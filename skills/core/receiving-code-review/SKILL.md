# Skill: Receiving Code Review

## Purpose

Turn review feedback into a prioritized response plan, fix real issues, and preserve explicit decisions for deferred items.

## When to use

Use when a human or agent reviewer provides comments, blockers, test failures, or merge-readiness feedback.

## Inputs

Review comments, current diff, spec/plan, validation output, project constraints, and user priorities.

## Workflow

1. Classify feedback as blocker, correctness issue, maintainability suggestion, question, or optional follow-up.
2. Address blockers and correctness issues before style preferences.
3. If feedback conflicts with requirements, ask or explain the trade-off before editing.
4. Make focused fixes and avoid using review as permission for broad rewrites.
5. Re-run relevant checks after changes.
6. Respond with what changed, what was verified, and what remains deferred with rationale.

## Outputs

A review-response summary, focused follow-up patch, updated validation status, and any deferred items with rationale.

## Failure modes

- Treating every suggestion as mandatory scope expansion.
- Dismissing blockers without evidence.
- Fixing review comments but not rerunning relevant checks.
- Leaving deferred decisions undocumented.

## Verification checklist

- [ ] Feedback is triaged by severity.
- [ ] Blockers are resolved or escalated.
- [ ] Checks were rerun where relevant.
- [ ] Deferred items have rationale and owner/next step.
