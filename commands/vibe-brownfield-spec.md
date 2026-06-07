# vibe-brownfield-spec

## Purpose

Apply spec discipline to an existing system: document current behavior, define desired
behavior, and plan a safe, incremental migration.

## When to use

Use when changing or extending an existing feature, when behavior is poorly documented, or
when a change is risky in a live system.

## Required inputs

- The existing code and observable behavior.
- The requested change and constraints.
- Any current tests or docs.

## Step-by-step behavior

1. Document current observable behavior, including edge cases and quirks.
2. Add or identify characterization tests that pin current behavior.
3. Define desired behavior and acceptance criteria.
4. Diff current vs desired to scope exactly what changes.
5. Assess regression, compatibility, and data/migration risks.
6. Plan small, reversible increments; prefer additive changes and flags.
7. Save the brownfield spec using `templates/brownfield-spec-template.md`.

## Outputs

A brownfield spec with current behavior, desired behavior, change diff, risks, and an
incremental migration plan.

## Stopping conditions

Stop and ask when current behavior cannot be observed/confirmed, when the change requires a
risky rewrite, or when characterization tests cannot be created before changing behavior.

## Verification checklist

- [ ] Current behavior is documented from observation.
- [ ] Characterization tests exist before changes.
- [ ] Desired behavior has acceptance criteria.
- [ ] Migration is incremental and reversible.

## Related skills/templates

- `skills/core/brownfield-spec-enhancement/SKILL.md`, `skills/core/systematic-debugging/SKILL.md`
- `templates/brownfield-spec-template.md`

## Ghi chú tiếng Việt

Áp dụng spec cho hệ thống sẵn có: ghi hành vi hiện tại (quan sát thật), thêm test ghim,
định nghĩa hành vi mong muốn, đánh giá rủi ro, di trú từng bước có thể rollback. Học ý
tưởng từ `spec-kit`, không copy template.
