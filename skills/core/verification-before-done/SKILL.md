# Skill: Verification Before Done

## Purpose

Ensure completion claims are backed by evidence.

## When to use

Use before final response, handoff, merge, or deployment.

## Inputs

Diff, acceptance criteria, available commands, test results.

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

1. Review what changed.
2. Map changes to acceptance criteria.
3. Run relevant validation commands.
4. **Apply the 5-axis runtime verification** for any user-facing or latency-sensitive change.
5. Record pass, fail, or limitation for each check (each axis).
6. Do not mark done if critical checks fail.

## Outputs

A verification summary with commands, results, 5-axis matrix, and limitations.

## Failure modes

- Claiming success without running checks.
- Ignoring failing tests.
- Using broad checks while skipping obvious targeted checks.
- Skipping one of the 5 axes on a user-facing change.
- "It works on my machine" — local verification is not p75 user verification.

## Verification checklist

- [ ] Relevant checks were run or limitations stated.
- [ ] Failures are reported honestly.
- [ ] Acceptance criteria are accounted for.
- [ ] Final status is not overstated.

## Superpowers alignment

Use with `verification-before-completion` as the local completion gate alias.
