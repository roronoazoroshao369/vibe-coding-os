# Skill: Subagent-Driven Development

## Purpose

Use separate agent passes or delegated workers for bounded subtasks without losing ownership of integration, review, and verification.

## When to use

Use when independent subtasks can run in parallel, when a reviewer/tester pass can improve quality, or when exploration and implementation can be separated safely.

## Inputs

Main task, accepted plan, independent subtask boundaries, file ownership, expected outputs, validation commands, and integration owner.

## Workflow

1. Decide which task remains on the critical path and keep that work local.
2. Delegate only concrete, bounded subtasks with clear file ownership or read-only questions.
3. Tell each worker they are not alone in the codebase and must not revert others' edits.
4. Keep delegated write scopes disjoint when possible.
5. Integrate returned work deliberately: inspect changed files, resolve conflicts, and run checks.
6. Record which agent/pass did what only when useful for review or handoff.

## Outputs

Delegation brief(s), completed subtask outputs, integrated patch, and verification or review notes.

## Failure modes

- Delegating the immediate blocking task and stalling the main workflow.
- Multiple agents edit the same files without coordination.
- Subagent output is trusted without integration review.
- Parallelism adds complexity without reducing risk or time.

## Verification checklist

- [ ] Subtasks are independent and bounded.
- [ ] File ownership is clear for write tasks.
- [ ] Returned changes were reviewed before finalizing.
- [ ] Final verification covers the integrated result.
