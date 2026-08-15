# Changelog

All notable changes to this project are documented in this file.

## [Unreleased]

### Fixed
- "当日" range now shows the whole current day in the chart (hourly from
  00:00 to the current hour), matching the statistics cards.

## [1.0.2] - 2026-08-15

### Added
- Daily usage contribution heatmap (GitHub-style, last 52 weeks / one year)
  below the trend chart; cell blue intensity reflects that day's total token
  usage, with weekday labels on the left and centered card content.

### Changed
- Price panel now includes models from the auto price table even if they have
  not appeared in usage yet; search also matches model display names.
- Trend chart now uses a single unified y-axis; the three curves are labeled
  input / output / cache hit (previously "uncached input" on a separate right
  axis).
- Trend chart replays its draw/fade animation when the data changes (for
  example when switching API, model or date range), not only on first open.
- Heatmap cells now use a custom hover tooltip instead of the native `title`
  tooltip, avoiding an intermittent blank/black tooltip after repeated hovers.

## [1.0.1] - 2026-08-15

### Added
- Estimated cost card (USD): per-model prices (input / output / cache read /
  cache write, USD per 1M tokens) are configured in the in-panel pricing
  dialog and persisted to `~/.dsh/storages/token-stats/prices.json`; the
  overview API returns `cost` (usd + unknownModels).
- Automatic price sync from [modelradar.cn](https://modelradar.cn) (machine
  readable `/data/models.json`): fetched on boot with backoff retries and
  refreshed daily, cached to `prices-auto.json`; manual prices always
  override the auto table. The pricing dialog shows the data source, last
  update, per-row auto/manual tags and a manual refresh button.

### Changed
- **USD-correct auto prices**: modelradar prices every model in its native
  currency (183 of 294 models are CNY — DeepSeek, Kimi, Moonshot, …). Auto
  prices now always use the dataset's per-field `*PriceUsdPer1M` conversions
  instead of treating native prices as USD (which overstated DeepSeek costs
  ~7x); CNY-sourced rows are tagged `auto·CNY` in the dialog.
- Persistence is async and batched (was one blocking `appendFileSync` per
  call, plus a final flush on dispose); history loading reads only the tail
  of `usage.jsonl`; capture and load apply the same row filter, so
  cache-only rows survive a restart.
- Cache read/write stat cards removed (DeepSeek and most providers report no
  cache-write metric); the stat grid spans the 6 remaining cards (3 columns
  on narrow screens). `cacheWriteTokens` is still captured and billed when
  a price is known.
- Pricing dialog: cache-write price column, model search box, "no matching
  models" state, and inline errors when the prices API is unreachable or an
  auto refresh fails. Auto matching also accepts provider-prefixed model ids
  by basename ("openai/gpt-5.6-sol" → radar row "gpt-5.6-sol").
- Total-tokens stat card hint shows a Chinese-unit approximation with two
  decimals (≈11.11万 / ≈11.11亿) instead of the literal "input + output + cache" text.

## [1.0.0] - 2026-08-14

### Added
- Initial public release of the token usage statistics plugin for the
  DeepSeek Harness Web UI.
- Sidebar entry (`sidebar.footer.action`, id `token-usage`) opening an
  animated stats panel.
- 7 stat cards: total tokens, requests, uncached input, output, cache read,
  cache write and overall cache hit rate.
- Unified trend chart: smooth (monotone) SVG line chart with gradient areas —
  uncached input / cache hit / output on dual y-axes (cache rides a green
  right scale; it usually exceeds uncached input by ~100x), with halo
  outlines and a dashed cache-hit line so overlapping peaks stay readable.
- Range presets: today (hourly, last 5 hours), 7 days, current month,
  30 days; x-axis always spans the full width evenly.
- API / model filters (server-side aggregation) applied to cards, chart and
  recent list alike.
- Legend hover: highlights the matching curve (emboldened) and dims others.
- Recent requests list (latest 30 calls) with per-request token chips.
- Node half: captures per-request usage from the `llm/stream` waterfall,
  persists JSONL under `~/.dsh/storages/token-stats/`, serves
  `/token-stats/api/overview`.
- zh-CN / en locales, dark/light theme via DSH design tokens.
