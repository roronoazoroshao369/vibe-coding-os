---
name: safe-refactor
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: core
tags:
  - core
status: stable
---

# Skill: Safe Refactor

## Purpose

Provide a 5-phase protocol for refactoring existing code without breaking behavior. Covers the full lifecycle: **characterize → cover → extract → migrate → cleanup**. The protocol guarantees that every refactor step is reversible, testable, and produces a measurable diff. Use when touching code that has existing behavior, callers, or tests you cannot break.

## When to use

Use when:
- A code smell is identified (long function, deep nesting, leaky abstraction, repeated logic) and the team has agreed to refactor.
- An upstream API or contract is being changed.
- A "while we're here" rewrite threatens to merge behavioral changes with structural changes.
- Code needs to be split, renamed, moved across modules, or have its dependency direction reversed.

Do NOT use when:
- The change is a bug fix (use `bug-fix-lifecycle`).
- The change is a new feature (use `writing-skills` or feature workflow).
- The behavior itself is wrong — fix the behavior first, then refactor.

## Inputs

- The code to refactor (file path or diff).
- Existing test coverage (or explicit acknowledgment that coverage is missing).
- The smell or pattern being addressed (long function, deep coupling, etc.).
- The target shape (what "good" looks like).
- Rollback strategy if the refactor must be reverted.

## Workflow

1. **Characterize** — capture current behavior with tests, traces, or property assertions. If no tests exist, write characterization tests FIRST. Record observable outputs for representative inputs.
2. **Cover** — confirm the characterization tests pass on the current code. Coverage must be ≥ 80% for the area being refactored before proceeding. If below 80%, stop and add coverage.
3. **Extract** — perform the smallest safe change that moves toward the target shape. One rename, one extract-method, one move-class per commit. Each commit must leave tests green.
4. **Migrate** — update callers, dependents, and contracts to use the new shape. Run the full test suite after each migration step. If any test fails, the refactor is wrong; revert and re-characterize.
5. **Cleanup** — delete the old code path, remove dead branches, remove commented-out code. Final verification: characterization tests still pass + new tests for the new shape pass + no behavioral diff.

## Outputs

- A commit chain where each commit is independently revertible.
- A diff summary: lines added, lines removed, files touched, public surface changed.
- A characterization test suite that pins behavior before and after.
- A rollback note: which commit to revert to if the refactor must be abandoned.

## Failure modes

- Refactoring without characterization tests — silent behavior change ships.
- Mixing refactor with bug fixes — bug fix and structural change become inseparable; rollback becomes impossible.
- Skipping the "each commit must leave tests green" rule — debugging a multi-step refactor mid-flight is expensive.
- Confusing "the new shape is cleaner" with "the refactor is correct" — cleanliness is not a verification gate.
- Leaving dead code "temporarily" — temporary becomes permanent; cleanup must happen in the same PR.
- Not updating the registry/index — refactored paths become orphans; traceability gate fails.

## Verification checklist

- [ ] Characterization tests written and passing BEFORE any structural change.
- [ ] Coverage of the refactored area is ≥ 80% before the refactor starts.
- [ ] Each refactor commit leaves `npm run validate:all` green.
- [ ] Each refactor commit leaves the characterization test suite green.
- [ ] Public surface (exported names, public methods, route paths, CLI flags) is documented in the diff.
- [ ] No behavioral diff: characterization tests pass on both old and new code.
- [ ] Registry/index updated: skill paths in `registry/skills.json`, command paths in `registry/commands.json`, template paths in `registry/templates.json` all reflect the refactor.
- [ ] `npm run validate:traceability -- --strict-new` passes (no new orphans introduced).
- [ ] PR description lists: smell addressed, target shape, commits in the chain, rollback commit hash.

## Related skills

- `skills/core/bug-fix-lifecycle/SKILL.md` — for the "fix bug first" rule (refactor never carries a fix).
- `skills/core/verification-before-done/SKILL.md` — 5-axis verification includes refactor-safety axis.
- `skills/core/quality-engine/SKILL.md` — quality-engine runs after every refactor commit.
- `templates/refactor-plan.md` — refactor PR worksheet.
- `commands/vibe-refactor.md` — the canonical command to start a refactor.

## Attribution

Pattern adapted from Michael Feathers' *Working Effectively with Legacy Code* (characterization tests) and Martin Fowler's *Refactoring* (commit-per-step discipline), in original wording.
