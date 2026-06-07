# Brownfield Spec Enhancement

## Purpose

Apply spec discipline to existing systems: capture current behavior, define desired
behavior, and plan a safe, incremental migration without rewriting from scratch.

## When to use

Use when changing or extending an existing feature, when behavior is poorly documented,
or when a change carries regression risk in a live system.

## Inputs

The existing code and behavior, the requested change, known constraints, and any tests or
docs describing current behavior.

## Workflow

1. Document current observable behavior, including edge cases and known quirks.
2. Define desired behavior and acceptance criteria for the change.
3. Diff current vs desired to scope exactly what must change.
4. Identify regression risks, compatibility concerns, and data/migration needs.
5. Plan small, reversible increments; prefer additive changes and feature flags.
6. Add or strengthen tests that pin current behavior before changing it.
7. Sequence the migration so each step is verifiable and rollback-able.

## Outputs

A brownfield spec (`templates/brownfield-spec-template.md`) with current behavior, desired
behavior, a change diff, risks, and an incremental migration plan.

## Failure modes

- Current behavior is assumed rather than observed.
- A large rewrite replaces a safe incremental change.
- Regression risks and compatibility are not assessed.
- No characterization tests exist before changing behavior.

## Verification checklist

- [ ] Current behavior is documented from observation.
- [ ] Desired behavior has acceptance criteria.
- [ ] Regression and compatibility risks are listed.
- [ ] Migration is incremental and reversible.
- [ ] Characterization tests exist before changes.

## Applied / Not Applied

- Applied: brownfield iterative enhancement discipline from `github/spec-kit`.
- Not applied: upstream templates, command names, or generated scaffolding. Composes with
  local `systematic-debugging` and `test-driven-development` skills.

## Ghi chú tiếng Việt

Áp dụng kỷ luật spec cho hệ thống sẵn có: ghi lại hành vi hiện tại (quan sát thật), định
nghĩa hành vi mong muốn, đánh giá rủi ro hồi quy, và lên kế hoạch di trú từng bước, có thể
rollback. Thêm test ghim hành vi trước khi đổi. Liên kết:
`skills/core/systematic-debugging/SKILL.md`, `templates/brownfield-spec-template.md`.
