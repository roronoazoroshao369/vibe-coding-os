---
name: critique-pass-protocol
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: core
tags:
  - core
status: stable
---

# Skill: Critique Pass Protocol

## Purpose

Run a lightweight critic pass before final delivery. The pass challenges an artifact, summary, patch, or plan against the original task so obvious gaps, weak assumptions, missing evidence, and avoidable risks are found before the user or reviewer sees the final answer.

## When to use

Use before final delivery of a non-trivial artifact, after a writer or implementer claims completion, when the same agent needs a structured second look, when a separate critic is available but a full red-team review is too heavy, or when requirements, tests, or risk boundaries are easy to misread.

## Inputs

Original task or spec, acceptance criteria, scope boundaries, artifact or diff to critique, author summary, validation results, known constraints, files or areas out of scope, and any unresolved questions or assumptions.

## Workflow

1. Restate the intended outcome, acceptance criteria, and non-goals in one short paragraph.
2. Inspect the artifact directly before trusting the author summary.
3. Challenge fit to task: missing requirements, invented requirements, unclear assumptions, and scope drift.
4. Challenge quality: correctness, clarity, maintainability, user impact, safety, and compatibility at a level proportional to the artifact risk.
5. Challenge evidence: tests, validation, citations, examples, screenshots, or reasoning actually support the claimed result.
6. Record findings by severity with concrete evidence and a suggested fix or decision.
7. Decide whether the writer can make a small fix, must rerun verification, should escalate, or can proceed with residual risks documented.
8. If fixes are applied, re-check only the changed risk areas and update the verdict.

## Outputs

A concise critique report with:

- **Scope checked**: task, artifact, files, and constraints reviewed.
- **Critical findings**: blockers that prevent delivery.
- **Important findings**: issues that should be fixed or explicitly deferred.
- **Minor findings**: non-blocking clarity or cleanup items.
- **Evidence**: validation reviewed, checks not run, and relevant artifact references.
- **Verdict**: `Proceed`, `Proceed with reservations`, `Revise first`, or `Escalate/clarify`.

## Failure modes

- Rubber-stamping because the artifact is mostly complete.
- Reviewing only wording or style while missing task fit or evidence gaps.
- Expanding into a full rewrite instead of a focused critique.
- Blocking on personal preference rather than delivery risk.
- Ignoring out-of-scope file ownership or concurrent agent changes.
- Claiming verification that was not run or not inspected.

## Verification checklist

- [ ] The critique compares the artifact to the original task, not only the author summary.
- [ ] Findings are severity-ranked, specific, and tied to evidence.
- [ ] Validation status and checks not run are stated honestly.
- [ ] Any required fixes, deferrals, or escalations are explicit.
- [ ] The final verdict reflects residual risk and file ownership boundaries.
