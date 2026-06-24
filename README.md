# Vibe Coding OS

[![Validate Repository](https://github.com/roronoazoroshao369/vibe-coding-os/actions/workflows/validate.yml/badge.svg)](https://github.com/roronoazoroshao369/vibe-coding-os/actions/workflows/validate.yml)
[![Adapter Smoke Tests](https://github.com/roronoazoroshao369/vibe-coding-os/actions/workflows/smoke-test.yml/badge.svg)](https://github.com/roronoazoroshao369/vibe-coding-os/actions/workflows/smoke-test.yml)

> **Workflow contract first. Runtime optional. Human intent stays sovereign.**

<p align="right">
  <a href="README.md">English</a> · <a href="README.vi.md">Tiếng Việt</a>
</p>

Vibe Coding OS is a markdown-first AI coding discipline framework for turning human intent into verified software work. It gives Claude Code, Codex, Cursor, Gemini, Cline, Continue, Aider, Windsurf, MCP, and similar agent harnesses a portable workflow contract: spec first, plan clearly, implement in small steps, verify honestly, and remember durable decisions safely.

It is not a mandatory wrapper, hosted service, product platform, or required runtime. The optional runtime is local-only and exists to support state, memory, checkpoints, teams, sessions, daemon workflows, MCP, and tmux runner use cases when you explicitly opt in.

## Current status

**Current release (v2.18.0):** validate:all **16/16 gates PASS** · **112 skills** · **115 commands** · **107 templates** · **22 tracked sources** · **9 adapters**.

**Latest:** v2.18.0 — Surface Simplification. This release keeps the focus on the Core 10 golden path, living roadmap hygiene, privacy coverage, maintainer sustainability, and source-of-truth sync. Full release history lives in [`CHANGELOG.md`](CHANGELOG.md).

**Count policy:** headline command counts come from `commands/manifest.json`; deprecated compatibility files may remain on disk but are excluded from public inventory counts. Release-facing counts and gate totals come from [`scripts/repo-metadata.mjs`](scripts/repo-metadata.mjs), exposed by `npm run count:all`.

---

## Start here

| New to Vibe Coding OS | You want |
|---|---|
| [**Core 10**](docs/CORE-10.md) | Start with the 10 capabilities that cover most real work |
| [First Workflow](docs/FIRST-WORKFLOW.md) | Run one complete `spec → plan → verify` loop |
| [Quickstart](docs/QUICKSTART.md) | Set up Claude Code, Codex, Cursor, or Gemini quickly |
| [Adapter hub](docs/adapters/README.md) | Tool-specific setup docs |
| [Install guide](INSTALL.md) | Plugin, clone, CLI, and zero-runtime options |
| [Tiếng Việt](docs/vi/index.md) | Vietnamese onboarding |

## Default workflow

```text
Intent → Spec → Plan → Implement → Test → Review → Memory → Merge
```

- **Intent** — capture what the human wants and why.
- **Spec** — define behavior, constraints, non-goals, and acceptance criteria.
- **Plan** — break the work into ordered, reviewable steps.
- **Implement** — make focused edits that match the plan.
- **Test** — run the smallest meaningful checks first, then broader validation.
- **Review** — inspect correctness, simplicity, security, and maintainability.
- **Memory** — record durable decisions without secrets.
- **Merge** — ship only after verification status is clear.

## Core product surfaces

| Surface | Purpose |
|---|---|
| `skills/` | Reusable engineering disciplines and agent workflows |
| `commands/` | Copy-pasteable slash-command prompts such as `/vibe-spec`, `/vibe-plan`, `/vibe-review` |
| `templates/` | Specs, plans, tasks, ADRs, reviews, memory entries, runbooks, and scorecards |
| `registry/` | Discovery metadata for skills, commands, templates, and sources |
| `adapters/` | Setup surfaces for Claude Code, Codex, Cursor, Gemini, Cline, Continue, Aider, Windsurf, and MCP |
| `runtime/` | Optional local JSON state helpers and MCP/team/session utilities |
| `references/` | Attribution-safe reference intelligence and upstream adoption mapping |

## Optional runtime

The runtime is opt-in. It stores local JSON state and never replaces the markdown baseline.

```bash
npm run runtime:install
npm run runtime:init
npm run runtime:validate
```

Use it only when you need task state, memory, checkpoints, team orchestration, session capture, daemon workflows, MCP tools, or tmux team execution. See [`docs/RUNTIME-GUIDE.md`](docs/RUNTIME-GUIDE.md).

## Validation

```bash
npm run validate        # core structural checks
npm run validate:all    # full source-of-truth validation gate
npm run count:all       # release-facing counts and gate metadata
npm run dashboard:check # dashboard vs metadata sync check
```

The `validate:all` gate includes docs/source-of-truth sync so README, README.vi, ROADMAP, ROADMAP-STATUS, DASHBOARD, and command manifest drift is caught before merge.

## Roadmap and plans

- [`ROADMAP.md`](ROADMAP.md) — product mission, principles, active roadmap, and recent releases.
- [`docs/ROADMAP-STATUS.md`](docs/ROADMAP-STATUS.md) — generated-style status summary through v2.18.0 plus active roadmap.
- [`docs/plans/2026-06-23-long-term-quality-roadmap-v2.19-to-v3.0.md`](docs/plans/2026-06-23-long-term-quality-roadmap-v2.19-to-v3.0.md) — canonical long-term quality roadmap.
- [`CHANGELOG.md`](CHANGELOG.md) — complete release history.

## Philosophy

1. **Human intent stays sovereign.** The assistant may propose, but it must not silently expand scope.
2. **Small correct changes beat grand rewrites.** Prefer reviewable, reversible steps.
3. **Specs are thinking tools, not bureaucracy.** Use enough structure to remove ambiguity.
4. **Verification is part of done.** Never claim success without evidence or an explicit limitation.
5. **Memory should be useful, current, and safe.** Store durable context, not secrets or transcripts.
6. **Attribution is a first-class artifact.** External ideas are tracked, rewritten, and mapped before adoption.

## Contributing

Start with [`CONTRIBUTING.md`](CONTRIBUTING.md), [`MAINTAINERS.md`](MAINTAINERS.md), and [`docs/CONTRIBUTING-SKILLS.md`](docs/CONTRIBUTING-SKILLS.md). Before merging structural or docs changes, run `npm run validate:all` and resolve any source-of-truth drift.

## License and attribution

Vibe Coding OS is original content inspired by patterns in the wider AI coding workflow community. See [`NOTICE.md`](NOTICE.md), [`ATTRIBUTIONS.md`](ATTRIBUTIONS.md), and [`LICENSE`](LICENSE).
