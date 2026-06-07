# Task State Tracking

## Purpose

Keep task lists executable by tracking each task's current state, dependencies, and next
eligible work item without adding runtime automation.

## When to use

Use when creating or updating `templates/tasks-template.md`, coordinating handoffs, or choosing
what to implement next from a task list.

## Inputs

A task list, dependency notes, current work status, and any active exclusive/shared-resource
constraints.

## Workflow

1. Give every task exactly one status: `todo`, `ready`, `in-progress`, `blocked`, `done`, or
   `deferred`.
2. Mark `ready` only when all dependencies are `done` and required inputs exist.
3. Mark `blocked` when a dependency, decision, file ownership conflict, or external condition
   prevents safe progress; record the blocker in dependency notes.
4. Use `in-progress` for work currently owned by a person/agent; avoid multiple owners for an
   `[exclusive]` task.
5. Mark `done` only after the done condition and verification command pass or are explicitly
   recorded as not run with a reason.
6. Choose the next task by this order: ready test tasks first, then ready dependency-unblocking
   tasks, then ready implementation tasks, then parallel-safe independent tasks.
7. When a task changes state, update any tasks that depended on it.

## Outputs

An updated task table with current status plus dependency notes that explain blockers,
exclusive constraints, and the next recommended task.

## Failure modes

- A task is marked done without verification evidence.
- Work starts on a task whose dependencies are not done.
- Multiple workers edit the same shared file because `[exclusive]` and status were ignored.
- Status values drift into ambiguous labels that are hard to compare.

## Verification checklist

- [ ] Every task has one status.
- [ ] No `ready` task has incomplete dependencies.
- [ ] Blockers are named in dependency notes.
- [ ] Done tasks include a passed check or an explicit not-run reason.
- [ ] The next recommended task follows dependency and test-first ordering.

## Applied / Not Applied

- Applied: lightweight task state, dependency-aware next-task selection, and traceability from
  spec/plan/tasks to work.
- Not applied: MCP servers, CLI engines, GitHub automation, queue daemons, or upstream task
  database formats.

## Ghi chú tiếng Việt

Theo dõi trạng thái task bằng markdown: `todo`, `ready`, `in-progress`, `blocked`, `done`,
`deferred`; chỉ chọn task `ready` khi dependency đã `done`; ưu tiên test trước, task mở khóa
trước, rồi implementation. Không thêm runtime/CLI/MCP/GitHub automation. Liên kết:
`templates/tasks-template.md`, `commands/vibe-tasks.md`, `commands/vibe-brief.md`.
