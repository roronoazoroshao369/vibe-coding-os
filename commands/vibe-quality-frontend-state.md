---
description: "Run the frontend state quality checklist before or after UI state, store, side-effect, or form changes."
---

# vibe-quality-frontend-state

## Purpose

Apply the Frontend State Quality Checklist to changes involving local state, stores, data fetching, forms, side effects, and optimistic updates so predictable behavior and test coverage are reviewed before release.

## When to use

Run for React, Vue, or Svelte state changes, new stores, composables, hooks, data-fetching updates, global state decisions, form logic, caching behavior, or any UI feature where loading, error, empty, stale, or concurrent update handling affects correctness.

## Required inputs

- Summary of the frontend change and acceptance criteria.
- Components, stores, services, hooks, reducers, actions, and routes affected.
- Data-fetching strategy, caching behavior, mutation behavior, and form validation rules.
- Existing tests for state transitions, side effects, and user interactions.

## Step-by-step behaviour

1. Identify where the new or changed state lives: local component state, store, server cache, route state, form state, or derived state.
2. Confirm global state is justified; prefer local or colocated state when only one consumer needs the source of truth.
3. Map user-visible states: initial, loading, success, empty, error, retrying, disabled, stale, and permission-denied where relevant.
4. Check that state mutations are predictable, immutability is respected where required, and no hidden mutation flows through shared references.
5. Review side-effect lifecycle: correct dependencies, proper cleanup, abort handling, and framework-specific teardown behavior.
6. Verify form handling: client validation for UX, server validation for security, duplicate submit prevention, and recoverable error display.
7. Review optimistic updates where used: success path, rollback path, partial failure handling, and conflict resolution.
8. Confirm stale-while-revalidate strategy is deliberate: cached data is shown intentionally, background refresh is used, and stale or refreshing state is surfaced when helpful.
9. Validate async race handling: stale responses cannot overwrite newer state, unmounted-component safety, and retry safety.
10. Inspect tests for key state transitions, effect cleanup, validation paths, optimistic success and rollback, and data refresh behavior.
11. Summarize passing items, gaps, required fixes, residual risks, and any manual verification steps.

## Outputs

- Completed frontend state quality checklist notes.
- Short list of required fixes, missing states, or missing tests.
- Verification evidence: test results, manual checks, or explicit limitations.

## Stopping conditions

Stop before marking the change ready if empty, error, and retry states are missing, side effects are uncleaned, optimistic updates have no rollback behavior, server-authoritative validation is missing, or state transitions are untested.

## Verification checklist

- [ ] State ownership is explicit and global state is justified.
- [ ] Loading, empty, error, success, stale, retry, and disabled states are handled where relevant.
- [ ] State mutations are predictable and follow framework conventions.
- [ ] Side effects have correct dependencies and cleanup behavior.
- [ ] Form validation includes client UX checks and server-authoritative validation.
- [ ] Optimistic updates include rollback and conflict behavior.
- [ ] Stale-while-revalidate behavior is deliberate for data fetching where applicable.
- [ ] Tests cover state transitions, cleanup, validation paths, optimistic rollback, and stale refresh behavior.

## Related skills/commands

- `skills/checklists/frontend-state-quality/SKILL.md`
- `skills/core/acceptance-criteria/SKILL.md`
- `skills/core/test-driven-development/SKILL.md`
- `commands/vibe-quality-api.md`

## Handoffs / next-step suggestion

- Failures in state modelling, side effects, validation, or tests → update the UI implementation or test coverage, then re-run.
- All items pass → proceed with `commands/vibe-request-review.md` or merge preparation.
