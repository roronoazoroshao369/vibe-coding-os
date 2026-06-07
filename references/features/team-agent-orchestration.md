# Feature: Team-agent orchestration

## Goal

Describe how Vibe Coding OS coordinates temporary teams of agents for broad or risky work while remaining a markdown-first, no-runtime framework.

## Reference sources

- yeachan-heo/oh-my-claudecode
- revfactory/harness
- obra/superpowers

## Local implementation

- `skills/core/team-agent-orchestration/SKILL.md`
- `commands/vibe-team.md`
- `templates/team-architecture-template.md`
- `docs/workflows/team-agent-orchestration.md`
- `skills/core/subagent-driven-development/SKILL.md`
- `references/features/multi-agent-workflow.md`

## Must-have behavior

- Team use is proportional to task size and risk.
- Domain analysis precedes role assignment.
- Team patterns are explicit: Pipeline, Fan-out/Fan-in, Expert Pool, Producer-Reviewer, Supervisor, Hierarchical Delegation.
- Role context is progressively disclosed, not dumped wholesale.
- One integrator owns shared files, conflict resolution, final verification, and attribution hygiene.
- Validation includes dry-run checks and with-team vs without-team comparison.

## Non-goals

- No upstream runtime, CLI engine, hook daemon, tmux/session manager, mailbox, generated `.claude/agents`, generated `.claude/skills`, or installer is vendored.
- No direct upstream prose, prompt text, or code is copied.

## Failure modes

- Treating runtime features as locally enforceable.
- Spawning many agents without disjoint scopes or a task graph.
- Letting authoring and approval happen in the same lane.
- Updating registries/references from multiple workers without one integrator.

## Update signals

- Team/subagent instructions change.
- New upstream orchestration pattern appears that is prompt-portable.
- Local users hit coordination conflicts, stale handoffs, or unclear ownership.

## Evaluation ideas

- Can an agent fill the team architecture template before delegation?
- Do role briefs prevent overlapping edits?
- Does final verification cover the integrated result?
- Does the retrospective say whether the team was worth it?
