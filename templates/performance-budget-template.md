# Performance Budget Template

Use this template to define and track performance budgets for user-facing or latency-sensitive features. Pairs with the MEASURE → IDENTIFY → FIX → VERIFY → GUARD loop in `skills/core/quality-engine/SKILL.md`.

## Feature / endpoint

- **Name:** `<feature or endpoint>`
- **Owner:** `<team or persona>`
- **User-visible?** yes | no
- **Latency-sensitive?** yes | no

## Targets (p75)

| Metric | Vibe target | Hard ceiling | Alert threshold |
| --- | --- | --- | --- |
| LCP | ≤ 2.0s | 2.5s | > 2.0s for 5 min |
| INP | ≤ 150ms | 200ms | > 150ms for 5 min |
| CLS | ≤ 0.05 | 0.1 | > 0.05 for 5 min |
| TTFB | ≤ 500ms | 800ms | > 500ms for 5 min |
| API p99 | ≤ 200ms | 300ms | > 200ms for 5 min |

Add rows for feature-specific metrics.

## Baseline (before change)

| Metric | p50 | p75 | p95 | p99 | Source |
| --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |
|  |  |  |  |  |  |

## MEASURE → IDENTIFY → FIX → VERIFY → GUARD

### 1. MEASURE (baseline)

`<Capture current p75 before the change. Note: synthetic vs real-user, throttling profile, sample size.>`

### 2. IDENTIFY (if regressed)

`<If any metric exceeds "Good" or the Vibe target, identify the dominant contributor. Cite the source (long task, render-blocking resource, N+1, etc.).>`

### 3. FIX

`<Smallest change that moves the metric into "Good". Prefer fixes that benefit the worst decile.>`

### 4. VERIFY

`<Re-measure at p75. Confirm "Good". If not, iterate from step 2.>`

### 5. GUARD

`<Wire a quality gate. Where does it run? What does it do on failure?>`

- Gate location: `<pre-merge | scheduled | continuous>`
- Measurement source: `<RUM | synthetic | e2e test>`
- Failure action: `<block merge | alert | log>`

## Worst-decile analysis

`<For the worst decile (p95-p99), what is the dominant cause? Document the tail-latency story.>`

## Related skills

- `skills/core/quality-engine/SKILL.md` — MEASURE → IDENTIFY → FIX → VERIFY → GUARD loop
- `skills/core/observability-design/SKILL.md` — questions-before-signals
- `commands/vibe-perf-budget.md` — perf budget command
