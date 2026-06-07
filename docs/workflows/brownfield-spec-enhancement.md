# Brownfield Spec Enhancement Workflow

## Purpose

Apply spec discipline to existing systems: document current behavior, define desired
behavior, and migrate incrementally with low regression risk.

## When to use

Use when changing or extending an existing feature, when behavior is poorly documented, or
when a change is risky in a live system.

## Step-by-step workflow

1. **Characterize** — Document current observable behavior, including edge cases and quirks.
2. **Add characterization tests** — Pin current behavior before changing it.
3. **Desired behavior** — Define the target behavior and acceptance criteria.
4. **Diff** — Scope exactly what must change (current vs desired).
5. **Risk assessment** — Identify regression, compatibility, and data/migration risks.
6. **Incremental plan** — Plan small, reversible steps; prefer additive changes and flags.
7. **Implement + verify** — Execute step by step; re-run characterization and new tests.

## Required inputs

The existing code/behavior, the requested change, and any current tests or docs.

## Outputs

A brownfield spec, characterization tests, an incremental migration plan, and verified
changes.

## Related skills

- `skills/core/brownfield-spec-enhancement/SKILL.md`
- `skills/core/systematic-debugging/SKILL.md`, `skills/core/test-driven-development/SKILL.md`, `skills/core/plan-from-spec/SKILL.md`

## Related commands

- `commands/vibe-brownfield-spec.md`, `commands/vibe-plan-from-spec.md`, `commands/vibe-verify.md`

## Applied / Not applied

- Applied: brownfield iterative enhancement with characterization tests and reversible migration.
- Not applied: upstream templates, command names, or generated scaffolding.

## Maintenance notes

Keep aligned with `templates/brownfield-spec-template.md`. Update when the brownfield skill
or migration guidance changes.

## Ghi chú tiếng Việt

Brownfield: ghi hành vi hiện tại, thêm test ghim, định nghĩa hành vi mong muốn, đánh giá
rủi ro, di trú từng bước có thể rollback, và verify lại. Học ý tưởng từ `spec-kit`, không
copy template.
