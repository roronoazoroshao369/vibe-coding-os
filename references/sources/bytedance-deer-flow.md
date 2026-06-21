# Reference: bytedance/deer-flow

## Metadata

- Repo: https://github.com/bytedance/deer-flow
- Owner: bytedance
- Name: deer-flow
- Category: agent-team-orchestration
- Status: tracked
- Import mode: inspiration
- License: MIT, verified from upstream LICENSE via raw GitHub during 2026-06-19 audit
- Last checked: 2026-06-19
- Last known commit: unknown (initial tracking)

## Why this repo matters

`bytedance/deer-flow` is a ByteDance-backed long-horizon SuperAgent harness that orchestrates sub-agents for research, coding, and creation. With 71k stars and MIT licensing, it provides battle-tested patterns for scalable subagent orchestration with sandboxed execution, structured memory, tools, and skills.

## Key concepts

- **SuperAgent harness** — orchestrator agent spawning worker agents for complex, long-horizon tasks.
- **Sandboxed execution environments** — isolated execution for subagents to prevent side effects.
- **Structured memory subsystem** — persistent memory across subagent invocations and sessions.
- **Deep research → code generation pipeline** — structured pipeline from research phase to code generation.
- **Volcengine integration** — large-scale agent orchestration with cloud backend support.
- **Multi-language support** — Python and TypeScript SDKs.

## Features to study

| Feature | Why it matters | Local equivalent | Status |
| --- | --- | --- | --- |
| SuperAgent harness architecture | Provides a scalable pattern for orchestrator-agent spawning worker agents. | `skills/core/subagent-driven-development/SKILL.md`, `skills/core/team-agent-orchestration/SKILL.md` | Inspiration only; not copied. |
| Sandboxed execution | Isolated subagent execution prevents side effects and improves reliability. | `skills/core/subagent-driven-development/SKILL.md` | Inspiration only; not copied. |
| Structured memory in agent harness | Persistent memory across subagent sessions can inform memory architecture. | `skills/memory/memory-ingestion/SKILL.md` | Inspiration only; not copied. |
| Deep research → code pipeline | Structured pipeline from research to implementation can inform workflow design. | `docs/workflows/context-engineering.md`, `skills/core/context-rich-implementation/SKILL.md` | Inspiration only; not copied. |

## Local mapping

This is an initial tracking entry. No local adaptations have been created yet. Future audits may identify specific patterns worth adapting into original Vibe Coding OS skills, commands, or workflow docs.

## Update watchlist

When this upstream repo changes, future agents should inspect:

- changes to SuperAgent harness architecture or subagent lifecycle;
- new sandboxing or isolation patterns;
- changes to memory subsystem design;
- new research-to-code pipeline patterns;
- license, notice, or attribution changes before any closer adaptation;
- examples that reveal user experience gaps without copying their text.

## Do not copy

Future agents must not copy large chunks, prompts, docs, examples, tests, or vendor code from this repository without license review and an explicit local decision. Summarize ideas in original language and map them to Vibe Coding OS needs.

## Last audit notes

- Initial reference file created on 2026-06-19 based on research report upstream-research-report-2026-06-19.md.
- License verified as MIT from upstream LICENSE file.
