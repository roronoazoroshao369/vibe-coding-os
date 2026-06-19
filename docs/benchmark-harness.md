# Benchmark Harness — Methodology Guide

## Overview

The Benchmark Harness measures execution performance of Vibe Coding OS's 26 validation gates. It provides reproducible timing data for performance tracking, regression detection, and capacity planning.

## Scripts

### `scripts/benchmark-validation-gates.mjs`

Runs each validation gate individually, measuring wall-clock time in milliseconds.

**Usage:**
```
node scripts/benchmark-validation-gates.mjs [options]
```

**Options:**
| Flag | Description |
| --- | --- |
| `--output <path>` | Output path for benchmark report (default: `docs/reports/benchmarks/benchmark-report.json`) |
| `--warmup` | Run 3 warm-up gates before measurement to warm caches |
| `--verbose` | Print per-gate pass/fail and timing to stderr |

**Output:**
- `benchmark-report.json` — JSON object with `meta` (run metadata) and `gates` (array of per-gate results).
- A timestamped copy is archived in `docs/reports/benchmarks/history/`.

**Exit code:** Always 0 (benchmark measures even when gates fail).

### `scripts/analyze-benchmark-trends.mjs`

Compares two or more benchmark reports, detects regressions, and generates a trend report.

**Usage:**
```
node scripts/analyze-benchmark-trends.mjs [options]
```

**Options:**
| Flag | Description |
| --- | --- |
| `--baseline <path>` | Baseline report (default: second-latest history entry) |
| `--compare <path>` | Candidate report (default: latest `benchmark-report.json`) |
| `--output <path>` | Trend report output (default: `docs/reports/benchmarks/trend-report.json`) |
| `--threshold <float>` | Regression threshold as decimal (default: 0.20 = 20%) |
| `--no-markdown` | Skip markdown report generation |

**Output:**
- `trend-report.json` — JSON analysis with regressions, improvements, stable gates.
- `trend-report.md` — Human-readable markdown summary (unless `--no-markdown`).

**Exit code:**
- 0 = No critical regressions
- 2 = Critical regressions found (>50% slowness)

## Benchmark Methodology

### Gate Isolation

Each gate runs in a separate Node.js subprocess via `spawnSync`. This ensures:
- Clean process-level isolation (no shared state between gates).
- Wall-clock timing includes process startup and teardown.
- Stdout/stderr are captured but not displayed unless `--verbose`.

### Timing Measurement

- **Duration:** Wall-clock milliseconds from `process.hrtime` diff (via `Date.now()` before and after `spawnSync`).
- **Reported fields:** `duration` (ms), `durationMs` (alias), `timestamp` (ISO 8601).
- **Aggregates:** Total, average, fastest, slowest per run.

### Warm-Up

Use `--warmup` to execute the first 3 gates before measurement begins. This primes filesystem caches and mitigates cold-start bias.

### Regression Detection

- **Threshold:** Default 20% increase in duration from baseline.
- **Severity levels:**
  - `warning`: 20–50% slower.
  - `critical`: >50% slower.
- **Baseline selection:** If not specified, the second-latest history entry is used as baseline and the latest as candidate.

### Report Storage

```
docs/reports/benchmarks/
├── benchmark-report.json      # Latest report
├── trend-report.json           # Latest trend analysis
├── trend-report.md             # Human-readable trend summary
└── history/
    ├── benchmark-2026-06-19T10-00-00-000Z.json
    └── ...
```

### Data Format

**Per-gate entry:**
```json
{
  "name": "Repo structure",
  "passed": true,
  "status": 0,
  "duration": 1423,
  "durationMs": 1423,
  "timestamp": "2026-06-19T10:00:00.000Z",
  "outputLength": 520,
  "command": "node scripts/validate-repo.mjs"
}
```

**Run metadata (`meta`):**
```json
{
  "version": "2.7.0",
  "gatesCount": 26,
  "passedCount": 26,
  "totalDurationMs": 45000,
  "averageDurationMs": 1731,
  "fastestGate": { "name": "...", "durationMs": 120 },
  "slowestGate": { "name": "...", "durationMs": 8500 },
  "timestamp": "2026-06-19T10:00:00.000Z",
  "nodeVersion": "v18.20.0",
  "platform": "linux"
}
```

## Best Practices

1. **Run benchmarks on idle systems.** Background CPU or I/O skews results.
2. **Take 3 samples and average them.** A single run can be noisy.
3. **Use `--warmup` for the first run of the day.** Cold caches inflate timings.
4. **Compare runs on the same hardware.** Cross-machine comparisons are unreliable.
5. **Commit baseline reports.** Include a known-good `benchmark-report.json` in the repo as the official baseline.

## NPM Scripts

```json
{
  "benchmark:gates": "node scripts/benchmark-validation-gates.mjs",
  "benchmark:trend": "node scripts/analyze-benchmark-trends.mjs"
}
```

## Vietnamese Summary (tóm tắt tiếng Việt)

Benchmark harness đo thời gian thực thi của 26 cổng validation. Mỗi cổng chạy trong tiến trình riêng (subprocess), đo thời gian wall-clock. Kết quả lưu dạng JSON. Script phân tích so sánh baseline và candidate, phát hiện regression khi chậm hơn 20%. Lưu trữ lịch sử trong `docs/reports/benchmarks/history/`.
