# Skill: Using Git Worktrees

## Purpose

Isolate risky or parallel work so multiple branches can be developed, tested, or reviewed without corrupting the main checkout.

## When to use

Use when work may conflict with current changes, when comparing approaches, when running parallel agent passes, or when a user explicitly requests isolated branch work.

## Inputs

Repository status, desired branch name, base branch or commit, current uncommitted changes, and cleanup expectations.

## Workflow

1. Inspect `git status` and existing worktrees before creating anything.
2. Choose a descriptive branch and worktree path that reflects the task.
3. Create the worktree from the correct base without moving or overwriting user changes.
4. Run implementation and validation inside the isolated worktree.
5. Keep artifacts, logs, and commits scoped to the worktree branch.
6. When finished, report the branch, path, validation status, and cleanup recommendation.

## Outputs

An isolated branch/worktree ready for focused work, plus a handoff note describing path, base, status, and cleanup steps.

## Failure modes

- Creating a worktree from the wrong base.
- Hiding or overwriting uncommitted user changes.
- Forgetting which checkout contains the final patch.
- Leaving stale worktrees without a cleanup note.

## Verification checklist

- [ ] `git status` was inspected first.
- [ ] Branch and worktree path are named clearly.
- [ ] No user changes were moved or discarded.
- [ ] Final report names the active branch/path and cleanup state.
