---
description: "Emit quality telemetry, aggregate session metrics, and generate trend reports from local quality engine results."
---

# vibe-quality-telemetry

## Purpose

Collect, aggregate, and review local-first quality telemetry so teams can track quality trends, compare models, and improve quality config over time.

## When to use

Use after quality engine runs, before merges, during periodic reviews, or whenever you want to move from single-run results to trend-based analysis.

## Subcommands

### emit

Record a quality event for the current run.

- Required: quality engine JSON results or summary payload
- Optional: `--model`, `--task-type`, `--session-id`, `--output-json`
- Produces a structured event file suitable for aggregation

### metrics

Aggregate recorded events into session-level metrics.

- Optional: `--model`, `--since`, `--output-json`
- Produces summary counts, averages, and distributions across recorded runs

### trend

Generate a trend report from collected metrics.

- Optional: `--model`, `--since`, `--output-json`
- Produces a concise markdown report with regressions, improvements, and configuration recommendations

## Options

- `--model` — scope results by model name or profile
- `--since` — include only events after the given timestamp or window
- `--output-json` — emit machine-readable output in addition to or instead of markdown

## Output

Aggregated metrics and a trend report covering pass, warn, fail, timing, and model or task comparisons.

## Verification or stopping conditions

Stop and ask for clarification if input data is missing, contradictory, or insufficient to produce reliable aggregated metrics.
