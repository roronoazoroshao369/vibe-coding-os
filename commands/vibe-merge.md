---
description: "Assess merge readiness by checking scope, acceptance criteria, validation, attribution, security, and follow-ups."
---

# vibe-merge

## Purpose

Assess merge readiness. Confirm the diff matches scope, acceptance criteria are satisfied, validation is complete or limitations are explicit, attribution is clean, and follow-ups are documented.

## When to use

Use this command after implementation and review, before committing or opening a pull request, before merging a branch, or when a final readiness check is needed after fixing review feedback.

## Required inputs

- Current branch and git status.
- Spec, plan, acceptance criteria, or explicit scope statement.
- Review findings and their resolution status.
- Validation commands and results.
- Attribution, licensing, or reference-audit notes if upstream inspiration was used.

## Step-by-step workflow

1. Inspect git status and confirm the diff is limited to the accepted scope.
2. Compare the final diff to the spec, plan, and acceptance criteria.
3. Confirm blockers from `vibe-review` are resolved or explicitly deferred with justification.
4. Check validation results and rerun required checks when results are stale.
5. Verify attribution, `NOTICE.md`, `ATTRIBUTIONS.md`, registries, and reference changelogs are updated when required.
6. Ensure no secrets, private credentials, local clones, or generated noise are staged.
7. Summarize readiness, remaining risks, and exact merge or PR next steps.

## Output format

Return a merge-readiness report with:

- **Readiness**: ready, not ready, or ready with noted limitations.
- **Scope check**.
- **Acceptance criteria status**.
- **Validation status**.
- **Attribution/security check**.
- **Open follow-ups**.
- **Recommended next action**.

## Verification expectation

Run or confirm current validation before declaring readiness. For repository-wide changes, prefer `npm run validate`; for reference-only changes, use `npm run validate:references`. Do not claim readiness if critical checks failed or were skipped without a clear limitation.

## Stop/ask-clarifying-question condition

Stop and ask when readiness depends on unresolved product decisions, failed critical validation, unclear attribution obligations, suspected secrets in the diff, or unreviewed changes outside the approved scope.

## Related skills/templates

- `skills/core/review-before-merge/SKILL.md`
- `skills/core/verification-before-done/SKILL.md`
- `skills/memory/privacy-filter/SKILL.md`
- `templates/review-template.md`
