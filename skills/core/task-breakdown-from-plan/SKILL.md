---
name: task-breakdown-from-plan
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: core
tags:
  - core
  - planning
status: stable
---

# Task Breakdown From Plan

## Purpose

Decompose an implementation plan into small, reviewable, independently grabbable tasks
with explicit dependencies, parallel markers, and test-first ordering.

## When to use

Use after a plan is agreed and before implementation, especially when work can be
parallelized, handed to multiple agents, or needs a clear order of execution.

## Inputs

The agreed plan (steps, technical context, risks), acceptance criteria, and any
constraints on ordering (shared interfaces, data migrations).

## Workflow

1. Convert each plan step into one or more concrete tasks.
2. For each task, write a clear subject, the files involved, and a done condition.
3. Add a `depends-on` field listing prerequisite task IDs.
4. Mark tasks that can run concurrently with a parallel marker.
5. Sequence test tasks before the implementation tasks they cover (TDD ordering).
6. Confirm every acceptance criterion is covered by at least one task.
7. Record the ordering rationale so reviewers understand the dependency graph.

## Outputs

A task list using `templates/tasks-template.md` with dependencies, parallel markers,
TDD ordering, and acceptance-criteria coverage.

## Failure modes

- Tasks are too large or vaguely scoped to grab independently.
- Hidden dependencies cause rework when tasks run out of order.
- Implementation tasks precede their tests.
- Some acceptance criteria have no covering task.

## Verification checklist

- [ ] Each task has a clear done condition and named files.
- [ ] Dependencies are explicit; the graph has no cycles.
- [ ] Parallelizable tasks are marked.
- [ ] Test tasks precede their implementation tasks.
- [ ] Every acceptance criterion maps to a task.

## Applied / Not Applied

- Applied: dependency-aware decomposition, parallel markers, and TDD ordering from
  `github/spec-kit`.
- Not applied: upstream tasks template text or `[P]` syntax verbatim, and upstream
  command names. Complements (does not replace) `skills/core/issue-slicing/SKILL.md`,
  which slices ideas into issues; this skill turns an agreed plan into ordered tasks.

## Ghi chú tiếng Việt

Chia kế hoạch thành các task nhỏ, độc lập, có `depends-on`, đánh dấu task song song, và
xếp test trước implementation (TDD). Đảm bảo mọi tiêu chí chấp nhận đều có task. Khác với
`issue-slicing` (chia ý tưởng thành issue); skill này biến plan thành task có thứ tự.
Liên kết: `skills/core/dependency-aware-task-ordering/SKILL.md`,
`skills/core/test-driven-development/SKILL.md`.
