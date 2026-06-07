# Feature: Checkpoint validation

## Goal

Validate that each workflow phase is sound before the next begins, providing an explicit
implementation-readiness gate.

## Reference sources

- github/spec-kit

## Local implementation

- `skills/core/checkpoint-validation/SKILL.md`
- `templates/checkpoint-template.md`
- `commands/vibe-checkpoints.md`, `commands/vibe-implement-from-tasks.md`
- `docs/workflows/spec-to-tasks-to-implementation.md`

## Applied upstream ideas

- Phase-boundary validation.
- Implementation-readiness gate (spec, plan, tasks all green before code).

## Not applied upstream ideas

- Upstream CLI checks or command names.

## Must-have behavior

- Each phase has explicit exit criteria.
- Gate failures block advancement.
- Evidence is recorded for each check.

## Failure modes

- Phases advance without meeting criteria.
- Gates run but evidence is not recorded.
- Implementation starts before the readiness gate clears.

## Update signals

- Upstream changes checkpoint or gate behavior.
- Defects repeatedly slip past a phase boundary.

## Evaluation ideas

- Does each gate cite evidence tied to acceptance criteria?
- Is the implementation-readiness gate consistently honored?

## Ghi chú tiếng Việt

Checkpoint: mỗi pha phải đạt tiêu chí (có bằng chứng) trước khi sang pha sau; cổng quan
trọng nhất là implementation-readiness. Học ý tưởng từ `spec-kit`, dùng checklist local +
`npm run validate`, không dùng CLI upstream.
