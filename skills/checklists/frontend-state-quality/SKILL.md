---
name: frontend-state-quality
description: Frontend state quality checklist for React, Vue, Svelte, stores, side effects, forms, and data fetching.
version: 1.0.0
author: Hermes Agent
license: MIT
platforms:
  - portable
tags:
  - checklist
  - frontend
  - state
  - testing
  - quality
---

# Skill: Frontend State Quality Checklist

## Purpose

Review frontend state changes for predictable behavior, complete user states, safe side effects, and testable transitions. Use this checklist to prevent UI bugs caused by unclear ownership, unhandled async states, stale data, leaky effects, and inconsistent form behavior.

## When to use

Use for React, Vue, or Svelte state changes; new stores; side effects; form state; client-side data fetching; optimistic updates; global state versus local state decisions; and any UI change where loading, empty, error, or stale data states affect the user experience.

## Inputs

- The frontend change summary and acceptance criteria.
- Components, stores, composables, hooks, actions, reducers, services, or routes affected.
- Data-fetching behavior, mutation behavior, cache policy, and form validation rules.
- Existing tests for state transitions, rendering states, and user interactions.

## Workflow

1. Identify state ownership: local component state, shared store, route state, server cache, form state, or derived state.
2. Justify global state only when multiple independent consumers need the same source of truth; otherwise prefer local or colocated state.
3. Map every user-visible state: initial, loading, success, empty, error, retrying, disabled, stale, and permission-denied where applicable.
4. Verify state mutations are predictable: immutable where required, centralized when appropriate, named transitions, and no hidden mutation through shared references.
5. Review side effects: dependencies are accurate, subscriptions and timers are cleaned up, abort or cancellation is handled, and framework cleanup hooks are used.
6. Check form behavior: client validation improves UX, server validation remains authoritative, submit state prevents duplicate work, and error display is specific and recoverable.
7. Review optimistic updates: define when they apply, how rollback works, what happens on partial failure, and how conflicts are resolved.
8. Apply stale-while-revalidate where useful for data fetching: show cached data deliberately, refresh in the background, and communicate stale or refreshing state when needed.
9. Confirm async race handling: stale responses cannot overwrite newer state, unmounted components are safe, and retries do not duplicate side effects.
10. Inspect accessibility and UX around state changes: focus, announcements, disabled controls, and clear empty or error copy.
11. Check test coverage for key state transitions, side-effect cleanup, form validation paths, optimistic success and rollback, and stale data refresh.
12. Record unresolved risks, manual checks, and any intentional trade-offs.

## Outputs

- A completed frontend state quality checklist with pass/fail/needs-follow-up notes.
- Identified gaps in state modeling, side-effect cleanup, form validation, data fetching, or tests.
- Verification evidence: test commands, manual checks, or explicit limitations.

## Failure modes

- Adding global state when local state or server cache would be simpler.
- Handling the success path only while skipping loading, empty, error, retry, or disabled states.
- Forgetting cleanup for subscriptions, timers, event listeners, in-flight requests, or framework effects.
- Performing optimistic updates without rollback or conflict handling.
- Trusting client-only validation for security-sensitive rules.
- Allowing stale async responses to overwrite newer user actions.
- Testing final rendered output but not transitions between states.

## Verification checklist

- [ ] State ownership is explicit and global state is justified.
- [ ] Loading, empty, error, success, stale, retry, and disabled states are handled where relevant.
- [ ] State mutations are predictable and follow framework conventions.
- [ ] Side effects have correct dependencies and cleanup behavior.
- [ ] Form validation includes client UX checks and server-authoritative validation.
- [ ] Optimistic updates include rollback and conflict behavior.
- [ ] Stale-while-revalidate behavior is deliberate for data fetching where applicable.
- [ ] Tests cover state transitions, cleanup, validation paths, optimistic rollback, and stale refresh behavior.
