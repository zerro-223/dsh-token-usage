// dsh-token-usage — pure token-cost accounting (no runtime deps, unit-testable).
// Extracted from lib/index.js so the cost functions can be tested in
// isolation without the @deepseek-ai/dsh-home-paths import side effects.

/** One captured request record (durable row of usage.jsonl). */
export function recordShape(entry) {
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
export function totalOf(r) {
  return r.inputTokens + r.outputTokens + r.cacheReadTokens + r.cacheWriteTokens;
}

/** Whether a durable row carries at least one non-zero token count.
 * Rows without any tokens at all — an aborted call that ended before usage
 * was reported — are dropped at capture time and on load alike, so the
 * in-memory window and the file always agree. Cache-only rows (input and
 * output both zero but cache reads/writes > 0) are kept on both paths. */
export function isUsable(rec) {
  return rec.ts > 0
    && (rec.inputTokens > 0 || rec.outputTokens > 0 || rec.cacheReadTokens > 0 || rec.cacheWriteTokens > 0);
}

/** Keep only well-formed non-negative numeric price rows. */
export function sanitizePrices(raw) {
  const out = {};
  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) return out;
  for (const [model, p] of Object.entries(raw)) {
    if (typeof model !== 'string' || model === '') continue;
    if (p === null || typeof p !== 'object' || Array.isArray(p)) continue;
    const row = {};
    for (const key of ['input', 'output', 'cacheRead', 'cacheWrite']) {
      const v = Number(p[key]);
      if (Number.isFinite(v) && v >= 0) row[key] = v;
    }
    if (Object.keys(row).length > 0) out[model] = row;
  }
  return out;
}

/** Normalized model key: lowercase, dots/dashes/underscores removed. */
export function normModelKey(id) {
  return String(id).toLowerCase().replace(/[-_.]/g, '');
}

/** Build a normalized lookup index from the radar dataset: key -> price row. */
export function buildAutoIndex(entries) {
  const index = new Map();
  if (entries === null || typeof entries !== 'object') return index;
  for (const [id, row] of Object.entries(entries)) {
    if (row === null || typeof row !== 'object') continue;
    index.set(normModelKey(id), row);
    // Provider-prefixed model ids ("openai/gpt-5.6-sol") also match by their
    // basename, which is how the radar dataset keys its rows.
    const slash = id.lastIndexOf('/');
    if (slash !== -1 && slash + 1 < id.length) index.set(normModelKey(id.slice(slash + 1)), row);
    const name = row._name;
    if (typeof name === 'string' && name !== '') index.set(normModelKey(name), row);
  }
  return index;
}

/** Estimate USD cost of the filtered records using the price table.
 * Bills the disjoint buckets (input, output, cacheRead, cacheWrite — each at
 * its own price when configured). Reasoning tokens are folded into output
 * tokens and are deliberately not billed separately.
 * @param records - in-memory usage history (already shaped).
 * @param manualPrices - user-configured price table (modelId -> price row) in
 * USD per 1M tokens; exact model-id match wins.
 * @param autoIndex - normalized lookup index of the auto-fetched radar table
 * (as built by {@link buildAutoIndex}); used when no manual price exists.
 * @returns {usd: number|null, unknownModels: string[]} — usd is null when no
 * model seen in the window has a configured price.
 */
export function calcCost(records, manualPrices, autoIndex) {
  let usd = 0;
  let anyConfigured = false;
  const unknown = new Set();
  for (const r of records) {
    const p = manualPrices[r.model] ?? (autoIndex ? autoIndex.get(normModelKey(r.model)) : undefined);
    if (p === undefined) {
      unknown.add(r.model);
      continue;
    }
    anyConfigured = true;
    usd += r.inputTokens / 1e6 * (p.input ?? 0)
      + r.outputTokens / 1e6 * (p.output ?? 0)
      + r.cacheReadTokens / 1e6 * (p.cacheRead ?? 0)
      + r.cacheWriteTokens / 1e6 * (p.cacheWrite ?? 0);
  }
  return { usd: anyConfigured ? usd : null, unknownModels: [...unknown] };
}

/** Cost of a single record (0 when the model has no configured price). */
export function costOfRecord(r, manualPrices, autoIndex) {
  const p = manualPrices[r.model] ?? (autoIndex ? autoIndex.get(normModelKey(r.model)) : undefined);
  if (p === undefined) return 0;
  return r.inputTokens / 1e6 * (p.input ?? 0)
    + r.outputTokens / 1e6 * (p.output ?? 0)
    + r.cacheReadTokens / 1e6 * (p.cacheRead ?? 0)
    + r.cacheWriteTokens / 1e6 * (p.cacheWrite ?? 0);
}
