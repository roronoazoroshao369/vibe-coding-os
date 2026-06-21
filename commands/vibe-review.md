---
description: "Review the current diff against the spec and plan, prioritizing blockers, missing tests, security, attribution, and scope control."
---

# vibe-review

## Purpose

Review the current diff against the spec and plan. Prioritize correctness, missing tests, security, maintainability, attribution, and scope control.

## When to use

Use this command after implementation and before merge, before committing a risky change, when a teammate asks for review, or when validation passed but human-readable acceptance criteria still need to be checked.

## Required inputs

- Current diff or branch to review.
- Spec, plan, acceptance criteria, or explicit scope statement.
- Validation results already run, including failures and limitations.
- Relevant repository instructions, attribution constraints, and security expectations.

## Step-by-step workflow

1. Read the spec, plan, and acceptance criteria before inspecting the diff.
2. Inspect changed files and nearby conventions to understand intended behavior.
3. Check for correctness gaps, missing edge cases, security or privacy risks, attribution issues, and unrelated churn.
4. Verify tests or validation cover the acceptance criteria, or identify what is missing.
5. Categorize findings by severity and put blockers first.
6. Keep feedback specific, actionable, and tied to files or commands.
7. If no blockers are found, still report any residual risks or skipped checks.

## Output format

Return review findings in this order:

- **Blockers**: issues that should prevent merge.
- **Suggestions**: improvements worth considering before merge.
- **Nits**: small style or clarity items.
- **Verification notes**: checks observed, missing, or recommended.

Use “No blockers found” only after checking the diff against the stated scope.

## Verification expectation

A review does not replace running tests. Verify by examining the diff, comparing it to acceptance criteria, and checking whether relevant commands such as `npm run validate` were run or should be run.

## Stop/ask-clarifying-question condition

Stop and ask when the scope or acceptance criteria are unavailable, the diff includes unrelated changes that cannot be separated safely, a suspected secret or private data appears, or attribution/licensing obligations are unclear.

## Related skills/templates

- `skills/agents/reviewer-agent/SKILL.md`
- `skills/core/review-before-merge/SKILL.md`
- `skills/core/verification-before-done/SKILL.md`
- `skills/memory/project-memory/SKILL.md`
- `templates/review-template.md`
