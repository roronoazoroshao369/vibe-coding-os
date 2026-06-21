---
description: "Define and track performance budgets for a user-facing or latency-sensitive feature."
---

# Command: Vibe Perf Budget

## When to use

Invoke when defining performance budgets for a user-facing or latency-sensitive feature, when a CWV metric regresses, or before merging a change that could affect LCP/INP/CLS/TTFB/API p99.

## Required inputs

- Feature or endpoint name
- Current baseline (p50/p75/p95/p99) — if available
- Source of measurement (RUM, synthetic, e2e test)
- Owner

## Step-by-step behavior

1. Set the targets in `templates/performance-budget-template.md` (use Vibe target column).
2. Capture the baseline at p75 (or p99 for APIs).
3. If regressed beyond "Good", run the MEASURE → IDENTIFY → FIX → VERIFY → GUARD loop.
4. Wire a quality gate (pre-merge, scheduled, or continuous) with a stable measurement source.
5. Document the worst-decile analysis (p95-p99 dominant cause).
6. Update the project's quality config with the new gate.

## Outputs

- Filled `templates/performance-budget-template.md`
- Quality gate entry in project config
- Worst-decile analysis

## Stopping conditions

Stop when: (a) all target metrics are within "Good", (b) a guard gate is wired with stable measurement, (c) worst-decile story is documented, (d) owner is named.

## Verification checklist

- [ ] Targets set (Vibe target + hard ceiling + alert threshold)
- [ ] Baseline captured at p75
- [ ] MEASURE → IDENTIFY → FIX → VERIFY → GUARD loop run
- [ ] Guard gate wired
- [ ] Worst-decile analysis documented
- [ ] Owner named

## Anti-patterns to avoid

- Optimizing median while ignoring worst decile
- "Looks fast on my machine" — local is not p75
- Optimizing for synthetic Lighthouse while real users hit throttling
- Guard gate without stable measurement source
- Setting targets without a budget enforcement mechanism

## Related skills

- `skills/core/quality-engine/SKILL.md` — CWV targets + MEASURE → GUARD loop
- `templates/performance-budget-template.md` — SLO/Latency budget template
