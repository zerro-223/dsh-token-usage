# Changelog

All notable changes to this project are documented in this file.

## [1.0.5] - 2026-08-15

### Fixed
- Stat cards: the grid still laid out 8 columns after the two cache cards
  were removed, leaving two empty cells; it now spans exactly the 6 cards
  (3 columns on narrow screens).

### Changed
- Auto-price boot refresh now retries with backoff (3s, then every 20s up to
  3 times) instead of giving up after one attempt, so a transient network
  failure at boot no longer leaves the pricing dialog empty until the next
  day.
- Pricing dialog surfaces failures instead of failing silently: an API
  unreachable/404 state, a failed auto refresh (with the error message), and
  the "auto prices not fetched yet" state are all shown as an inline warning.

## [1.0.4] - 2026-08-15

### Fixed
- **Currency bug in auto prices**: modelradar.cn prices every model in its
  native currency (183 of 294 models are CNY — DeepSeek, Kimi, Moonshot, …),
  and the plugin previously stored the native fields as USD, inflating cost
  by the CNY→USD factor (~7x for DeepSeek). Auto prices now always use the
  dataset per-field `*PriceUsdPer1M` conversions (native price is kept as
  a fallback only for USD-native models), and rows sourced from CNY prices
  are tagged `auto·CNY` in the pricing dialog.

### Changed
- Cache-write price column added to the pricing dialog and to the cost
  estimate (`cacheWriteTokens` are now billed when a price is known, e.g.
  Anthropic); manual price rows accept cache-write too.
- Pricing dialog: search box to filter models, and a "no matching models"
  state.
- Auto-price matching now also indexes provider-prefixed model ids by
  basename ("openai/gpt-5.6-sol" matches the radar row "gpt-5.6-sol").
- Cache-read stat card removed (same rationale as cache write: DeepSeek and
  most providers report no separate cache-read card value worth a card);
  the trend chart cache-hit curve and recent-list chips are unaffected.

## [1.0.3] - 2026-08-15

### Removed
- The cache-write stat card: DeepSeek and most other providers never report
  a cache-write metric (only Pi AI fills `usage.cacheWrite`), so the card
  was permanently 0 for them. `cacheWriteTokens` is still captured and
  persisted (and still counts toward the total-tokens card) for providers
  that do report it.

## [1.0.2] - 2026-08-15

### Changed
- Persistence is now async and batched (`appendFile` on a serialized promise
  chain, flushed every second or as soon as 64 rows pile up, plus a final
  flush on plugin dispose) instead of one blocking `appendFileSync` per
  model call.
- History loading reads only the tail of `usage.jsonl` (backward chunked
  reads, capped at the newest 500k rows) instead of parsing the whole file
  on boot.
- Capture and load now apply the same row filter; cache-only rows
  (`cacheReadTokens` / `cacheWriteTokens` > 0 with zero input/output) are
  kept on both paths instead of being lost after a restart.
- Fixed an abort-timer cleanup gap in the ModelRadar refresh: the 15s
  timeout is now cleared on every exit path.
- Removed dead code in the browser half (`useMounted`, `PALETTE`,
  unused `.ts-triggerBadge` CSS) and corrected the retry explanation to
  match the official docs (`dsh-llm-retry` does not wrap `llm/stream`;
  retries are new requests scheduled through `agent/request-error`).

## [1.0.1] - 2026-08-14

### Added
- Estimated cost card (USD): per-model prices (input / output / cache read,
  USD per 1M tokens) are configured in the in-panel pricing dialog and
  persisted to `~/.dsh/storages/token-stats/prices.json`; the overview API
  returns `cost` (usd + unknownModels).
- Automatic price sync from [modelradar.cn](https://modelradar.cn) (machine
  readable `/data/models.json`): fetched on boot and refreshed daily,
  cached to `prices-auto.json`; manual prices always override the auto
  table. The pricing dialog shows the data source, last update, per-row
  auto/manual tags and a manual refresh button.

### Changed
- Total-tokens stat card hint now shows a Chinese-unit approximation with two
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
