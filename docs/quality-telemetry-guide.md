# Quality Telemetry Guide

## What is it?

Quality Telemetry captures, aggregates, and trends quality signals from every quality engine run so teams move from reactive single-run reviews to proactive continuous improvement.

Instead of reviewing each run in isolation, telemetry shows you:

- Which gates fail most often across tasks and models
- How pass/warn/fail rates change over time
- Whether model or profile choices correlate with quality outcomes
- Where to invest next in quality config, workflow discipline, or model selection

## Quick start

### 1. Emit a quality event

After any quality engine run, emit structured telemetry:

```
vibe-quality-telemetry emit --model gpt-4o-mini --task-type api-change --output-json
```

This records the run's payload (gate results, timing, scope) into a local event store.

### 2. Review aggregated metrics

Get the big picture for a model or time window:

```
vibe-quality-telemetry metrics --model gpt-4o-mini --since 7d
```

Shows pass/warn/fail counts, average run duration, and gate-level breakdowns.

### 3. Generate a trend report

Spot regressions and improvement areas:

```
vibe-quality-telemetry trend --since 30d
```

Highlights rising failure rates, repeatedly weak gates, and actionable config or profile recommendations.

## Telemetry data structure

Each quality event includes:

- **Timestamp** — when the quality run occurred
- **Model** — model name or profile used
- **Task type** — category like api-change, refactor, db-migration
- **Gates** — per-gate results (pass/warn/fail) with counts
- **Timing** — total duration and per-gate wall clock
- **Scope** — optional summary of what was inspected

Events are lightweight JSON objects stored locally.

## Privacy

All telemetry is **local-first** and **never shared externally**. Data stays on the machine where the quality engine runs. No external servers, no analytics platforms, no reporting back to any service.

If you choose to share aggregated results (e.g., in a team retro), ensure no individual task details, file paths, or model outputs leak in the summary.

## Integration with quality engine

The telemetry workflow fits naturally after `vibe-quality-engine`:

1. Run `vibe-quality-engine` with the appropriate profile.
2. Immediately emit telemetry with `vibe-quality-telemetry emit`.
3. Before a merge or periodic review, run metrics and trend.
4. Adjust quality config, thresholds, or model profile based on trend insights.

For model-aware config users, telemetry can surface whether a particular model profile consistently underperforms on certain task types, prompting a config adjustment.
