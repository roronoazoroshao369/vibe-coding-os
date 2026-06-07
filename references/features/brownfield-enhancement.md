# Feature: Brownfield enhancement

## Goal

Apply spec discipline to existing systems: capture current behavior, define desired
behavior, and plan a safe, incremental migration.

## Reference sources

- github/spec-kit

## Local implementation

- `skills/core/brownfield-spec-enhancement/SKILL.md`
- `templates/brownfield-spec-template.md`
- `commands/vibe-brownfield-spec.md`
- `docs/workflows/brownfield-spec-enhancement.md`

## Applied upstream ideas

- Iterative enhancement of existing systems under spec discipline.
- Current-vs-desired behavior diffing.

## Not applied upstream ideas

- Upstream templates, command names, or generated scaffolding.

## Must-have behavior

- Current behavior is documented from observation, not assumption.
- Desired behavior has acceptance criteria.
- Migration is incremental, reversible, and backed by characterization tests.

## Failure modes

- Current behavior is assumed, causing regressions.
- A large rewrite replaces a safe incremental change.
- No characterization tests before changing behavior.

## Update signals

- Upstream changes its brownfield workflow.
- Recurring regressions in existing features.

## Evaluation ideas

- Are characterization tests present before changes?
- Is the migration reversible at each step?

## Ghi chú tiếng Việt

Brownfield: ghi hành vi hiện tại (quan sát thật), định nghĩa hành vi mong muốn, đánh giá
rủi ro hồi quy, di trú từng bước có thể rollback, và thêm test ghim hành vi trước khi đổi.
Học ý tưởng từ `spec-kit`, không copy template.
