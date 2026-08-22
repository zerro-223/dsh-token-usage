// dsh-token-usage — pure aggregation over usage records (no runtime deps, unit-testable).
// Extracted from lib/index.js so bucketing / aggregation can be tested in isolation
// and so every overview build is ONE pass over the record window instead of four.
// All functions here are pure: no fs, no timers, no state.

import { normModelKey, totalOf } from './cost.js';

const DAY_MS = 24 * 3600 * 1000;
const HOUR_MS = 3600 * 1000;
const MAX_RECENT = 30;

/** Local calendar date key (YYYY-MM-DD) for one timestamp. */
export function dateKey(ts) {
  const d = new Date(ts);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

/** Parse a YYYY-MM-DD string as a local date. */
export function parseDateKey(s) {
  const p = String(s).split('-');
  return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
}

/** Local hour bucket start (minutes/seconds/ms zeroed) for one timestamp. */
export function localHourStart(ts) {
  const d = new Date(ts);
  d.setMinutes(0, 0, 0);
  return d.getTime();
}

/** Local clock label "HH:00" for one timestamp. */
function hourClock(ts) {
  const d = new Date(ts);
  return String(d.getHours()).padStart(2, '0') + ':00';
}

/** Local calendar-day start (time zeroed) for one timestamp. */
export function dayStartOf(ts) {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

/** Sum buckets of one aggregated group row (costUsd filled by the caller). */
export function zeroBucket() {
  return { requests: 0, inputTokens: 0, outputTokens: 0, cacheReadTokens: 0, cacheWriteTokens: 0, reasoningTokens: 0, costUsd: 0 };
}

export function addToBucket(b, r) {
  b.requests += 1;
  b.inputTokens += r.inputTokens;
  b.outputTokens += r.outputTokens;
  b.cacheReadTokens += r.cacheReadTokens;
  b.cacheWriteTokens += r.cacheWriteTokens;
  b.reasoningTokens += r.reasoningTokens;
  return b;
}

/** Cost of one record given its price row (USD per 1M tokens), or 0 when unpriced. */
function costOfTokens(r, p) {
  return r.inputTokens / 1e6 * (p.input ?? 0)
    + r.outputTokens / 1e6 * (p.output ?? 0)
    + r.cacheReadTokens / 1e6 * (p.cacheRead ?? 0)
    + r.cacheWriteTokens / 1e6 * (p.cacheWrite ?? 0);
}

/** Model -> price row lookup: manual exact-id match wins, then the normalized
 * auto index. The normalized key is computed once per model (cached), which
 * matters because aggregation runs over hundreds of thousands of records. */
function makePriceFinder(manualPrices, autoIndex) {
  const cache = new Map();
  return (model) => {
    if (Object.prototype.hasOwnProperty.call(manualPrices, model)) return manualPrices[model];
    if (!cache.has(model)) cache.set(model, autoIndex ? autoIndex.get(normModelKey(model)) : undefined);
    return cache.get(model);
  };
}

/** Build the time-series buckets for one range preset (zero-filled).
 * @param range - '5h' | 'hour' | number (days) | 'month' | 'year' | 364.
 * @param now - reference timestamp (local time zone of the server). */
export function buildSeriesBuckets(range, now) {
  if (range === '5h') {
    const currentHourStart = localHourStart(now);
    const buckets = [];
    for (let i = 4; i >= 0; i -= 1) {
      const s = currentHourStart - i * HOUR_MS;
      buckets.push({ key: s, label: hourClock(s), date: dateKey(s), ...zeroBucket() });
    }
    return { granularity: 'hour', buckets, keyOf: localHourStart };
  }
  if (range === 'hour') {
    const dayStart = dayStartOf(now);
    const currentHour = new Date(now).getHours();
    const buckets = [];
    for (let h = 0; h <= currentHour; h += 1) {
      const s = dayStart + h * HOUR_MS;
      buckets.push({ key: s, label: hourClock(s), date: dateKey(s), ...zeroBucket() });
    }
    return { granularity: 'hour', buckets, keyOf: localHourStart };
  }
  const d = new Date(now);
  let startDay;
  if (typeof range === 'number' && Number.isFinite(range) && range > 0) {
    startDay = dayStartOf(now) - (range - 1) * DAY_MS;
  } else if (range === 'year') {
    startDay = dayStartOf(new Date(d.getFullYear(), 0, 1).getTime());
  } else {
    startDay = dayStartOf(new Date(d.getFullYear(), d.getMonth(), 1).getTime());
  }
  const days = Math.round((dayStartOf(now) - startDay) / DAY_MS) + 1;
  const buckets = [];
  for (let i = 0; i < days; i += 1) {
    const s = startDay + i * DAY_MS;
    buckets.push({ key: s, label: dateKey(s), date: dateKey(s), ...zeroBucket() });
  }
  return { granularity: 'day', buckets, keyOf: dayStartOf };
}

/**
 * Single-pass aggregation of the record window.
 * One loop over `records` fills the series buckets, totals, per-model rows,
 * the recent ring buffer and (time-window-only) filter option sets, in the
 * same pass that applies the provider/model filter.
 * @param opts - {
 *   buckets: zero-filled bucket objects (each must carry key/label/date),
 *   keyOf: maps a record ts to its bucket key,
 *   startTs, endTs: inclusive window,
 *   provider, model: filters (null = all),
 *   manualPrices, autoIndex: price tables,
 *   include: 'full' | 'series' — 'series' skips totals/cost/byModel/recent/options.
 * }
 */
export function aggregate(records, opts) {
  const { buckets, keyOf, startTs, endTs, provider, model, manualPrices, autoIndex, include } = opts;
  const full = include === 'full';
  const priceOf = makePriceFinder(manualPrices || {}, autoIndex || null);
  const bucketMap = new Map(buckets.map((b) => [b.key, b]));

  const totals = full ? zeroBucket() : null;
  let anyConfigured = false;
  const unknown = new Set();
  const recent = full ? [] : null;
  const providerSet = full ? new Set() : null;
  const modelSet = full ? new Set() : null;
  const byModelMap = full ? new Map() : null;

  for (const r of records) {
    if (r.ts < startTs || r.ts > endTs) continue;
    if (full) {
      if (r.provider !== '') providerSet.add(r.provider);
      if (r.model !== '') modelSet.add(r.model);
    }
    if (provider !== null && r.provider !== provider) continue;
    if (model !== null && r.model !== model) continue;

    const b = bucketMap.get(keyOf(r.ts));
    if (b !== undefined) {
      addToBucket(b, r);
      const p = priceOf(r.model);
      if (p !== undefined) b.costUsd += costOfTokens(r, p);
    }
    if (!full) continue;

    addToBucket(totals, r);
    const p = priceOf(r.model);
    if (p !== undefined) {
      anyConfigured = true;
      totals.costUsd += costOfTokens(r, p);
    } else {
      unknown.add(r.model);
    }

    let m = byModelMap.get(r.model);
    if (m === undefined) {
      m = { key: r.model, label: r.model, ...zeroBucket(), costUnknown: false, _priced: false };
      byModelMap.set(r.model, m);
    }
    addToBucket(m, r);
    if (p !== undefined) {
      m._priced = true;
      m.costUsd += costOfTokens(r, p);
    } else {
      m.costUnknown = true;
    }

    recent.push(r);
    if (recent.length > MAX_RECENT) recent.shift();
  }

  const byModel = full
    ? [...byModelMap.values()].map((m) => ({
      key: m.key,
      label: m.label,
      requests: m.requests,
      inputTokens: m.inputTokens,
      outputTokens: m.outputTokens,
      cacheReadTokens: m.cacheReadTokens,
      cacheWriteTokens: m.cacheWriteTokens,
      reasoningTokens: m.reasoningTokens,
      costUsd: m._priced ? m.costUsd : null,
      costUnknown: m.costUnknown,
    })).sort((a, b) => totalOf(b) - totalOf(a) || b.requests - a.requests)
    : null;

  const cacheDenom = totals ? totals.cacheReadTokens + totals.inputTokens : 0;

  return {
    buckets,
    totals,
    cacheHitRate: full && cacheDenom > 0 ? totals.cacheReadTokens / cacheDenom : null,
    cost: full ? { usd: anyConfigured ? totals.costUsd : null, unknownModels: [...unknown] } : null,
    byModel,
    recent: full ? [...recent].reverse() : null,
    filterOptions: full
      ? { providers: [...providerSet].sort(), models: [...modelSet].sort() }
      : null,
  };
}

/** Build an overview payload for a range preset (mirrors the old /overview shape).
 * @param now - reference timestamp (defaults to Date.now(); injectable for tests). */
export function buildOverview(records, range, provider, model, manualPrices, autoIndex, now = Date.now()) {
  const { granularity, buckets, keyOf } = buildSeriesBuckets(range, now);
  const agg = aggregate(records, {
    buckets,
    startTs: buckets[0].key,
    endTs: now,
    keyOf,
    provider,
    model,
    manualPrices,
    autoIndex,
    include: 'full',
  });
  return {
    generatedAt: now,
    range,
    granularity,
    rangeStart: buckets[0].key,
    rangeEnd: now,
    totals: agg.totals,
    cacheHitRate: agg.cacheHitRate,
    cost: agg.cost,
    series: agg.buckets.map(({ key, label, date, requests, inputTokens, outputTokens, cacheReadTokens, cacheWriteTokens, reasoningTokens, costUsd }) => ({
      label, date, requests, inputTokens, outputTokens, cacheReadTokens, cacheWriteTokens, reasoningTokens, costUsd,
    })),
    byModel: agg.byModel,
    recent: agg.recent,
    filterOptions: agg.filterOptions,
  };
}

/** Build an overview payload for an explicit custom date range (max 30 days).
 * @param now - reference timestamp (defaults to Date.now(); injectable for tests). */
export function buildCustomOverview(records, startStr, endStr, provider, model, manualPrices, autoIndex, now = Date.now()) {
  const startDay = dayStartOf(parseDateKey(startStr).getTime());
  const endDay = dayStartOf(parseDateKey(endStr).getTime());
  const days = Math.round((endDay - startDay) / DAY_MS) + 1;
  if (!(days >= 1 && days <= 30)) {
    throw new Error('custom range must be between 1 and 30 days');
  }
  const buckets = [];
  for (let i = 0; i < days; i += 1) {
    const s = startDay + i * DAY_MS;
    buckets.push({ key: s, label: dateKey(s), date: dateKey(s), ...zeroBucket() });
  }
  const agg = aggregate(records, {
    buckets,
    startTs: startDay,
    endTs: endDay + DAY_MS - 1,
    keyOf: dayStartOf,
    provider,
    model,
    manualPrices,
    autoIndex,
    include: 'full',
  });
  return {
    generatedAt: now,
    range: 'custom',
    granularity: 'day',
    rangeStart: startDay,
    rangeEnd: endDay + DAY_MS - 1,
    totals: agg.totals,
    cacheHitRate: agg.cacheHitRate,
    cost: agg.cost,
    series: agg.buckets.map(({ key, label, date, requests, inputTokens, outputTokens, cacheReadTokens, cacheWriteTokens, reasoningTokens, costUsd }) => ({
      label, date, requests, inputTokens, outputTokens, cacheReadTokens, cacheWriteTokens, reasoningTokens, costUsd,
    })),
    byModel: agg.byModel,
    recent: agg.recent,
    filterOptions: agg.filterOptions,
  };
}

/** Build a lightweight daily-series payload for the heatmap (series only).
 * @param now - reference timestamp (defaults to Date.now(); injectable for tests). */
export function buildHeatmap(records, range, provider, model, now = Date.now()) {
  const { granularity, buckets, keyOf } = buildSeriesBuckets(range, now);
  const agg = aggregate(records, {
    buckets,
    startTs: buckets[0].key,
    endTs: now,
    keyOf,
    provider,
    model,
    manualPrices: {},
    autoIndex: null,
    include: 'series',
  });
  return {
    generatedAt: now,
    range,
    granularity,
    series: agg.buckets.map(({ key, label, date, requests, inputTokens, outputTokens, cacheReadTokens, cacheWriteTokens, reasoningTokens }) => ({
      label, date, requests, inputTokens, outputTokens, cacheReadTokens, cacheWriteTokens, reasoningTokens,
    })),
  };
}

/** Merge two record sets (e.g. in-memory window + on-disk tail from another
 * profile) into the newest `cap` records, deduped by an exact row key.
 * Records from `memory` win over identical disk rows; the result is returned
 * in ascending `ts` order. */
export function mergeRecords(memory, disk, cap) {
  const rowKey = (r) => `${r.ts}|${r.provider}|${r.model}|${r.inputTokens}|${r.outputTokens}|${r.cacheReadTokens}|${r.cacheWriteTokens}`;
  const byKey = new Map();
  for (const r of disk) byKey.set(rowKey(r), r);
  for (const r of memory) byKey.set(rowKey(r), r);
  const all = [...byKey.values()].sort((a, b) => a.ts - b.ts);
  return all.length > cap ? all.slice(all.length - cap) : all;
}
