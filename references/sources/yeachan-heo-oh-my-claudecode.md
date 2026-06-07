# Reference: yeachan-heo/oh-my-claudecode

## Metadata

- Repo: https://github.com/yeachan-heo/oh-my-claudecode
- Owner: yeachan-heo
- Name: oh-my-claudecode
- Category: claude-code-workflow
- Status: tracked
- Import mode: adapted
- License: MIT, Copyright (c) 2025 Yeachan Heo. Verified from upstream root LICENSE during the 2026-06-07 audit.
- Last checked: 2026-06-07
- Last known commit: 3e945671dcf3ed1c1bcc422862815f92c1999143

## Why this repo matters

It is tracked as a reference for Claude Code workflow organization. Vibe Coding OS should study how command, agent, and skill collections can be navigable for humans and maintainable by future agents.

## Key concepts

- Claude Code project ergonomics.
- Multi-agent role organization and model/role routing.
- Staged team flow: plan/product-definition, execution, verification, and fix passes.
- Task/message coordination, structured handoffs, watchdog concepts, worktree isolation, and dynamic team scaling.
- Naming and navigation conventions for command libraries.

## Features to study

| Feature | Why it matters | Local equivalent | Status |
| --- | --- | --- | --- |
| Skill orchestration | Helps evaluate whether local workflows are discoverable and reusable. | `CLAUDE.md`, `registry/skills.json`, `skills/meta/using-vibe-coding-os/SKILL.md` | Adapted in original wording. |
| Multi-agent workflow | Clarifies role boundaries, task ownership, handoffs, and separate verification lanes. | `skills/core/subagent-driven-development/SKILL.md`, `skills/core/team-agent-orchestration/SKILL.md`, `commands/vibe-team.md` | Adapted in original wording. |
| Team coordination concepts | Provides portable ideas for staged team flow, task/message coordination, handoffs, watchdogs, worktree isolation, and dynamic scaling. | `docs/workflows/team-agent-orchestration.md`, `templates/team-architecture-template.md` | Markdown-only; no runtime copied. |
| Review before merge | Reinforces author/reviewer/tester separation and no self-approval. | `skills/core/review-before-merge/SKILL.md`, `skills/agents/reviewer-agent/SKILL.md`, `skills/agents/tester-agent/SKILL.md` | Adapted in original wording. |

## Local mapping

The current local targets connected to this source are:

- `CLAUDE.md`
- `skills/agents/architect-agent/SKILL.md`
- `skills/agents/implementer-agent/SKILL.md`
- `skills/agents/reviewer-agent/SKILL.md`
- `skills/agents/tester-agent/SKILL.md`
- `skills/core/team-agent-orchestration/SKILL.md`
- `commands/vibe-team.md`
- `templates/team-architecture-template.md`
- `docs/workflows/team-agent-orchestration.md`
- `references/features/team-agent-orchestration.md`
- `adapters/claude-code/README.md`

## Update watchlist

When this upstream repo changes, future agents should inspect:

- changes to workflow structure, command naming, and agent-facing instructions;
- new patterns that reduce ambiguity, improve verification, or improve memory hygiene;
- removed or deprecated concepts that indicate a local idea may need re-evaluation;
- license, notice, or attribution changes before any closer adaptation;
- examples that reveal user experience gaps without copying their text.

## Do not copy

Future agents must not copy large chunks, prompts, docs, examples, tests, or vendor code from this repository without license review and an explicit local decision. Summarize ideas in original language and map them to Vibe Coding OS needs.

## Last audit notes

- Initial reference file created.
