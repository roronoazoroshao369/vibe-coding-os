# Historical Master Plan: Vibe Coding OS — Roadmap v1.8.0 → v2.5.0

> Historical/complete plan. Generated: 2026-06-18 | Based on Expert Council synthesis + repo baseline audit.
> Superseded by `docs/plans/2026-06-23-long-term-quality-roadmap-v2.19-to-v3.0.md` and summarized in `ROADMAP.md` / `docs/ROADMAP-STATUS.md`.

## 0. Current Baseline

**HEAD:** `60be23e` (v1.7.0 — Quality Shield) on `main`
**Validation gates:** 25 checks in `validate:all`
**Inventory:** 112 skills, 88 commands, 80 templates, 515 narrative files

### What already exists (foundations for future versions)

| Version | Existing Artifacts |
|---------|-------------------|
| **v1.8.0 Expert Mode** | Skills: `adversarial-code-review`, `writer-critic-pair`, 5 quality-packs (`api-endpoint`, `auth`, `db-migration`, `frontend-state`, `async-job`). **Missing:** critique-pass-protocol skill, Quality Council pattern, commands (`vibe-adversarial-review`, `vibe-quality-api`, etc.), docs hub/quality-shield sync, registry completeness |
| **v1.9.0 Smart Adapt** | Skills: `model-weakness-memory`, `adaptive-prompt-selection`, `lessons-learned-db`. Scripts: `quality-scorecard.mjs`, `quality-scorecard-report.mjs`. **Missing:** commands (`vibe-model-weakness`, `vibe-adaptive-prompt`, `vibe-lessons-learned`), scorecard templates, docs/smart-adapt.md, registry |
| **v2.0 Quality Engine** | Skills: `quality-engine`, commands: `vibe-quality-engine`, docs: `quality-engine-guide.md`, scripts: `quality-engine.mjs`+`report`, schemas: `quality-engine-config.json`, templates: config. Validation gate #25 exists. Registry partially wired. **Missing:** integration tests per profile, guide Quickstart, gate manifest template hardening, expanded docs |
| **v2.1 Model-Aware Config** | Skills: `model-aware-config`. Schemas: not yet. Commands: none. **Missing:** all listed deliverables in ROADMAP-STATUS |
| **v2.2 Quality Telemetry** | Skills: `quality-telemetry`. Scripts: `quality-event-emitter.mjs`, `session-metrics-collector.mjs`, `quality-trend-report.mjs`. **Missing:** command, guide, privacy section, registry, validation gate wiring |
| **v2.3 Multi-Repository Learning** | Skills: `lessons-learned-db` (shares with v1.9). **Missing:** lesson exchange schema, scripts, quality checker, template |
| **v2.4 CI/CD Integration** | **Nothing yet** |
| **v2.5 Advanced Orchestration** | Skills: `orchestration-workflows`. Schemas: none yet. Commands: none. |

**Key issues found:**
1. `ROADMAP-STATUS.md` shows v1.8 → v2.5 as 0% PLANNED but many skills/schemas/scripts already exist
2. `docs/releases/v1.9.0-release-notes.md` exists but ROADMAP-STATUS says v1.9 PLANNED (stale)
3. Registry has forward-references to existing skills but some commands/templates are missing
4. Several v2.x scripts run fine but lack command/skill/docs wrappers for discoverability

### Master Plan Strategy

**Principle:** Harden + release existing artifacts, fill gaps, release version-by-version.
- Markdown-first: no new runtime engines (ADR 0002 freeze respected)
- Validation gates expand only when new runnable checks are wired
- Each version is a clean PR with validation evidence

---

## Phase A — Quality Shield Elevation (v1.8.0 → v1.9.0)

### Sprint 1: v1.8.0 — Expert Mode Release

**Branch:** `feat/v1.8.0-expert-mode`

**Definition of Done:**
- [ ] All v1.8 skills/checklists have corresponding `commands/vibe-*.md` command files
- [ ] `skills/core/critique-pass-protocol/SKILL.md` created
- [ ] `skills/agents/quality-council/SKILL.md` created (multi-agent pattern)
- [ ] Registry (`skills.json`, `prompts.json`) complete for all v1.8 artifacts
- [ ] `docs/expert-mode.md` created (canonical guide)
- [ ] `docs/quality-shield.md` updated with Expert Mode pathways
- [ ] `docs/releases/v1.8.0-release-notes.md` created
- [ ] `npm run validate:all` passes with 25/25 (no new gates needed)
- [ ] README, README.vi, DASHBOARD sync
- [ ] ROADMAP-STATUS marked v1.8.0 COMPLETE

**Team 1 — Review Protocols (non-overlapping: skills/agents/, skills/core/critique, prompts)**:
- `skills/core/critique-pass-protocol/SKILL.md` — new
- `skills/agents/quality-council/SKILL.md` — new
- `vibe-adversarial-review` command — new
- `commands/vibe-critique-pass.md` — new
- `templates/critique-pass-template.md` — new

**Team 2 — Task-Specific Quality Commands (non-overlapping: commands/vibe-quality-*)**:
- `commands/vibe-quality-api.md`
- `commands/vibe-quality-db-migration.md`
- `commands/vibe-quality-auth.md`
- `commands/vibe-quality-frontend-state.md`
- `commands/vibe-quality-async-job.md`
- quality checklist report template — optional

**Team 3 — Docs Sync & Registry (non-overlapping: docs/, registry/, README*)**:
- `docs/expert-mode.md` — canonical guide
- `docs/quality-shield.md` — update with Expert Mode connections
- `docs/releases/v1.8.0-release-notes.md`
- Registry updates (`skills.json`, `prompts.json`)
- Update README, README.vi banner and What's New
- Regenerate DASHBOARD, check sync

**Exit:** Full validation pass. Squash → PR → merge.

---

### Sprint 2: v1.9.0 — Smart Adapt Release

**Branch:** `feat/v1.9.0-smart-adapt`

**Definition of Done:**
- [ ] All v1.9 skills have associated command files
- [ ] Scorecard templates created for session reporting
- [ ] `docs/smart-adapt.md` created
- [ ] `examples/quality-elevation/` with at least 1 scored session
- [ ] Registry complete
- [ ] Validation passes
- [ ] README/README.vi/DASHBOARD sync
- [ ] ROADMAP-STATUS marked v1.9.0 COMPLETE

**Team 1 — Model Weakness & Adaptive Prompts**:
- `commands/vibe-model-weakness.md`
- `commands/vibe-adaptive-prompt.md`
- `commands/vibe-lessons-learned.md`
- `templates/model-weakness-log.md`
- `templates/adaptive-prompt-matrix.md`
- `templates/lesson-entry-template.md`

**Team 2 — Scorecards & Examples**:
- `templates/quality-scorecard-session.md`
- `docs/smart-adapt.md`
- `examples/quality-elevation/README.md` + one scored example
- `scripts/quality-scorecard-report.mjs` — enhance with session template support

**Team 3 — Registry & Docs Sync**:
- Registry entries for all v1.9 skills and commands
- `docs/releases/v1.9.0-release-notes.md`
- README/README.vi banner updates
- DASHBOARD, ROADMAP-STATUS

**Exit:** Full validation. Squash → PR → merge.
**Council Checkpoint:** After merge — Phase A review before proceeding to Phase B.

---

## Phase B — Quality Engine Hardening (v2.0.0 → v2.1.0)

### Sprint 3: v2.0.0 — Quality Engine Release

**Branch:** `feat/v2.0.0-quality-engine`

**Definition of Done:**
- [ ] Quality Engine integration tests for 3 profiles (lean/standard/heavy)
- [ ] Gate manifest template + schema hardened
- [ ] Guide updated with Quickstart (30s to run)
- [ ] Adaptive gate selector wired (task-type-aware)
- [ ] Registry entries verified and complete
- [ ] New validation gate #26: `validate:quality-engine-e2e`
- [ ] Validation passes with 26/26
- [ ] ROADMAP-STATUS marked v2.0.0 COMPLETE

**Team 1 — Schemas & Contracts:**
- `schemas/quality-gate-manifest.json` — harden
- `templates/quality-gate-manifest.json` — create
- Integration test script: `scripts/test-quality-engine.mjs`
- `templates/quality-engine-config.json` — enhance with profile examples

**Team 2 — Runner & Report:**
- `scripts/quality-engine.mjs` — enhance with task-type gate selection
- `scripts/adaptive-gate-selector.mjs` — wire into engine
- `scripts/quality-engine-report.mjs` — enhance with profile comparison
- `package.json` scripts

**Team 3 — Docs & Registry:**
- `docs/quality-engine-guide.md` — add Quickstart, profile comparison, examples
- Registry entries completion
- `docs/releases/v2.0.0-release-notes.md`
- New gate #26 wired in `validate-all.mjs` + README/DASHBOARD cascade
- ROADMAP-STATUS

**Exit:** 26/26 validation pass. Squash → PR → merge.

---

### Sprint 4: v2.1.0 — Model-Aware Config

**Branch:** `feat/v2.1.0-model-aware-config`

**Team 1 — Skill & Command:**
- `commands/vibe-model-config.md` — new
- `skills/core/model-aware-config/SKILL.md` — harden with model detection workflow

**Team 2 — Schema & Guide:**
- `schemas/model-profile-registry.json` — create (if not exists) or harden
- model profile registry config — default profiles (claude, codex, gemini)
- `docs/model-aware-config-guide.md`
- Quality engine integration: `--model` flag support

**Team 3 — Registry & Validation:**
- Registry entries
- New gate #27: `validate:model-profiles`
- README/README.vi/DASHBOARD cascade
- Release notes v2.1.0

**Exit:** 27/27 validation pass.
**Council Checkpoint:** After merge — Phase B review.

---

## Phase C — Metrics & Learning (v2.2.0 → v2.3.0)

### Sprint 5: v2.2.0 — Quality Telemetry & Analytics

**Branch:** `feat/v2.2.0-quality-telemetry`

**Team 1 — Skill, Command, Guide, Privacy:**
- `commands/vibe-quality-telemetry.md`
- `docs/quality-telemetry-guide.md` + privacy/opt-in section
- `docs/privacy.md` or equivalent note

**Team 2 — Scripts Hardening:**
- `scripts/quality-event-emitter.mjs` — enhance with privacy filters
- `scripts/session-metrics-collector.mjs` — enhance
- `scripts/validate-property-tests.mjs (replaced quality-trend v2.17)` — enhance with comparison
- `package.json` scripts

**Team 3 — Validation & Registry:**
- New gate #28: `validate:telemetry-privacy` (scans for HTTP calls, PII exposure)
- Registry entries
- Release notes v2.2.0
- README/DASHBOARD cascade
- ROADMAP-STATUS

**Exit:** 28/28 validation pass. Squash → merge.

---

### Sprint 6: v2.3.0 — Multi-Repository Learning

**Branch:** `feat/v2.3.0-multi-repo-learning`

**Team 1 — Schema & Templates:**
- `schemas/lesson-exchange-format.json` — create/harden
- lesson exchange sample — create

**Team 2 — Import/Export Scripts:**
- `scripts/lesson-exporter.mjs`
- `scripts/lesson-importer.mjs`
- `scripts/lesson-quality-checker.mjs`

**Team 3 — Docs & Validation:**
- `docs/multi-repository-learning.md`
- New gate #29: `validate:lesson-exchange`
- Registry entries
- Release notes v2.3.0
- README/DASHBOARD cascade

**Exit:** 29/29 validation pass.
**Council Checkpoint:** After merge — Phase C review.

---

## Phase D — Delivery Integration (v2.4.0 → v2.5.0)

### Sprint 7: v2.4.0 — CI/CD Integration

**Branch:** `feat/v2.4.0-ci-cd-integration`

**Team 1 — GitHub Workflows:**
- `.github/workflows/vibe-quality-gate.yml` — PR quality gate
- `.github/workflows/vibe-quality-report.yml` — weekly trend
- `.github/actions/vibe-quality/action.yml` — reusable composite action

**Team 2 — Templates & Guide:**
- PR quality summary template
- `docs/ci-cd-integration-guide.md` — includes GitHub+non-GitHub notes

**Team 3 — Validation:**
- New gate #30: `validate:ci-yaml` (syntax check on workflow files)
- Registry (if new commands created)
- Release notes v2.4.0
- README/DASHBOARD cascade

**Exit:** 30/30 validation pass. Squash → merge.

---

### Sprint 8: v2.5.0 — Advanced Orchestration

**Branch:** `feat/v2.5.0-advanced-orchestration`

**Team 1 — Workflow Contracts:**
- `schemas/orchestration-workflow.json` — create
- feature workflow orchestration template
- bugfix workflow orchestration template
- security audit workflow orchestration template

**Team 2 — Runner:**
- `scripts/orchestrate-workflow.mjs` — dry-run first, safe execution
- Package scripts for orchestration
- `skills/core/orchestration-workflows/SKILL.md` — harden

**Team 3 — Docs & Governance:**
- `vibe-orchestrate-workflow` command
- `docs/orchestration-guide.md`
- New gate #31: `validate:orchestration-workflows`
- Release notes v2.5.0
- README/DASHBOARD cascade
- ROADMAP-STATUS final update

**Exit:** 31/31 validation pass. Roadmap 100% complete.
**Council Checkpoint:** Final audit before tagging v2.5.0.

---

## Validation Gate Expansion Summary

| # | New Gate | Added In | Notes |
|---|---------|----------|-------|
| 26 | `validate:quality-engine-e2e` | v2.0.0 | Integration tests per profile |
| 27 | `validate:model-profiles` | v2.1.0 | Schema + default profile compliance |
| 28 | `validate:telemetry-privacy` | v2.2.0 | No HTTP, no PII exposure scan |
| 29 | `validate:lesson-exchange` | v2.3.0 | Schema + importer safety |
| 30 | `validate:ci-yaml` | v2.4.0 | Workflow YAML syntax check |
| 31 | `validate:orchestration-workflows` | v2.5.0 | Schema + template compliance |

**Total after completion:** 31 validation gates (25 current + 6 new)

---

## Execution Conventions (from sprint skills)

1. **Before each sprint:** `git checkout main && git pull origin main && git checkout -b feat/<version>`
2. **Spawning teams:** max 3 parallel subagents, non-overlapping file ownership (use Team deliniation above)
3. **Validation:** After each team set, run `npm run validate:all` + `git checkout -- docs/reports/evaluation-report.md` before squash
4. **Squash:** `git reset --soft origin/main` → `git commit -m "feat: vX.Y.Z — title"` → `npm run validate:all` → `git checkout -- docs/reports/evaluation-report.md`
5. **PR:** Create via GitHub API, wait for CI, squash-merge
6. **Release cycle:** 2-PR pattern: feature → merge → release-docs PR → tag → GitHub Release
7. **GitHub authentication source:** local Git credential store for API-based PR and release operations

---

## Release Sequence

| Version | Tag | Dependencies |
|---------|-----|-------------|
| v1.8.0 | `v1.8.0` | None (from v1.7.0 main) |
| v1.9.0 | `v1.9.0` | v1.8.0 (uses adversarial outputs) |
| v2.0.0 | `v2.0.0` | v1.9.0 (adaptive prompts feed engine) |
| v2.1.0 | `v2.1.0` | v2.0.0 (engine reads model config) |
| v2.2.0 | `v2.2.0` | v2.1.0 (telemetry tags include model) |
| v2.3.0 | `v2.3.0` | v2.2.0 (lessons use telemetry data) |
| v2.4.0 | `v2.4.0` | v2.3.0 (CI uses quality engine + telemetry) |
| v2.5.0 | `v2.5.0` | v2.4.0 (orchestration uses CI gates) |

---

## Final 100% Definition of Done

- [ ] ROADMAP-STATUS: all versions v1.8.0→v2.5.0 ✅ COMPLETE
- [ ] All skills/commands/templates registered and traceability clean
- [ ] `npm run validate:all`: 31/31 gates PASS
- [ ] Release tags: all 8 versions tagged with release notes
- [ ] GitHub Releases exist with evidence, scope, known limitations
- [ ] README/README.vi banners match latest version and gate count
- [ ] Dashboard current at v2.5.0
- [ ] No runtime expansion beyond ADR 0002 boundary
- [ ] Expert Council final audit report in `docs/reports/v2.5.0-final-audit.md`
