---
description: "Decompose an agreed plan into ordered tasks with dependencies, parallel markers, and TDD ordering."
---

# vibe-tasks

## Purpose

Decompose an agreed plan into small, reviewable tasks with explicit dependencies, parallel
markers, and test-first ordering.

## When to use

Use after a plan is agreed and before implementation, especially when work can be
parallelized or handed to multiple agents.

## Required inputs

- The agreed plan with steps and technical context.
- Acceptance criteria.
- Ordering constraints (shared interfaces, data migrations).

## Step-by-step behavior

1. Convert each plan step into one or more concrete tasks.
2. For each task, write a subject, the files involved, and a done condition.
3. Add a `depends-on` list of prerequisite task IDs.
4. Mark parallel-safe tasks (no shared files/interfaces).
5. Sequence test tasks before their implementation tasks.
6. Confirm every acceptance criterion is covered by a task.
7. Save the task list using `templates/tasks-template.md`.

## Outputs

An ordered task list with dependencies, parallel markers, TDD ordering, and acceptance
coverage.

## Stopping conditions

Stop and ask when the plan is missing, when dependencies form a cycle that cannot be
broken, or when an acceptance criterion has no feasible task.

## Verification checklist

- [ ] Each task has a done condition and named files.
- [ ] Dependencies are explicit and acyclic.
- [ ] Parallel-safe tasks are marked.
- [ ] Test tasks precede implementation tasks.
- [ ] Every acceptance criterion maps to a task.

## Related skills/templates

- `skills/core/task-breakdown-from-plan/SKILL.md`, `skills/core/dependency-aware-task-ordering/SKILL.md`
- `templates/tasks-template.md`

## Handoffs / next-step suggestion

After tasks are generated, suggest the likely next command:

- Spec, plan, and tasks all exist → `commands/vibe-analyze.md` to verify spec ↔ plan ↔ tasks
  alignment before any code is written.
- Analysis is clean → clear the implementation-readiness gate
  (`skills/core/checkpoint-validation/SKILL.md`), then `commands/vibe-implement.md`.
- Tasks exposed missing coverage → return to `commands/vibe-plan.md` or `commands/vibe-specify.md`.

## Ghi chú tiếng Việt

Chia plan thành task nhỏ: done condition, `depends-on`, đánh dấu song song, test trước
code, và phủ hết tiêu chí chấp nhận. Dùng `templates/tasks-template.md`. Học ý tưởng từ
`spec-kit`, không copy cú pháp/CLI.
