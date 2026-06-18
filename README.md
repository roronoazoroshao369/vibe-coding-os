# Vibe Coding OS

[![Validate Repository](https://github.com/roronoazoroshao369/vibe-coding-os/actions/workflows/validate.yml/badge.svg)](https://github.com/roronoazoroshao369/vibe-coding-os/actions/workflows/validate.yml)
[![Adapter Smoke Tests](https://github.com/roronoazoroshao369/vibe-coding-os/actions/workflows/smoke-test.yml/badge.svg)](https://github.com/roronoazoroshao369/vibe-coding-os/actions/workflows/smoke-test.yml)

> **Workflow contract first. Runtime optional. Human intent stays sovereign.**

<p align="right">
  <a href="README.md">English</a> · <a href="README.vi.md">Tiếng Việt</a>
</p>

### Why this matters

AI coding assistants can generate code fast — but speed without structure leads to scope creep, forgotten edge cases, and unmaintainable output. Vibe Coding OS adds a lightweight discipline layer on top: spec-driven workflows, verification gates, and engineering practices that keep human intent sovereign while letting you ship at AI speed.

**Current release (v1.5.0):** validate:all 20/20 gates PASS · **90 skills** · **68 commands** · **56 templates** · 14 tracked sources

---

**Vibe Coding OS** is a Claude/Codex-friendly skill framework for one person who wants to move fast with AI coding assistants without giving up engineering discipline. It is markdown-first, dependency-light, and usable as plain instructions, prompts, and templates.

It is not a required wrapper, product, hosted service, or mandatory agent runtime. It is a portable operating system for AI-assisted software work: reusable skills, command prompts, templates, registries, adapters, reference maps, and optional local runtime helpers that help a human and an AI assistant repeatedly turn intent into reliable code.

> **On the name:** "Vibe coding" usually means fast, unstructured AI-assisted coding. Vibe Coding OS is the discipline counterpart — spec-first, verification-gated, and engineering-rigorous. Same speed, but with guardrails.

---

## Start here

| New to Vibe Coding OS | You want |
|---|---|
| [First Workflow](docs/FIRST-WORKFLOW.md) | Run one complete `spec → plan → verify` loop |
| [Quickstart](docs/QUICKSTART.md) | 10-minute setup for Claude Code, Codex, or Cursor |
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

## What's new in v1.5.0

- **Runtime freeze:** Scope formally frozen via ADR 0002 — runtime only receives bug fix, safety, compat, docs, and tests.
- **Config hardening:** Unknown `maxRiskLevel` → normalized; tool lists validated as arrays of strings.
- **MCP approval scoped by args:** `task.update(task-A)` approval does NOT auto-approve `task.update(task-B)`.
- **Negative TTL rejected:** `claimTask`, `heartbeatTask`, `renewTaskLease` reject negative TTL at public APIs.
- **Vietnamese docs improved:** README.vi.md dieted (536→194 lines). New `docs/vi/QUICKSTART.md`.
- **Adoption feedback:** GitHub issue template for structured onboarding feedback.
- **Config validation cleanup:** maxTaskLease, maxRiskLevel, tool lists all validated on load.

---

## Core vs Optional Runtime

The **core** is markdown-first and works with **zero runtime**: install the Claude Code plugin and use `/vibe-*` commands, skills, and templates as plain instructions. No daemon, database, MCP server, or tmux session is required.

The **runtime** is fully **opt-in**. Enable it only when you want local JSON state for tasks, memory, checkpoints, teams, sessions, daemon workflows, MCP tools, or a tmux team runner.

See [`docs/workflows/core-vs-optional-runtime.md`](docs/workflows/core-vs-optional-runtime.md) for the detailed boundary.

---

## What's included

**90 skills**, **68 commands**, **56 templates**, **14 tracked inspiration sources**, and an optional runtime layer.

| Layer | What it does |
|---|---|
| **Spec-driven workflow** | Constitution → specify → plan → tasks → checkpoints → implementation-readiness gates |
| **Adaptive flow** | Tiny / small / medium / large / risky workflow tiers |
| **Real engineering skills** | Grilling, PRD, ADRs, TDD, diagnosis, review, branch finishing |
| **Prompt discipline** | Karpathy-style think / simplicity / surgical / goal-driven rules |
| **Team-agent orchestration** | Role templates, handoffs, watchdogs, scaffold generation |
| **Memory layer** | Session capture, summarization, privacy filtering, progressive retrieval, citations |
| **Reference intelligence** | Source index, attribution, feature maps, update-impact maps, changelogs |
| **Optional runtime** | JSON stores, task/memory/checkpoint/team/session CLI, daemon, MCP server, tmux runner, vector search |

---

## Quick start by tool

### Claude Code — install as plugin (recommended)

```text
/plugin marketplace add https://github.com/roronoazoroshao369/vibe-coding-os
/plugin install vibe-coding-os
```

After install, skills auto-activate and commands are available as `/vibe-*`.

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

See [`adapters/compatibility-matrix.md`](adapters/compatibility-matrix.md) for tool-specific setup details.

---

## Validation

This repository is intentionally dependency-light. Run validation after any structural edit:

```bash
npm run validate        # core structural checks (4 gates)
npm run validate:all    # full validation (20 gates)
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
- [`docs/TUTORIAL.md`](docs/TUTORIAL.md) — 15-minute tutorial
- [`INSTALL.md`](INSTALL.md) — installation options
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
