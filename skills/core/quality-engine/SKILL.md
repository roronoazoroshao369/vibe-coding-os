---
name: quality-engine
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: core
tags:
  - core
  - quality
status: stable
---

# Skill: Quality Engine

## Purpose

Run a configurable quality engine that executes relevant quality gates on a task or repository and returns structured results, actionable recommendations, and a human-readable report.

## When to use

Use after implementation, before a PR or merge, during periodic quality audits, or when onboarding or reassessing a repository. Choose this skill when you need a coordinated pass across multiple quality gates instead of running individual checks manually.

## Inputs

- Task description and scope (what changed, what is affected)
- Model profile selection (`lean`, `standard`, or `heavy`)
- Repository path or working context
- Optional config path for project-specific settings
- Optional gate selection to force or exclude certain checks

## Workflow

1. Load configuration from the project config path if available, otherwise use the default quality engine defaults.
2. Determine the model profile and translate it into execution constraints, depth, and evidence expectations.
3. Select relevant gates based on task type, changed areas, and the chosen profile.
4. Execute the quality engine with the selected gates in a predictable order.
5. Capture pass, warn, and fail results with supporting evidence or remediation pointers.
6. Review failures and warnings, then group them into root causes and actionable fixes.
7. Generate a structured result set plus a markdown report with timing, summary, and recommendations.

## Outputs

- Structured results object with gate names, statuses, messages, and timing
- Markdown report summarizing findings, risk, and recommended next steps
- Ranked fix recommendations grouped by severity and confidence

## Failure modes

- Running a heavy profile on trivial work and wasting review bandwidth.
- Running a lean profile on high-risk changes and missing important signals.
- Skipping config and losing project-specific thresholds or exclusion rules.
- Mixing evidence from unrelated tasks or files.
- Treating warnings as blockers without reviewing confidence and impact.

## Verification checklist

- [ ] `validate:all` exits 0 (config + gates loaded; `--json` shape matches `schemas/`).
- [ ] Selected profile (`lean|standard|heavy`) is recorded in the report header.
- [ ] Every failing gate cites a file path, command, or captured output (not just "X failed").
- [ ] Recommendation count == failing-gate count; no orphan recommendations.
- [ ] Report file size > 1 KB and < 200 KB (sanity bounds; flags empty or runaway reports).
- [ ] Report distinguishes `FAIL` from `WARN` in the summary table.

## Performance budgets (frontend & API)

Use these Core Web Vitals targets and the MEASURE → IDENTIFY → FIX → VERIFY → GUARD loop when the quality engine is evaluating user-facing or latency-sensitive changes.

### Core Web Vitals target table

| Metric | Good | Needs improvement | Poor | Vibe target (p75) |
| --- | --- | --- | --- | --- |
| **LCP** (Largest Contentful Paint) | ≤ 2.5s | 2.5s – 4.0s | > 4.0s | ≤ 2.0s |
| **INP** (Interaction to Next Paint) | ≤ 200ms | 200ms – 500ms | > 500ms | ≤ 150ms |
| **CLS** (Cumulative Layout Shift) | ≤ 0.1 | 0.1 – 0.25 | > 0.25 | ≤ 0.05 |
| **TTFB** (Time to First Byte) | ≤ 800ms | 800ms – 1800ms | > 1800ms | ≤ 500ms |
| **API p99** (for latency-sensitive endpoints) | ≤ 300ms | 300ms – 1000ms | > 1000ms | ≤ 200ms |

### MEASURE → IDENTIFY → FIX → VERIFY → GUARD loop

For any user-facing or latency-sensitive change:

1. **MEASURE** — capture the baseline metric at p75 (LCP, INP, CLS, TTFB, or p99 for APIs). Use the project's existing observability signal or a synthetic test.
2. **IDENTIFY** — if the metric exceeds the "Good" threshold, identify the dominant contributor (long task, render-blocking resource, layout shift source, DB query plan, N+1). Cite the source.
3. **FIX** — make the smallest change that moves the metric into the "Good" range. Prefer fixes that benefit the worst decile, not just the median.
4. **VERIFY** — re-measure at p75. Confirm the metric moved into "Good". If not, iterate from step 2.
5. **GUARD** — wire a quality gate that fails the merge if the metric regresses beyond the "Good" threshold. Document the gate in the project's quality config.

### Failure modes (performance)

- Optimizing median while worst decile is unchanged (tail latency ignored).
- "Looks fast on my machine" — local measurements are not p75.
- Optimizing for synthetic Lighthouse while users hit real-world network throttling.
- Adding a guard gate without a stable measurement source (noisy alerts).

## Related skills

- `skills/core/quality-execution-contract/SKILL.md`
- `skills/core/adversarial-code-review/SKILL.md`
- `skills/core/adaptive-prompt-selection/SKILL.md`
- `skills/core/observability-design/SKILL.md` — questions-before-signals (downstream consumer of quality-engine output)
- `templates/performance-budget-template.md` — performance budget template
- `commands/vibe-perf-budget.md` — perf budget command
