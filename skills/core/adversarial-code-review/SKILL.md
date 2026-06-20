---
name: adversarial-code-review
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: core
tags:
  - core
  - review
status: stable
---

# Skill: Adversarial Code Review

## Purpose

Run a red-team review of a code change that actively looks for ways the patch can be wrong, unsafe, insufficiently tested, incompatible, or larger than necessary. This is not a polite rubber-stamp review: approval must be earned by evidence.

## When to use

Use before merge, before releasing risky changes, after an implementation agent claims completion, when tests pass but confidence is low, or when correctness, security/safety, compatibility, or minimal-diff discipline matters.

## Inputs

Original task or spec, acceptance criteria, current diff, changed files, relevant surrounding code, test and validation results, supported environments or compatibility constraints, known risks, and any non-goals or files out of scope.

## Workflow

1. Restate the intended behavior and scope boundaries in one or two sentences.
2. Inspect the diff before trusting the implementation summary.
3. Attack correctness: edge cases, state transitions, error paths, data shape assumptions, concurrency, idempotency, and regression risk.
4. Attack security and safety: input handling, access control, privacy exposure, dependency or supply-chain risk, dangerous defaults, and misuse potential.
5. Attack tests: missing coverage, weak assertions, untested failure modes, flaky checks, and validation that does not exercise the changed behavior.
6. Attack compatibility: public API changes, migrations, configuration, platform assumptions, version skew, localization, accessibility, and backward compatibility.
7. Attack scope: unrelated churn, broad rewrites, speculative abstractions, formatting noise, and changes that are not required by the task.
8. Classify findings by severity and make each finding specific, reproducible, and tied to evidence.
9. If no serious findings remain, state the residual risks and why they are acceptable.

## Outputs

A red-team review report with these sections:

- **Critical**: must-fix correctness, safety, data-loss, build-breaking, or release-blocking issues.
- **Important**: high-value fixes for tests, compatibility, maintainability, or edge cases that should be addressed before merge unless explicitly deferred.
- **Minor**: small clarity, naming, or cleanup items that do not block acceptance.
- **Verdict**: `Request changes`, `Approve with reservations`, or `Approve`, with verification evidence and residual risk.

## Failure modes

- Rubber-stamping because the implementation looks plausible.
- Reviewing only style while missing correctness or safety risks.
- Accepting test output without checking whether tests cover the changed behavior.
- Treating a large diff as acceptable when a minimal diff would satisfy the task.
- Reporting vague concerns without actionable evidence.
- Blocking on personal preference instead of task risk.

## Verification checklist

- [ ] Review challenged correctness, security/safety, tests, compatibility, and minimal diff.
- [ ] Findings are sorted by severity and tied to concrete evidence.
- [ ] The report avoids polite approval without scrutiny.
- [ ] The verdict explains remaining risk and required follow-up.
