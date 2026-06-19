# Quality Telemetry Guide

## Overview

Quality Telemetry captures, aggregates, and trends quality signals from every quality engine run so teams move from reactive single-run reviews to proactive continuous improvement.

Instead of reviewing each run in isolation, telemetry shows you:

- Which gates fail most often across tasks and models
- How pass/warn/fail rates change over time
- Whether model or profile choices correlate with quality outcomes
- Where to invest next in quality config, workflow discipline, or model selection

## What telemetry captures

Each telemetry event is a flat object that conforms to `schemas/quality-telemetry-event.json`. The schema is intentionally lean — it records only metadata, never raw content:

| Field | Description |
|---|---|
| `event_id` | Unique event identifier (UUID recommended for production; deterministic IDs acceptable for dry-run reproducibility) |
| `timestamp` | ISO 8601 date-time of the source run |
| `version` | Telemetry schema version (currently `2.2.0`) |
| `gate_id` | Quality gate identifier (e.g., `traceability`, `secret-scan`). Top-level run summaries use the pseudo-gate `quality-engine`; scorecard reports use `quality-scorecard-report` |
| `status` | Normalized gate outcome: `pass`, `fail`, `warn`, `skip`, `timeout`, or `unknown` |
| `duration_ms` | Gate execution wall-clock time in milliseconds |
| `model_id` | Model identifier (e.g., `claude-sonnet-4`, `gpt-4o-mini`, `unknown`) |
| `task_type` | Task category (e.g., `feature`, `bugfix`, `refactor`, `security`, `unknown`) |
| `profile` | Quality engine profile (`lean`, `standard`, `heavy`, or `unknown`) |
| `evidence_hash` | SHA-256 hash of redacted evidence — never raw stdout, stderr, prompts, file paths, or model output |

### Telemetry event lifecycle

1. **Quality engine run** — the `quality-engine.mjs` script produces a structured JSON report (`--output-json`).
2. **Scorecard report** (optional) — `quality-scorecard-report.mjs` produces a markdown summary of historical scorecard data.
3. **Collector** — `quality-telemetry.mjs` reads both sources and emits telemetry events.
4. **Storage** — events are appended as NDJSON to `docs/metrics/quality-telemetry-events.ndjson`.
5. **Trend analysis** — `quality-trend-report.mjs` aggregates events into daily/weekly pass-rate trends with per-model and per-gate breakdowns.

## How to run the collector

### Basic usage

```bash
# Collect from a quality engine JSON report
node scripts/quality-telemetry.mjs --engine docs/reports/quality-engine/quality-engine-2026-06-19T01-18-05-544Z.json

# Collect from engine output + scorecard report together
node scripts/quality-telemetry.mjs \
  --engine docs/reports/quality-engine/quality-engine-2026-06-19T01-18-05-544Z.json \
  --scorecard docs/reports/quality-engine/quality-engine-2026-06-19T01-18-05-544Z.md

# Dry-run (validate only, no file write)
node scripts/quality-telemetry.mjs --engine path/to/engine.json --dry-run

# Output as JSON array to stdout instead of file append
node scripts/quality-telemetry.mjs --engine path/to/engine.json --json

# Replace output file instead of append
node scripts/quality-telemetry.mjs --engine path/to/engine.json --replace

# Override model, task type, or profile when source lacks them
node scripts/quality-telemetry.mjs \
  --engine path/to/engine.json \
  --model-id claude-sonnet-4 \
  --task-type feature \
  --profile standard
```

### Typical workflow integration

```
vibe-quality-engine --output-json                           # 1. Run quality engine
node scripts/quality-telemetry.mjs --engine <output-file>    # 2. Emit telemetry
node scripts/quality-trend-report.mjs --since 7d             # 3. Review trends
```

### Output format

Events are written as NDJSON (one JSON object per line) to `docs/metrics/quality-telemetry-events.ndjson` by default.

```jsonl
{"event_id":"evt-...","timestamp":"2026-06-19T12:00:00.000Z","version":"2.2.0","gate_id":"quality-engine","status":"pass","duration_ms":15420,"model_id":"unknown","task_type":"feature","profile":"standard","evidence_hash":"sha256:..."}
{"event_id":"evt-...","timestamp":"2026-06-19T12:00:00.000Z","version":"2.2.0","gate_id":"traceability","status":"pass","duration_ms":842,"model_id":"unknown","task_type":"feature","profile":"standard","evidence_hash":"sha256:..."}
```

## Trend analysis

### Using quality-trend-report.mjs

The trend report aggregates events from the NDJSON event store and produces a markdown report:

```bash
# Generate a trend report for the last 7 days
node scripts/quality-trend-report.mjs --since 7d

# Generate from a specific events file
node scripts/quality-trend-report.mjs --events docs/metrics/quality-telemetry-events.ndjson --since 30d

# Generate from pre-computed metrics
node scripts/quality-trend-report.mjs --metrics path/to/metrics.json
```

The report includes:

- **Overall quality** — total sessions, gate runs, pass/fail counts, overall pass rate
- **Per-model comparison** — session count, average pass rate, most commonly failed gate per model
- **Per-gate reliability** — runs, pass rate, average duration for each gate
- **Trend over time** — daily and weekly pass rate groupings
- **Worst-performing gates** — gates with the highest failure counts
- **Recommendations** — actionable insights based on trend data

### Using session-metrics-collector.mjs

For ad-hoc metrics without a full trend report:

```bash
node scripts/session-metrics-collector.mjs --since 7d --model gpt-4o-mini
node scripts/session-metrics-collector.mjs --since 7d --output-json
```

### Interpreting trends

- **Pass rate declining** over time for a specific gate → investigate gate logic, config thresholds, or model guidance
- **Model consistently fails certain gates** → consider profile adjustments, coaching, or model-specific gate overrides
- **Warning signals increasing** across scorecard runs → review recent commits for scope creep or documentation gaps
- **Duration increasing** for a gate → investigate if the gate script has become slower (e.g., larger file scope)

## Privacy and redaction rules

### Local-first design

All telemetry is **local-first** and **never shared externally**. Data stays on the machine where the quality engine runs. No external servers, no analytics platforms, no reporting back to any service.

If you choose to share aggregated results (e.g., in a team retro), ensure no individual task details, file paths, or model outputs leak in the summary.

### Evidence hashing

The `evidence_hash` field stores a SHA-256 hash of a stable-serialized, **redacted** evidence object. The evidence object is constructed from the quality engine output but deliberately excludes:

- Raw stdout or stderr from gate scripts
- File paths from scorecard reports
- Model prompts or completions
- Secret tokens, API keys, or credentials
- User-identifying information

What IS included in the hash input (for deduplication and audit traceability):

- Gate exit code, signal, and timeout flag
- Evidence summary counts (warnings, skipped gates, changed files)
- Source metadata (gate category, criticality)

This means the evidence hash **cannot be reversed** to recover private content, but it can be used to detect duplicate events and correlate against audit logs.

### Scope for redaction

| Data type | Stored in event? | Hashed only? | Excluded? |
|---|---|---|---|
| Gate ID | ✅ | — | — |
| Status (pass/fail) | ✅ | — | — |
| Duration | ✅ | — | — |
| Model ID | ✅ | — | — |
| Task type | ✅ | — | — |
| Profile | ✅ | — | — |
| Gate stdout/stderr | — | — | ❌ (never stored or hashed) |
| File paths | — | — | ❌ (never stored or hashed) |
| Model prompts/output | — | — | ❌ (never stored or hashed) |
| Secrets/credentials | — | — | ❌ (never stored or hashed) |
| Gate exit code | — | ✅ | — |
| Timeout flags | — | ✅ | — |
| Summary counts | — | ✅ | — |

### Best practices

- Always use `--dry-run` when testing new collector configurations to verify no private data leaks
- Schedule periodic deletion of the events file (or set up log rotation) since NDJSON files grow unboundedly
- Never commit the events file to version control if it contains sensitive project names — add `docs/metrics/quality-telemetry-events.ndjson` to `.gitignore`
- The events file is already excluded from any export or sharing pipeline; do not circumvent this

## Schema reference

See `schemas/quality-telemetry-event.json` for the canonical JSON Schema definition.

Example event payloads are available at `templates/quality-telemetry-event-example.json`.

## Integration with quality engine

The telemetry workflow fits naturally after `vibe-quality-engine`:

1. Run `vibe-quality-engine --output-json` with the appropriate profile.
2. Immediately collect telemetry with `node scripts/quality-telemetry.mjs`.
3. Before a merge or periodic review, run trend analysis with `node scripts/quality-trend-report.mjs`.
4. Adjust quality config, thresholds, or model profile based on trend insights.

For model-aware config users, telemetry can surface whether a particular model profile consistently underperforms on certain task types, prompting a config adjustment.

Telemetry-derived patterns can also feed cross-repo learning after privacy review. See [`examples/multi-repo-learning/README.md`](../examples/multi-repo-learning/README.md) for safe lesson exchange and golden-example promotion guidance.

## Troubleshooting

- **"Quality engine output not found"** — verify the path; the `--engine` flag expects the `.json` output from `vibe-quality-engine --output-json`
- **"Invalid telemetry event"** — run with `--dry-run` to see detailed validation errors; verify the source file is valid JSON
- **Evidence hash mismatch** — the hash depends on stable serialization of the evidence object; different node versions should produce the same hash for identical input
- **No events collected** — check that the engine JSON file has a `results` array (even if empty); for scorecard reports, ensure the markdown is from a quality scorecard run
