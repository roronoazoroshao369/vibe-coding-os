---
title: Tasks: <title>
type: template
name: tasks-template
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: template
tags:
  - template
status: stable
---

# Tasks: <title>

> Vietnamese usage note / Ghi chú sử dụng: Đây là danh sách task được sinh từ plan. Mỗi
> task phải nhỏ, độc lập, có done condition, `depends-on`, đánh dấu song song, và test xếp
> trước implementation. Học ý tưởng từ `github/spec-kit`, không copy cú pháp marker upstream.

## Context

Link or summarize the spec and plan this task list implements.

## Markers

- `[parallel]` — safe to run concurrently (no shared files/interfaces with other parallel tasks).
- `[exclusive]` — touches a shared resource; must run alone.
- `[test]` — a test task that must precede the implementation task it covers.

## Tasks

Status values: `proposed`, `approved`, `in-progress`, `review`, `done`, `blocked`, `abandoned`.

Status badge convention: `![status](https://img.shields.io/badge/<status>-<color>)` or plain-text
`[<status>]` in front of the task subject. Use colors: proposed=lightgrey, approved=blue,
in-progress=yellow, review=orange, done=green, blocked=red, abandoned=black.

|| ID | Status | Subject | Files | depends-on | Markers | Done condition | Acceptance criteria covered |
|| --- | --- | --- | --- | --- | --- | --- | --- |
|| T1 | approved | <write test for X> | `<path>` | — | `[test]` | <test fails for the right reason> | AC1 |
|| T2 | proposed | <implement X> | `<path>` | T1 | — | <T1 test passes> | AC1 |
|| T3 | approved | <independent change Y> | `<path>` | — | `[parallel]` | <observable outcome> | AC2 |

## State-transition log

Record each transition as `YYYY-MM-DD: <from> → <to> — <reason>` in a log block after the
task table. This provides the rollback and audit trail required by the task-state-tracking
skill. The log is append-only — never delete or rewrite entries.

## Dependency notes

- <Explain the ordering rationale and any cycle that was broken.>

## Non-goals

- <Work explicitly out of scope for this task list.>

## Assumptions

- <Ordering or environment assumptions.>

## Acceptance criteria coverage

- [ ] Every acceptance criterion maps to at least one task.
- [ ] Test tasks precede their implementation tasks.

## Next-task selection

- A task is selectable only when its status is `ready` (all `depends-on` tasks are `done`).
- Order of preference: ready `[test]` tasks → ready tasks that unblock others → ready
  implementation tasks → parallel-safe independent tasks.
- Never start a task whose dependencies are not `done`; never run two `[exclusive]` tasks at once.
- Update dependents' status when a task becomes `done`. See `skills/core/task-state-tracking/SKILL.md`.

## Verification gates

- [ ] The dependency graph is acyclic.
- [ ] Parallel-marked tasks share no files/interfaces.
- [ ] Per-task verification command is defined.

## Ghi chú tiếng Việt

Mỗi task nhỏ, có done condition, `depends-on`, marker song song/độc quyền, và test trước
code. Phủ hết tiêu chí chấp nhận. Liên kết: `skills/core/task-breakdown-from-plan/SKILL.md`,
`skills/core/dependency-aware-task-ordering/SKILL.md`.
