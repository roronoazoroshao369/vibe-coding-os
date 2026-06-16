# Roadmap Status — Vibe Coding OS

Auto-generated status check for the project roadmap.
Last updated: 2026-06-16

## v0.1.1 — Validation Recovery & Vietnamese Onboarding
**Status:** ✅ COMPLETE

| Deliverable | Status |
|---|---|
| `npm run validate` pass | ✅ Done |
| Vietnamese docs (docs/vi/) | ✅ Done |
| README links to VI docs | ✅ Done |
| Validation scope reported in PRs | ✅ Done |

## v0.2 — Adoption MVP
**Status:** ✅ COMPLETE

| Deliverable | Status |
|---|---|
| Quickstart 10-min guides | ✅ docs/QUICKSTART.md (3 guides: Claude Code, Codex, Cursor) |
| Adapter install snippets | ✅ docs/adapter-install-snippets.md + snippets added to each adapter README |
| 3-5 end-to-end examples | ✅ 5 examples in examples/ (bugfix, feature, legacy-enhancement, multi-agent, refactor) |
| vibe-doctor documented | ✅ via CLI help (`vibe doctor` in scripts/vibe-cli.mjs) |
| Memory redaction tests | ✅ docs/tests/memory-redaction-test-cases.md (30 cases) + scripts/verify-memory-redaction.mjs |
| CLI helper MVP | ✅ scripts/vibe-cli.mjs (init, doctor, stats, list-skills, list-commands) |

## v0.3 — Evidence & Safety
**Status:** ✅ COMPLETE

| Deliverable | Status |
|---|---|
| Behavioral eval scenarios | ✅ docs/eval-scenarios.md (5 scenarios) |
| Memory redaction tests | ✅ 30 test cases, verification script exists |
| Import review scorecard | ✅ references/upstream-intake-scorecard.md |
| Reference report workflow | ✅ via `npm run references:report` |
| Secret scanning | ✅ scripts/validate-secrets.mjs |
| Adapter smoke tests | ✅ scripts/smoke-test-adapters.mjs + .github/workflows/smoke-test.yml |
| Eval report runner | ✅ Done — scripts/evaluation-report.mjs is wired as `npm run eval:report` and included in `npm run validate:all` |

## v0.4 — Packaging & Skill Packs
**Status:** ✅ RELEASE-READY

| Deliverable | Status |
|---|---|
| `vibe init` | ✅ scripts/vibe-cli.mjs |
| `vibe doctor` | ✅ scripts/vibe-cli.mjs |
| `vibe stats` | ✅ scripts/vibe-cli.mjs |
| `vibe list-skills` | ✅ scripts/vibe-cli.mjs |
| `vibe list-commands` | ✅ scripts/vibe-cli.mjs |
| `vibe spec` | ✅ docs/RELEASE-PACKAGING.md + examples/cli-workflows/README.md |
| `vibe plan` | ✅ docs/RELEASE-PACKAGING.md + examples/cli-workflows/README.md |
| `vibe memory` | ✅ docs/RELEASE-PACKAGING.md + examples/cli-workflows/README.md |
| Release packaging guide | ✅ docs/RELEASE-PACKAGING.md |
| Version bump script | ✅ scripts/bump-version.sh |
| CLI workflow examples | ✅ examples/cli-workflows/README.md |
| Core Solo Developer Pack | ✅ docs/skill-packs/core-solo-developer.md |
| Memory-Safe Pack | ✅ docs/skill-packs/memory-safe-pack.md |
| Multi-Agent Pack | ✅ docs/skill-packs/multi-agent-pack.md |
| Upstream Intelligence Pack | ✅ docs/skill-packs/upstream-intelligence-pack.md |
| Adapter smoke tests | ✅ scripts/smoke-test-adapters.mjs + CI workflow |
| Versioned compatibility matrix | ✅ adapters/compatibility-matrix.md |

## v1.0 — Trusted Workflow Framework
**Status:** ✅ COMPLETE

| Deliverable | Status |
|---|---|
| Stable core workflow contract | ✅ docs/core-workflow-contract.md |
| Stable registry schemas | ✅ schemas/ + `npm run validate:schemas` |
| Contribution governance | ✅ docs/governance.md, docs/decision-record-process.md, docs/maintainer-guide.md |
| Compatibility support policy | ✅ docs/compatibility-support-policy.md |
| Safety/eval dashboard | ✅ docs/DASHBOARD.md + scripts/check-dashboard-sync.mjs |
| Full validation gate | ✅ npm run validate:all (13 gates) |
| Release checklist | ✅ docs/release-checklist.md |
| v1.0 release plan | ✅ docs/v1.0-release-plan.md |
| v1.0 RC checklist | ✅ docs/v1.0-rc-checklist.md |
| Support matrix | ✅ docs/support-matrix.md |
| Release automation | ✅ scripts/release.mjs + npm run release:dry-run |
| CI full validation gate | ✅ .github/workflows/validate.yml runs validate:all |
| Issue/release/compat/safety templates | ✅ 3 issue templates + PR template with v1.0 gates |
| Dashboard sync validation | ✅ scripts/check-dashboard-sync.mjs in validate:all |
| v1.0 readiness report | ✅ docs/reports/v1.0-readiness-report.md |
| v1.0 final audit | ✅ docs/reports/v1.0-final-audit.md |
| README v1.0 positioning | ✅ README + README.vi updated for v0.4.0 → v1.0 RC path |

Bug-fix workflows are covered by [`skills/core/bug-fix-lifecycle/SKILL.md`](../skills/core/bug-fix-lifecycle/SKILL.md) as part of the v1.0 trusted workflow framework.

## Overall Progress

- v0.1.1: ████████████ 100%
- v0.2:   ████████████ 100%
- v0.3:   ████████████ 100%
- v0.4:   ████████████ 100%
- v1.0:   ████████████ 100%
