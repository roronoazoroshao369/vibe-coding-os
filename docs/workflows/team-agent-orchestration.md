# Team-Agent Orchestration Workflow

Team-Agent Orchestration is the Vibe Coding OS workflow for turning broad work into a temporary, accountable team. It borrows only portable ideas from orchestration systems: clear roles, explicit task ownership, progressive context, handoffs, and separate verification lanes. It does not add a runtime engine.

Use the operating procedure in `skills/core/team-agent-orchestration/SKILL.md`, the command entry point in `commands/vibe-team.md`, and the planning artifact in `templates/team-architecture-template.md`.

## Where it fits

Adaptive Flow controls whether teams are worth the ceremony:

- `tiny` / `small`: do not use a team.
- `medium`: use `vibe-subagents` only for bounded read-only exploration or review.
- `large`: use a team when work spans domains or benefits from parallel lanes.
- `risky`: use a team or equivalent separate review/test lane; authoring cannot self-approve.

## Core loop

```text
Domain Analysis
→ Team Architecture Design
→ Role Brief Generation
→ Skill / Checklist Generation when reusable
→ Integration & Orchestration
→ Validation & Testing
→ Retrospective / Memory
```

## Portable patterns

| Pattern | Good fit | Local example |
| --- | --- | --- |
| Pipeline | Ordered phases. | spec audit → plan → tasks → implementation → review. |
| Fan-out / fan-in | Same question across many areas. | docs/skills/registries inspected in parallel, one synthesis. |
| Expert Pool | Distinct risk lenses. | security, test, docs, attribution reviewers. |
| Producer-Reviewer | Patch needs independent challenge. | implementer writes, reviewer tries to reject, tester proves. |
| Supervisor | Many tasks need coordination. | team lead owns task graph and unblocks workers. |
| Hierarchical Delegation | Very broad domain. | domain leads summarize sub-areas to one integrator. |

## Progressive disclosure

Do not paste the whole repo into every role. Give each worker:

1. the task intent and acceptance criteria;
2. only relevant file paths or excerpts;
3. constraints, non-goals, and attribution limits;
4. their write scope and forbidden scope;
5. the handoff contract;
6. validation commands they own.

The integrator keeps the full picture.

## Validation model

Team output is not done when workers finish. It is done when the integrated result passes checks.

Validation has two layers:

- **Dry-run validation:** before spawning or delegating, confirm task boundaries, scopes, dependencies, and handoffs make sense.
- **With-vs-without comparison:** after completion, ask whether the team lowered risk or only added ceremony. Use that result to tune future team use.

## Runtime non-goals

This workflow does not vendor or require upstream orchestration runtimes, tmux/session control, mailbox systems, hook daemons, installers, generated agent folders, or command engines. Those can inspire local markdown patterns, but Vibe Coding OS remains docs/prompts/skills/templates only. Native team spawning is available only in environments that separately install a runtime such as the OMC plugin; this repo itself provides markdown guidance, not that runtime.

## Failure modes

- Workers edit shared files without an integrator.
- Team roles duplicate each other and create noise.
- Reviewers approve authoring from the same context.
- Handoffs omit validation status.
- Attribution/reference files are updated by multiple workers inconsistently.
- Runtime features are documented as if Vibe Coding OS can enforce them.

## Ghi chú tiếng Việt

Workflow này dùng team-agent cho việc lớn/rủi ro: phân tích domain, thiết kế team, giao role, orchestration, verify, rồi rút kinh nghiệm. Chỉ lấy ý tưởng portable như role rõ ràng, handoff, progressive context, reviewer/tester riêng. Không vendor runtime, tmux, hook daemon, mailbox, installer, hay generated agents/skills từ upstream.
