// dsh-token-usage — node half
// Captures per-request LLM token usage from the llm/stream waterfall,
// persists it to ~/.dsh/storages/token-stats/usage.jsonl, and serves
// aggregated statistics to the browser half over /token-stats/api/*.
import { appendFileSync, existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { dshHomePath } from '@deepseek-ai/dsh-home-paths';

/** Stable cordis plugin name. */
export const name = 'dsh-token-usage';

/** Services required before the plugin activates. */
export const inject = ['webServer'];

/** Storage location: shared with every profile under the harness home. */
const DIR = join(dshHomePath('storages'), 'token-stats');
const FILE = join(DIR, 'usage.jsonl');

/** Hard cap on in-memory records (oldest records are dropped on load). */
const MAX_RECORDS = 500000;

/** One captured request record (durable row of usage.jsonl). */
function recordShape(entry) {
  return {
    ts: Number(entry.ts) || 0,
    provider: String(entry.provider ?? ''),
    model: String(entry.model ?? ''),
    sessionId: entry.sessionId == null ? null : String(entry.sessionId),
    purpose: entry.purpose == null ? null : String(entry.purpose),
    inputTokens: Number(entry.inputTokens) || 0,
    outputTokens: Number(entry.outputTokens) || 0,
    cacheReadTokens: Number(entry.cacheReadTokens) || 0,
    cacheWriteTokens: Number(entry.cacheWriteTokens) || 0,
    reasoningTokens: Number(entry.reasoningTokens) || 0,
  };
}

/** Total billed tokens of one record (uncached input + output + cache reads/writes). */
function totalOf(r) {
  return r.inputTokens + r.outputTokens + r.cacheReadTokens + r.cacheWriteTokens;
}

/** Load durable history: keep only the newest MAX_RECORDS rows. */
function loadHistory() {
  const records = [];
  if (!existsSync(FILE)) return records;
  try {
    const raw = readFileSync(FILE, 'utf8');
    const lines = raw.split('\n');
    const start = Math.max(0, lines.length - MAX_RECORDS);
    for (let i = start; i < lines.length; i += 1) {
      const line = lines[i];
      if (line === '') continue;
      try {
        const parsed = JSON.parse(line);
        const rec = recordShape(parsed);
        if (rec.ts > 0 && (rec.inputTokens > 0 || rec.outputTokens > 0)) records.push(rec);
      } catch {
        // skip one malformed durable row — the file is append-only and a
        // torn write at the tail is the only realistic corruption.
      }
    }
  } catch (error) {
    console.warn('[token-stats] failed to load history:', error);
  }
  return records;
}

/** Local calendar date key (YYYY-MM-DD) for one timestamp. */
function dateKey(ts) {
  const d = new Date(ts);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}


/** Local hour bucket start (minutes/seconds/ms zeroed) for one timestamp. */
function localHourStart(ts) {
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
function dayStartOf(ts) {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

/** Sum buckets of one aggregated group row. */
function zeroBucket() {
  return { requests: 0, inputTokens: 0, outputTokens: 0, cacheReadTokens: 0, cacheWriteTokens: 0, reasoningTokens: 0 };
}

function addToBucket(b, r) {
  b.requests += 1;
  b.inputTokens += r.inputTokens;
  b.outputTokens += r.outputTokens;
  b.cacheReadTokens += r.cacheReadTokens;
  b.cacheWriteTokens += r.cacheWriteTokens;
  b.reasoningTokens += r.reasoningTokens;
  return b;
}

/** Range presets driving the series granularity and window. */
const RANGES = {
  hour: 'hour',
  '7': 7,
  month: 'month',
  '30': 30,
};

/** Build the time-series buckets for one range preset (zero-filled). */
function buildSeriesBuckets(range, now) {
  const DAY_MS = 24 * 3600 * 1000;
  const HOUR_MS = 3600 * 1000;
  if (range === 'hour') {
    const currentHourStart = localHourStart(now);
    const buckets = [];
    for (let i = 4; i >= 0; i -= 1) {
      const s = currentHourStart - i * HOUR_MS;
      buckets.push({ key: s, label: hourClock(s), date: dateKey(s), ...zeroBucket() });
    }
    return { granularity: 'hour', buckets, keyOf: localHourStart };
  }
  let startDay;
  if (range === 7) startDay = dayStartOf(now) - 6 * DAY_MS;
  else if (range === 30) startDay = dayStartOf(now) - 29 * DAY_MS;
  else {
    const d = new Date(now);
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

/** Aggregate records into the overview payload the browser renders.
* @param records - in-memory usage history.
* @param range - 'hour' | 7 | 'month' | 30 (series window).
* @param provider - provider filter, or null for all.
* @param model - model filter, or null for all.
*/
function buildOverview(records, range, provider, model) {
  const now = Date.now();
  const { granularity, buckets, keyOf } = buildSeriesBuckets(range, now);
  const bucketMap = new Map(buckets.map((b) => [b.key, b]));
  const rangeStart = buckets[0].key;

  const filtered = [];
  for (const r of records) {
    if (r.ts < rangeStart || r.ts > now) continue;
    if (provider !== null && r.provider !== provider) continue;
    if (model !== null && r.model !== model) continue;
    filtered.push(r);
    const b = bucketMap.get(keyOf(r.ts));
    if (b !== undefined) addToBucket(b, r);
  }

  const totals = zeroBucket();
  for (const r of filtered) addToBucket(totals, r);
  const cacheDenom = totals.cacheReadTokens + totals.inputTokens;
  const cacheHitRate = cacheDenom > 0 ? totals.cacheReadTokens / cacheDenom : null;

  const byModelMap = new Map();
  for (const r of filtered) {
    const m = byModelMap.get(r.model);
    if (m === undefined) byModelMap.set(r.model, addToBucket({ key: r.model, label: r.model }, r));
    else addToBucket(m, r);
  }
  const byModel = [...byModelMap.values()].sort((a, b) => totalOf(b) - totalOf(a) || b.requests - a.requests);

  const recent = filtered.slice(-30).reverse();

  // Filter dropdown options: same window, but never narrowed by provider/model.
  const providerSet = new Set();
  const modelSet = new Set();
  for (const r of records) {
    if (r.ts < rangeStart || r.ts > now) continue;
    if (r.provider !== '') providerSet.add(r.provider);
    if (r.model !== '') modelSet.add(r.model);
  }
  const filterOptions = {
    providers: [...providerSet].sort(),
    models: [...modelSet].sort(),
  };

  return {
    generatedAt: now,
    range,
    granularity,
    rangeStart,
    rangeEnd: now,
    totals,
    cacheHitRate,
    series: buckets.map(({ key, label, date, requests, inputTokens, outputTokens, cacheReadTokens, cacheWriteTokens, reasoningTokens }) => ({
      label,
      date,
      requests,
      inputTokens,
      outputTokens,
      cacheReadTokens,
      cacheWriteTokens,
      reasoningTokens,
    })),
    byModel,
    recent,
    filterOptions,
  };
}

/** Send one JSON response with cache-busting headers. */
function sendJson(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
  });
  res.end(payload);
}

/**
* Plugin body: hook the llm/stream waterfall, persist usage, and mount the
* aggregation routes.
* @param ctx - cordis plugin context (webServer and the llm event bus).
*/
export function apply(ctx) {
  try {
    mkdirSync(DIR, { recursive: true });
  } catch (error) {
    ctx.logger.warn('[token-stats] cannot create storage dir:', error);
  }

  const records = loadHistory();
  let writeFailed = false;

  /** Append one durable row; a failure is logged once, never thrown. */
  function persist(rec) {
    try {
      appendFileSync(FILE, JSON.stringify(rec) + '\n');
      writeFailed = false;
    } catch (error) {
      if (!writeFailed) {
        writeFailed = true;
        ctx.logger.warn('[token-stats] cannot persist usage row:', error);
      }
    }
  }

  // Capture usage from every model call. Registered inside the llm-retry
  // waterfall (base layer registers earlier), so every actual provider
  // attempt reports its own usage.
  ctx.on('llm/stream', async function* (options, next) {
    const inner = next();
    let usage = null;
    for await (const chunk of inner) {
      if (chunk !== null && typeof chunk === 'object' && chunk.type === 'usage' && chunk.usage !== undefined) {
        usage = chunk.usage;
      }
      yield chunk;
    }
    if (usage === null) return;
    try {
      const rec = recordShape({
        ts: Date.now(),
        provider: options.provider,
        model: options.model,
        sessionId: options.sessionId ?? null,
        purpose: options.purpose ?? null,
        inputTokens: usage.inputTokens,
        outputTokens: usage.outputTokens,
        cacheReadTokens: usage.cacheReadTokens,
        cacheWriteTokens: usage.cacheWriteTokens,
        reasoningTokens: usage.reasoningTokens,
      });
      records.push(rec);
      if (records.length > MAX_RECORDS) records.splice(0, records.length - MAX_RECORDS);
      persist(rec);
    } catch (error) {
      ctx.logger.warn('[token-stats] failed to record usage:', error);
    }
  });

  const handler = async (req, res) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405);
      res.end();
      return;
    }
    const url = new URL(req.url ?? '/', 'http://token-stats');
    if (url.pathname === '/token-stats/api/overview') {
      const raw = url.searchParams.get('days') ?? '7';
      const range = RANGES[raw] ?? 7;
      const provider = url.searchParams.get('provider') || null;
      const model = url.searchParams.get('model') || null;
      const payload = buildOverview(records, range, provider, model);
      sendJson(res, 200, payload);
      return;
    }
    res.writeHead(404);
    res.end();
  };

  ctx.effect(() => ctx.webServer.register({ kind: 'prefix', path: '/token-stats/api', handler }), 'token-stats: aggregation routes');
}
