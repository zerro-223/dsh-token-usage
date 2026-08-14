# Changelog

All notable changes to this project are documented in this file.

## [1.0.1] - 2026-08-14

### Added
- Estimated cost card (USD): per-model prices (input / output / cache read,
  USD per 1M tokens) are configured in the in-panel pricing dialog and
  persisted to `~/.dsh/storages/token-stats/prices.json`; the overview API
  returns `cost` (usd + unknownModels).

### Changed
- Total-tokens stat card hint now shows a Chinese-unit approximation
  (≈11万 / ≈11亿) instead of the literal "input + output + cache" text.

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
