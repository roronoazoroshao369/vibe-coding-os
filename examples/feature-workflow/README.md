# Example: Feature Workflow

This example shows how to run the default Vibe Coding OS loop for a small product feature. It is illustrative only; replace filenames, checks, and acceptance criteria with the real project context.

## 1. Initial user intent

> Add a keyboard shortcut help modal so users can press `?` in the dashboard and see available shortcuts.

Assumptions to confirm before implementation:

- The dashboard already has a modal pattern or component library.
- The `?` shortcut should not fire while the user is typing in an input, textarea, or editable element.
- The feature should be covered by the smallest meaningful UI or component tests available in the host project.

## 2. Command/skill order

1. `vibe-init` to inspect repo instructions, current state, and relevant files before editing.
2. `vibe-spec` with `spec-first-development` and `clarify-before-code` to capture behavior and open questions.
3. `vibe-plan` with `plan-driven-execution` to sequence small implementation and test steps.
4. `vibe-implement` with `test-driven-development` to add or update tests and implement the shortcut modal.
5. `vibe-review` with `review-before-merge` to inspect the diff against the spec and plan.
6. `vibe-memory` with `project-memory` or `session-summarizer` to record durable decisions.
7. `vibe-merge` with `verification-before-done` to confirm readiness before merge.

## 3. Sample spec

Based on [`templates/spec-template.md`](../../templates/spec-template.md).

```markdown
# Spec: Dashboard keyboard shortcut help modal

## Intent

Users need a quick way to discover dashboard keyboard shortcuts without leaving the current screen.

## Goals

- Pressing `?` on the dashboard opens a shortcut help modal.
- The modal lists current dashboard shortcuts with short descriptions.
- The modal can be dismissed with Escape, the close button, or the existing modal backdrop behavior.
- The shortcut does not trigger while focus is inside form fields or editable content.

## Non-goals

- Do not add new dashboard shortcuts beyond documenting existing ones.
- Do not redesign the modal system.
- Do not add global shortcuts outside the dashboard route.

## Constraints

- Reuse existing modal and button components.
- Follow existing accessibility conventions for dialogs.
- Keep copy generic and avoid personal data.

## Expected behavior

- Given the dashboard is focused, when the user presses `?`, then the help modal opens.
- Given the modal is open, when the user presses Escape, then the modal closes.
- Given focus is in an input, textarea, select, or contenteditable element, pressing `?` types normally and does not open the modal.

## Edge cases

- Repeated `?` presses while the modal is open should not create duplicate modals.
- Shortcut listener should be removed when the dashboard unmounts.
- Keyboard layouts that emit `?` with Shift should still be handled through the event key value.

## Acceptance criteria

- [ ] `?` opens exactly one shortcut help modal on the dashboard.
- [ ] Escape and visible close controls dismiss the modal.
- [ ] Inputs and editable regions are ignored by the shortcut handler.
- [ ] Tests cover opening, dismissal, and ignored editable focus.
- [ ] Repository validation passes or limitations are documented.

## Open questions

- Should the modal content be owned by dashboard code or a shared shortcut registry?
- Are there localization requirements for shortcut labels?

## Verification strategy

- Run targeted component or UI tests for the dashboard shortcut modal.
- Run lint/typecheck if available.
- Run the repository's validation command before merge.
```

## 4. Sample plan

Based on [`templates/plan-template.md`](../../templates/plan-template.md).

```markdown
# Plan: Dashboard keyboard shortcut help modal

## Context

Spec: Dashboard keyboard shortcut help modal. The change should reuse existing modal components and avoid triggering while users type.

## Tasks

1. [ ] Inspect dashboard and modal patterns; identify the smallest files to touch.
2. [ ] Add a failing test for `?` opening the modal on the dashboard.
3. [ ] Add tests for Escape dismissal and ignored editable focus.
4. [ ] Implement the shortcut listener and modal state with cleanup on unmount.
5. [ ] Add modal content using existing accessible dialog components.
6. [ ] Run targeted tests, then broader validation.
7. [ ] Review diff for scope, accessibility, cleanup, and attribution hygiene.

## Risks

- Shortcut handling can interfere with normal text input.
- A global listener can leak if cleanup is missing.
- Modal accessibility can regress if the existing dialog pattern is bypassed.

## Verification

- Command: `npm test -- dashboard-shortcuts`
- Expected result: shortcut modal tests pass.
- Command: `npm run validate`
- Expected result: repository validation passes.

## Rollback

- Revert the dashboard shortcut handler, modal content, and related tests as one small feature commit.
```

## 5. Sample task breakdown

Based on [`templates/task-template.md`](../../templates/task-template.md).

```markdown
# Task: Add dashboard shortcut help modal

## Objective

Implement a discoverable keyboard shortcut help modal for the dashboard without changing unrelated shortcuts.

## Scope

### In scope

- Dashboard route/component shortcut listener.
- Modal content for current dashboard shortcuts.
- Tests for open, close, and editable-focus behavior.

### Out of scope

- New shortcut commands.
- Global shortcut infrastructure.
- Visual redesign of modals.

## Files or areas

- `src/dashboard/*` or equivalent dashboard area.
- Existing modal component area.
- Dashboard test files.

## Steps

1. Find the existing modal pattern and dashboard test utilities.
2. Add tests that describe the expected shortcut behavior.
3. Implement a focused keyboard event handler that ignores editable targets.
4. Render modal content with existing components.
5. Run targeted and repository-level validation.

## Done when

- [ ] Acceptance criteria in the spec are satisfied.
- [ ] Tests fail before implementation and pass after implementation where practical.
- [ ] Diff is limited to dashboard shortcut behavior, modal content, and tests.
- [ ] Verification results are recorded in the review and memory notes.

## Notes

- Prefer a local dashboard handler unless multiple pages need the same behavior later.
```

## 6. Sample review note

Based on [`templates/review-template.md`](../../templates/review-template.md).

```markdown
# Review: Dashboard keyboard shortcut help modal

## Summary

The diff adds a dashboard-only `?` shortcut that opens a single help modal, reuses the existing modal component, and includes tests for opening, closing, and ignored editable focus.

## Blockers

- None identified.

## Suggestions

- Consider moving shortcut labels into a shared registry only if a second page needs them.

## Verification reviewed

- `npm test -- dashboard-shortcuts` passed.
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
# Memory: 2026-06-06 dashboard shortcut help modal

## Durable facts

- Dashboard shortcut help is intentionally dashboard-scoped, not global.
- Shortcut handlers must ignore inputs, textareas, selects, and contenteditable targets.

## Decisions

- Reused the existing modal component instead of adding a shortcut-specific dialog implementation.
- Deferred a shared shortcut registry until more pages need shortcut discovery.

## Commands and results

- `npm test -- dashboard-shortcuts`: passed.
- `npm run validate`: passed.

## Gotchas

- Repeated `?` key events should not stack duplicate modals.
- Listener cleanup is required when the dashboard unmounts.

## Follow-ups

- Revisit localization if dashboard copy becomes translated elsewhere.

## Sensitivity check

- [x] Contains no secrets, credentials, or unnecessary personal data.

## Confidence

High
```

## 8. Verification report

| Check | Command | Expected result | Status |
| --- | --- | --- | --- |
| Targeted shortcut behavior | `npm test -- dashboard-shortcuts` | Tests for open, close, and editable focus pass. | Pass |
| Type/lint if available | `npm run lint && npm run typecheck` | Static checks pass, or unavailable scripts are documented. | Pass or documented limitation |
| Repository validation | `npm run validate` | Framework or host repo validation passes. | Pass |

## 9. Merge readiness checklist

- [ ] Spec acceptance criteria are satisfied.
- [ ] Plan tasks are complete or intentionally deferred with notes.
- [ ] Tests and validation have run with results recorded.
- [ ] Diff is limited to the feature, tests, and docs needed for the feature.
- [ ] Accessibility and keyboard interaction have been reviewed.
- [ ] No secrets, personal data, vendored third-party code, or unattributed external content were added.
- [ ] Review decision is `Approve` or remaining changes are explicitly accepted by the human.
