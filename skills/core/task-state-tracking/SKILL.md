# Task State Tracking

## Purpose

Keep task lists executable by tracking each task's current state, dependencies, and next
eligible work item without adding runtime automation.

## State machine

Every task passes through exactly one of seven states. The state machine enforces valid
transitions and prevents skipping verification or recovery work.

| Current state | Valid next states | DONE condition |
| --- | --- | --- |
| **proposed** | approved, abandoned | Task definition complete; dependencies declared |
| **approved** | in-progress, blocked, abandoned | All dependencies `done`; inputs ready |
| **in-progress** | review, blocked, abandoned | Implementation complete; tests pass |
| **review** | done, in-progress (rework), blocked, abandoned | Reviewer confirms criteria met |
| **blocked** | in-progress, approved, abandoned | Blocker resolved or superseded |
| **done** | — (terminal) | All acceptance criteria met + verification passed |
| **abandoned** | — (terminal) | Explicit decision recorded with reason |

Transitions are one-step only — a task cannot jump from `proposed` to `review` without
passing through `approved` and `in-progress`. A `blocked` task may resume at `in-progress`
(when unblocked) or drop back to `approved` (if the original approach is invalidated).

## DONE criteria per state

Each state has a DONE condition that gates the next transition:

- **proposed → approved**: subject, files list, dependencies declared, acceptance criteria
  mapped, a named owner.
- **approved → in-progress**: all dependencies are `done` or confirmed unblocked; required
  inputs and decision records exist.
- **in-progress → review**: implementation complete per plan; tests exist and pass; no
  unresolved merge conflicts in the working tree.
- **review → done**: a reviewer (human or separate agent context) has confirmed acceptance
  criteria are met; verification evidence recorded.
- **→ blocked**: a concrete blocker is named in dependency notes; task carries a `blocked`
  status and a re-evaluation trigger.
- **→ abandoned**: the decision is recorded in the task list with a brief rationale linked
  to the superseding spec or plan change.

## Merge-conflict handling

When a file conflict arises between two `in-progress` tasks (same file edited in parallel),
resolve before either task reaches `review`. Steps: 1) identify the conflict via diff or
worktree collision; 2) apply the `[exclusive]` marker to the contested file retroactively;
3) sequence tasks so only one touches the file at a time; 4) rebase or re-apply the second
task's changes. The merge resolution itself must be verified before either task is `done`.

## Rollback rules

A task in `review` or `done` found to have an incorrect implementation is rolled back by
creating a new rework task (not by re-opening the original). The rework task declares
`depends-on: <original-task>` so observers trace the full history. For `blocked` tasks
that were unblocked but still cannot proceed, set the task back to `blocked` with an
updated blocker note instead of abandoning prematurely. Rollback always produces a
traceable entry in the task list — never an unreported revert.

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
