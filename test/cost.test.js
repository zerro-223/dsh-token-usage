import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calcCost, normModelKey, recordShape, sanitizePrices, totalOf } from '../lib/cost.js';

/** Build a shaped record with convenient overrides. */
function rec(overrides = {}) {
  return recordShape({
    ts: 1700000000000,
    provider: 'deepseek',
    model: 'deepseek-chat',
    ...overrides,
  });
}

test('totalOf sums disjoint buckets and does not double-count reasoning', () => {
  const r = rec({
    inputTokens: 100,
    outputTokens: 200,
    cacheReadTokens: 30,
    cacheWriteTokens: 40,
    reasoningTokens: 50,
  });
  // reasoning (50) is folded into output, not added again.
  assert.equal(totalOf(r), 100 + 200 + 30 + 40);
});

test('calcCost bills cacheWriteTokens (fallback to input price)', () => {
  const r = rec({ cacheWriteTokens: 1_000_000 });
  const prices = { 'deepseek-chat': { input: 1, output: 2, cacheRead: 0.5 } };
  const { usd, unknownModels } = calcCost([r], prices);
  assert.equal(unknownModels.length, 0);
  // 1M cache-write tokens billed at input price $1/M = $1
  assert.equal(usd, 1);
});

test('calcCost bills cacheWriteTokens at the input price', () => {
  const r = rec({ cacheWriteTokens: 1_000_000 });
  const prices = { 'deepseek-chat': { input: 1.5, output: 2, cacheRead: 0.5 } };
  // cacheWrite falls back to the input price (no separate cacheWrite bucket).
  assert.equal(calcCost([r], prices).usd, 1.5);
});

test('calcCost does not double-count reasoning tokens', () => {
  const r = rec({ outputTokens: 1_000_000, reasoningTokens: 500_000 });
  const prices = { 'deepseek-chat': { input: 1, output: 2, cacheRead: 0.5 } };
  // Only output is billed ($2); reasoning is folded into output, not $1 extra.
  assert.equal(calcCost([r], prices).usd, 2);
});

test('calcCost bills all disjoint buckets together', () => {
  const r = rec({
    inputTokens: 1_000_000,
    outputTokens: 2_000_000,
    cacheReadTokens: 3_000_000,
    cacheWriteTokens: 4_000_000,
  });
  const prices = { 'deepseek-chat': { input: 1, output: 2, cacheRead: 0.5 } };
  // 1*1 + 2*2 + 3*0.5 + 4*1 = 1 + 4 + 1.5 + 4 = 10.5
  assert.equal(calcCost([r], prices).usd, 10.5);
});

test('calcCost returns null usd when no model in the window is priced', () => {
  const r = rec({ inputTokens: 100 });
  const { usd, unknownModels } = calcCost([r], {});
  assert.equal(usd, null);
  assert.deepEqual(unknownModels, ['deepseek-chat']);
});

test('calcCost tracks unknown models and skips them without breaking known ones', () => {
  const known = rec({ model: 'known', inputTokens: 1_000_000 });
  const unknown = rec({ model: 'unknown', inputTokens: 999_999_999 });
  const prices = { known: { input: 1, output: 2 } };
  const { usd, unknownModels } = calcCost([known, unknown], prices);
  assert.equal(usd, 1);
  assert.deepEqual(unknownModels, ['unknown']);
});

test('calcCost treats missing price fields as 0', () => {
  const r = rec({ inputTokens: 1_000_000, outputTokens: 1_000_000, cacheWriteTokens: 1_000_000 });
  const prices = { 'deepseek-chat': { input: 1 } };
  // input 1*1 + output 0 + cacheWrite 1 (fallback to input) = 2
  assert.equal(calcCost([r], prices).usd, 2);
});

test('sanitizePrices ignores cacheWrite keys', () => {
  const raw = { m: { input: 1, output: 2, cacheRead: 0.5, cacheWrite: 1.5 } };
  assert.deepEqual(sanitizePrices(raw), { m: { input: 1, output: 2, cacheRead: 0.5 } });
});

test('sanitizePrices drops negative, NaN, infinite and non-numeric prices', () => {
  const raw = {
    a: { input: -1, output: 2 },
    b: { input: NaN, output: 2 },
    c: { input: Infinity, output: 2 },
    d: { input: 'x', output: 2 },
    e: { input: 0, output: 2 },
  };
  const out = sanitizePrices(raw);
  assert.deepEqual(out.a, { output: 2 });
  assert.deepEqual(out.b, { output: 2 });
  assert.deepEqual(out.c, { output: 2 });
  assert.deepEqual(out.d, { output: 2 });
  assert.deepEqual(out.e, { input: 0, output: 2 });
});

test('sanitizePrices rejects non-object rows and non-string model keys', () => {
  assert.deepEqual(sanitizePrices(null), {});
  assert.deepEqual(sanitizePrices([]), {});
  assert.deepEqual(sanitizePrices('x'), {});
  assert.deepEqual(sanitizePrices({ '': { input: 1 } }), {});
  assert.deepEqual(sanitizePrices({ m: null }), {});
  assert.deepEqual(sanitizePrices({ m: [1, 2] }), {});
  assert.deepEqual(sanitizePrices({ m: {} }), {});
});

test('recordShape coerces missing/NaN fields to 0 and keeps old records compatible', () => {
  // Old JSONL rows recorded before cacheWrite/reasoning were added.
  const r = recordShape({ ts: 1700000000000, provider: 'p', model: 'm', inputTokens: 10, outputTokens: 20 });
  assert.equal(r.cacheReadTokens, 0);
  assert.equal(r.cacheWriteTokens, 0);
  assert.equal(r.reasoningTokens, 0);
  assert.equal(r.inputTokens, 10);
  assert.equal(r.outputTokens, 20);
});

test('recordShape coerces types', () => {
  const r = recordShape({
    ts: '1700000000000',
    provider: 42,
    model: null,
    inputTokens: '100',
    outputTokens: undefined,
    cacheReadTokens: null,
    cacheWriteTokens: NaN,
    reasoningTokens: '7',
  });
  assert.equal(r.ts, 1700000000000);
  assert.equal(r.provider, '42');
  assert.equal(r.model, '');
  assert.equal(r.inputTokens, 100);
  assert.equal(r.outputTokens, 0);
  assert.equal(r.cacheReadTokens, 0);
  assert.equal(r.cacheWriteTokens, 0);
  assert.equal(r.reasoningTokens, 7);
});

test('calcCost handles empty records and zero tokens', () => {
  assert.equal(calcCost([], { m: { input: 1 } }).usd, null);
  const r = rec({ inputTokens: 0, outputTokens: 0, cacheReadTokens: 0, cacheWriteTokens: 0 });
  assert.equal(calcCost([r], { 'deepseek-chat': { input: 1 } }).usd, 0);
});

test('calcCost handles very large token counts', () => {
  const r = rec({ cacheWriteTokens: 1_000_000_000_000 }); // 1e12 tokens
  const prices = { 'deepseek-chat': { input: 100 } };
  // 1e12 / 1e6 * 100 = 1e8
  assert.equal(calcCost([r], prices).usd, 1e8);
});

test('calcCost falls back to autoIndex when a model has no manual price', () => {
  const r = rec({ model: 'Deep-Seek_Chat', inputTokens: 2_000_000 }); // no manual price
  const autoIndex = new Map([['deepseekchat', { input: 2, output: 8, cacheRead: 1 }]]);
  const { usd, unknownModels } = calcCost([r], {}, autoIndex);
  // 2e6 / 1e6 * 2 = 4
  assert.equal(usd, 4);
  assert.deepEqual(unknownModels, []);
});

test('calcCost prefers manual prices over autoIndex', () => {
  const r = rec({ inputTokens: 1_000_000 });
  const prices = { 'deepseek-chat': { input: 10, output: 10, cacheRead: 10 } };
  const autoIndex = new Map([['deepseekchat', { input: 2, output: 8, cacheRead: 1 }]]);
  const { usd } = calcCost([r], prices, autoIndex);
  // manual 10 wins over auto 2
  assert.equal(usd, 10);
});

test('normModelKey normalizes model ids for index lookup', () => {
  assert.equal(normModelKey('Deep-Seek_Chat'), 'deepseekchat');
  assert.equal(normModelKey('deepseek-v4-pro'), 'deepseekv4pro');
  assert.equal(normModelKey(''), '');
});
