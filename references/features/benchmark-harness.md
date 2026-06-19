# Feature: Benchmark Harness for Validation Gates

## Goal

Measure the execution performance of each validation gate individually, track timing trends across runs, and detect regressions (slowness >20%) that signal performance degradation.

## Reference sources

- Original Vibe Coding OS validation infrastructure (`scripts/validate-all.mjs`, 26 gates)

## Local implementation

- `scripts/benchmark-validation-gates.mjs` — Runs all 26 gates, measures duration (ms), pass/fail, outputs `benchmark-report.json`.
- `scripts/analyze-benchmark-trends.mjs` — Compares reports across runs, detects regressions, generates trend report.
- `docs/benchmark-harness.md` — Methodology guide.
- `docs/reports/benchmarks/` — Report storage directory.

## Applied upstream ideas

- Subprocess isolation: each gate runs as a separate `spawnSync` to measure wall-clock time independently.
- History archiving: every run is saved with a timestamp in `docs/reports/benchmarks/history/`.
- Regression detection: percentage-based comparison using a configurable threshold (default 20%).
- Severity levels: >20% = warning, >50% = critical.

## Not applied upstream ideas

- No distributed benchmark agent or cloud CI aggregation.
- No continuous profiling or flamegraph generation.

## Must-have behavior

- Must execute all 26 gates exactly as defined in `validate-all.mjs`.
- Must report per-gate timing in milliseconds.
- Must archive results with timestamps for trend analysis.
- Trend analysis must flag gates slower than baseline by more than 20%.
- Must exit 0 even on gate failures (measurement mode), but exit 2 on critical regressions in trend analysis.
- npm scripts: `benchmark:gates` and `benchmark:trend`.

## Vietnamese summary (tóm tắt tiếng Việt)

Tính năng benchmark harness chạy từng cổng validation (26 gates), đo thời gian thực thi (ms), ghi kết quả vào JSON report. Script phân tích xu hướng so sánh các lần chạy, phát hiện regression khi chạy chậm hơn 20%. Lưu trữ lịch sử benchmark để theo dõi hiệu năng theo thời gian.
