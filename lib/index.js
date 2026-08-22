// dsh-token-usage — node half
// Captures per-request LLM token usage from the llm/stream waterfall,
// persists it to ~/.dsh/storages/token-stats/usage.jsonl, and serves
// aggregated statistics to the browser half over /token-stats/api/*.
import { closeSync, existsSync, fstatSync, mkdirSync, openSync, readFileSync, readSync, renameSync, statSync, writeFileSync, writeSync } from 'node:fs';
import { appendFile as appendFileAsync } from 'node:fs/promises';
import { join } from 'node:path';
import { dshHomePath } from '@deepseek-ai/dsh-home-paths';
import { buildAutoIndex, isUsable, recordShape, sanitizePrices } from './cost.js';
import { buildCustomOverview, buildHeatmap, buildOverview, mergeRecords } from './aggregate.js';

/** Stable cordis plugin name. */
export const name = 'dsh-token-usage';

/** Services required before the plugin activates.
 * webServer is REQUIRED: this cordis fork has no optional inject, so the
 * plugin activates only where a web server exists (the web profile). The
 * storage is still shared on disk across profiles; compaction merges the
 * on-disk tail so no profile's rows are lost. */
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

/** When usage.jsonl grows past this size, rewrite it with only in-memory records. */
const COMPACT_BYTES = 128 * 1024 * 1024;

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
  '5h': '5h',
  hour: 'hour',
  '7': 7,
  month: 'month',
  '30': 30,
  '90': 90,
  year: 'year',
  '364': 364,
};

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

  /** Rewrite usage.jsonl: merge the in-memory window with the records that are
   * currently on disk (written by THIS process or by another profile sharing
   * the storage), dedupe, keep the newest MAX_RECORDS rows, and stream them
   * out in bounded chunks so the peak memory stays ~a small batch, not a
   * joined multi-hundred-MB string. Old on-disk rows are dropped: the merge
   * only keeps the newest cap rows overall. */
  function compactFile() {
    try {
      // Read the current file tail so another profile's rows are not lost.
      const diskRecords = [];
      try {
        for (const line of readTailLines(FILE, MAX_RECORDS * 2)) {
          try {
            const rec = recordShape(JSON.parse(line));
            if (isUsable(rec)) diskRecords.push(rec);
          } catch {
            // skip one malformed durable row (see loadHistory)
          }
        }
      } catch (error) {
        ctx.logger.warn('[token-stats] cannot read current file for compaction:', error);
      }
      const merged = mergeRecords(records, diskRecords, MAX_RECORDS);
      const tmp = FILE + '.tmp';
      const fd = openSync(tmp, 'w', 0o644);
      try {
        let buf = '';
        for (let i = 0; i < merged.length; i += 1) {
          buf += JSON.stringify(merged[i]) + '\n';
          if (buf.length >= 256 * 1024 || i === merged.length - 1) {
            writeSync(fd, buf, null, 'utf8');
            buf = '';
          }
        }
      } finally {
        closeSync(fd);
      }
      renameSync(tmp, FILE);
      return true;
    } catch (error) {
      ctx.logger.warn('[token-stats] compact failed:', error);
      return false;
    }
  }

  // Compact once at boot if the file has grown too large.
  try {
    if (existsSync(FILE) && statSync(FILE).size > COMPACT_BYTES) {
      compactFile();
      ctx.logger.info('[token-stats] compacted usage.jsonl');
    }
  } catch (error) {
    ctx.logger.warn('[token-stats] boot compaction check failed:', error);
  }

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

  // Periodically rewrite usage.jsonl when it grows too large.
  ctx.effect(() => {
    const timer = setInterval(() => {
      try {
        if (existsSync(FILE) && statSync(FILE).size > COMPACT_BYTES) compactFile();
      } catch (error) {
        ctx.logger.warn('[token-stats] periodic compaction failed:', error);
      }
    }, 6 * 60 * 60 * 1000);
    return () => clearInterval(timer);
  }, 'token-stats: usage file compaction');

  // Async batched persistence: rows buffer in memory and are appended with
  // `appendFile` (never the sync variant, which would block the event loop
  // on every model call). Appends run on a serialized promise chain so
  // concurrent flushes cannot interleave, and happen at most once per second
  // or as soon as FLUSH_BATCH rows pile up. A failed batch is put back at the
  // head of the queue and retried with a capped backoff instead of being
  // dropped silently (a transient disk error must not lose statistics).
  const FLUSH_BATCH = 64;
  const FLUSH_MS = 1000;
  const FLUSH_RETRY_MS = 2000;
  const FLUSH_MAX_ATTEMPTS = 8;
  let pendingBatch = [];
  let flushChain = Promise.resolve();
  let flushTimer = null;
  let flushAttempts = 0;

  function flushPending() {
    if (flushTimer !== null) {
      clearTimeout(flushTimer);
      flushTimer = null;
    }
    if (pendingBatch.length === 0) return;
    const batch = pendingBatch.join('');
    pendingBatch = [];
    flushChain = flushChain
      .then(() => appendFileAsync(FILE, batch))
      .then(() => {
        flushAttempts = 0;
        writeFailed = false;
      })
      .catch((error) => {
        if (!writeFailed) {
          writeFailed = true;
          ctx.logger.warn('[token-stats] cannot persist usage batch:', error);
        }
        if (flushAttempts < FLUSH_MAX_ATTEMPTS) {
          flushAttempts += 1;
          pendingBatch = [batch, ...pendingBatch];
          if (flushTimer === null) {
            flushTimer = setTimeout(flushPending, Math.min(FLUSH_RETRY_MS * flushAttempts, 30000));
          }
        } else {
          ctx.logger.warn(`[token-stats] dropping usage batch after ${FLUSH_MAX_ATTEMPTS} failed attempts`);
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
    if (req.method === 'HEAD') {
      // No payload needed for HEAD — skip the (potentially expensive) aggregation.
      res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
      res.end();
      return;
    }
    if (req.method !== 'GET' && req.method !== 'POST') {
      res.writeHead(405);
      res.end();
      return;
    }
    const url = new URL(req.url ?? '/', 'http://token-stats');
    if (url.pathname === '/token-stats/api/overview') {
      const raw = url.searchParams.get('days') ?? '7';
      const provider = url.searchParams.get('provider') || null;
      const model = url.searchParams.get('model') || null;
      if (raw === 'custom') {
        const start = url.searchParams.get('start');
        const end = url.searchParams.get('end');
        if (!start || !end) {
          sendJson(res, 400, { ok: false, error: 'start and end are required for custom range' });
          return;
        }
        try {
          const payload = buildCustomOverview(records, start, end, provider, model, prices, autoIndex);
          sendJson(res, 200, payload);
        } catch (error) {
          sendJson(res, 400, { ok: false, error: error instanceof Error ? error.message : String(error) });
        }
        return;
      }
      const range = RANGES[raw] ?? 7;
      const payload = buildOverview(records, range, provider, model, prices, autoIndex);
      sendJson(res, 200, payload);
      return;
    }
    if (url.pathname === '/token-stats/api/heatmap') {
      const raw = url.searchParams.get('days') ?? '364';
      const range = RANGES[raw] ?? 364;
      const provider = url.searchParams.get('provider') || null;
      const model = url.searchParams.get('model') || null;
      const payload = buildHeatmap(records, range, provider, model);
      sendJson(res, 200, payload);
      return;
    }
    if (url.pathname === '/token-stats/api/export' && req.method === 'GET') {
      // Stream the full durable history as NDJSON (one record per line) so a
      // 500k-row export costs no big in-memory payload on either side.
      const provider = url.searchParams.get('provider') || null;
      const model = url.searchParams.get('model') || null;
      res.writeHead(200, {
        'content-type': 'application/x-ndjson; charset=utf-8',
        'content-disposition': `attachment; filename="token-stats-${Date.now()}.jsonl"`,
        'cache-control': 'no-store',
      });
      for (const r of records) {
        if (provider !== null && r.provider !== provider) continue;
        if (model !== null && r.model !== model) continue;
        res.write(JSON.stringify(r) + '\n');
      }
      res.end();
      return;
    }
    if (url.pathname === '/token-stats/api/clear' && req.method === 'POST') {
      // Drop the in-memory window and truncate the durable file. An in-flight
      // append may add a few rows back afterwards; they are re-absorbed on the
      // next boot and are harmless.
      try {
        pendingBatch = [];
        records.length = 0;
        writeFileSync(FILE, '');
        sendJson(res, 200, { ok: true });
      } catch (error) {
        ctx.logger.warn('[token-stats] cannot clear history:', error);
        sendJson(res, 500, { ok: false, error: error instanceof Error ? error.message : String(error) });
      }
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

  // Mount the aggregation API on the (required) web server.
  ctx.effect(() => ctx.webServer.register({ kind: 'prefix', path: '/token-stats/api', handler }), 'token-stats: aggregation routes');
}
