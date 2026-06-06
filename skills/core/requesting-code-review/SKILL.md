# Skill: Requesting Code Review

## Purpose

Package a change for useful review by making scope, intent, diff, risks, and verification evidence easy to inspect.

## When to use

Use after a patch is ready for another human or agent pass, before merge readiness, or when a risky decision needs independent scrutiny.

## Inputs

Spec or task, implementation plan, current diff, changed files, validation results, known risks, and questions for the reviewer.

## Workflow

1. Review your own diff first and remove unrelated changes.
2. Summarize intent, user-visible behavior, and non-goals.
3. List changed files by purpose instead of dumping the diff.
4. Provide exact tests/checks run and any failures or limitations.
5. Ask focused review questions for risky areas.
6. Stop claiming readiness if validation or attribution obligations are unresolved.

## Outputs

A review request containing scope, summary, changed files, risks, verification evidence, and specific questions.

## Failure modes

- Sending a review request without validation status.
- Hiding known risks or failed checks.
- Asking for generic review when a focused question is needed.
- Including noisy or unrelated diff.

## Verification checklist

- [ ] Diff was self-reviewed first.
- [ ] Review request names scope and non-goals.
- [ ] Validation evidence is explicit.
- [ ] Open questions are actionable.
