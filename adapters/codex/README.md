# Codex Adapter

Use `AGENTS.md` as the primary coding-agent instruction file. Keep changes small, cite files in final responses when required by the environment, and run `npm run validate` after editing framework structure. Use skills as task-specific procedures rather than permanent hidden context.

## Agent ownership

When spawning Codex delegated agents or workers, assign ownership by file/module and responsibility. Tell workers they are not alone in the codebase, must not revert edits made by others, and must accommodate concurrent changes. Keep shared registries, generated files, and cross-cutting docs under one owner unless the write scopes are explicitly separated.

## Handoff format

Require each delegated agent/worker to return:

```markdown
## Context
- Goal, constraints, and assumptions.

## Files touched
- Files/modules changed or inspected.

## Decisions
- Key choices and rationale.

## Risks
- Correctness, scope, attribution, sequencing, or verification concerns.

## Verification
- Exact checks run, results, and limitations.
```

## Parallelization rules

Delegate in parallel only for sidecar work or implementation slices with disjoint write scopes. Do not delegate the immediate blocking critical-path task if the main rollout must wait for that exact result before doing anything useful. Keep urgent, tightly coupled, or integration-heavy work local.

## Review gates

Reviewer agents must check correctness, scope, attribution, and tests before approval. Verification agents should report exact commands and limitations so the main agent can cite final checks accurately.

## Conflict handling

If delegated outputs conflict, the main Codex agent owns integration. Review the returned changes, preserve other agents' edits, decide the resolution, and rerun relevant validation before committing.

## Tool-specific notes

- Claude Code subagents: map this workflow to bounded subagent prompts with explicit ownership and structured handoff requirements.
- Codex delegated agents/workers: prefer concrete, bounded subtasks; workers should edit only their owned files and list changed paths in the final answer.
- Cursor manual chat workflows: emulate delegation with one manual chat per write scope and paste each handoff into the main chat for integration.
