# Vibe Coding OS

[![Validate Repository](https://github.com/roronoazoroshao369/vibe-coding-os/actions/workflows/validate.yml/badge.svg)](https://github.com/roronoazoroshao369/vibe-coding-os/actions/workflows/validate.yml)
[![Adapter Smoke Tests](https://github.com/roronoazoroshao369/vibe-coding-os/actions/workflows/smoke-test.yml/badge.svg)](https://github.com/roronoazoroshao369/vibe-coding-os/actions/workflows/smoke-test.yml)

> **Workflow contract first. Runtime optional. Human intent stays sovereign.**

<p align="right">
  <a href="README.md">English</a> · <a href="README.vi.md">Tiếng Việt</a>
</p>

### Why this matters

AI coding assistants can generate code fast — but speed without structure leads to scope creep, forgotten edge cases, and unmaintainable output. Vibe Coding OS adds a lightweight discipline layer on top: spec-driven workflows, verification gates, and engineering practices that keep human intent sovereign while letting you ship at AI speed.

**Current release (v2.8.0):** validate:all 26/26 gates PASS · **128 skills** · **96 commands** · **93 templates** · **20 tracked sources** · 8 adapters (Claude Code, Codex, Cursor, Gemini, Cline, Continue, Aider, Windsurf)

**Latest:** v2.8.0 Adapter Expansion — 8 adapters (Claude Code, Codex, Cursor, Gemini, Cline, Continue, Aider, Windsurf)

---

**Vibe Coding OS** is a Claude/Codex-friendly skill framework for one person who wants to move fast with AI coding assistants without giving up engineering discipline. It is markdown-first, dependency-light, and usable as plain instructions, prompts, and templates.

It is not a required wrapper, product, hosted service, or mandatory agent runtime. It is a portable operating system for AI-assisted software work: reusable skills, command prompts, templates, registries, adapters, reference maps, and optional local runtime helpers that help a human and an AI assistant repeatedly turn intent into reliable code.

> **On the name:** "Vibe coding" usually means fast, unstructured AI-assisted coding. Vibe Coding OS is the discipline counterpart — spec-first, verification-gated, and engineering-rigorous. Same speed, but with guardrails.

---

## Start here

**First workflow CTA:** If you are new, start with [First Workflow](docs/FIRST-WORKFLOW.md) and run one complete `spec → plan → verify` loop before exploring runtime or maintainer tooling.

| New to Vibe Coding OS | You want |
|---|---|
| [First Workflow](docs/FIRST-WORKFLOW.md) | Run one complete `spec → plan → verify` loop |
| [Quality Shield](docs/quality-shield.md) | Use the portable quality discipline layer for intent, context, verification, and self-review |
| [Expert Mode](docs/expert-mode.md) | Escalate risky work to adversarial review, critique passes, task-specific quality packs, and writer-critic patterns |
| [Smart Adapt](docs/smart-adapt.md) | Adapt prompt stacks to task risk, model weaknesses, and lessons learned |
| [Quality Engine](docs/quality-engine-guide.md) | Run orchestrated quality gates, timing reports, and targeted fix recommendations |
| [Model-Aware Config](docs/model-aware-config-guide.md) | Configure Quality Engine gates from model capability, task risk, and project settings |
| [Quality Telemetry](docs/quality-telemetry-guide.md) | Emit local quality events, aggregate session metrics, and generate trend reports |
| [Multi-Repository Learning](docs/multi-repo-learning.md) | Export, review, and import portable lesson exchange batches across repositories |
| [Advanced Orchestration](docs/orchestration-guide.md) | Run stage-gated multi-agent workflows for feature, bugfix, and security-audit delivery |
| [Quickstart](docs/QUICKSTART.md) | 10-minute setup for Claude Code, Codex, or Cursor |
| [Adapter hub](docs/adapters/README.md) | Tool-specific setup docs for Claude Code, Codex, Cursor, and Gemini |
| [Tutorial](docs/TUTORIAL.md) | 15-minute zero-to-workflow walkthrough |
| [Install guide](INSTALL.md) | Full installation options (plugin, clone, CLI, zero-runtime) |
| [Examples](examples/) | Complete sample workflows |
| [Tiếng Việt](docs/vi/index.md) | Onboarding và hướng dẫn tiếng Việt |

---

## Default workflow

Use this loop for substantial work:

```text
Intent → Spec → Plan → Implement → Test → Review → Memory → Merge
```

- **Intent** — capture what the human wants and why.
- **Spec** — define behavior, constraints, non-goals, acceptance criteria.
- **Plan** — break the change into reviewable tasks and verification steps.
- **Implement** — make focused edits that match the plan.
- **Test** — run the smallest meaningful checks first, then broader validation.
- **Review** — inspect the diff for correctness, simplicity, security, and maintainability.
- **Memory** — record durable decisions, gotchas, and follow-ups.
- **Merge** — ship only after verification status is clear.

---

## What's new in v2.8.0

Adapter Expansion — từ 4 → 8 adapters:

- **4 new tool adapters**: Cline, Continue.dev, Aider, Windsurf
- **Cline adapter**: `.clinerules`, mode-specific rules (architect/ask/code), MCP native, skills directory
- **Continue.dev adapter**: AGENTS.md per-directory, slash commands (`/spec`, `/plan`, `/implement`), config.example.json
- **Aider adapter**: CONVENTIONS.md conventions, `.aider.conf.yml`, architect/editor mode, lint integration
- **Windsurf adapter**: `.windsurfrules`, Cascade agent, Flows, Deep Context, legacy `.cursorrules` compat
- **Compatibility matrix** expanded to 8 tools + docs hub + install snippets
- **Runtime unchanged:** v2.8.0 respects ADR 0002.

## What's new in v2.7.0

AI Testing Suite — automated quality infrastructure for the framework:

- **Property-based testing**: schema + runner (`npm run test:property`)
- **Benchmark harness**: per-gate timing + regression trends (`npm run benchmark:gates`)
- **Test generator**: auto-generates property tests from existing skills (`npm run test:generate`)
- **Quality trend dashboard**: time-series from telemetry (`npm run dashboard:trend`)
- **PR quality comment**: GitHub Actions auto-posts quality summary on PR
- **Runtime unchanged:** v2.7.0 respects ADR 0002.

## What's new in v2.6.0

Full Reference Implementation — 20 reference sources fully processed across 10 batches:

- **20 sources** implemented: Deer-Flow, Code-Review-Graph, Antigravity, Best-Practice 58k★, Supermemory, ECC, CCPM, BMAD, Agent-OS, planning-with-files, lean-ctx + 9 deep sources
- **43 new files, 70 modified**, +2,312 lines
- **SuperAgent orchestration** — orchestrator→worker lifecycle, sandboxed execution
- **Code intelligence review** — call graph + dep map, delta-only incremental review
- **Plugin bundle system** — bundles.json + skill categories + multi-platform adapter guide
- **Proficiency path** — 4-level with maturity badges in registry
- **Memory depth** — 5-phase ingestion, 6-phase retrieval, provider interface
- **7-state task machine** — full state machine with rollback rules
- **Crash-proof planning** — YAML frontmatter + bracket markers + recovery workflows
- **Context policy/DLP** — allow/block/flag ingress/egress rules
- **Runtime unchanged:** v2.6.0 respects ADR 0002.

## What's new in v2.5.0

Advanced Orchestration adds schema-backed, stage-gated workflows for complex feature work, bugfixes, security audits, and multi-agent delivery. v2.5.0 also marks the roadmap 100% complete through v2.5.

- **Orchestration workflow schema:** `schemas/orchestration-workflow.json` defines stages, agent roles, inputs, outputs, triggers, retry policies, and gate references.
- **Workflow runner:** `scripts/orchestrate-workflow.mjs` executes workflows with `--workflow`, `--dry-run`, and `--output-json`.
- **Workflow templates:** `templates/workflow-simple-feature.json`, `templates/workflow-bugfix.json`, and `templates/workflow-security-audit.json`.
- **Orchestration skill:** `skills/core/orchestration-workflows/SKILL.md` documents stage-gated workflow discipline.
- **`vibe-orchestrate` command:** `commands/vibe-orchestrate.md` provides the command entry point.
- **Canonical guide:** `docs/orchestration-guide.md` explains usage, failure modes, reports, and quality-gate integration.
- **Registry sync:** orchestration skill and `vibe-orchestrate` command are registered in `registry/skills.json` and `registry/prompts.json`.
- **Roadmap complete:** v1.7→v2.5 is fully complete with 26/26 validation gates passing and no runtime expansion beyond ADR 0002.

---

## What's new in v2.3.0

Multi-Repository Learning turns local lessons learned into a portable exchange format — export lessons from one repository, inspect or filter them, and import useful patterns into another repository's lessons database.

- **Multi-Repository Learning skill:** `skills/core/multi-repo-learning/SKILL.md` documents exporting, checking, and importing lesson exchange batches.
- **`vibe-lesson-exchange` command:** `commands/vibe-lesson-exchange.md` provides export, check, and import interfaces.
- **Canonical guide:** `docs/multi-repo-learning.md` explains the full workflow: quality check, export, safety review, dry-run, and import.
- **Lesson exchange schema:** `schemas/lesson-exchange-format.json` defines the portable format for single lessons and exchange batches.
- **Package scripts:** `lesson:export`, `lesson:import`, `lesson:check` are wired and ready.
- **Registry sync:** multi-repo-learning skill and vibe-lesson-exchange command are registered in `registry/skills.json` and `registry/prompts.json`.
- **Runtime unchanged:** v2.3.0 respects ADR 0002 and does not require a daemon or hosted service.

---

## What's new in v2.2.0

Quality Telemetry & Analytics makes quality observable at the local level — emit events from engine runs, aggregate session metrics, and generate trend reports for continuous improvement.

- **Quality Telemetry skill:** `skills/core/quality-telemetry/SKILL.md` documents collecting local quality telemetry from engine runs.
- **`vibe-quality-telemetry` command:** `commands/vibe-quality-telemetry.md` provides emit, metrics, and trend-report interfaces.
- **Canonical guide:** `docs/quality-telemetry-guide.md` explains the event schema, emit workflow, session aggregation, trend reporting, and privacy patterns.
- **Package scripts:** `quality:emit-event`, `quality:session-metrics`, `quality:trend-report` scripts are wired and ready.
- **Registry sync:** quality-telemetry skill and command are registered in `registry/skills.json` and `registry/prompts.json`.
- **Runtime unchanged:** v2.2.0 respects ADR 0002 and does not require a daemon or hosted service.

---

## What's new in v2.1.0

Model-Aware Config makes Quality Engine gate selection sensitive to model capability, task risk, and project constraints before execution.

- **Model-aware gate selection:** choose lean/heavy/custom gate profiles from declared model capability and task risk.
- **Skill + command:** `skills/core/model-aware-config/SKILL.md` and `commands/vibe-model-config.md` document the workflow.
- **Canonical guide:** `docs/model-aware-config-guide.md` explains profiles, inputs, examples, and Quality Engine integration.
- **Registry sync:** Model-Aware Config skill and command are registered in `registry/skills.json` and `registry/prompts.json`.
- **Runtime unchanged:** v2.1.0 respects ADR 0002 and does not require a daemon or hosted service.

---

## Onboarding paths: User, Maintainer, Optional Runtime

- **User path (default):** Use the markdown-first core with **zero runtime**. Install the Claude Code plugin, copy the adapter files for Codex/Cursor/Gemini, or use skills, commands, and templates as plain instructions. No `npm install`, daemon, database, MCP server, or tmux session is required.
- **Maintainer/contributor path:** Clone the repo when you want to edit skills, commands, templates, docs, adapters, registries, or validation scripts. Use `npm install` and validation commands only for repo maintenance and contribution work.
- **Optional runtime path:** Enable runtime only when you explicitly need local JSON state for tasks, memory, checkpoints, teams, sessions, daemon workflows, MCP tools, or a tmux team runner.

The **core** is the product identity; the **runtime** is opt-in and frozen-scope under ADR 0002.

See [`docs/workflows/core-vs-optional-runtime.md`](docs/workflows/core-vs-optional-runtime.md) for the detailed boundary.

---

## What's included

**128 skills**, **96 commands**, **93 templates**, **20 tracked inspiration sources**, **8 adapters**, and an optional runtime layer.

| Layer | What it does |
|---|---|
| **Spec-driven workflow** | Constitution → specify → plan → tasks → checkpoints → implementation-readiness gates |
| **Adaptive flow** | Tiny / small / medium / large / risky workflow tiers |
| **Real engineering skills** | Grilling, PRD, ADRs, TDD, diagnosis, review, branch finishing |
| **Prompt discipline** | Karpathy-style think / simplicity / surgical / goal-driven rules |
| **Quality Shield** | Portable markdown-first quality discipline: rubric, execution contract, context pack, verification honesty, self-review, and scorecards |
| **Team-agent orchestration** | Role templates, handoffs, watchdogs, scaffold generation |
| **Memory layer** | Session capture, summarization, privacy filtering, progressive retrieval, citations |
| **Reference intelligence** | Source index, attribution, feature maps, update-impact maps, changelogs |
| **Optional runtime** | JSON stores, task/memory/checkpoint/team/session CLI, daemon, MCP server, tmux runner, vector search |

---

## Quick start by tool

### Claude Code — install as plugin (global Claude Code scope, recommended)

```text
/plugin marketplace add https://github.com/roronoazoroshao369/vibe-coding-os
/plugin install vibe-coding-os
```

After install, skills auto-activate and commands are available as `/vibe-*`. For project-local setup instead, use `vibe init --tool claude-code --scope recommended --current-terminal`; see [setup scope guide](docs/setup-scope-guide.md).

<details>
<summary>Shell installer fallback</summary>

```bash
curl -fsSL https://raw.githubusercontent.com/roronoazoroshao369/vibe-coding-os/main/install.sh | bash
```

</details>

### Claude Code — manual (no plugin)

```bash
# Option A — point Claude Code at this repo
git clone https://github.com/roronoazoroshao369/vibe-coding-os ~/vibe-coding-os
cd ~/vibe-coding-os && claude

# Option B — use it inside YOUR project
cp ~/vibe-coding-os/CLAUDE.md ./CLAUDE.md
# then reference skills/commands by path in your prompts
```

### Codex CLI

```bash
git clone https://github.com/roronoazoroshao369/vibe-coding-os ~/vibe-coding-os
cp ~/vibe-coding-os/AGENTS.md ./AGENTS.md   # Codex reads AGENTS.md
```

### Gemini CLI

```bash
cp ~/vibe-coding-os/AGENTS.md ./GEMINI.md
```

### Cursor / other assistants

Paste the contents of `CLAUDE.md` into your project rules (e.g. `.cursorrules`), then paste individual `commands/*.md` prompts per phase.

Adapter docs:

- `adapters/claude-code/` — Claude Code plugin/manual usage
- `adapters/codex/` — Codex CLI instruction surface
- `adapters/cursor/` — Cursor project rules workflow
- `adapters/gemini/` — Gemini CLI instruction surface
- `adapters/hooks/` — optional hook contracts
- `adapters/memory/` — optional memory adapter plans

See the [`docs/adapters/README.md`](docs/adapters/README.md) hub for tool-specific setup details.

---

## Validation

This repository is intentionally dependency-light. Run validation after any structural edit:

```bash
npm run validate        # core structural checks (4 gates)
npm run validate:all    # full validation (26 gates)
```

**Coverage honesty labels:**

- **COVERED-tooling** — enforced by a script that exits non-zero on violation
- **COVERED-advice** — guidance in a SKILL.md, command, or template; value depends on actually applying it

See [`docs/SECURITY-MODEL.md`](docs/SECURITY-MODEL.md) for the trust model and [`docs/support-matrix.md`](docs/support-matrix.md) for compatibility.

---

## Philosophy

1. **Human intent stays sovereign.** The assistant may propose, but it must not invent requirements or silently expand scope.
2. **Small correct changes beat grand rewrites.** Prefer the smallest useful step that can be reviewed and verified.
3. **Specs are thinking tools, not bureaucracy.** Use just enough structure to remove ambiguity.
4. **Verification is part of done.** Never claim success without tests, validation, or an explicit limitation.
5. **Memory should be useful, current, and safe.** Store durable decisions and context, not secrets or irrelevant transcripts.
6. **Attribution is a first-class artifact.** Ideas may be inspired by public work, but imported content must be tracked before it is used.

---

## Optional runtime

The runtime stores local JSON state under `.omc/runtime/` and never auto-starts.

```bash
npm run runtime:install    # bootstrap
npm run runtime:init       # initialise
npm run runtime:validate   # validate collections
```

| Need | Script |
|---|---|
| Task state | `npm run runtime:task` |
| Local memory | `npm run runtime:memory` |
| Checkpoints | `npm run runtime:checkpoint` |
| Team orchestration | `npm run runtime:team` |
| Session capture | `npm run runtime:session` |
| MCP stdio server | `npm run runtime:mcp` |
| Tmux team runner | `npm run runtime:team-run` |

See [`docs/RUNTIME-GUIDE.md`](docs/RUNTIME-GUIDE.md) for full runtime documentation.

---

## Reference Intelligence Layer

Before adapting upstream ideas:

1. Read `references/index.json`
2. Read the source document in `references/sources/`
3. Inspect feature docs in `references/features/`
4. Inspect mappings in `references/mappings/`
5. Run `npm run validate:references`

Rule: study patterns, rewrite in local language, and do not vendor upstream code/docs/prompts without license and attribution. See [`docs/UPSTREAM_ADOPTION_POLICY.md`](docs/UPSTREAM_ADOPTION_POLICY.md).

---

## Adapted methodology sources

Vibe Coding OS studies and adapts ideas from the following projects without vendoring their code:

- [`obra/superpowers`](https://github.com/obra/superpowers) — composable-skill methodology, brainstorming before coding, TDD, review exchange
- [`github/spec-kit`](https://github.com/github/spec-kit) — spec-driven development, constitution → plan → tasks lifecycle
- [`mattpocock/skills`](https://github.com/mattpocock/skills) — real engineering practices: grilling, ADRs, diagnosis, handoff
- [`thedotmack/claude-mem`](https://github.com/thedotmack/claude-mem) — persistent context: session capture, privacy filtering, observation citations

All adaptations are documented in `references/sources/` and `references/mappings/`. No upstream templates, prompts, or CLI tools are required.

---

## Documentation map

**Core docs:**
- [`docs/FIRST-WORKFLOW.md`](docs/FIRST-WORKFLOW.md) — first workflow walkthrough
- [`docs/QUICKSTART.md`](docs/QUICKSTART.md) — tool-specific quickstart
- [`docs/adapters/README.md`](docs/adapters/README.md) — adapter hub
- [`docs/quality-shield.md`](docs/quality-shield.md) — Quality Shield guide and audit map
- [`docs/expert-mode.md`](docs/expert-mode.md) — Expert Mode escalation guide
- [`docs/smart-adapt.md`](docs/smart-adapt.md) — Smart Adapt guide (v1.9)
- [`docs/quality-engine-guide.md`](docs/quality-engine-guide.md) — Quality Engine guide (v2.0)
- [`docs/model-aware-config-guide.md`](docs/model-aware-config-guide.md) — Model-Aware Config guide (v2.1)
- [`docs/quality-telemetry-guide.md`](docs/quality-telemetry-guide.md) — Quality Telemetry guide (v2.2)
- [`docs/multi-repo-learning.md`](docs/multi-repo-learning.md) — Multi-Repository Learning guide (v2.3)
- [`docs/TUTORIAL.md`](docs/TUTORIAL.md) — 15-minute tutorial
- [`INSTALL.md`](INSTALL.md) — installation options
- [`skills/README.md`](skills/README.md), [`commands/README.md`](commands/README.md), [`templates/README.md`](templates/README.md), [`registry/README.md`](registry/README.md) — layer READMEs
- [`docs/DASHBOARD.md`](docs/DASHBOARD.md) — project health dashboard
- [`docs/ROADMAP-STATUS.md`](docs/ROADMAP-STATUS.md) — version progress
- [`CHANGELOG.md`](CHANGELOG.md) — version history

**Vietnamese docs:**
- [`docs/vi/index.md`](docs/vi/index.md) — tổng quan, quick start, glossary
- [`docs/vi/FIRST-WORKFLOW.md`](docs/vi/FIRST-WORKFLOW.md) — hướng dẫn workflow đầu tiên
- [`docs/vi/TUTORIAL.vi.md`](docs/vi/TUTORIAL.vi.md) — tutorial tiếng Việt

**Runtime & advanced:**
- [`docs/RUNTIME-GUIDE.md`](docs/RUNTIME-GUIDE.md) — optional runtime guide
- [`docs/SECURITY-MODEL.md`](docs/SECURITY-MODEL.md) — trust and security model
- [`docs/RELEASE-PACKAGING.md`](docs/RELEASE-PACKAGING.md) — release process

---

## Contributing

- [How to contribute skills, commands, and templates](docs/CONTRIBUTING-SKILLS.md)
- [Skill packs](docs/SKILL-PACKS.md) — curated bundles
- [Adapters](adapters/) — tool-specific integration guides
- [Release notes](docs/releases/) — per-version release documentation

---

## Attribution and license

Vibe Coding OS is original content inspired by patterns in the wider AI coding workflow community. It does not vendor upstream code or documentation. Before importing external material: verify the source license, record it in `registry/sources.json`, document in `ATTRIBUTIONS.md`, and prefer adaptation over copying.

See [`NOTICE.md`](NOTICE.md) and [`ATTRIBUTIONS.md`](ATTRIBUTIONS.md) for details. Licensed under MIT.
