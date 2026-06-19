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

## Orchestrator role

For multi-subtask work, designate an orchestrator that owns the task graph, delegates subtasks, monitors lifecycle states, and integrates results. The orchestrator is not a manager role that blocks workers — it is a coordination role that ensures subtask boundaries are respected, dependencies are resolved, and integration validation runs. See `skills/core/superagent-orchestration/SKILL.md` for the full orchestrator pattern with lifecycle states (queued → planning → executing → reviewing → merging → complete).

## Sandbox scoping

Before delegating a write subtask, declare the worker's **sandbox scope**: write zone (files the worker may modify), read-only zone (files the worker may inspect), and forbidden zone (files the worker must not touch). Include a side-effect declaration listing every operation outside pure file writes. Use `templates/sandbox-scope-template.md` and the sandboxed execution skill for the scope declaration discipline. This prevents silent conflicts when multiple workers touch the same repository.

## Error-handling patterns for subagent failures

Subagents can fail silently (wrong output), loudly (crash or timeout), or partially (some work done, some wrong). Handle each case deliberately.

### Detection

- **Silent failure:** Validate subagent output against acceptance criteria before integration. Always run per-subtask gates.
- **Loud failure:** Check return codes, exit signals, and whether expected output files were actually created or modified.
- **Partial failure:** Compare the worker's output against the brief's acceptance criteria item by item. Accept valid portions; reject the rest.

### Recovery strategies

| Failure type | Recovery action |
|---|---|
| Wrong output, no integration yet | Rescope the brief with tighter constraints and re-delegate. |
| Wrong output, already integrated | Revert the affected files from the worker, fix in the orchestrator pass, and add a regression gate. |
| Timeout or crash | Reduce subtask scope, add checkpoint gates inside the subtask, and re-delegate with a simpler brief. |
| Sandbox violation (wrote to forbidden zone) | Revert all files touched by the worker, tighten the brief's forbidden-zone language, and re-delegate to a different worker. |
| Side-effect leak (ran a script instead of making file edits) | Roll back the side effect if possible, add an explicit side-effect declaration requirement to the brief. |

### Prevention

- Split large subtasks into smaller units with intermediate checkpoints.
- Include a "stop if uncertain" instruction in every brief: the worker should block and report ambiguity rather than guess.
- Run dry-run validation before delegation: confirm task boundaries, scopes, and dependencies make sense before a worker starts.
- After a failure, record the pattern in the orchestration retrospective to tune future decomposition.

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
