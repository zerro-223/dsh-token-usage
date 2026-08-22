import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  aggregate,
  buildCustomOverview,
  buildHeatmap,
  buildOverview,
  buildSeriesBuckets,
  dateKey,
  dayStartOf,
  mergeRecords,
} from '../lib/aggregate.js';
import { buildAutoIndex, recordShape } from '../lib/cost.js';

/** Fixed reference time: 2026-08-15 18:26:30 local. */
const NOW = new Date(2026, 7, 15, 18, 26, 30).getTime();
const DAY_MS = 24 * 3600 * 1000;

function rec(overrides = {}) {
  return recordShape({
    ts: NOW,
    provider: 'p1',
    model: 'm1',
    inputTokens: 100,
    outputTokens: 50,
    cacheReadTokens: 10,
    cacheWriteTokens: 0,
    reasoningTokens: 0,
    ...overrides,
  });
}

const PRICES = { m1: { input: 2, output: 4, cacheRead: 1, cacheWrite: 1 } };

function fixture() {
  return [
    rec({ ts: dayStartOf(NOW) - DAY_MS }), // yesterday, m1 priced
    rec({ ts: dayStartOf(NOW) + 3600_000, provider: 'p2', model: 'm2', inputTokens: 20, outputTokens: 0, cacheReadTokens: 5 }), // today, m2 unpriced
    rec({ ts: dayStartOf(NOW) + 2 * 3600_000, inputTokens: 10, outputTokens: 10 }), // today, m1 priced
    rec({ ts: dayStartOf(NOW) - 8 * DAY_MS }), // outside a 7-day window
  ];
}

test('buildSeriesBuckets builds the 5h preset (5 hourly buckets)', () => {
  const { granularity, buckets, keyOf } = buildSeriesBuckets('5h', NOW);
  assert.equal(granularity, 'hour');
  assert.equal(buckets.length, 5);
  assert.equal(buckets[0].label, '14:00');
  assert.equal(buckets[4].label, '18:00');
  assert.equal(buckets[0].key, dayStartOf(NOW) + 14 * 3600_000);
  assert.equal(keyOf(NOW), dayStartOf(NOW) + 18 * 3600_000);
});

test('buildSeriesBuckets builds the hour preset up to the current hour', () => {
  const { buckets } = buildSeriesBuckets('hour', NOW);
  assert.equal(buckets.length, 19); // 00:00 .. 18:00
  assert.equal(buckets[0].label, '00:00');
  assert.equal(buckets[18].label, '18:00');
});

test('buildSeriesBuckets builds day presets (7 / month / year / 364)', () => {
  const d7 = buildSeriesBuckets(7, NOW);
  assert.equal(d7.granularity, 'day');
  assert.equal(d7.buckets.length, 7);
  assert.equal(d7.buckets[0].date, dateKey(dayStartOf(NOW) - 6 * DAY_MS));
  assert.equal(d7.buckets[6].date, '2026-08-15');

  const month = buildSeriesBuckets('month', NOW);
  assert.equal(month.buckets.length, 15); // Aug 1..15

  const year = buildSeriesBuckets('year', NOW);
  assert.equal(year.buckets[0].date, '2026-01-01');
  assert.equal(year.buckets.length, 31 + 28 + 31 + 30 + 31 + 30 + 31 + 15); // 227

  const wide = buildSeriesBuckets(364, NOW);
  assert.equal(wide.buckets.length, 364);
});

test('aggregate fills buckets, totals, cost, byModel, recent and filterOptions in one pass', () => {
  const { granularity, buckets, keyOf } = buildSeriesBuckets(7, NOW);
  const agg = aggregate(fixture(), {
    startTs: buckets[0].key,
    endTs: NOW,
    buckets,
    keyOf,
    provider: null,
    model: null,
    manualPrices: PRICES,
    autoIndex: null,
    include: 'full',
  });

  assert.equal(granularity, 'day');
  // totals: 3 in-window records (the 8-day-old one is outside)
  assert.equal(agg.totals.requests, 3);
  assert.equal(agg.totals.inputTokens, 130);
  assert.equal(agg.totals.outputTokens, 60);
  assert.equal(agg.totals.cacheReadTokens, 25); // 10 + 5 + 10
  // m1 prices: input 2 / output 4 / cacheRead 1 per 1M
  // r1: 100*2 + 50*4 + 10*1 = 0.00041 ; r3: 10*2 + 10*4 + 10*1 = 0.00007
  assert.ok(Math.abs(agg.totals.costUsd - 0.00048) < 1e-12);

  const denom = 25 + 130;
  assert.equal(agg.cacheHitRate, 25 / denom);

  // cost: only m1 is priced; m2 is unknown
  assert.ok(Math.abs(agg.cost.usd - 0.00048) < 1e-12);
  assert.deepEqual(agg.cost.unknownModels, ['m2']);

  // byModel: m1 first (more total tokens), priced; m2 unpriced -> null + flag
  assert.equal(agg.byModel.length, 2);
  assert.equal(agg.byModel[0].key, 'm1');
  assert.equal(agg.byModel[0].requests, 2);
  assert.ok(Math.abs(agg.byModel[0].costUsd - 0.00048) < 1e-12);
  assert.equal(agg.byModel[0].costUnknown, false);
  assert.equal(agg.byModel[1].key, 'm2');
  assert.equal(agg.byModel[1].costUsd, null);
  assert.equal(agg.byModel[1].costUnknown, true);

  // recent: newest first, capped at 30
  assert.deepEqual(agg.recent.map((r) => r.ts), [
    dayStartOf(NOW) + 2 * 3600_000,
    dayStartOf(NOW) + 3600_000,
    dayStartOf(NOW) - DAY_MS,
  ]);

  // filterOptions ignores the provider/model filter and skips empty names
  assert.deepEqual(agg.filterOptions.providers, ['p1', 'p2']);
  assert.deepEqual(agg.filterOptions.models, ['m1', 'm2']);

  // series: only the last (today) bucket holds the two same-day records;
  // bucket objects keep their key/label/date payload fields
  const last = agg.buckets[6];
  assert.equal(last.requests, 2);
  assert.equal(last.inputTokens, 30);
  assert.equal(last.label, '2026-08-15');
  assert.equal(last.date, '2026-08-15');
  assert.equal(last.cacheReadTokens, 15); // 5 + 10
  assert.equal(last.reasoningTokens, 0);
  assert.ok(Math.abs(last.costUsd - 0.00007) < 1e-12);
});

test('aggregate applies provider and model filters to stats but not to filterOptions', () => {
  const { buckets, keyOf } = buildSeriesBuckets(7, NOW);
  const base = {
    startTs: buckets[0].key,
    endTs: NOW,
    buckets,
    keyOf,
    manualPrices: PRICES,
    autoIndex: null,
    include: 'full',
  };
  const byProvider = aggregate(fixture(), { ...base, provider: 'p1', model: null });
  assert.equal(byProvider.totals.requests, 2);
  assert.deepEqual(byProvider.filterOptions.providers, ['p1', 'p2']); // never narrowed

  const byModel = aggregate(fixture(), { ...base, provider: null, model: 'm2' });
  assert.equal(byModel.totals.requests, 1);
  assert.equal(byModel.totals.inputTokens, 20);
  assert.deepEqual(byModel.byModel.map((m) => m.key), ['m2']);
});

test('aggregate series-only mode skips totals/cost/byModel/recent', () => {
  const { buckets, keyOf } = buildSeriesBuckets(7, NOW);
  const agg = aggregate(fixture(), {
    startTs: buckets[0].key,
    endTs: NOW,
    buckets,
    keyOf,
    provider: null,
    model: null,
    manualPrices: {},
    autoIndex: null,
    include: 'series',
  });
  assert.equal(agg.totals, null);
  assert.equal(agg.cost, null);
  assert.equal(agg.byModel, null);
  assert.equal(agg.recent, null);
  assert.equal(agg.buckets[6].requests, 2);
});

test('recent is capped at 30 newest records', () => {
  const records = [];
  for (let i = 0; i < 40; i += 1) {
    records.push(rec({ ts: dayStartOf(NOW) + 3600_000 + i }));
  }
  const { buckets, keyOf } = buildSeriesBuckets(7, NOW);
  const agg = aggregate(records, {
    startTs: buckets[0].key,
    endTs: NOW,
    buckets,
    keyOf,
    provider: null,
    model: null,
    manualPrices: PRICES,
    autoIndex: null,
    include: 'full',
  });
  assert.equal(agg.recent.length, 30);
  assert.equal(agg.recent[0].ts, dayStartOf(NOW) + 3600_000 + 39);
});

test('buildOverview returns the documented payload shape', () => {
  const payload = buildOverview(fixture(), 7, null, null, PRICES, null, NOW);
  assert.equal(payload.range, 7);
  assert.equal(payload.granularity, 'day');
  assert.equal(payload.series.length, 7);
  assert.equal(payload.totals.requests, 3);
  assert.equal(payload.recent.length, 3);
  assert.equal(payload.filterOptions.models.length, 2);
  assert.ok(payload.generatedAt > 0);
  assert.ok(payload.rangeEnd >= payload.rangeStart);
});

test('buildCustomOverview validates the range and builds day series', () => {
  assert.throws(() => buildCustomOverview([], '2026-08-02', '2026-08-01', null, null, {}, null), /between 1 and 30/);
  assert.throws(() => buildCustomOverview([], '2026-06-01', '2026-08-15', null, null, {}, null), /between 1 and 30/);
  const payload = buildCustomOverview(fixture(), '2026-08-15', '2026-08-15', null, null, PRICES, null);
  assert.equal(payload.range, 'custom');
  assert.equal(payload.series.length, 1);
  assert.equal(payload.series[0].requests, 2);
  assert.equal(payload.totals.requests, 2);
});

test('buildHeatmap returns series-only payload without costs', () => {
  const payload = buildHeatmap(fixture(), 7, null, null, NOW);
  assert.equal(payload.series.length, 7);
  assert.equal(payload.series[6].requests, 2);
  assert.ok(!('cost' in payload));
  assert.ok(!('totals' in payload));
});

test('mergeRecords dedupes by row key and keeps the newest cap records', () => {
  const disk = [
    rec({ ts: 1000, provider: 'p', model: 'a', inputTokens: 1 }),
    rec({ ts: 2000, provider: 'p', model: 'b', inputTokens: 1 }),
  ];
  const memory = [
    rec({ ts: 2000, provider: 'p', model: 'b', inputTokens: 1 }), // exact duplicate of disk[1]
    rec({ ts: 3000, provider: 'p', model: 'c', inputTokens: 1 }),
  ];
  const merged = mergeRecords(memory, disk, 100);
  assert.equal(merged.length, 3);
  assert.deepEqual(merged.map((r) => r.ts), [1000, 2000, 3000]);

  const capped = mergeRecords(memory, disk, 2);
  assert.deepEqual(capped.map((r) => r.ts), [2000, 3000]);
});

test('aggregate excludes empty provider/model names from filter options', () => {
  const { buckets, keyOf } = buildSeriesBuckets(7, NOW);
  const records = [
    rec({ provider: '', model: '' }),
    rec({ provider: 'p1', model: 'm1' }),
  ];
  const agg = aggregate(records, {
    buckets,
    startTs: buckets[0].key,
    endTs: NOW,
    keyOf,
    provider: null,
    model: null,
    manualPrices: PRICES,
    autoIndex: null,
    include: 'full',
  });
  assert.deepEqual(agg.filterOptions.providers, ['p1']);
  assert.deepEqual(agg.filterOptions.models, ['m1']);
});

test('aggregate price lookup prefers manual prices and caches auto lookups', () => {
  const autoIndex = buildAutoIndex({ 'm2-extra': { input: 9, output: 9, _name: 'M2' } });
  const rWithAutoMatch = rec({ provider: 'p2', model: 'M2', inputTokens: 1_000_000, outputTokens: 0, cacheReadTokens: 0 });
  const manual = { m1: { input: 2, output: 4 } };
  const { buckets, keyOf } = buildSeriesBuckets(7, NOW);
  const agg = aggregate([rWithAutoMatch], {
    startTs: buckets[0].key,
    endTs: NOW,
    buckets,
    keyOf,
    provider: null,
    model: null,
    manualPrices: manual,
    autoIndex,
    include: 'full',
  });
  // M2 normalized matches the radar name row -> billed at 9/M
  assert.equal(agg.cost.usd, 9);
});
