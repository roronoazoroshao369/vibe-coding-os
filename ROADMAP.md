# Product Mission and Roadmap

> Use this file to keep long-running product direction visible without turning specs into strategy documents.

## Mission

Vibe Coding OS helps humans and coding agents turn intent into verified software work through portable markdown skills, commands, templates, and reference intelligence.

## Product principles

- Markdown-first: useful without a runtime, installer, or hosted service.
- Optional runtime: a lightweight local JSON companion may materialize state under `.omc/runtime/`, but it stays opt-in and never replaces the markdown baseline.
- Portable: applicable across Claude Code, Codex, Cursor, and similar agent harnesses.
- Verification-oriented: completion claims require evidence.
- Attribution-safe: external ideas are tracked, rewritten, and mapped.
- Lightweight by default: process depth scales with risk and scope.

## Current roadmap themes

| Theme | Goal | Signals of success |
| --- | --- | --- |
| Spec-to-implementation quality | Make specs, plans, tasks, and briefs sufficient for one-pass implementation. | Fewer clarifying loops; validation gates pass with less rework. |
| Memory and context hygiene | Preserve useful context while excluding secrets and stale noise. | Retrieval bundles are relevant, cited, fresh, and small. |
| Reference intelligence | Keep upstream inspiration auditable without vendoring. | Index, mappings, changelogs, and attribution stay synchronized. |
| Team-agent coordination | Use teams only when parallel work improves outcome. | Clear ownership, fewer conflicts, independent verification. |

## Using this roadmap in workflow artifacts

- Specs may cite roadmap themes to explain priority, but acceptance criteria must stay behavior-focused.
- Plans may cite roadmap themes to justify sequencing or trade-offs.
- Tasks should not copy roadmap prose; they should reference the relevant theme only when it changes priority.
- If a request conflicts with the roadmap but is explicit and safe, user intent wins; record the trade-off.

## Out of scope

- This roadmap is not a release promise.
- It does not authorize mandatory runtime dependencies, installers, or external services; the optional runtime layer stays opt-in and local-only.
- It does not replace per-feature specs, plans, or acceptance criteria.

## Ghi chú tiếng Việt

File này giữ mission/roadmap để spec và plan có định hướng sản phẩm mà không nhồi strategy vào từng spec. Roadmap giúp ưu tiên, nhưng acceptance criteria vẫn phải cụ thể và kiểm chứng được.

## Recent releases

- **v2.17.3** (2026-06-22) — Newcomer UX fix: CLAUDE.md orphan/deprecated references replaced; templates/manifest.json regenerated (92→107); ROADMAP release history updated.
- **v2.17.2** (2026-06-22) — Bus factor safety: CODEOWNERS created, ADR 0001/0002 frontmatter added, ADR number collision resolved.
- **v2.17.1** (2026-06-22) — Tier 1 bugfix: tool-contract allowlist expanded 6→15 tools (unblocked 9/15 MCP tools), .vibe/ git-isolated, stats aligned across 5 files, 5 workflow CLI commands added.
- **v2.17.0** (2026-06-21) — Expert Council Trim. 152→115 skills (−24%), 120→116 commands, 110→107 templates. +Autopilot runtime, +3 validators, validation 3× faster. Post-release audit committed.
- **v2.16.x** (2026-06-20) — Quality + delivery sprint cycle. Multiple council reports (close-the-gaps, security, adoption). Validation gates expanded. Spec/plan refinement.
- **v2.15.0** (2026-06-20) — Wire the Shield + Skill Maturity + Community Signals. Council of Security (3-layer defense + ADR 0004 adaptive trust), Council of Engineering (frontmatter 100% coverage + 5 regression tests), Council of Adoption (4 adapter configs + 20 per-skill examples + 5 VI guides + community + dependencies).
- **v2.14.0** (2026-06-20) — Defense in Depth + Engineering Quality. 3-layer defense (97.37% OWASP LLM01), 5 redactor modes, 30-pattern redactor, 19 OWASP patterns, canary corpus, skill quality gate, quality engine, 6 adapter docs.
- **v2.13.0** (2026-06-20) — Security Shield + Engineering Quality Lift (Bypass authorization gate, default-deny hooks, OWASP LLM Top 10).

## Next roadmap theme: v2.18.0 — Council-Driven Audit Cadence (planned)

| Target | Description |
| --- | --- |
| Quarterly Expert Council | Run 3-panel audit (Newcomer, Runtime, Maintainer) every release |
| Tier-1 fix SLA | Ship Tier-1 audit findings as bugfix release within 48h |
| Bus factor growth | Recruit 1–2 co-maintainers via CODEOWNERS to reduce bus factor 1.5 → 2.5+ |
| Tier-3 trim residue | Clear 8 stale doc references, templates manifest drift, autopilot unit tests |
| Tier-4 automation | CI workflow for autopilot, session TTL/GC, audit log hardening |

**Runtime:** Frozen per ADR 0002. No mandatory daemon or hosted service.

**Deliverables (proposed):**

a. **Quarterly Expert Council cadence** — codify 3-panel audit as part of every minor release. Each panel produces 1 file under `docs/reports/council/`.

b. **Tier-1 fix SLA** — audit findings categorized Tier-1 (release blockers) ship as bugfix release within 48h. Automation: tag audit commit, auto-create fix branch.

c. **Bus factor growth plan** — recruit 1–2 trusted contributors via CODEOWNERS, document onboarding in MAINTAINERS.md.

d. **Tier-3 trim residue cleanup** — clear 8 stale doc references identified by Council Panel A, regenerate templates manifest from filesystem (107 templates), add autopilot unit tests.

e. **CI workflow for autopilot** — GitHub Actions runs autopilot end-to-end test on every PR to catch silent failures like the tool-contract allowlist bug from v2.17.0.

**Out of scope:** mandatory daemon, hosted service, expansion beyond opt-in runtime.
