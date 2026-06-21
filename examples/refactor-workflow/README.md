# Example: Refactor Workflow

This example shows how to apply the Architecture Improvement Loop to a deliberate refactoring task. It follows the full intent → zoom-out → architecture improvement → ADR → plan → implement → review → verify path, emphasizing reversible slices, domain language, and test-backed safety.

## 1. Initial user intent

> The `src/payment/` module has grown tangled — billing logic, subscription state, and invoice formatting are mixed together. Refactor it into clearly separated concerns without changing external behavior.

Assumptions to confirm before implementation:

- External API contracts (payment endpoints, webhook handlers) must remain unchanged.
- Existing tests for payment flows serve as behavioral guardrails during refactoring.
- The module is not deprecated and will continue to be actively maintained.

## 2. Command/skill order

1. `vibe-init` to inspect repo instructions, current architecture docs, and payment module structure.
2. `vibe-zoom-out` with `zoom-out-system-context` to map the payment module's boundaries, dependencies, and pain points within the larger system.
3. `vibe-improve-architecture` with `improve-codebase-architecture` to identify seams, coupling violations, and candidate refactoring slices.
4. `vibe-adr` with `architecture-decision-records` to record the architectural decision about how to separate concerns.
5. `vibe-plan` with `plan-driven-execution` to sequence small, testable refactoring steps.
6. `vibe-implement` with `test-driven-development` to execute each refactoring slice with tests verifying no behavioral change.
7. `vibe-review` with `review-before-merge` to inspect the diff for scope, correctness, and unintended behavior changes.
8. `vibe-verify` with `verification-before-done` to confirm all tests pass and the module's public interface is preserved.
9. `vibe-memory` with `project-memory` to record the refactoring rationale and new module structure.

## 3. Sample zoom-out output

Based on [`skills/core/brainstorming/SKILL.md`](../../skills/core/brainstorming/SKILL.md).

```markdown
# Zoom-Out: Payment Module Context

## System boundaries

- `src/payment/billing.ts` — subscription creation, upgrade, cancellation, and proration.
- `src/payment/state.ts` — subscription status tracking, trial logic, renewal dates.
- `src/payment/invoices.ts` — invoice generation, PDF formatting, email delivery.
- `src/payment/webhooks.ts` — incoming webhook handlers from the payment provider.
- `src/payment/api.ts` — public API surface consumed by the rest of the application.

## Pain points identified

1. `billing.ts` directly reads and writes subscription state, making it hard to test in isolation.
2. `invoices.ts` depends on billing internals to format line items, creating a bidirectional dependency.
3. `state.ts` mixes persistence concerns with business logic.
4. No clear domain language — the same "subscription" concept has different names across files.

## Dependencies

- `src/payment/` is imported by `src/orders/`, `src/accounts/`, and `src/admin/`.
- `src/payment/` imports from `src/lib/db.ts`, `src/lib/http.ts`, and `src/config/pricing.ts`.
- Webhook handler is registered in `src/server/routes.ts`.

## Constraints

- Public API surface (`src/payment/api.ts`) must not change.
- Webhook handler signatures must remain compatible with the payment provider.
- Refactoring must be done in testable, reversible slices.
```

## 4. Sample architecture improvement analysis

Based on [`skills/core/improve-codebase-architecture/SKILL.md`](../../skills/core/improve-codebase-architecture/SKILL.md).

```markdown
# Architecture Improvement: Payment Module Separation

## Current state assessment

- Three distinct concerns (billing, state, invoices) are interleaved across files.
- Bidirectional dependency between billing and invoices.
- Persistence logic mixed with domain state in `state.ts`.

## Proposed target structure

```
src/payment/
  api.ts              — public API surface (unchanged)
  webhooks.ts         — webhook handlers (unchanged signature)
  billing/
    subscription.ts   — subscription lifecycle operations
    proration.ts      — proration calculation logic
  state/
    subscription.ts   — subscription status domain model
    persistence.ts    — database read/write for subscription state
  invoices/
    generator.ts      — invoice line item assembly
    formatter.ts      — PDF/email formatting
  domain/
    types.ts          — shared domain types and language
```

## Identified seams

1. Extract domain types into `domain/types.ts` first — zero behavioral change, establishes shared language.
2. Split `state.ts` into domain model and persistence — tests guard domain logic.
3. Extract invoice line item assembly from billing into `invoices/generator.ts`.
4. Remove bidirectional dependency by making `invoices/` depend on `domain/types.ts` instead of `billing/`.

## Risk areas

- Renaming or moving files can break imports across consuming modules.
- Persistence extraction could change error handling behavior if not careful.
- Proration logic is tightly coupled to billing — keep it in the same slice until tests prove it safe.
```

## 5. Sample ADR

Based on [`templates/adr-template.md`](../../templates/adr-template.md).

```markdown
# ADR: Separate Payment Module Concerns

## Status

Accepted

## Context

The `src/payment/` module has grown organically and now mixes billing operations, subscription state management, invoice formatting, and persistence logic across four files. This coupling makes testing difficult, obscures domain boundaries, and slows feature development in the payment area.

## Decision

Separate the payment module into clearly bounded sub-modules: `billing/`, `state/`, `invoices/`, and `domain/`. Each sub-module owns a single concern. Domain types live in `domain/types.ts` and are imported by all other sub-modules. Persistence is extracted from the domain model into its own file.

## Consequences

- Each sub-module can be tested in isolation with focused mock dependencies.
- The public API surface (`api.ts`) and webhook handler (`webhooks.ts`) remain unchanged.
- Consuming modules (`orders/`, `accounts/`, `admin/`) continue importing from `api.ts` — no change needed.
- Future payment features can be added to the correct sub-module without touching unrelated code.
- The refactoring must be done in slices: domain types first, then state extraction, then invoice decoupling, then billing isolation.

## Alternatives considered

1. **Full rewrite** — rejected because it increases risk and removes behavioral guardrails.
2. **Ad-hoc cleanup** — rejected because it lacks a coherent target structure and makes review harder.
3. **Namespace-based separation** — rejected because flat directories with clear naming are simpler for this codebase.
```

## 6. Sample plan

Based on [`templates/plan-template.md`](../../templates/plan-template.md).

```markdown
# Plan: Refactor Payment Module

## Context

Refactoring `src/payment/` to separate billing, state, and invoice concerns. The public API surface and webhook handler must remain unchanged. All existing tests serve as behavioral guardrails.

## Tasks

1. [ ] Extract shared domain types into `src/payment/domain/types.ts`. Update imports across the module. Run all payment tests.
2. [ ] Split `src/payment/state.ts` into `src/payment/state/subscription.ts` (domain logic) and `src/payment/state/persistence.ts` (database access). Run all payment tests.
3. [ ] Extract invoice line item assembly from `billing.ts` into `src/payment/invoices/generator.ts`. Run invoice-related tests.
4. [ ] Remove bidirectional dependency: update `invoices/formatter.ts` to import from `domain/types.ts` instead of `billing.ts`. Run invoice and billing tests.
5. [ ] Move billing lifecycle operations into `src/payment/billing/subscription.ts`. Extract proration into `src/payment/billing/proration.ts`. Run billing tests.
6. [ ] Update all consuming module imports if file paths changed. Run full test suite.
7. [ ] Review diff for scope, correctness, and preserved behavior.
8. [ ] Record ADR and memory note with new module structure.

## Risks

- Import path changes can break consuming modules if not updated atomically.
- Persistence extraction could change error handling if database errors are wrapped differently.
- Proration logic extraction may require careful boundary drawing to avoid splitting cohesive logic.

## Verification

- Command: `npm test -- payment`
- Expected result: all existing payment tests pass with no behavioral changes.
- Command: `npm test -- orders accounts admin`
- Expected result: consuming module tests pass with no import errors.
- Command: `npm run validate`
- Expected result: repository validation passes.

## Rollback

- Each slice can be reverted independently by restoring the previous file layout and re-running tests.
```

## 7. Sample task breakdown

Based on [`templates/task-template.md`](../../templates/task-template.md).

```markdown
# Task: Extract payment domain types

## Objective

Create a shared domain types file to establish common language and reduce type duplication across payment sub-modules.

## Scope

### In scope

- `src/payment/domain/types.ts` — shared types for Subscription, Invoice, BillingEvent.
- Import updates in `src/payment/billing.ts`, `src/payment/state.ts`, `src/payment/invoices.ts`.

### Out of scope

- Moving logic into new directories (handled in later tasks).
- Changing type definitions or adding new fields.
- Updating consuming modules outside `src/payment/`.

## Files or areas

- New: `src/payment/domain/types.ts`
- Modified: `src/payment/billing.ts`, `src/payment/state.ts`, `src/payment/invoices.ts`

## Steps

1. Identify all shared type definitions currently duplicated or inconsistent across payment files.
2. Create `src/payment/domain/types.ts` with canonical type definitions.
3. Update imports in each payment file to use the shared types.
4. Run `npm test -- payment` to confirm no behavioral change.

## Done when

- [ ] Shared types file exists with all payment domain types.
- [ ] All payment files import from `domain/types.ts` for shared types.
- [ ] All payment tests pass.
- [ ] No changes to public API surface.

## Notes

- Keep type definitions minimal — do not add new fields or behaviors.
- This task has zero behavioral change and serves as the foundation for subsequent slices.
```

## 8. Sample review note

Based on [`templates/review-template.md`](../../templates/review-template.md).

```markdown
# Review: Refactor Payment Module

## Summary

The refactoring separates billing, state, and invoice concerns into distinct sub-modules within `src/payment/`. Domain types are centralized in `domain/types.ts`. Persistence is extracted from the domain model. The bidirectional dependency between billing and invoices is removed. The public API surface and webhook handler are unchanged.

## Blockers

- None identified.

## Suggestions

- Consider adding an index file (`src/payment/index.ts`) that re-exports the public API for cleaner imports.
- The proration module is small enough to stay in `billing/` for now; revisit if it grows.

## Verification reviewed

- `npm test -- payment` passed.
- `npm test -- orders accounts admin` passed.
- `npm run validate` passed.

## Scope and attribution

- [x] Diff matches intended scope.
- [x] Attribution and license obligations are clean.

## Decision

Approve
```

## 9. Sample memory note

Based on [`templates/memory-template.md`](../../templates/memory-template.md).

```markdown
# Memory: 2026-06-16 payment module refactoring

## Durable facts

- Payment module is now split into `billing/`, `state/`, `invoices/`, and `domain/` sub-modules.
- Domain types live in `domain/types.ts` and are the single source of truth for payment types.
- Persistence is separated from domain logic in `state/persistence.ts`.
- Public API surface (`api.ts`) and webhook handler (`webhooks.ts`) are unchanged.

## Decisions

- Separated concerns incrementally in testable slices rather than a full rewrite.
- Kept proration logic in `billing/` to avoid splitting cohesive logic prematurely.
- Used the existing ADR process to record the architectural decision.

## Commands and results

- `npm test -- payment`: passed (all slices).
- `npm test -- orders accounts admin`: passed (consuming modules).
- `npm run validate`: passed.

## Gotchas

- Import path changes broke one consuming module test initially — fixed by updating the import.
- Persistence extraction required careful error wrapping to preserve existing error behavior.

## Follow-ups

- Add a barrel export file (`src/payment/index.ts`) if consuming modules need a cleaner import surface.
- Consider extracting a shared test fixture for payment domain types.

## Sensitivity check

- [x] Contains no secrets, credentials, or unnecessary personal data.

## Confidence

High
```

## 10. Verification report

| Check | Command | Expected result | Status |
| --- | --- | --- | --- |
| Payment tests (all slices) | `npm test -- payment` | All existing payment tests pass. | Pass |
| Consuming module tests | `npm test -- orders accounts admin` | No import errors, no behavioral regressions. | Pass |
| Static checks | `npm run lint && npm run typecheck` | Static checks pass, or unavailable scripts are documented. | Pass or documented limitation |
| Repository validation | `npm run validate` | Framework or host repo validation passes. | Pass |

## 11. Merge readiness checklist

- [ ] ADR is recorded and reviewed.
- [ ] All payment tests pass across all refactoring slices.
- [ ] Consuming module tests pass with no import errors.
- [ ] Public API surface and webhook handler signatures are unchanged.
- [ ] Diff is limited to `src/payment/` sub-module reorganization and import updates.
- [ ] No secrets, personal data, vendored third-party code, or unattributed external content were added.
- [ ] Review decision is `Approve` or remaining changes are explicitly accepted by the human.
