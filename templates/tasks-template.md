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

| ID | Subject | Files | depends-on | Markers | Done condition | Acceptance criteria covered |
| --- | --- | --- | --- | --- | --- | --- |
| T1 | <write test for X> | `<path>` | — | `[test]` | <test fails for the right reason> | AC1 |
| T2 | <implement X> | `<path>` | T1 | — | <T1 test passes> | AC1 |
| T3 | <independent change Y> | `<path>` | — | `[parallel]` | <observable outcome> | AC2 |

## Dependency notes

- <Explain the ordering rationale and any cycle that was broken.>

## Non-goals

- <Work explicitly out of scope for this task list.>

## Assumptions

- <Ordering or environment assumptions.>

## Acceptance criteria coverage

- [ ] Every acceptance criterion maps to at least one task.
- [ ] Test tasks precede their implementation tasks.

## Verification gates

- [ ] The dependency graph is acyclic.
- [ ] Parallel-marked tasks share no files/interfaces.
- [ ] Per-task verification command is defined.

## Ghi chú tiếng Việt

Mỗi task nhỏ, có done condition, `depends-on`, marker song song/độc quyền, và test trước
code. Phủ hết tiêu chí chấp nhận. Liên kết: `skills/core/task-breakdown-from-plan/SKILL.md`,
`skills/core/dependency-aware-task-ordering/SKILL.md`.
