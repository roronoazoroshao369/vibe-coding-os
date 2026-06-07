# Feature: Dependency-aware tasks

## Goal

Order tasks by real dependencies and identify safe parallelism so execution avoids rework
and exploits concurrency without conflicts.

## Reference sources

- github/spec-kit

## Local implementation

- `skills/core/dependency-aware-task-ordering/SKILL.md`, `skills/core/task-breakdown-from-plan/SKILL.md`
- `templates/tasks-template.md`
- `commands/vibe-tasks.md`

## Applied upstream ideas

- Per-task dependencies (`depends-on`).
- Parallel-safe markers.
- Test-before-implementation ordering.

## Not applied upstream ideas

- Upstream `[P]` marker syntax verbatim.
- CLI-driven ordering.

## Must-have behavior

- The dependency graph is acyclic.
- Parallel-marked tasks share no files or interfaces.
- Exclusive-access tasks are flagged.

## Failure modes

- Hidden dependencies cause rework.
- Parallel tasks conflict on a shared file.
- Tests scheduled after the code they should drive.

## Update signals

- Upstream changes dependency or parallel semantics.
- Builds break from out-of-order execution.

## Evaluation ideas

- Is the graph acyclic and the parallel set conflict-free?
- Are exclusive-access tasks clearly flagged?

## Ghi chú tiếng Việt

Sắp xếp task theo phụ thuộc thật; đánh dấu nhóm song song an toàn; xếp test trước code; gắn
cờ task cần truy cập độc quyền. Học ý tưởng từ `spec-kit`, không copy cú pháp marker.
