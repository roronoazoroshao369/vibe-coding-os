---
name: verification-before-done
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: core
tags:
  - core
status: stable
---

# Skill: Verification Before Done

## Purpose

Make completion claims only after relevant checks, review, and limitations are explicit.

## When to use

Use before saying done, opening a PR, merging, handing off, or ending a long work session.
Also use before final response, handoff, merge, or deployment.

## Inputs

Task goal, acceptance criteria, changed files, validation commands, test output, known limitations, and environment constraints.

## 5-axis runtime verification (abstract)

When verifying a change that runs in a browser, app, or service, check the **5 axes** of runtime behavior. This pattern is framework-agnostic; apply the axes that match your runtime.

| Axis | What to verify | Evidence |
| --- | --- | --- |
| **DOM / state** | The rendered output matches the spec (or pre-change baseline). | Screenshot, DOM diff, snapshot test. |
| **Console / logs** | No new errors, warnings, or unhandled rejections. | Console capture, log diff. |
| **Network / API** | The expected requests fire with the expected payloads; responses match the spec. | Network trace, API contract test. |
| **Performance** | LCP / INP / CLS / TTFB / API p99 are within "Good" thresholds. | CWV report, perf budget gate. |
| **Visual** | The UI renders correctly across the supported viewports / themes. | Screenshot diff across breakpoints. |

For multi-CLI projects, the **5 axes map to specific tools** per CLI:
- **Claude Code (browser)**: use `chrome-devtools` MCP for DOM/console/network/visual; Lighthouse for performance.
- **Other CLIs (non-browser)**: substitute network/API/console equivalents; visual axis becomes "output file diff" or "headless screenshot".

## Workflow

1. Map acceptance criteria to concrete evidence: tests, validation, inspection, or user confirmation.
2. Run the smallest relevant checks first, then broader validation when feasible.
3. Record exact commands and outcomes, including failures and warnings.
4. **Apply the 5-axis runtime verification** for any user-facing or latency-sensitive change.
5. Inspect the final diff for scope, secrets, attribution, generated files, and stale notes.
6. Do not convert environment limitations into success claims.
7. End with a clear status: passed, failed, blocked, or partially verified.

## Outputs

A verification report with exact commands, outcomes, evidence coverage, 5-axis matrix, limitations, and final readiness status.

## Failure modes

- Reporting tests as passed when they were not run.
- Claiming success without running checks.
- Using broad validation to hide a missing targeted check.
- Ignoring failed checks because the patch looks correct.
- Skipping one of the 5 axes on a user-facing change.
- Omitting environment limitations.
- "It works on my machine" — local verification is not p75 user verification.

## Verification checklist

- [ ] Acceptance criteria have matching evidence.
- [ ] Exact commands and outcomes are listed.
- [ ] Failures or limitations are visible.
- [ ] Final status is not overstated.
- [ ] All `npm run validate:*` commands invoked in this change exited 0 (record exit codes in commit body).
- [ ] DOM/state axis captured: screenshot, DOM diff, or snapshot test attached for any UI change.
- [ ] Console/logs axis captured: `console.log/error/warn` output recorded, zero new unhandled rejections.
- [ ] Network/API axis captured: request/response trace or contract test recorded for any API change.
- [ ] Performance axis captured: LCP / INP / CLS / TTFB / API p99 numbers recorded for any latency-sensitive change.
- [ ] Visual axis captured: screenshot diff across the supported breakpoints (mobile, tablet, desktop).
- [ ] Each check is recorded as `PASS` / `FAIL` / `LIMITATION:` — no "looks good" or "feels right".

## Related skills

This skill is the evidence bar that backs the goal-driven member of the four-part engineering
discipline set (think-before-coding, simplicity-first, surgical-changes, goal-driven):

- `skills/core/goal-driven-execution/SKILL.md` — turns an imperative into a verifiable goal
  whose success condition is checked here.
- `skills/prompts/karpathy-engineering-discipline/SKILL.md` — Think Before Coding and Surgical
  Changes.
- `skills/prompts/anti-overengineering/SKILL.md` — Simplicity First.
