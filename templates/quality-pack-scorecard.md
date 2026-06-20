---
title: Task-Specific Quality Pack Scorecard
type: template
name: quality-pack-scorecard
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: template
tags:
  - quality
status: stable
---

# Task-Specific Quality Pack Scorecard

> Use this fillable scorecard after running a task-specific quality pack: API endpoint, database migration, auth/permissions, frontend state, or async/background job.

## Summary

- Quality pack: API endpoint / DB migration / auth / frontend state / async job
- Reviewed change: <PR, commit, branch, ticket, or short description>
- Reviewer: <name or agent>
- Date: <YYYY-MM-DD>
- Scope reviewed: <files, endpoints, migrations, flows, components, jobs>
- Checklist source: <name of the checklist skill or quality command used>
- Commands run: <validation, tests, linters, manual checks>
- Overall result: PASS / PASS WITH RISKS / BLOCKED

## Evidence table

| Dimension | Status | Evidence | Notes / follow-up |
|---|---|---|---|
| <checklist dimension> | PASS / FAIL / N/A / UNKNOWN | <file path, test output, spec section, log, or manual check> | <concise note> |
| <checklist dimension> | PASS / FAIL / N/A / UNKNOWN | <file path, test output, spec section, log, or manual check> | <concise note> |
| <checklist dimension> | PASS / FAIL / N/A / UNKNOWN | <file path, test output, spec section, log, or manual check> | <concise note> |

## Blocker list

- [ ] <blocker: exact failing dimension, impact, required fix, owner if known>
- [ ] <blocker: exact failing dimension, impact, required fix, owner if known>

## Residual risks

- <risk that remains after review; include likelihood, impact, and mitigation or acceptance rationale>
- <risk that remains after review; include likelihood, impact, and mitigation or acceptance rationale>

## Verdict

- [ ] PASS — checklist evidence is complete; no blockers remain.
- [ ] PASS WITH RISKS — no release blocker remains, but residual risks are documented and accepted.
- [ ] BLOCKED — one or more blockers must be fixed before merge or release.

## Next step

- If blocked: fix listed blockers, add or update evidence, then re-run the relevant `commands/vibe-quality-*` command.
- If passing: proceed to review or merge preparation with this scorecard attached to the handoff.
