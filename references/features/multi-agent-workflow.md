# Feature: Multi-agent workflow

## Goal

Define how Vibe Coding OS should support multi-agent workflow as an original local capability while learning from tracked references.

## Reference sources

- yeachan-heo/oh-my-claudecode

## Local implementation

- `skills/agents/architect-agent/SKILL.md`
- `skills/agents/implementer-agent/SKILL.md`
- `skills/agents/reviewer-agent/SKILL.md`
- `skills/agents/tester-agent/SKILL.md`
- `adapters/claude-code/README.md`
- `adapters/codex/README.md`

## Agent ownership

Multi-agent work must start with explicit ownership:

- Assign each agent a file/module responsibility before it edits.
- Keep shared registries, schemas, generated files, migrations, and cross-cutting docs serialized unless one integrator owns them.
- Tell agents they are not alone in the codebase and must not revert edits made by other agents.
- Require agents to adapt to existing concurrent edits or escalate conflicts instead of overwriting.

## Handoff format

Every delegated agent should return a compact handoff with these sections:

```markdown
## Context
- Goal, constraints, assumptions, and any relevant prior decisions.

## Files touched
- Files/modules changed, inspected, or reserved as write scope.

## Decisions
- Important implementation, architecture, review, or testing choices.

## Risks
- Correctness, scope, attribution, sequencing, or verification concerns.

## Verification
- Exact checks run or recommended, results, and limitations.
```

## Parallelization rules

- Parallelize only when write scopes are clearly separated by file/module ownership.
- Do not delegate a blocking critical-path task when the main agent's immediate next step depends on that result.
- Prefer parallel sidecar work such as independent review lanes, read-only exploration, or disjoint implementation slices.
- Use a single owner or ordered sequence for tightly coupled changes.
- Name the main agent as integration owner whenever multiple outputs must be combined.

## Review gates

A reviewer must check these gates before approving:

- Correctness: the change satisfies the spec and preserves existing behavior.
- Scope: the patch stays within assigned ownership and avoids unrelated churn.
- Attribution: external inspiration, copied examples, licenses, notices, and reference updates are clean.
- Tests: relevant checks ran, failures are explained, and missing coverage is visible.

## Conflict handling

- Conflicting outputs are integration inputs, not instructions to overwrite another agent.
- Agents should report affected files, incompatible assumptions, and proposed resolution options.
- The main agent keeps responsibility for final integration, conflict resolution, staging, committing, and final verification.
- If a conflict involves attribution or licensing, pause import/adaptation until the attribution decision is explicit.

## Tool-specific notes

- Claude Code subagents: use for bounded independent roles; pass ownership and handoff requirements in the prompt; keep final synthesis in the main Claude Code conversation.
- Codex delegated agents/workers: assign disjoint write scopes, tell workers not to revert others' edits, and review uploaded changes before integration.
- Cursor manual chat workflows: simulate delegation by opening separate chats with pasted context, one write owner per chat, and a structured handoff back to the main chat.

## Must-have behavior

- Agent roles have clear responsibility boundaries.
- Review and testing roles can challenge implementation.
- Delegation does not create conflicting edits or unclear ownership.
- Handoffs preserve enough context for integration and audit.

## Failure modes

- Copying upstream wording instead of adapting the idea.
- Adding process overhead that does not improve local outcomes.
- Letting a feature become stale because mappings and changelogs are not updated.
- Treating reference popularity as proof that the pattern fits this project.
- Parallelizing overlapping write scopes without an integration owner.

## Update signals

- A tracked source changes its workflow model, command names, or recommended practices.
- Local users repeatedly hit ambiguity, verification gaps, or memory staleness related to this feature.
- A local skill, command, or template changes enough that mappings need to be refreshed.

## Evaluation ideas

- Can an agent find the relevant local files from this feature document in under a minute?
- Does the feature reduce mistakes without adding unnecessary ceremony?
- Are acceptance criteria, verification, and attribution implications visible?
- Can the main agent identify ownership, handoffs, conflicts, and final verification responsibilities from the docs?
