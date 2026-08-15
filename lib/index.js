// dsh-token-usage — node half
// Captures per-request LLM token usage from the llm/stream waterfall,
// persists it to ~/.dsh/storages/token-stats/usage.jsonl, and serves
// aggregated statistics to the browser half over /token-stats/api/*.
import { closeSync, existsSync, fstatSync, mkdirSync, openSync, readFileSync, readSync, writeFileSync } from 'node:fs';
import { appendFile as appendFileAsync } from 'node:fs/promises';
import { join } from 'node:path';
import { dshHomePath } from '@deepseek-ai/dsh-home-paths';
import { buildAutoIndex, calcCost, isUsable, normModelKey, recordShape, sanitizePrices, totalOf } from './cost.js';

/** Stable cordis plugin name. */
export const name = 'dsh-token-usage';

/** Services required before the plugin activates. */
export const inject = ['webServer'];

/** Storage location: shared with every profile under the harness home. */
const DIR = join(dshHomePath('storages'), 'token-stats');
const FILE = join(DIR, 'usage.jsonl');
const PRICES_FILE = join(DIR, 'prices.json');
const PRICES_AUTO_FILE = join(DIR, 'prices-auto.json');
/** ModelRadar machine-readable pricing dataset (USD per 1M tokens). */
const RADAR_URL = 'https://modelradar.cn/data/models.json';
/** How often the auto price table refreshes in the background. */
const RADAR_REFRESH_MS = 24 * 60 * 60 * 1000;

/** Hard cap on in-memory records (oldest records are dropped on load). */
const MAX_RECORDS = 500000;

/** Read up to maxLines complete lines from the tail of an append-only file
 * without loading the whole file: walk backwards in bounded chunks until the
 * newest maxLines lines are collected (or the start is reached). A line
 * longer than one chunk accumulates in `pending` and never breaks the walk. */
function readTailLines(file, maxLines) {
  const CHUNK = 1024 * 1024;
  const fd = openSync(file, 'r');
  try {
    const size = fstatSync(fd).size;
    let end = size;
    let pending = '';
    const newestFirst = [];
    while (end > 0 && newestFirst.length < maxLines) {
      const start = Math.max(0, end - CHUNK);
      const buf = Buffer.allocUnsafe(end - start);
      readSync(fd, buf, 0, buf.length, start);
      const text = buf.toString('utf8') + pending;
      const nl = text.indexOf('\n');
      if (nl === -1) {
        pending = text; // whole chunk is one partial line, keep walking back
        end = start;
        continue;
      }
      const complete = text.slice(nl + 1).split('\n');
      for (let i = complete.length - 1; i >= 0 && newestFirst.length < maxLines; i -= 1) {
        if (complete[i] !== '') newestFirst.push(complete[i]);
      }
      pending = text.slice(0, nl);
      end = start;
    }
    // The oldest collected line can still sit in `pending` when the walk
    // reached the file start: it is complete then (nothing precedes it), so
    // keep it unless the maxLines cap was already filled.
    if (newestFirst.length < maxLines && pending !== '') newestFirst.push(pending);
    newestFirst.reverse();
    return newestFirst;
  } finally {
    closeSync(fd);
  }
}

/** Load durable history: keep only the newest MAX_RECORDS rows. Tail reads
 * make a multi-hundred-MB file cost a few bounded reads, not a full parse. */
function loadHistory() {
  const records = [];
  if (!existsSync(FILE)) return records;
  try {
    for (const line of readTailLines(FILE, MAX_RECORDS)) {
      try {
        const parsed = JSON.parse(line);
        const rec = recordShape(parsed);
        if (isUsable(rec)) records.push(rec);
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

/** Model price table: modelId -> { input?, output?, cacheRead? } in USD per 1M tokens. */
function loadPricesFile() {
  try {
    if (!existsSync(PRICES_FILE)) return {};
    const parsed = JSON.parse(readFileSync(PRICES_FILE, 'utf8'));
    return sanitizePrices(parsed);
  } catch {
    return {};
  }
}

/** Persist the fetched radar table (id -> {input, output, cacheRead}). */
function writeAutoPrices(entries) {
  try {
    writeFileSync(PRICES_AUTO_FILE, JSON.stringify(entries, null, 2));
    return true;
  } catch {
    return false;
  }
}

/** Load the last fetched radar table from disk. */
function loadAutoPricesFile() {
  try {
    if (!existsSync(PRICES_AUTO_FILE)) return {};
    return JSON.parse(readFileSync(PRICES_AUTO_FILE, 'utf8'));
  } catch {
    return {};
  }
}

/** Collect one JSON request body with a size cap. */
function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > 512 * 1024) {
        reject(new Error('request body too large'));
        req.destroy();
      }
    });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

/** Range presets driving the series granularity and window. */
const RANGES = {
  hour: 'hour',
  '7': 7,
  month: 'month',
  '30': 30,
  '364': 364,
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
  if (typeof range === 'number' && Number.isFinite(range) && range > 0) {
    startDay = dayStartOf(now) - (range - 1) * DAY_MS;
  } else {
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
* @param range - 'hour' | 7 | 'month' | 30 | 364 (series window).
* @param provider - provider filter, or null for all.
* @param model - model filter, or null for all.
* @param manualPrices - user-configured price table (USD per 1M tokens).
* @param autoIndex - normalized lookup index of the auto-fetched radar table.
*/
function buildOverview(records, range, provider, model, manualPrices, autoIndex) {
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

  const cost = calcCost(filtered, manualPrices, autoIndex);

  return {
    generatedAt: now,
    range,
    granularity,
    rangeStart,
    rangeEnd: now,
    totals,
    cacheHitRate,
    cost,
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
  let prices = loadPricesFile();
  let autoEntries = loadAutoPricesFile();
  let autoIndex = buildAutoIndex(autoEntries);
  let autoUpdatedAt = typeof autoEntries._updatedAt === 'string' ? autoEntries._updatedAt : null;
  /** Last auto-price refresh failure (surfaced to the browser half). */
  let autoError = null;
  let writeFailed = false;

  /** Fetch the ModelRadar dataset and refresh the auto price table. */
  async function refreshAutoPrices() {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(RADAR_URL, { signal: controller.signal, headers: { accept: 'application/json' } });
      if (!response.ok) {
        autoError = 'HTTP ' + response.status;
        return { ok: false, error: autoError };
      }
      const payload = await response.json();
      const list = Array.isArray(payload) ? payload : (payload && Array.isArray(payload.models) ? payload.models : []);
      // The dataset prices every model in its native currency (most Chinese
      // providers are CNY) and also ships per-field USD conversions. We always
      // store USD so manual and auto prices share one unit; the native
      // currency is kept per row for display.
      const entries = { _updatedAt: new Date().toISOString() };
      for (const m of list) {
        if (!m || typeof m.id !== 'string' || m.id === '') continue;
        const row = {};
        const usdOf = (native, usd) => {
          if (usd !== null && usd !== undefined && Number.isFinite(Number(usd))) return Number(usd);
          if (native !== null && native !== undefined && Number.isFinite(Number(native))
            && String(m.currency ?? '').toUpperCase() === 'USD') return Number(native);
          return undefined;
        };
        const input = usdOf(m.inputPricePer1M, m.inputPriceUsdPer1M);
        const output = usdOf(m.outputPricePer1M, m.outputPriceUsdPer1M);
        const cacheRead = usdOf(m.cacheReadPricePer1M, m.cacheReadPriceUsdPer1M);
        const cacheWrite = usdOf(m.cacheWritePricePer1M, m.cacheWritePriceUsdPer1M);
        if (input !== undefined) row.input = input;
        if (output !== undefined) row.output = output;
        if (cacheRead !== undefined) row.cacheRead = cacheRead;
        if (cacheWrite !== undefined) row.cacheWrite = cacheWrite;
        if (Object.keys(row).length === 0) continue;
        if (typeof m.name === 'string' && m.name !== '') row._name = m.name;
        const currency = String(m.currency ?? '').toUpperCase();
        if (currency !== '') row._currency = currency;
        entries[m.id] = row;
      }
      autoEntries = entries;
      autoIndex = buildAutoIndex(entries);
      autoUpdatedAt = entries._updatedAt;
      writeAutoPrices(entries);
      autoError = null;
      return { ok: true, updatedAt: autoUpdatedAt, count: Object.keys(entries).length - 1 };
    } catch (error) {
      autoError = error instanceof Error ? error.message : String(error);
      return { ok: false, error: autoError };
    } finally {
      clearTimeout(timer);
    }
  }

  // Background refresh: first attempt shortly after boot, retried with
  // backoff when the network is flaky, then once a day. Every failure is
  // recorded in "autoError" so the browser half can explain missing prices.
  ctx.effect(() => {
    let retriesLeft = 3;
    let bootTimer = null;
    const bootAttempt = async () => {
      const r = await refreshAutoPrices();
      if (!r.ok && retriesLeft > 0) {
        retriesLeft -= 1;
        bootTimer = setTimeout(bootAttempt, 20000);
      }
    };
    bootTimer = setTimeout(bootAttempt, 3000);
    const interval = setInterval(async () => {
      const r = await refreshAutoPrices();
      if (!r.ok) ctx.logger.warn('[token-stats] auto price refresh failed:', r.error);
    }, RADAR_REFRESH_MS);
    return () => {
      clearTimeout(bootTimer);
      clearInterval(interval);
    };
  }, 'token-stats: radar price refresh');

  // Async batched persistence: rows buffer in memory and are appended with
  // `appendFile` (never the sync variant, which would block the event loop
  // on every model call). Appends run on a serialized promise chain so
  // concurrent flushes cannot interleave, and happen at most once per second
  // or as soon as FLUSH_BATCH rows pile up. A failure is logged once, never
  // thrown, and the chain keeps draining subsequent batches.
  const FLUSH_BATCH = 64;
  const FLUSH_MS = 1000;
  let pendingBatch = [];
  let flushChain = Promise.resolve();
  let flushTimer = null;

  function flushPending() {
    if (flushTimer !== null) {
      clearTimeout(flushTimer);
      flushTimer = null;
    }
    if (pendingBatch.length === 0) return;
    const batch = pendingBatch;
    pendingBatch = [];
    flushChain = flushChain
      .then(() => appendFileAsync(FILE, batch.join('')))
      .then(() => {
        writeFailed = false;
      })
      .catch((error) => {
        if (!writeFailed) {
          writeFailed = true;
          ctx.logger.warn('[token-stats] cannot persist usage batch:', error);
        }
      });
  }

  /** Buffer one durable row; the periodic flush writes it to disk. */
  function persist(rec) {
    pendingBatch.push(JSON.stringify(rec) + '\n');
    if (pendingBatch.length >= FLUSH_BATCH) flushPending();
    else if (flushTimer === null) flushTimer = setTimeout(flushPending, FLUSH_MS);
  }

  // Capture usage from every model call. `llm/stream` fires once per actual
  // provider attempt: dsh-llm-retry does not wrap this waterfall (retries
  // are scheduled through the agent loop's `agent/request-error` hook and
  // each retried attempt is a new stream call), so every attempt that
  // reaches a provider is recorded here exactly once.
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
      if (!isUsable(rec)) return;
      records.push(rec);
      if (records.length > MAX_RECORDS) records.splice(0, records.length - MAX_RECORDS);
      persist(rec);
    } catch (error) {
      ctx.logger.warn('[token-stats] failed to record usage:', error);
    }
  });

  const handler = async (req, res) => {
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.method !== 'POST') {
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
      const payload = buildOverview(records, range, provider, model, prices, autoIndex);
      sendJson(res, 200, payload);
      return;
    }
    if (url.pathname === '/token-stats/api/prices' && req.method === 'GET') {
      sendJson(res, 200, { prices, auto: autoEntries, autoUpdatedAt, autoError });
      return;
    }
    if (url.pathname === '/token-stats/api/prices/refresh' && req.method === 'POST') {
      const result = await refreshAutoPrices();
      if (result.ok) {
        sendJson(res, 200, { ok: true, auto: autoEntries, autoUpdatedAt });
      } else {
        sendJson(res, 502, { ok: false, error: result.error });
      }
      return;
    }
    if (url.pathname === '/token-stats/api/prices' && req.method === 'POST') {
      try {
        const body = await readBody(req);
        const parsed = JSON.parse(body || '{}');
        const next = sanitizePrices(parsed.prices);
        prices = next;
        const ok = (() => {
          try {
            writeFileSync(PRICES_FILE, JSON.stringify(next, null, 2));
            return true;
          } catch (error) {
            ctx.logger.warn('[token-stats] cannot persist prices:', error);
            return false;
          }
        })();
        sendJson(res, ok ? 200 : 500, { ok });
      } catch (error) {
        sendJson(res, 400, { ok: false, error: error instanceof Error ? error.message : String(error) });
      }
      return;
    }
    res.writeHead(404);
    res.end();
  };

  // Final flush when the plugin is disposed (unload / HMR). A hard process
  // kill can still drop the last buffered second; the periodic flush keeps
  // that window bounded.
  ctx.effect(() => {
    return () => {
      flushPending();
    };
  }, 'token-stats: persistence flush');

  ctx.effect(() => ctx.webServer.register({ kind: 'prefix', path: '/token-stats/api', handler }), 'token-stats: aggregation routes');
}
