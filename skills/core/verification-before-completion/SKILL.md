# Skill: Verification Before Completion

## Purpose

Make completion claims only after relevant checks, review, and limitations are explicit.

## When to use

Use before saying done, opening a PR, merging, handing off, or ending a long work session.

## Inputs

Task goal, acceptance criteria, changed files, validation commands, test output, known limitations, and environment constraints.

## Workflow

1. Map acceptance criteria to concrete evidence: tests, validation, inspection, or user confirmation.
2. Run the smallest relevant checks first, then broader validation when feasible.
3. Record exact commands and outcomes, including failures and warnings.
4. Inspect the final diff for scope, secrets, attribution, generated files, and stale notes.
5. Do not convert environment limitations into success claims.
6. End with a clear status: passed, failed, blocked, or partially verified.

## Outputs

A verification report with exact commands, outcomes, evidence coverage, limitations, and final readiness status.

## Failure modes

- Reporting tests as passed when they were not run.
- Using broad validation to hide a missing targeted check.
- Ignoring failed checks because the patch looks correct.
- Omitting environment limitations.

## Verification checklist

- [ ] Acceptance criteria have matching evidence.
- [ ] Exact commands and outcomes are listed.
- [ ] Failures or limitations are visible.
- [ ] Final status is not overstated.

## Related skills

This skill is the evidence bar that backs the goal-driven member of the four-part engineering
discipline set (think-before-coding, simplicity-first, surgical-changes, goal-driven):

- `skills/core/goal-driven-execution/SKILL.md` — turns an imperative into a verifiable goal
  whose success condition is checked here.
- `skills/prompts/karpathy-engineering-discipline/SKILL.md` — Think Before Coding and Surgical
  Changes.
- `skills/prompts/anti-overengineering/SKILL.md` — Simplicity First.
