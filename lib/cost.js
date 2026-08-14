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

/** Total billed tokens of one record. Disjoint buckets (uncached input + output
* + cache reads/writes); reasoning tokens are folded into outputTokens, so they
* are deliberately not summed again here. */
export function totalOf(r) {
  return r.inputTokens + r.outputTokens + r.cacheReadTokens + r.cacheWriteTokens;
}

/** Keep only well-formed non-negative numeric price rows.
* Accepted fields: input, output, cacheRead. */
export function sanitizePrices(raw) {
  const out = {};
  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) return out;
  for (const [model, p] of Object.entries(raw)) {
    if (typeof model !== 'string' || model === '') continue;
    if (p === null || typeof p !== 'object' || Array.isArray(p)) continue;
    const row = {};
    for (const key of ['input', 'output', 'cacheRead']) {
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

/** Estimate USD cost of the filtered records using the price table.
* Bills the disjoint buckets (input, output, cacheRead, cacheWrite); cache
* writes are billed at the input price.
* reasoningTokens are folded into outputTokens and are not billed separately.
* @param records - in-memory usage history (already shaped).
* @param prices - manual price table (modelId -> {input, output, cacheRead})
* in USD per 1M tokens.
* @param autoIndex - optional normalized lookup index (Map) of auto-fetched
* radar prices; used as a fallback when a model has no manual price.
* @returns {usd: number|null, unknownModels: string[]} — usd is null when no
* model seen in the window has a configured price.
*/
export function calcCost(records, prices, autoIndex) {
  let usd = 0;
  let anyConfigured = false;
  const unknown = new Set();
  for (const r of records) {
    const p = prices[r.model] ?? (autoIndex ? autoIndex.get(normModelKey(r.model)) : undefined);
    if (p === undefined) {
      unknown.add(r.model);
      continue;
    }
    anyConfigured = true;
    usd += r.inputTokens / 1e6 * (p.input ?? 0)
      + r.outputTokens / 1e6 * (p.output ?? 0)
      + r.cacheReadTokens / 1e6 * (p.cacheRead ?? 0)
      + r.cacheWriteTokens / 1e6 * (p.input ?? 0);
  }
  return { usd: anyConfigured ? usd : null, unknownModels: [...unknown] };
}
