---
name: dependency-aware-task-ordering
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: core
tags:
  - core
status: stable
---

# Dependency-Aware Task Ordering

## Purpose

Order tasks by their real dependencies and identify which tasks can safely run in
parallel, so execution avoids rework and concurrency is exploited without conflicts.

## When to use

Use after task breakdown, when planning execution order, when assigning work to multiple
agents, or when a build keeps breaking because tasks ran out of order.

## Inputs

The task list with per-task `depends-on` fields, shared interfaces or files, and any
data/migration ordering constraints.

## Workflow

1. Build the dependency graph from each task's `depends-on`.
2. Detect cycles; break them by splitting or re-scoping tasks.
3. Topologically order tasks so prerequisites come first.
4. Group tasks with no shared files or interfaces as parallel-safe and mark them.
5. Sequence test tasks before the implementation tasks they verify.
6. Note any task that touches a shared resource and must run exclusively.
7. Record the ordering and parallel groups for reviewers and executors.

## Outputs

An ordered task list with a dependency graph, parallel-safe groups, and exclusive-access
notes.

## Failure modes

- Cycles or hidden dependencies cause repeated rework.
- Tasks marked parallel actually share a file and conflict.
- Tests are scheduled after the code they should drive.
- The ordering is implicit and not reviewable.

## Verification checklist

- [ ] The dependency graph is acyclic.
- [ ] Parallel-marked tasks share no files or interfaces.
- [ ] Test tasks precede their implementation tasks.
- [ ] Exclusive-access tasks are flagged.
- [ ] Ordering rationale is recorded.

## Applied / Not Applied

- Applied: task dependencies, parallel markers, and TDD ordering from `github/spec-kit`.
- Not applied: upstream marker syntax verbatim or CLI-driven ordering. Ordering is a
  documented local convention in `templates/tasks-template.md`.

## Ghi chú tiếng Việt

Sắp xếp task theo phụ thuộc thật, phát hiện chu trình, và đánh dấu nhóm chạy song song an
toàn (không chung file/interface). Xếp test trước code. Ghi rõ thứ tự để review. Liên kết:
`skills/core/task-breakdown-from-plan/SKILL.md`, `templates/tasks-template.md`.
