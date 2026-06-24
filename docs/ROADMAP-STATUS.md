# Roadmap Status — Vibe Coding OS

> Source-of-truth sync: 2026-06-24.
> Counts come from `scripts/repo-metadata.mjs`; release history comes from `CHANGELOG.md`; active direction comes from `ROADMAP.md`.

## Current release snapshot

| Metric | Value |
|---|---|
| Current version | v2.18.0 |
| validate:all | 16/16 gates PASS |
| Skills | 112 skills |
| Commands | 115 commands |
| Templates | 107 templates |
| Tracked sources | 22 tracked sources |
| Adapters | 9 adapters |
| Canonical product roadmap | `ROADMAP.md` |
| Canonical long-term plan | `docs/plans/2026-06-23-long-term-quality-roadmap-v2.19-to-v3.0.md` |

## Status model

This file is a status summary, not the strategy source of truth.

- **History complete:** released versions and completed roadmap waves.
- **Recent release detail:** v2.17.0 → v2.18.0, because those releases changed the repo surface and source-of-truth policy.
- **Active roadmap:** current open work from `ROADMAP.md` and the v2.19 → v3.0 long-term quality roadmap.

## History complete through v2.16.x

| Version range | Status | Notes |
|---|---|---|
| v0.1.0 → v0.4.0 | ✅ Complete | Initial public framework, packaging, CLI, dashboard, examples, and adoption MVP |
| v1.0.0 → v1.6.0 | ✅ Complete | Trusted workflow framework, runtime hardening, adoption trust, adapter docs, governance |
| v1.7.0 → v2.5.0 | ✅ Complete | Quality Shield, Expert Mode, Smart Adapt, Quality Engine, telemetry, multi-repo learning, CI/CD, orchestration |
| v2.6.0 → v2.12.0 | ✅ Complete | Reference implementation, AI testing suite, adapter expansion, plugin polish, engineering discipline pack |
| v2.13.0 → v2.16.x | ✅ Complete | Security Shield, Defense in Depth, skill maturity, close-the-gaps cleanup, validation hardening |

For detailed per-release notes, use `CHANGELOG.md` rather than duplicating full history here.

## Recent release detail

### v2.17.0 — Expert Council Trim
**Status:** ✅ Complete

- Reduced surface from the larger pre-trim inventory to the current focused product shape.
- Added Autopilot runtime surfaces and new validators for imports, typecheck, and scope match.
- Established the modern surface-simplification direction that v2.18.0 continues.

### v2.17.1 — Tool-contract and stats alignment
**Status:** ✅ Complete

- Expanded MCP/tool-contract allowlists so command tools are reachable.
- Added workflow CLI commands and fixed several count/stat mismatches.
- Removed runtime state from packaged/git surfaces.

### v2.17.2 — Bus factor safety
**Status:** ✅ Complete

- Added CODEOWNERS coverage.
- Standardized ADR frontmatter and resolved ADR numbering collision.
- Prepared the repo for future co-maintainer onboarding.

### v2.17.3 — Trim residue and autopilot tests
**Status:** ✅ Complete

- Regenerated template manifest.
- Added Autopilot unit tests and CI workflow.
- Cleaned stale references and updated roadmap/release-facing docs.

### v2.17.4 — Council findings closure
**Status:** ✅ Complete

- Fixed high-severity stale reference and runtime session timestamp issues.
- Removed dead validators from the old hard-coded validation runner.
- Added guardrails against deprecated/orphan command references.

### v2.17.5 — Maintenance cleanup
**Status:** ✅ Complete

- Synced stats across release-facing docs.
- Consolidated CI paths and added orphan inventory review.
- Closed scope gaps in the deprecated-command guard.

### v2.17.6 — MCP security hardening
**Status:** ✅ Complete

- Added MCP auth handshake and runtime injection scanning.
- Added direct auth/injection tests and security model docs.
- Kept changes inside optional runtime/security surfaces.

### v2.17.7 — Post-hardening wiring
**Status:** ✅ Complete

- Wired MCP auth tests into CI.
- Added token priority and file-permission behavior tests.
- Fixed runtime wording in FAQ and CI cleanup details.

### v2.18.0 — Surface Simplification
**Status:** ✅ Complete / maintain

| Deliverable | Status |
|---|---|
| Core 10 golden path (`docs/CORE-10.md`) | ✅ Done |
| README narrowed to latest release + core entrypoints | ✅ Done |
| Privacy coverage gate for runtime free-text stores | ✅ Done |
| `redactObject()` recursive redaction helper | ✅ Done |
| Redaction behavior tests | ✅ Done |
| Maintainer runbook and release cadence guidance | ✅ Done |
| Council/report policy merged into living docs | ✅ Done |
| Source-of-truth metadata script (`scripts/repo-metadata.mjs`) | ✅ Done |
| Docs/source sync gate (`scripts/validate-docs-sync.mjs`) | ✅ Done |
| Roadmap/status sync gate (`scripts/validate-roadmap-sync.mjs`) | ✅ Done |
| Dashboard and roadmap/status resynced to v2.18.0 | ✅ Done |

**Validation posture:** validate:all 16/16 gates PASS expected after source-of-truth sync.

## Active roadmap

| Priority | Item | Status | Acceptance criteria |
|---|---|---|---|
| P0 | Keep Core 10 as the golden path | Done, maintain | `docs/CORE-10.md` remains the first entry point; README links to it before advanced surfaces. |
| P0 | Archive resolved council/process reports | Done, maintain | `docs/reports/council/` keeps only README; historical reports are outside active product docs. |
| P0 | Merge audit findings into living docs | Done, maintain | v2.17.7/v2.18.0 findings are represented in `ROADMAP.md`, `MAINTAINERS.md`, README, and this file. |
| P0 | Roadmap/status/dashboard sync | Done, guard | `README.md`, `README.vi.md`, `ROADMAP.md`, `docs/ROADMAP-STATUS.md`, `docs/DASHBOARD.md`, and `commands/manifest.json` agree on v2.18.0 source-of-truth metadata. |
| P1 | Bus factor growth | Planned | Recruit 1–2 trusted contributors; update CODEOWNERS and reviewer table when real reviewers exist. |
| P1 | Runtime behavior tests | Deferred | Add end-to-end tests for snapshot → replay → rebuild stores and doctor edge cases. |
| P1 | Promote long-term quality roadmap | Done | v2.19 → v3.0 plan lives in `docs/plans/2026-06-23-long-term-quality-roadmap-v2.19-to-v3.0.md`. |
| P2 | Runtime init-path consolidation | Deferred | Reconcile runtime init/install/bootstrap flows so collection layout has one source of truth. |
| P2 | Count/source-of-truth drift prevention | Done, guard | `npm run count:all`, `npm run dashboard:check`, `npm run validate:docs-sync`, and `npm run validate:roadmap-sync` fail on release-facing drift. |

## Next roadmap: v2.19 → v3.0

The canonical future plan is `docs/plans/2026-06-23-long-term-quality-roadmap-v2.19-to-v3.0.md`.

| Phase | Target | Theme | Status |
|---|---|---|---|
| v2.19.0 | Behavior over Shape | Runtime e2e behavior tests and First-Try Quality Score baseline | Planned |
| v2.20.0 | One Front Door | `vibe find`, surface reduction, count drift prevention | Planned |
| v2.21.0 | Structural Uniformity | Single persistence choke-point, privacy/approval consistency, init-path consolidation | Planned |
| v2.22.0 | Two Hands on the Wheel | Sustainable cadence, co-maintainer on-ramp, bus-factor metrics | Planned |
| v3.0.0 | Proven Discipline | Consolidated, behavior-proven, maintainable framework | Planned |

## Maintenance rules

1. Do not hand-edit release-facing counts without updating `scripts/repo-metadata.mjs` consumers.
2. Run `npm run count:all` before editing README, roadmap, dashboard, or manifests.
3. Run `npm run validate:docs-sync` after editing release-facing docs.
4. Historical version roadmaps live under `docs/archive/roadmaps/`; historical implementation plans live under `docs/plans/historical/`.
5. Active product direction belongs in `ROADMAP.md` and the canonical long-term plan, not scattered reports.
