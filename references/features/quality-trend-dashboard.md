# Quality Score Trend Dashboard

**Feature ID:** quality-trend-dashboard
**Status:** implemented (v2.7.0)
**Source:** Vibe Coding OS roadmap

## Summary

Time-series visualization from telemetry data (quality-engine session metrics) showing quality trends across sessions. Provides at-a-glance view of quality improvements, regressions, and stability over time.

## Key capabilities

- Reads telemetry data from quality-telemetry output (JSON event files)
- Generates time-series trend data showing pass/fail rates, execution times, and score changes
- Produces a markdown report with trend tables and summary stats
- Dashboard section integrates trend data into the main DASHBOARD.md

## Implementation references

- `scripts/quality-trend-dashboard.mjs` — Trend data generator
- `docs/quality-trend-dashboard.md` — Usage guide
- `docs/DASHBOARD.md` — Trend section integrated

## Related

- `quality:telemetry` — Data source
- `quality:session-metrics` — Session-level metrics
- `dashboard:generate` — Main dashboard generator
