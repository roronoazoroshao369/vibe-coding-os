# Core vs Optional Runtime

Vibe Coding OS has two layers:

1. **Core portable layer**: markdown-first guidance that any Claude-compatible workflow can read and follow.
2. **Optional runtime layer**: small local Node helpers for users who want machine-readable task, memory, checkpoint, team, or MCP state.

The core is the product. The runtime is a companion.

See also: [`docs/adr/0001-optional-runtime-layer.md`](../adr/0001-optional-runtime-layer.md).

## Core portable layer

The core layer is:

- `skills/`
- `commands/`
- `templates/`
- `docs/`
- `references/`
- root guidance such as `CONSTITUTION.md`, `STANDARDS.md`, `ROADMAP.md`, `CLAUDE.md`, and `AGENTS.md`

Properties:

- zero runtime dependencies;
- always usable after checkout;
- markdown-first and inspectable;
- portable across Claude Code and other agent harnesses;
- driven by reading, behavior, checklists, and validation habits;
- safe to adapt from upstream ideas using original wording and attribution.

This layer is where upstream practices should usually land.

## Optional runtime layer

The optional runtime includes local scripts and modules such as:

- `runtime/*.mjs`
- `runtime/core/*.mjs`
- `runtime/tasks/*.mjs`
- `runtime/memory/*.mjs`
- `runtime/checkpoints/*.mjs`
- `runtime/teams/*.mjs`
- `scripts/runtime-*.mjs`

It supports commands like:

```bash
npm run runtime:init
npm run runtime:validate
npm run runtime:task
npm run runtime:memory
npm run runtime:checkpoint
npm run runtime:team
npm run runtime:mcp
npm run runtime:team-run
```

Properties:

- opt-in;
- minimal dependencies;
- local JSON-first state under `.omc/runtime/`;
- no mandatory daemon, database, hosted service, vector store, or external account;
- disposable companion state, not the durable source of truth;
- never the place to vendor upstream engines.

Runtime additions must pass the engine-vs-skill gate in [`docs/UPSTREAM_ADOPTION_POLICY.md`](../UPSTREAM_ADOPTION_POLICY.md).

## Comparison

| Dimension | Portable core | Optional runtime |
| --- | --- | --- |
| Nature | Skills, commands, templates, docs, references, conventions. | Local Node CLI helpers and JSON state. |
| Dependencies | None beyond reading files. | Node/npm; specific adapters may need extra local tools. |
| Required? | Yes. This is the default Vibe Coding OS experience. | No. Users opt in per command. |
| External-source adoption | Adapt ideas into original local prose and artifacts. | Do not vendor upstream engines; only small local helpers or adapter contracts. |
| Test / validation | Markdown/reference validation, checklist review, behavior verification by agents. | Runtime smoke tests, JSON schema checks, CLI checks, plus normal repo validation. |
| Enable | Clone/read/use skills and commands. | Run `npm run runtime:*` commands after checkout/setup. |

## Boundary rules

- If a feature can be expressed as an instruction, checklist, template, command prompt, or reference mapping, keep it in the core.
- If a feature needs local machine-readable state, consider optional runtime.
- If a feature needs an upstream daemon, hosted service, database, queue, team engine, or installer, reject runtime adoption by default.
- If an adapter is useful, keep the adapter boundary small and removable.
- The runtime may support the core; it must not replace it.
- MCP tool adapters (see `adapters/mcp/`) follow the same rule: define the contract and markdown-first default in core, provide an optional MCP harness as an adapter for agents that support the protocol. The core skill works without MCP; the adapter accelerates it.

## Examples

| Candidate | Preferred layer | Reason |
| --- | --- | --- |
| Review checklist from an engineering skills repo | Core | It is behavior guidance, not a capability engine. |
| Spec-to-task traceability template | Core | Markdown artifact works everywhere. |
| Local task dependency lookup | Optional runtime | Machine-readable task state can be useful, but is not required. |
| Upstream team/swarm engine | Reject runtime | Too much engine surface; adapt only portable team patterns. |
| Vector memory service | Adapter-only or reject runtime | Requires explicit opt-in and privacy review; core memory remains markdown/local-first. |

## Frozen runtime scope

The optional runtime scope is **frozen** at: task, memory, checkpoint, team-runner, and mcp. Do not expand it without passing the Engine Adoption Gate in [`docs/UPSTREAM_ADOPTION_POLICY.md`](../UPSTREAM_ADOPTION_POLICY.md). New capability ideas land in the core layer first.

## Which team runner?

"Team" maps to three different things. Pick by intent:

| You want to... | Use | Requirements |
| --- | --- | --- |
| Run an interactive multi-agent session now, with live coordination | Claude Code native `/team` | Claude Code |
| Apply staged team discipline (roles, separate verify lane, no self-approval) as guidance | OMC `/team` skill | oh-my-claudecode available |
| Drive a saved team spec through local terminal panes and collect outputs to JSON state | Repo `npm run runtime:team-run` | `tmux` on `PATH`; a team spec imported into the team-store |

**Default = native** (optionally guided by the OMC `/team` skill). Reach for `npm run runtime:team-run` only when you specifically want local `tmux` automation; it is opt-in and experimental. Full contract: [`docs/workflows/runtime-team-runner.md`](runtime-team-runner.md); deeper disambiguation: [`docs/workflows/team-runner-choice.md`](team-runner-choice.md).

## Ghi chú tiếng Việt

Core là phần chính: skill, command, template, docs, references, không cần dependency. Runtime chỉ là lớp tùy chọn dùng `npm run runtime:*` để ghi trạng thái local; không dùng runtime để nhập engine upstream. Phạm vi runtime bị đóng băng (task/memory/checkpoint/team-runner/mcp); muốn mở rộng phải qua Engine Adoption Gate. Có ba thứ tên "team": `/team` native, skill `/team` của OMC, và `npm run runtime:team-run` (tmux local, tùy chọn) — mặc định dùng native.