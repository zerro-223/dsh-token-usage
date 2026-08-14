# Changelog

All notable changes to this project are documented in this file.

## [1.3.4] - 2026-08-14

### Changed
- Scoped package name `@zerro223/dsh-token-usage` (unscoped name was squatted on npm).
- Legend hover highlights the matching curve (emboldened) and dims the others.
- Default range is now `today` (last 5 hours) instead of 7 days.

## [1.3.3] - 2026-08-14

### Fixed
- Overlapping curves no longer hide each other: cache-hit line is drawn dashed
  on top with background halo outlines; all peaks stay distinguishable even
  when they coincide.

## [1.3.2] - 2026-08-14

### Changed
- Output curve color changed from blue to amber for better contrast.

### Fixed
- Panel no longer jumps on open: fixed panel height + layout-mirroring skeleton.

## [1.3.1] - 2026-08-14

### Changed
- Dual y-axes: uncached input & output share the left scale, cache reads ride
  a green-tinted right scale (cache usually exceeds uncached input by 100x).

## [1.3.0] - 2026-08-14

### Changed
- Removed the "By Model" top-8 bar chart.
- Trend chart rewritten as smooth (monotone) SVG line chart with area fills;
  no overshoot below the x-axis.
- Y-axis ticks with units (M/K token).
- Bar chart replaced by line chart — x-axis spans the full width evenly.

## [1.2.0] - 2026-08-14

### Changed
- Unified big trend chart with range presets: today (hourly), 7d, month, 30d.
- API / model filters (server-side aggregation).
- Added cache hit rate stat card.

## [1.1.0] - 2026-08-14

### Added
- Hourly buckets for today (last 5 hours, zero-filled).

## [1.0.0] - 2026-08-14

### Added
- Initial release: sidebar entry + stats panel, per-request usage capture
  from the `llm/stream` waterfall, JSONL persistence under
  `~/.dsh/storages/token-stats/`, aggregation API.
