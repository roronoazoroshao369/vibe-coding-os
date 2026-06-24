# Product Mission and Roadmap

> Keep long-running product direction visible without turning specs, release notes,
> or historical audit reports into strategy documents.

## Mission

Vibe Coding OS helps humans and coding agents turn intent into verified software
work through portable markdown skills, commands, templates, and reference
intelligence.

## Product principles

- Markdown-first: useful without a runtime, installer, or hosted service.
- Optional runtime: local JSON helpers may materialize state under `.omc/runtime/`, but they stay opt-in and never replace the markdown baseline.
- Portable: applicable across Claude Code, Codex, Cursor, Gemini, Cline, Continue, Aider, Windsurf, MCP, and similar agent harnesses.
- Verification-oriented: completion claims require evidence.
- Attribution-safe: external ideas are tracked, rewritten, and mapped.
- Lightweight by default: process depth scales with risk and scope.
- Living-doc first: durable decisions belong in ROADMAP, ADRs, MAINTAINERS, CHANGELOG, or user guides — not in stale process reports.

## Canonical planning docs

| Document | Role |
| --- | --- |
| `ROADMAP.md` | Product mission, principles, active roadmap, recent releases. |
| `docs/ROADMAP-STATUS.md` | Release/status summary through v2.18.0 and active roadmap snapshot. |
| `docs/plans/2026-06-23-long-term-quality-roadmap-v2.19-to-v3.0.md` | Canonical long-term quality roadmap for v2.19 → v3.0. |
| `docs/archive/roadmaps/` and `docs/plans/historical/` | Historical/superseded roadmap and implementation-plan archive. |
| `CHANGELOG.md` | Full release history and validation evidence. |

Release-facing counts and gate totals come from `scripts/repo-metadata.mjs` (`npm run count:all`). Docs/source drift is guarded by `npm run validate:docs-sync` and `npm run validate:roadmap-sync`.

## Current roadmap themes

| Theme | Goal | Signals of success |
| --- | --- | --- |
| Surface simplification | Make the repo feel like a focused product, not a warehouse of prompts. | Newcomers start with Core 10; README stays short; old report noise is archived. |
| Spec-to-implementation quality | Make specs, plans, tasks, and briefs sufficient for one-pass implementation. | Fewer clarifying loops; validation gates pass with less rework. |
| Memory and context hygiene | Preserve useful context while excluding secrets and stale noise. | Retrieval bundles are relevant, cited, fresh, and small; privacy coverage gate passes. |
| Maintainer sustainability | Reduce solo-maintainer risk and avoid release/report churn. | Release cadence is batched; co-maintainer onboarding is documented; CODEOWNERS can grow beyond one owner. |
| Runtime confidence | Keep optional runtime useful without expanding it into a mandatory platform. | Runtime changes are tested, privacy-scrubbed, and compatible with ADR 0002. |

## Active roadmap

| Priority | Item | Status | Acceptance criteria |
| --- | --- | --- | --- |
| P0 | Keep Core 10 as the golden path | Done, maintain | `docs/CORE-10.md` remains the first entry point; README links to it before advanced surfaces. |
| P0 | Archive resolved council/process reports | Done, maintain | `docs/reports/council/` keeps only README; historical reports are outside active product docs. |
| P0 | Merge audit findings into living docs | Done, maintain | v2.17.7/v2.18.0 findings are represented in `ROADMAP.md`, `MAINTAINERS.md`, README, and this file. |
| P0 | Roadmap/status/dashboard sync | Done, guard | `README.md`, `README.vi.md`, `ROADMAP.md`, `docs/ROADMAP-STATUS.md`, `docs/DASHBOARD.md`, and `commands/manifest.json` agree on v2.18.0 source-of-truth metadata. |
| P1 | Bus factor growth | Planned | Recruit 1–2 trusted contributors; update CODEOWNERS and reviewer table when real reviewers exist. |
| P1 | Runtime behavior tests | Deferred | Add end-to-end tests for snapshot → replay → rebuild stores and doctor edge cases. |
| P1 | Promote long-term quality roadmap | Done | v2.19 → v3.0 plan lives in `docs/plans/2026-06-23-long-term-quality-roadmap-v2.19-to-v3.0.md`. |
| P2 | Runtime init-path consolidation | Deferred | Reconcile runtime init/install/bootstrap flows so collection layout has one source of truth. |
| P2 | Count/source-of-truth drift prevention | Done, guard | `npm run count:all`, `npm run dashboard:check`, `npm run validate:docs-sync`, and `npm run validate:roadmap-sync` fail on release-facing drift. |

## Council/report policy

Council reviews are useful as temporary analysis, but they are not product
surface. Once findings are closed or converted into work items:

1. Move durable decisions into this roadmap, ADRs, MAINTAINERS, CHANGELOG, or the relevant user guide.
2. Keep historical panels, deep dives, summaries, and superseded syntheses outside committed docs unless there is an explicit release-artifact need.
3. Do not keep generated HTML exports as active documentation when Markdown or a synthesis exists.
4. Do not bump package version for cleanup-only report movement.

## Recent releases

- **v2.18.0** (2026-06-23) — Surface Simplification: Core 10 golden path, privacy coverage gate, opt-in version check, maintainer runbook, council/report cleanup policy.
- **v2.17.7** (2026-06-22) — MCP auth CI wiring, auth docs, token priority tests, FAQ runtime wording fix.
- **v2.17.6** (2026-06-22) — MCP token handshake and runtime injection scan.
- **v2.17.5** (2026-06-22) — Maintenance cleanup: stat sync, CI consolidation, orphan/deprecated command checks.
- **v2.17.4** (2026-06-22) — Council finding closure: stale refs fixed, dead validators removed, autopilot bug fixes.
- **v2.17.3** (2026-06-22) — Newcomer UX fix, templates manifest regenerated, autopilot tests/CI added.
- **v2.17.2** (2026-06-22) — Bus factor safety: CODEOWNERS created, ADR frontmatter standardized.
- **v2.17.1** (2026-06-22) — Tier 1 bugfix: tool-contract allowlist expanded, stats aligned, workflow CLI commands added.
- **v2.17.0** (2026-06-21) — Expert Council Trim: 152→115 skills, 120→116 commands, 110→107 templates; +Autopilot runtime; +3 validators.
- **v2.16.x** (2026-06-20/21) — Quality/security delivery cycle and close-the-gaps cleanup.
- **v2.15.0** (2026-06-20) — Wire the Shield + Skill Maturity + Community Signals.
- **v2.14.0** (2026-06-20) — Defense in Depth + Engineering Quality.
- **v2.13.0** (2026-06-20) — Security Shield + Engineering Quality Lift.

## Using this roadmap in workflow artifacts

- Specs may cite roadmap themes to explain priority, but acceptance criteria must stay behavior-focused.
- Plans may cite roadmap themes to justify sequencing or trade-offs.
- Tasks should not copy roadmap prose; they should reference the relevant theme only when it changes priority.
- If a request conflicts with the roadmap but is explicit and safe, user intent wins; record the trade-off.

## Out of scope

- This roadmap is not a release promise.
- It does not authorize mandatory runtime dependencies, installers, daemons, or hosted services; the optional runtime layer stays opt-in and local-only.
- It does not replace per-feature specs, plans, or acceptance criteria.
- It does not require keeping historical council reports in the active docs tree.

## Ghi chú tiếng Việt

File này giữ mission/roadmap để spec và plan có định hướng sản phẩm mà không nhồi strategy vào từng spec. Report cũ đã xử lý nên được archive hoặc merge vào tài liệu sống; roadmap giúp ưu tiên, nhưng acceptance criteria vẫn phải cụ thể và kiểm chứng được.
