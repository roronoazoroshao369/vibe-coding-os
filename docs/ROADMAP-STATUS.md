# Roadmap Status — Vibe Coding OS

Auto-generated status check for the project roadmap.
Last updated: 2026-06-18

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
**Status:** ✅ COMPLETE — Released v1.0.0

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
| README v1.0 positioning | ✅ README + README.vi updated for v1.0.0 final release |

Bug-fix workflows are covered by [`skills/core/bug-fix-lifecycle/SKILL.md`](../skills/core/bug-fix-lifecycle/SKILL.md) as part of the v1.0 trusted workflow framework.

## v1.1 — P0+P1+P2 Hardening
**Status:** ✅ COMPLETE — Released v1.1.0

| Deliverable | Status |
|---|---|
| Schema alignment (registries, runtime, adapter, validation) | ✅ Done |
| Workflow state hardening (task/checkpoint/memory/team/session/daemon/MCP/tmux) | ✅ Done |
| Runtime validation expansion (config checks, installer safety, smoke coverage) | ✅ Done |
| CLI expansion (broader coverage, 20 smoke tests passing) | ✅ Done |
| Cursor / Codex / Claude adapter packs refreshed | ✅ Done |
| Safety & hook contracts clarified (secret scan, injection, redaction, handoff) | ✅ Done |
| Execution trace support (local runtime activity logging) | ✅ Done |
| Bilingual sync validation (English/Vietnamese docs alignment) | ✅ Done |
| Markdown link validation (broken reference catch) | ✅ Done |

## v1.2 — Runtime Contracts v2, Safety, Migration
**Status:** ✅ COMPLETE — Released v1.2.0

| Deliverable | Status |
|---|---|
| Docs drift hotfix (dashboard gate counts, README/template counts, orphan wording, vi docs, expanded validators) | ✅ Done |
| Runtime schema v2 foundation (envelope, createdBy, source, trace, risk, strict items, metadata/extensions placeholders) | ✅ Done |
| Multi-agent state contracts v2 (task/workflow-run/checkpoint/session/team/memory) | ✅ Done |
| Safety + traceability (action v2, event schema, approval schema, tool-contract schema) | ✅ Done |
| Migration manifest + dry-run engine | ✅ Done |

## v1.3.0 — Runtime Production Readiness
**Status:** ✅ COMPLETE — Released v1.3.0

| Deliverable | Status |
|---|---|
| P0 Trust cleanup (README/README.vi, v1.2 roadmap archive, release notes patch, heading-version validator gate #17, expert council review, v1.3 roadmap, session metrics and skill proposal templates) | ✅ Done |
| P1A Runtime enforcement core (`runtime/core/enforcement.mjs`, strict item/collection/field/risk/action assertions, generated defaults, enforcement across all 5 runtime stores) | ✅ Done |
| P1B Claim/lease APIs (`claimTask`, `releaseTask`, `heartbeatTask`, `renewTaskLease`, `listExpiredClaims`, `cancelExpiredClaims`) and CLI task ownership commands | ✅ Done |
| P1C Safety & recovery (approval gates, fail-closed tool boundaries, runtime audit, event replay, snapshots, migration apply/backup/rollback/status) | ✅ Done |
| P1D Behavioral integration tests (9 test files, 76 test cases, runtime behavior gate #18 in `validate:all`) | ✅ Done |
| Release inventory baseline (90 skills, 68 commands, 56 templates, 20 schemas, 6 adapters, 14 upstream sources, 18 validation gates) | ✅ Done |

## v1.4.0 — Runtime Kernel + Hardening
**Status:** ✅ COMPLETE — Released v1.4.0

| Deliverable | Status |
|---|---|
| Runtime kernel (config layer, task state machine, schema enforcement) | ✅ Done |
| Event Store v2 (seq, correlation, causation, idempotency, metadata consistency) | ✅ Done |
| Runtime observability (doctor/events CLI and JSON contracts) | ✅ Done |
| Runtime hardening (locking, idempotencyKey, JSON-only surfaces, maxTaskLease enforcement) | ✅ Done |
| Runtime boundary docs and release prep | ✅ Done |

## v1.4.1 — Release Polish
**Status:** ✅ COMPLETE — Released v1.4.1

| Deliverable | Status |
|---|---|
| Stale docs counts fixed (READ ME.vi template count, support-matrix version-neutral) | ✅ Done |
| CHANGELOG retroactive entries v1.1.0–v1.4.0 | ✅ Done |
| CLI cleanup (unused imports, dead code, help text fixes) | ✅ Done |
| Task state machine docs fix (subtask guard comment) | ✅ Done |
| Tmux runner shell safety (assertSafeAgentCommand, shQuote) | ✅ Done |

## v1.4.2 — Runtime Hardening & Adoption Trust
**Status:** ✅ COMPLETE — Released v1.4.2

| Deliverable | Status |
|---|---|
| claimTask terminal state guard (reject completed/cancelled) | ✅ Done |
| Absolute lease cap enforced across all lease paths | ✅ Done |
| Event schema v2 fields (seq, correlation, causation, idempotency) | ✅ Done |
| Date-time format validation in runtime validation layer | ✅ Done |
| Duplicate role name detection in tmux prepareTeamRun | ✅ Done |
| Bilingual FIRST-WORKFLOW prompts (Vietnamese + English) | ✅ Done |

## v1.4.3 — Operational Hygiene
**Status:** ✅ COMPLETE — Released v1.4.3

| Deliverable | Status |
|---|---|
| claimTask rejects terminal states (completed/cancelled) | ✅ Done |
| renewTaskLease caps absolute lease at now + maxTaskLease | ✅ Done |
| requireTmux throws Error instead of process.exit(1) | ✅ Done |
| mapResults returns final task objects | ✅ Done |
| MCP actor tracking (task.update forwards actor: mcp) | ✅ Done |
| Config validation (reject zero/negative maxTaskLease) | ✅ Done |
| README diet 618→~260 lines | ✅ Done |
| Docs hub (docs/README.md full navigation) | ✅ Done |
| 0 orphan templates (all templates referenced) | ✅ Done |
| Vietnamese strategy doc updated to v1.4.3 | ✅ Done |

## v1.5.0 — Core Adoption & Runtime Freeze
**Status:** ✅ COMPLETE — Released v1.5.0

| Deliverable | Status |
|---|---|
| ADR 0002 — Runtime Scope Freeze formal declaration | ✅ Done |
| Propagate freeze language across all governance docs | ✅ Done |
| Diet README.vi.md (536→~194 lines) | ✅ Done |
| ROADMAP-STATUS updated through v1.5.0 | ✅ Done |
| Config hardening (normalize maxRiskLevel, validate tool lists) | ✅ Done |
| MCP approval specificity (argsHash in approval subject) | ✅ Done |
| Reject negative TTL at public APIs | ✅ Done |
| Vietnamese QUICKSTART (docs/vi/QUICKSTART.md) | ✅ Done |
| Adoption feedback issue template | ✅ Done |
| Reconcile test reporting (14 test files aggregate) | ✅ Done |
| Runtime behavioral tests: 14/14 PASS | ✅ Done |

**Scope rules for v1.5.0:**
- New ideas land in markdown core first (skills, commands, templates, docs, examples, adapters, validation).
- Runtime changes limited to bug fix, security, compat, docs, tests.
- Runtime expansion requires ADR 0002 exception process + Engine Adoption Gate.

---

## v1.6.0 — Adoption Trust (in progress)
**Status:** 🔄 IN PROGRESS — Sprint 1 partially done

| Deliverable | Status |
|---|---|
| docs/onboarding/landing improvements | 🔄 Partially done (Sprint 1) |

**Quality Elevation — Strategic Target:**
Agent Quality = Model Capability × Context Quality × Workflow Discipline × Verification Feedback.

This target runs across v1.7–v1.9, elevating AI coding agent quality even with average/mid-tier models through:
- **Prompt discipline** — structured, consistent prompting patterns
- **Rules & skills** — composable discipline layer
- **Knowledge/context management** — reference intelligence, memory, context packs
- **Workflow discipline** — spec → plan → implement → verify → memory → merge
- **Verification gates** — validate:all, traceability checks, smoke tests
- **Self-review** — automated quality checks before response
- **Adversarial review** — critic pass, cross-examination patterns
- **Model-adaptive intelligence** — adapt prompts and verification to model strengths/weaknesses

## v1.7.0 — Quality Shield
**Status:** ✅ COMPLETE

| Deliverable | Status |
|---|---|
| Universal Code Quality Rubric | ✅ Done |
| Quality Execution Contract | ✅ Done |
| Self-Review Before Response | ✅ Done |
| Compact AGENTS.md Template | ✅ Done |
| Code Context Pack | ✅ Done |
| Pattern Library Starter | ✅ Done |
| Quality Diff Audit Script | ✅ Done |
| Repo Map Concept | ✅ Done |
| Quality Elevation eval scenarios | ✅ Done |
| Quality Scorecard | ✅ Done |

## v1.8.0 — Expert Mode
**Status:** ✅ COMPLETE

| Deliverable | Status |
|---|---|
| Adversarial Code Review | ✅ Done |
| Critique Pass Protocol | ✅ Done |
| Task-Specific Quality Packs (API, DB migration, auth, frontend state, async jobs) | ✅ Done |
| Writer-Critic Pair / Quality Council multi-agent patterns | ✅ Done |

## v1.9.0 — Smart Adapt
**Status:** ✅ COMPLETE

| Deliverable | Status |
|---|---|
| Model Weakness Memory | ✅ Done |
| Adaptive Prompt Selection | ✅ Done |
| Quality Score Card (session + report) | ✅ Done |
| Lessons Learned DB / Golden Example Library v2 | ✅ Done |

## v2.0 — Quality Engine
**Status:** ✅ COMPLETE

| Deliverable | Status |
|:---|---|
| Quality engine schemas and data contracts | ✅ Done |
| Quality engine runner (core logic) | ✅ Done |
| Report generator (markdown + structured output) | ✅ Done |
| Quality Engine skill (`skills/core/quality-engine/SKILL.md`) | ✅ Done |
| `vibe-quality-engine` command (`commands/vibe-quality-engine.md`) | ✅ Done |
| Quality Engine guide (`docs/quality-engine-guide.md`) | ✅ Done |
| Quality Engine registry entries (`skills.json`, `prompts.json`) | ✅ Done |

## v2.1 — Model-Aware Config
**Status:** ✅ COMPLETE

| Deliverable | Status |
|---|---|
| Model-Aware Config skill (`skills/core/model-aware-config/SKILL.md`) | ✅ Done |
| `vibe-model-config` command (`commands/vibe-model-config.md`) | ✅ Done |
| Model-Aware Config guide (`docs/model-aware-config-guide.md`) | ✅ Done |
| Model-Aware Config registry entries (`skills.json`, `prompts.json`) | ✅ Done |

## v2.2 — Quality Telemetry & Analytics
**Status:** ✅ COMPLETE

| Deliverable | Status |
|---|---|
| Quality Telemetry skill (`skills/core/quality-telemetry/SKILL.md`) | ✅ Done |
| `vibe-quality-telemetry` command (`commands/vibe-quality-telemetry.md`) | ✅ Done |
| Quality Telemetry guide (`docs/quality-telemetry-guide.md`) | ✅ Done |
| Package scripts for telemetry emit, metrics, and trend report | ✅ Done |
| Registry entries (`skills.json`, `prompts.json`) | ✅ Done |
| Runtime script implementations (`quality-event-emitter`, `session-metrics-collector`, `quality-trend-report`) | ✅ Done |

## v2.3 — Multi-Repository Learning
**Status:** ✅ COMPLETE

| Deliverable | Status |
|---|---|
| Lesson exchange schema (`schemas/lesson-exchange-format.json`) | ✅ Done |
| Lesson exporter/importer scripts | ✅ Done |
| Lesson quality checker | ✅ Done |
| Lesson exchange sample template | ✅ Done |

## v2.4 — CI/CD Integration
**Status:** ✅ COMPLETE

| Deliverable | Status |
|---|---|
| PR quality gate workflow (`.github/workflows/vibe-quality-gate.yml`) | ✅ Done |
| Weekly quality report workflow (`.github/workflows/vibe-quality-report.yml`) | ✅ Done |
| Reusable GitHub composite action | ✅ Done |
| PR quality summary template | ✅ Done |
| CI/CD integration guide | ✅ Done |

## v2.5 — Advanced Orchestration
**Status:** ✅ COMPLETE

| Deliverable | Status |
|---|---|
| Orchestration workflow schema (`schemas/orchestration-workflow.json`) | ✅ Done |
| Workflow templates (feature, bugfix, security audit) | ✅ Done |
| Workflow runner (`scripts/orchestrate-workflow.mjs`) | ✅ Done |
| Orchestration skill and command | ✅ Done |
| Orchestration guide | ✅ Done |

---

## Overall Progress

- v0.1.1: ████████████ 100%
- v0.2:   ████████████ 100%
- v0.3:   ████████████ 100%
- v0.4:   ████████████ 100%
- v1.0:   ████████████ 100%
- v1.1:   ████████████ 100%
- v1.2:   ████████████ 100%
- v1.3.0: ████████████ 100%
- v1.4.0: ████████████ 100%
- v1.4.1: ████████████ 100%
- v1.4.2: ████████████ 100%
- v1.4.3: ████████████ 100%
- v1.5.0: ████████████ 100%
- v1.6.0: ███░░░░░░░░░ 25% (Sprint 1 partially done)
- v1.7.0: ████████████ 100%
- v1.8.0: ████████████ 100%
- v1.9.0: ████████████ 100%
- v2.0:   ████████████ 100%
- v2.1:   ████████████ 100%
- v2.2:   ████████████ 100%
- v2.3:   ████████████ 100%
- v2.4:   ████████████ 100%
- v2.5:   ████████████ 100%
