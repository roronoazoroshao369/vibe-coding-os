---
description: "Run a mandatory self-review checklist on your own diff before responding to the user."
---

# Skill: Self-Review Before Response

## Purpose
Audit your own diff like a strict reviewer before claiming a task is done.

## When to use
Use before EVERY final response after making code changes. This is a mandatory step, not optional.

## Why
Average models skip self-review, leading to slip-through bugs. This skill forces a structured audit to catch scope creep, unintended changes, and hidden issues.

## Inputs
The diff from your changes, the original request, and the verification results.

## Workflow
1. Generate or review the diff of all changed files.
2. Run through every item in `templates/self-review-checklist.md`.
3. For any unchecked item, fix the issue or explicitly note it as a deferred risk.
4. Fill in the Summary section: files changed, verification run, risks/follow-up.
5. Include the completed checklist in your final response to the user.

## Checklist
Use `templates/self-review-checklist.md` which includes:
- Changed lines trace directly to the original request
- No unrelated files modified (no scope creep)
- No unrelated formatting or whitespace churn
- No invented behavior or assumptions not in spec
- No duplicated logic introduced
- Edge cases identified and handled (or explicitly noted as deferred)
- Failure/error paths handled (not silently swallowed)
- Tests added or updated when behavior changed
- Documentation updated only when needed (no gratuitous doc changes)
- No secrets, PII, or credentials in the diff
- Public API preserved unless explicitly required to change
- Verification commands run and results reported honestly

## Outputs
A completed self-review report with the checklist, files changed, verification results, and any risks or follow-up items.

## Failure modes
- Skipping the checklist for "small" changes that still alter behavior.
- Self-approve without running through every checklist item.
- Claiming "looks good" without running the checklist and reporting results honestly.
- Omitting risks or follow-up items from the summary.

## Verification checklist

- [ ] Diff reviewed against every checklist item.
- [ ] Unchecked items fixed or explicitly deferred with justification.
- [ ] Summary includes changed files, verification run, and risks/follow-up.
- [ ] Final response honestly reflects verification outcome.

## Related skills
- `skills/core/verification-before-completion/SKILL.md` — runs verification commands and reports evidence.
- `commands/vibe-self-review.md` — short command prompt to trigger this checklist.
