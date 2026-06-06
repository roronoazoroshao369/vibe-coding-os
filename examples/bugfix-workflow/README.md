# Example: Bugfix Workflow

This example shows how to apply the Vibe Coding OS loop to a focused bugfix. It emphasizes reproducing the issue first, making the smallest safe correction, and documenting verification before merge.

## 1. Initial user intent

> Fix the settings page bug where saving an unchanged profile still shows a success toast and sends an unnecessary API request.

Assumptions to confirm before implementation:

- The settings page already tracks initial profile values or can compare against loaded data.
- A no-op save should not call the update endpoint.
- The UI should tell users there are no changes instead of reporting a successful save.

## 2. Command/skill order

1. `vibe-init` to inspect instructions, git state, and settings-related files before editing.
2. `vibe-spec` with `clarify-before-code` to define the bug, expected behavior, and non-goals.
3. `vibe-plan` with `plan-driven-execution` to identify reproduction, fix, and verification steps.
4. `vibe-implement` with `test-driven-development` to add a regression test and the minimal fix.
5. `vibe-review` with `review-before-merge` to confirm the patch is narrow and correct.
6. `vibe-memory` with `session-summarizer` to record the root cause and verification outcome.
7. `vibe-merge` with `verification-before-done` to check merge readiness.

## 3. Sample spec

Based on [`templates/spec-template.md`](../../templates/spec-template.md).

```markdown
# Spec: Prevent no-op profile saves

## Intent

Users should not see a misleading success message or trigger an API update when they click Save without changing profile settings.

## Goals

- Detect unchanged profile form submissions.
- Skip the update API request when submitted values match the loaded profile.
- Show a neutral message such as `No changes to save.` for unchanged submissions.
- Preserve existing successful save behavior when values actually change.

## Non-goals

- Do not redesign the settings form.
- Do not change server API semantics.
- Do not add autosave or dirty-state navigation guards.

## Constraints

- Keep the fix local to settings form state and tests where possible.
- Avoid comparing fields that are not editable in the form.
- Preserve existing error handling for failed API requests.

## Expected behavior

- Given the profile form is loaded and unchanged, when Save is clicked, then no update request is sent and a neutral no-change message appears.
- Given at least one editable field changes, when Save is clicked, then the existing update request and success flow run.
- Given the update request fails for changed data, then existing error behavior remains unchanged.

## Edge cases

- Whitespace normalization should match existing form behavior.
- Optional empty fields should compare consistently with loaded values.
- Loading or disabled states should not allow duplicate submissions.

## Acceptance criteria

- [ ] A regression test proves unchanged Save does not call the update endpoint.
- [ ] A regression test proves changed Save still calls the update endpoint.
- [ ] The unchanged path shows a neutral no-change message, not a success toast.
- [ ] Existing error behavior for changed saves is preserved.
- [ ] Repository validation passes or limitations are documented.

## Open questions

- Should the Save button be disabled until the form is dirty, or should unchanged submissions remain clickable with a neutral message?

## Verification strategy

- Add or update settings form tests around unchanged and changed submissions.
- Run targeted tests for settings.
- Run repository validation before merge.
```

## 4. Sample plan

Based on [`templates/plan-template.md`](../../templates/plan-template.md).

```markdown
# Plan: Prevent no-op profile saves

## Context

Spec: Prevent no-op profile saves. The bug is a misleading success toast and unnecessary API call when settings are submitted unchanged.

## Tasks

1. [ ] Reproduce the bug manually or with an existing test by submitting unchanged settings.
2. [ ] Add a regression test that expects no update request and a neutral no-change message.
3. [ ] Add a regression test that changed values still submit successfully.
4. [ ] Implement a minimal unchanged-value comparison for editable profile fields.
5. [ ] Preserve existing loading, success, and error behavior for changed submissions.
6. [ ] Run targeted settings tests and repository validation.
7. [ ] Review the diff for scope, edge cases, and user-facing copy.

## Risks

- Deep equality can accidentally include non-editable or server-managed fields.
- Normalization mismatches can treat visually unchanged values as dirty.
- Changing toast behavior can affect existing tests or user expectations.

## Verification

- Command: `npm test -- settings-profile`
- Expected result: unchanged and changed save tests pass.
- Command: `npm run validate`
- Expected result: repository validation passes.

## Rollback

- Revert the settings form comparison and regression tests; the previous behavior returns without database or schema changes.
```

## 5. Sample task breakdown

Based on [`templates/task-template.md`](../../templates/task-template.md).

```markdown
# Task: Add no-op save guard to profile settings

## Objective

Prevent unnecessary profile update requests and misleading success messages when the settings form is submitted unchanged.

## Scope

### In scope

- Editable profile field comparison.
- No-change user feedback.
- Regression tests for unchanged and changed save paths.

### Out of scope

- API contract changes.
- Settings page redesign.
- Dirty-state route guards.

## Files or areas

- `src/settings/*` or equivalent settings form area.
- API mock or test utility for profile updates.
- Settings form tests.

## Steps

1. Locate settings form submit logic and current tests.
2. Write or update a test that reproduces the no-op API request.
3. Implement comparison against loaded editable field values.
4. Return early with neutral feedback for unchanged submissions.
5. Confirm changed submissions still call the API and show existing success behavior.
6. Run targeted tests and validation.

## Done when

- [ ] No-op save path skips the API request.
- [ ] Changed save path is unaffected.
- [ ] Regression tests cover both paths.
- [ ] Verification results are documented.

## Notes

- Compare only fields the form lets users edit.
```

## 6. Sample review note

Based on [`templates/review-template.md`](../../templates/review-template.md).

```markdown
# Review: Prevent no-op profile saves

## Summary

The diff adds a no-op guard for unchanged settings submissions, returns neutral user feedback, and keeps the existing update flow for changed values.

## Blockers

- None identified.

## Suggestions

- If future forms need similar behavior, extract a shared dirty-field helper after the second use case.

## Verification reviewed

- `npm test -- settings-profile` passed.
- `npm run validate` passed.

## Scope and attribution

- [x] Diff matches intended scope.
- [x] Attribution and license obligations are clean.

## Decision

Approve
```

## 7. Sample memory note

Based on [`templates/memory-template.md`](../../templates/memory-template.md).

```markdown
# Memory: 2026-06-06 no-op profile save bugfix

## Durable facts

- Settings profile saves should call the update endpoint only when editable profile fields changed.
- Unchanged submissions show neutral feedback instead of a success toast.

## Decisions

- Kept the comparison local to the profile settings form for now.
- Compared only editable fields to avoid server-managed metadata affecting dirty state.

## Commands and results

- `npm test -- settings-profile`: passed.
- `npm run validate`: passed.

## Gotchas

- Optional empty fields need the same normalization used by the form.
- Do not include non-editable server fields in no-op comparison.

## Follow-ups

- Consider disabling Save while pristine if product wants a stronger visual affordance.

## Sensitivity check

- [x] Contains no secrets, credentials, or unnecessary personal data.

## Confidence

High
```

## 8. Verification report

| Check | Command | Expected result | Status |
| --- | --- | --- | --- |
| Regression tests | `npm test -- settings-profile` | No-op and changed-save paths pass. | Pass |
| Static checks if available | `npm run lint && npm run typecheck` | Static checks pass, or unavailable scripts are documented. | Pass or documented limitation |
| Repository validation | `npm run validate` | Framework or host repo validation passes. | Pass |

## 9. Merge readiness checklist

- [ ] Bug is reproduced by a regression test or documented manual reproduction.
- [ ] Acceptance criteria are satisfied.
- [ ] Patch is limited to the no-op save behavior and supporting tests.
- [ ] Changed-save and error paths remain covered or manually verified.
- [ ] Verification results are recorded in review and memory notes.
- [ ] No secrets, personal data, vendored third-party code, or unattributed external content were added.
- [ ] Review decision is `Approve` or remaining risks are explicitly accepted by the human.
