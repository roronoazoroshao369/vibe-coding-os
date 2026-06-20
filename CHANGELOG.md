# Changelog

## [2.13.0] - 2026-06-20

### Theme: Security Shield + Engineering Quality Lift

**Wave A — Security Critical (Council of Security & Trust)**
- Bypass authorization gate: `scripts/load-bypass-techniques.mjs` gates `registry/bypass-techniques.json` payloads behind `VIBE_ENABLE_OFFENSIVE_TECHNIQUES=1` + `--authorization-ref`. Executable templates stripped from JSON; only metadata remains. All load attempts logged to `docs/security/bypass-load-attempts.log`.
- Default-deny hooks baseline: `.claude/settings.json` + 6 hook scripts (PreToolUse default-deny with allowlist per (tool, action); UserPromptSubmit injection scan; PostToolUse secret scan; SessionStart context load; Stop session snapshot; SessionEnd audit flush).
- OWASP LLM Top 10 coverage in `skills/core/secure-coding-checklist/SKILL.md` — LLM01–LLM10 mapping layer added to existing OWASP table.
- Prompt anti-injection contract in `templates/prompt-template-7-section.md` — anti-injection checklist (treat tool output as untrusted, persona ≤2 sentences, constraint origin).
- License policy enforcement: `scripts/validate-licenses.mjs` fails CI if `import_mode=inspiration` + non-permissive license. Flagged eyaltoledano (Commons-Clause) and multica-ai (MIT-incomplete) as `tracked_inspiration`.

**Wave B — Engineering High-Value Additive (Council of Engineering)**
- `skills/core/safe-refactor/SKILL.md` + `commands/vibe-refactor.md` + `templates/refactor-plan.md` — 5-phase refactor protocol (characterize → cover → extract → migrate → cleanup).
- 3 ops templates: `templates/incident-postmortem.md`, `templates/rollout-plan.md`, `templates/runbook.md`. Linked from `skills/core/observability-design/SKILL.md`.
- `docs/workflows/plan-skill-decision-tree.md` — 6 plan-family skills disambiguated with 7-step decision tree. `## Choose instead` sections added to all 6 plan-* skills.
- `scripts/validate-traceability.mjs --strict-new --since=<tag>` — promotes orphan warnings to ERRORS for newly-added files since the tag.
- ADR refs in `registry/runtime-freeze-allowlist.json` — `adr` field points to `docs/adr/0002-runtime-scope-freeze.md`. New `scripts/validate-runtime-freeze.mjs` enforces policy.

**Quality metric**
- Validation gates: 28 → 30 (added License policy + Traceability strict-new).
- Skills: 142 → 143 (safe-refactor).
- Templates: 112 → 116 (refactor-plan, incident-postmortem, rollout-plan, runbook).
- All 30/30 gates PASS.

All notable changes to Vibe Coding OS will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.12.0] — 2026-06-20 — "Quality Shield + rohitg00 Adoption + GitHub SEO"

### Added
- 3 NEW core skills inspired by `RohitG00/awesome-claude-code-toolkit` (Apache-2.0, verified 2026-06-20):
  - `skills/core/claude-code-hooks-pack/SKILL.md` — declarative pattern for `PreToolUse`/`PostToolUse`/`Stop`/`SessionStart`/`SessionEnd` hooks with matchers and guard rails
  - `skills/core/secure-coding-checklist/SKILL.md` — OWASP Top 10-mapped three-layer review (input validation, output encoding, identity & capability)
  - `skills/core/prompt-architecture/SKILL.md` — 7-section prompt template (Persona → Context → Constraints → Toolset → Output Schema → Examples → Anti-patterns)
- 3 NEW commands: `vibe-hooks-pack`, `vibe-secure-coding`, `vibe-prompt-architect`
- 3 NEW templates: `hooks-pack-template`, `secure-coding-checklist-template`, `prompt-template-7-section`
- NEW skill files for broken refs: `skills/core/red-team-bypass/SKILL.md`, `skills/core/writing-skills/SKILL.md`
- NEW template: `templates/skill-template.md` (8-section canonical template enforced by `validate-skill-quality.mjs`)
- NEW validator: `scripts/validate-skill-quality.mjs` — lints every SKILL.md against the 8-section contract; flags weak verbs, non-falsifiable verification gates, missing required sections, and token bloat
- NEW adapter artifacts:
  - `adapters/windsurf/.windsurfrules.template` — drop-in `.windsurfrules` content
  - `adapters/windsurf/windsurf.json` + `adapters/windsurf/TROUBLESHOOTING.md`
  - `adapters/cline/MODE_ARTIFACTS.md` — 3 mode files (architect / ask / code)
  - `adapters/cline/mcp_settings.example.json` + `adapters/cline/TROUBLESHOOTING.md` + `adapters/cline/cline.json`
- NEW docs: `docs/marketplace/SUBMISSION.md` (Claude Code marketplace submission package)
- NEW asset: `docs/assets/social-preview.png` (1200×630 marketing banner)
- NEW reference source: `RohitG00/awesome-claude-code-toolkit` (#22) — Apache-2.0, `references/sources/rohitg00-awesome-claude-code-toolkit.md` + changelog
- GitHub SEO overhaul: 15 repo topics, project description, Discussions enabled, social preview image

### Changed
- Enhanced `skills/core/quality-engine/SKILL.md` — falsifiable Verification checklist (LCP/INP/CLS/TTFB/API p99, FCP, console errors, network call budget, profile coverage)
- Enhanced `skills/core/verification-before-done/SKILL.md` — falsifiable 5-axis Verification checklist with concrete gates
- Enhanced `adapters/windsurf/README.md` — added "Files in this adapter" table, references to `.windsurfrules.template` + `TROUBLESHOOTING.md`
- Enhanced `adapters/cline/README.md` — added "Files in this adapter" table, references to `MODE_ARTIFACTS.md` + `TROUBLESHOOTING.md` + `mcp_settings.example.json`
- Enhanced `package.json` — added `validate:skill-quality` script
- Enhanced `scripts/validate-all.mjs` — wired in `validate-provenance.mjs` (Move 2a quick win) and `validate-skill-quality.mjs`
- Enhanced `registry/skills.json` — registered 5 new skills (claude-code-hooks-pack, secure-coding-checklist, prompt-architecture, red-team-bypass, writing-skills)
- Enhanced `registry/prompts.json` — registered 3 new commands (vibe-hooks-pack, vibe-secure-coding, vibe-prompt-architect)
- Enhanced `plugins/marketplace.json` — bumped to v2.12.0; updated description and inner plugin counts
- Enhanced `README.md`, `README.vi.md`, `docs/DASHBOARD.md` — all metadata bumped to v2.12.0 with new counts

### Fixed
- Provenance gate was not wired into `validate-all.mjs` (now wired — Move 2a).
- Three orphan skills were referenced but missing files (red-team-bypass, writing-skills, prompt-architecture — now created).
- One broken markdown link in `prompt-architecture/SKILL.md` (path now resolves).

### Validation
- `npm run validate:all` → **28/28 PASS**
- `npm run validate:references` → **22 sources, 26 features, 5 commands**
- `npm run validate:skill-quality` → **142 skills, 0 errors, 249 informational warnings**
- `npm run quality:engine` → **PASS**

## [Unreleased]

## [2.11.0] — 2026-06-20 — "Engineering Discipline Pack"

### Added
- 5 NEW core skills inspired by `addyosmani/agent-skills` (MIT, verified 2026-06-20):
  - `skills/core/doubt-driven-development/SKILL.md` — in-flight doubt posture with CLS-DAR protocol and Loading Constraints
  - `skills/core/observability-design/SKILL.md` — questions-before-signals workflow with metric/log/trace trade-off
  - `skills/core/deprecation-migration/SKILL.md` — Compulsory/Advisory classification with 5 pre-deprecation questions
  - `skills/core/threat-model-driven-security/SKILL.md` — STRIDE 6-letter lens on (boundary, asset, adversary) tuples + abuse cases
  - `skills/core/vertical-slicing/SKILL.md` — end-to-end vertical slice doctrine with 5-step cycle
- 7 NEW commands: `vibe-doubt`, `vibe-observability`, `vibe-deprecate`, `vibe-migrate`, `vibe-threat-model`, `vibe-slice`, `vibe-perf-budget`
- 6 NEW templates: `doubt-log`, `observability-plan-template`, `deprecation-notice-template`, `threat-model-template`, `slice-spec-template`, `performance-budget-template`
- NEW architectural artifacts: `plugins/manifest.json` (plugin metadata), `plugins/marketplace.json` (discovery index)
- NEW registry: `registry/deprecation-tracker.json` (append-only deprecation ledger)
- NEW reference source tracking: `addyosmani/agent-skills` (#21), `references/sources/addyosmani-agent-skills.md`, `references/changelogs/addyosmani-agent-skills.md`

### Changed
- Enhanced `skills/core/quality-engine/SKILL.md` — added Core Web Vitals targets table (LCP/INP/CLS/TTFB/API p99) and MEASURE → IDENTIFY → FIX → VERIFY → GUARD loop
- Enhanced `skills/core/grill-user-before-building/SKILL.md` — added 95% confidence stop condition, single-question cadence, Loading Constraints anti-pattern catalog
- Enhanced `skills/core/verification-before-done/SKILL.md` — added 5-axis runtime verification (DOM, Console, Network, Performance, Visual)
- Enhanced `docs/orchestration-guide.md` — added Anti-patterns section (persona-calls-persona, deep trees, single-agent-all-perspectives, summarize-for-handoff, sequential-when-parallel, mid-slice commits) + Loading Constraints table
- Enhanced `scripts/validate-schemas.mjs` — soft-warns on missing recommended skill sections (`## Common rationalizations`, `## Red flags`, `## Verification checklist`) without breaking existing skills
- Enhanced `commands/manifest.json` and `templates/manifest.json` — generated from filesystem (108 commands, 92 templates)

### Sources
- `addyosmani/agent-skills` (MIT) — full attribution in `ATTRIBUTIONS.md` and `NOTICE.md`

### Inspiration sources tracked
- 20 → 21 sources

## [2.9.0] — 2026-06-19

### Added
- Release pipeline automation for streamlined versioning and publish workflow.
- Plugin metadata support for adapter manifests and plugin discovery.
- MCP command tools for richer model-context-protocol integration.
- Dashboard trend persistence — CI-friendly trend data across releases.
- Context injection skill for runtime prompt augmentation.
- AC (acceptance criteria) quality pack for structured verification.
- Agent alignment workflow for multi-agent coordination.

### Changed
- CLAUDE.md slimmed down for faster agent onboarding and reduced token usage.
- Memory compression for more efficient session storage.
- Anti-overengineering guardrails applied across core workflows.

### Fixed
- Claude Code quality pass: AGENTS.md deduplication, CLAUDE.md polish, onboarding UX fixes.
- Post-release sync: README v2.8.0 sections, CLI tool listing, adapter smoke tests.

## [2.8.0] — 2026-06-19

### Added
- Adapter expansion: **Cline**, **Continue.dev**, **Aider**, and **Windsurf** adapters with setup manifests and documentation.
- Per-adapter README setup commands and compatibility notes.

### Changed
- Adapter support matrix expanded to cover 8 AI coding tools.

## [2.7.0] — 2026-06-19

### Added
- AI Testing Suite: property-based testing framework for skill and command validation.
- Benchmark harness for measuring workflow execution performance.
- Test generator for automated behavioral test creation from specs.
- Trend dashboard for visualizing test pass/fail rates over time.
- PR comment integration for automated test summary annotations.

## [2.6.0] — 2026-06-19

### Added
- Full implementation loop for all reference source features — upstream tracking, adoption scoring, provenance gates, and audit changelogs now fully wired end-to-end.
- AI Testing Suite roadmap and Docusaurus website scaffold.
- 4 new upstream sources added to reference index.
- Bug-fix lifecycle tracking in reference docs.
- MemScore triple metric in reference evaluation docs.

### Fixed
- Lesson-importer ISO expiry handling.
- Schema warnings and CLI bug fixes.
- Dashboard sync drift corrections.

## [2.5.0] — 2026-06-19

### Added
- Advanced Orchestration — roadmap 100% complete.
- Multi-agent task routing and parallelization rules.
- Team orchestration handoff contracts and conflict handling.

## [2.4.0] — 2026-06-19

### Added
- CI/CD Integration layer for automated validation, testing, and release gates.
- GitHub Actions workflow enhancements for full validation pipeline.

## [2.3.0] — 2026-06-19

### Added
- Multi-Repo Learning — cross-repository skill and pattern sharing.
- Upstream intelligence aggregation across linked repositories.

## [2.2.0] — 2026-06-19

### Added
- Quality Telemetry & Analytics: event emitter, metrics collector, and trend reports.
- Runtime quality metrics for skill execution and workflow outcomes.

## [2.1.0] — 2026-06-19

### Added
- Model-Aware Configuration: model profiles, task-risk classifier, and adaptive gate selector.
- Context-aware workflow tier selection based on model capabilities.

## [2.0.0] — 2026-06-19

### Added
- Quality Engine MVP: gate manifest, engine runner, report generator, quality skill, and quality command.
- Structured quality verification framework with configurable gate definitions.

## [1.9.0] — 2026-06-19

### Added
- Smart Adapt: model weakness memory, adaptive prompts, lessons learned, and scorecard report.
- Runtime adaptation based on observed model failure patterns.

## [1.8.0] — 2026-06-19

### Added
- Expert Mode: adversarial review pass, critique pass, 5 task-specific quality packs, and quality council.
- Structured expert-level review workflows for high-risk changes.

### Fixed
- Dashboard and roadmap sync corrections.

## [1.7.0] — 2026-06-19

### Added
- Quality Shield: quality-shield.md guide, quality-shield-workflow.md process, and quality-shield example.
- Code Context Pack, Pattern Library, and Quality Diff Audit (Sprint 2).
- Quality Shield completion artifacts and canonical guide.

## [1.6.0] — 2026-06-19

### Added
- Adoption Trust foundations: README user/maintainer paths, adapter documentation, layer entrypoints.
- CLI onboarding UX polish (`vibe init`, `vibe doctor`).
- Validation gates and governance documentation.
- Examples hub for discoverable workflow templates.
- Project-local scope-selecting setup flow.

### Changed
- Hardened v1.6 adoption trust foundations across roadmap and docs.

## [1.5.0] — 2026-06-17

### Added
- docs/adr/0002-runtime-scope-freeze.md: formal runtime scope freeze declaration.
- docs/vi/QUICKSTART.md: Vietnamese quickstart guide.
- .github/ISSUE_TEMPLATE/adoption-feedback.md: structured adoption feedback issue template.

### Fixed
- runtime/core/config.mjs: normalize unknown maxRiskLevel to default on load.
- runtime/core/config.mjs: validate tools.allowed / tools.denied are arrays of strings.
- runtime/core/approval-gate.mjs: approval subject includes argsHash so approval is scoped per argument set.
- runtime/tasks/task-store.mjs: reject negative TTL in claimTask, heartbeatTask, renewTaskLease.
- scripts/test-runtime-claim-lease.mjs: replace negative TTL test setup with backdated store writes; add explicit negative TTL rejection tests.

### Changed
- README.vi.md: dieted from 536 to 194 lines.
- docs/ROADMAP-STATUS.md: added v1.4.1, v1.4.2, v1.4.3, v1.5.0 sections.
- docs/support-matrix.md: runtime layer now documents scope freeze and ADR 0002.
- docs/adr/0001-optional-runtime-layer.md: reconcile with ADR 0002 scope freeze.
- CHANGELOG.md: fix runtime test count claim from 18/18 to 14/14 test files.
- docs/releases/v1.4.3.md: reconcile runtime test count.

## [1.4.3] — 2026-06-17

### Fixed
- task-store.mjs: `claimTask()` now rejects terminal states (completed/cancelled) — state machine contract is solid.
- task-store.mjs: `renewTaskLease()` now caps absolute expiration at `now + maxTaskLease`, preventing lease drift from migrated/corrupt data.
- tmux-runner.mjs: `requireTmux()` now throws an Error instead of calling `process.exit(1)`, making it safe for library and test use.
- tmux-runner.mjs: `mapResults()` now returns final task objects (after status updates) instead of stale pre-update objects.
- runtime/mcp/server.mjs: `task.update` handler now forwards `actor: mcp` into `updateTaskStatus()`.
- runtime/core/config.mjs: invalid `maxTaskLease` values (zero, negative, non-finite) silently reset to defaults with a `_configWarning` field.
- README.md: reduced from 618 → ~260 lines. Product identity is now unmistakable on first load.
- README.vi.md: updated to v1.4.3 with matching Vietnamese release notes.
- docs/README.md: rewritten as a full docs navigation hub with categorized template links (resolves 12 orphan template warnings).
- docs/vi/strategy-and-roadmap.md: updated from v1.4.0 → v1.4.2/v1.4.3 with current status metrics.
- docs/RELEASE-PACKAGING.md: version header updated from 1.0.0 → current; workflow modernized.

### Changed
- README.md: new "What's new in v1.4.3" section, clear "Core vs Optional Runtime" section, adapter bullet list for traceability.
- docs/QUICKSTART.md: rewritten with explicit doc role ("tool setup only, not a workflow guide").
- docs/FIRST-WORKFLOW.md: added scope statement linking to QUICKSTART and INSTALL.
- docs/RELEASE-PACKAGING.md: rewritten for v1.4.x workflow with modern `npm pkg set` flow.

### Tests
- Added `claimTask rejects terminal tasks` test (verifies terminal state guard).
- Added `renewTaskLease absolute expiration capped by config maxTaskLease` test (verifies absolute lease cap).
- Runtime behavior aggregate: 14/14 test files PASS; claim/lease test file includes terminal state, lease cap, and negative TTL cases.

## [1.4.1] — 2026-06-17

### Fixed
- Stale docs counts: README.vi template count (54→56), support-matrix version references, Vietnamese strategy/roadmap refreshed for v1.4.
- CHANGELOG.md now includes v1.1.0–v1.4.0 and v1.4.1 entries (previously missing).
- CLI pack `install-pack` usage help shows flags and required/optional args correctly.
- CLI `doctor` help now shows `--project <path>` (not `[--project]`), `events` shows `--limit=N`.
- Removed unused import `appendEventV2` in vibe-cli.mjs.
- Removed unreachable `if (json)` branch in `cmdDoctor` after early return.
- Task state machine: fixed misleading subtask guard comment.
- task-store.mjs: removed dead no-op conditional block.
- test-runtime-audit.mjs test data now uses valid status `in_progress` instead of `active`.
- tmux-runner.mjs: validated agent command before shell interpolation, single-quoted prompt path.

## [1.4.0] — 2026-06-17

### Added
- Runtime kernel with optional config layer, formal task state machine, and broader schema enforcement.
- Event Store v2 with sequence numbers, correlation/causation IDs, idempotency keys, and metadata consistency checks.
- Runtime observability via `vibe doctor --json` and `vibe events --json`.
- Config-enforced `maxTaskLease` behavior in claim/renew APIs.
- Event-store v2 tests, doctor tests, and CLI JSON contract tests.

### Changed
- Legacy events.mjs append path now wraps canonical v2 behavior.
- Expanded runtime behavioral test coverage to 14 suites.

### Fixed
- `vibe doctor --json` now emits JSON-only output.
- `vibe events` shows latest/recent events correctly.
- `--limit` validation for event CLI output.

## [1.3.0] — 2026-06-17

### Added
- Runtime enforcement core: centralized validation layer before runtime store writes with `assertValidItem`, `assertStrictCollection`, `assertKnownFields`, `assertRiskWithin`, `assertAction`.
- Claim/lease task APIs: `claimTask`, `releaseTask`, `heartbeatTask`, `renewTaskLease`, `listExpiredClaims`, `cancelExpiredClaims`.
- Safety & recovery: approval gate middleware, tool boundary enforcement (fail-closed), runtime safety audit, event replay/snapshot/migration utilities.
- Behavioral integration tests: 9 test files, 76 test cases (validation gate #18).
- 2 new templates: `session-metrics`, `skill-proposal`.

### Fixed
- Release-facing README, README.vi, and roadmap history updated.
- Heading-version validator added as validation gate #17.

## [1.2.0] — 2026-06-17

### Added
- Runtime schema v2 foundation with `contractVersion`, `runtimeId`, `revision`, `createdBy`, `source`, `trace`, `risk` fields.
- Multi-agent state contracts v2 for task, workflow-run, checkpoint, session, team, and memory schemas.
- Safety + traceability: action v2, runtime event, approval, tool-contract schemas.
- Migration manifest + dry-run engine for safer runtime-state upgrades.

### Fixed
- Docs drift hotfix: dashboard gate count, version progress, orphan wording, Vietnamese strategy wording corrected.
- Validators expanded to catch stale counts and dashboard/version drift earlier.

## [1.1.0] — 2026-06-17

### Added
- Schema alignment across registries, runtime payloads, and validation scripts.
- Workflow state hardening for task, memory, checkpoint, team, session, and MCP flows.
- Expanded CLI coverage: 20 CLI smoke tests passing.
- Adapter packs refreshed for Cursor, Codex, and Claude setups.
- Execution trace support for local runtime activity logging.
- Bilingual sync validation for English/Vietnamese documentation alignment.
- Markdown link validation to catch broken references before release.

### Changed
- Expanded release validation from 13 to 16 gates.
- Refreshed adapter documentation for portability across tools.

## [1.0.0] — 2026-06-17

### Added
- Dashboard sync validation (`scripts/check-dashboard-sync.mjs`, `npm run dashboard:check`) that verifies `docs/DASHBOARD.md` matches live package version, inventory counts, narrative file count, and orphan counts; added to `npm run validate:all`.
- Release checklist issue template (`.github/ISSUE_TEMPLATE/release_checklist.md`) for tracking RC progress, validation gates, documentation checks, and post-release verification.
- Compatibility report issue template (`.github/ISSUE_TEMPLATE/compatibility_report.md`) for adapter compatibility regressions and support-tier issues.
- Safety / eval report issue template (`.github/ISSUE_TEMPLATE/safety_eval_report.md`) for safety check failures, eval regressions, and security concerns.
- PR template updated with v1.0 gates section: `validate:all`, schema validation, CLI/E2E, release dry-run, and docs/dashboard sync.
- Governance doc updated to reference new issue templates for routing release, compatibility, and safety work.
- v1.0 release plan (`docs/v1.0-release-plan.md`) with scope definition, done criteria, required gates, RC strategy (`v1.0.0-rc.1` → feedback → final), and release manager workflow.
- v1.0 RC checklist (`docs/v1.0-rc-checklist.md`) with pre-RC validation, release notes requirements, documentation completeness checks, and post-merge verification steps.
- Support matrix (`docs/support-matrix.md`) with adapter support tiers, optional runtime vs core expectations, and compatibility policy summary.
- ROADMAP-STATUS.md updated: v0.4.0 marked as release-ready, v1.0 progress moved to ~65% with v1.0 planning deliverables.
- README status refresh with CI/status badges, compact current-status line (v0.4.0, 90 skills, 68 commands, 41 templates, validate:all 13/13, 0 broken refs, 0 orphans), and links to DASHBOARD, RELEASE-PACKAGING, ROADMAP-STATUS, QUICKSTART, tutorial, v0.4.0 release notes, and v1.0 release plan. Equivalent Vietnamese updates in README.vi.md.
- v0.4.0 GitHub Release notes draft (`docs/releases/v0.4.0.md`) with summary, highlights, validation status, upgrade notes, and post-merge tag instructions.
- RELEASE-PACKAGING.md now points to `docs/releases/v0.4.0.md` as the current release note draft.
- 15-minute onboarding tutorials in English and Vietnamese (`docs/TUTORIAL.md`, `docs/vi/TUTORIAL.vi.md`) covering clone/install, validation, CLI artifacts, eval reports, review/merge checklist, and troubleshooting.
- v1.0 contribution governance and maintainer process docs (`docs/governance.md`, `docs/decision-record-process.md`, `docs/maintainer-guide.md`), plus `CONTRIBUTING.md` links and roadmap updates.
- Stable registry schema contracts in `schemas/` for the reference index, skills, commands, and templates.
- Lightweight schema validation (`scripts/validate-schemas.mjs`, `npm run validate:schemas`) covering schema JSON validity, `references/index.json`, skill headings/descriptions, and command prompt content.
- Registry schema documentation (`docs/registry-schemas.md`) and full validation gate coverage via `npm run validate:all`.
- CLI smoke tests (`scripts/smoke-test-cli.mjs`, `npm run smoke-test:cli`) covering 7 read-only CLI commands with pass/fail per command and overall.
- Dashboard generator (`scripts/generate-dashboard.mjs`, `npm run dashboard:generate`) that regenerates `docs/DASHBOARD.md` from live dashboard data with auto-generated mark.
- `npm run dashboard:data` script alias for direct JSON data extraction.
- CLI smoke tests and dashboard data checks added to `npm run validate:all`.
- Release checklist updated with dashboard regeneration section.
- `scripts/vibe-cli.mjs` and `scripts/dashboard-data.mjs` refactored to export their command/functionality for reuse by other scripts.
- End-to-end CLI workflow integration test (`scripts/test-e2e-workflow.mjs`, `npm run test:e2e`) that copies templates to a temp dir, asserts content, runs read-only CLI commands, and cleans up. Added to validation gate (`npm run validate:all`) and release checklist.
- Release dry-run automation (`scripts/release.mjs`, `npm run release:dry-run`) that validates clean git status, runs the full validation gate and dashboard data check, and prints exact tag/GitHub release next steps without pushing tags.
- GitHub Actions validate workflow now runs the full `npm run validate:all` gate, with the adapter smoke workflow documented as fast path-focused coverage.

## [0.4.0] — 2026-06-16

### Added
- Release packaging guide (`docs/RELEASE-PACKAGING.md`) covering version numbering, tag naming conventions, pre-release checklist, GitHub release creation, CHANGELOG section header updates, and a release notes template
- Version bump script (`scripts/bump-version.sh`) — automated version updates to `package.json`, CHANGELOG section header migration, git tag creation, and next-step instructions
- CLI workflow examples (`examples/cli-workflows/README.md`) — practical examples for `vibe doctor`, `vibe spec`, `vibe plan`, `vibe task`, `vibe memory`, `vibe templates`, and `npm run eval:report` with expected outputs and usage guidance
- Project health dashboard (`docs/DASHBOARD.md`) with quick status, safety metrics, coverage summary, and regeneration commands
- Dashboard data extractor (`scripts/dashboard-data.mjs`) for clean JSON counts across skills, commands, templates, narrative files, upstream sources, and traceability warnings
- Full validation gate (`scripts/validate-all.mjs`, `npm run validate:all`) covering repo, references, traceability, injection, secrets, memory redaction, adapter smoke tests, and eval summary
- ROADMAP-STATUS.md updated to mark dashboard + validate-all as done under v1.0
- ROADMAP-STATUS.md updated to mark release packaging and CLI examples as done
- Detailed adapter install snippets for Claude Code, Codex, and Cursor, including `docs/adapter-install-snippets.md` and per-adapter README setup commands.
- v1.0 foundation docs: core workflow contract, release checklist, compatibility/support policy (docs/core-workflow-contract.md, docs/release-checklist.md, docs/compatibility-support-policy.md)
- Memory redaction test suite (30 cases in docs/tests/ + scripts/verify-memory-redaction.mjs)
- CLI helper MVP (`vibe init`, `vibe doctor`, `vibe stats`, `vibe list-skills`, `vibe list-commands`) in scripts/vibe-cli.mjs
- Adapter smoke tests + CI workflow (scripts/smoke-test-adapters.mjs, .github/workflows/smoke-test.yml)
- Upstream Intelligence Pack (`docs/skill-packs/upstream-intelligence-pack.md`) with Discover → Score → Provenance/License Gate → Adapt, don't copy → Attribute → Validate → Report workflow, safe import checklist, and upstream evaluation example
- Skill packs: Core Solo Developer, Memory-Safe, Multi-Agent (docs/skill-packs/)
- Skill decision guide (docs/skill-decision-guide.md)
- Runtime guide (docs/RUNTIME-GUIDE.md — MCP setup, commands, troubleshooting)
- ROADMAP-STATUS.md (docs/ROADMAP-STATUS.md)
- CHANGELOG.md (Keep a Changelog format)
- CONTRIBUTING.md (skill/command/template contribution guide)
- CODE_OF_CONDUCT.md (Contributor Covenant v2.1)
- .github/ (issue templates, PR template, CI workflows)
- docs/QUICKSTART.md (10-min guides for Claude Code, Codex, Cursor)
- 5 examples: bugfix-workflow, feature-workflow, legacy-enhancement, multi-agent-task, refactor-workflow
- docs/eval-scenarios.md (5 behavioral evaluation scenarios)
- references/upstream-intake-scorecard.md (1-5 rubric + decision matrix)
- docs/adr/0002-notification-system.md (ADR for multi-agent demo)
- Evaluation report runner (scripts/evaluation-report.mjs)
- 15-minute onboarding tutorials in English and Vietnamese (`docs/TUTORIAL.md`, `docs/vi/TUTORIAL.vi.md`) covering clone/install, validation, CLI artifacts, eval reports, review/merge checklist, and troubleshooting.
- v1.0 contribution governance trio: governance, decision-record process, and maintainer guide (`docs/governance.md`, `docs/decision-record-process.md`, `docs/maintainer-guide.md`), plus `CONTRIBUTING.md` links and roadmap updates.
- Stable registry schemas in `schemas/` for the reference index, skills, commands, and templates, with lightweight schema validation (`scripts/validate-schemas.mjs`, `npm run validate:schemas`) and full validation gate coverage.
- CLI smoke tests (`scripts/smoke-test-cli.mjs`, `npm run smoke-test:cli`) covering read-only CLI commands with pass/fail reporting.
- Dashboard generator (`scripts/generate-dashboard.mjs`, `npm run dashboard:generate`) plus `npm run dashboard:data` for direct JSON data extraction.
- End-to-end CLI workflow integration test (`scripts/test-e2e-workflow.mjs`, `npm run test:e2e`) that exercises template copies, read-only CLI commands, assertions, and cleanup.
- v0.4.0 GitHub Release notes draft (`docs/releases/v0.4.0.md`) with copy-ready release body and post-merge tag commands.

## [0.1.0] — 2026-06-06

First public release of Vibe Coding OS — a markdown-first AI coding skill framework for disciplined vibe coding.

### Added

#### Core Workflow
- Default workflow: **Intent → Spec → Plan → Implement → Test → Review → Memory → Merge**
- Adaptive workflow tiers: tiny, small, medium, large, and risky
- Spec-driven development layer with constitution, specify, plan, tasks, and implementation-readiness gate

#### Skills System
- 90 skills across 5 categories:
  - **Core** (47): clarify-before-code, spec-first-development, plan-driven-execution, TDD, review-before-merge, verification, anti-overengineering, and more
  - **Prompts** (13): Karpathy-inspired think/simplicity/surgical/goal-driven disciplines and coding book principles
  - **Memory** (17): session capture, summarization, privacy filtering, progressive retrieval, citation
  - **Meta** (9): skill writing, reuse, skillify-from-session
  - **Agents** (4): architect, implementer, reviewer, tester roles

#### Command Prompts
- 68 command prompts in `vibe-*` format covering initialization, specification, planning, implementation, review, memory, merge, diagnostics, reference, and team orchestration

#### Templates
- 41 reusable templates for specs, plans, tasks, PRDs, ADRs, architecture reviews, reviews, diagnoses, memory entries, session summaries, handoffs, upstream audits, reference scorecards, team specs, and runtime configs

#### Reference Intelligence Layer
- Tracking 14 upstream sources with source docs, feature maps, local file mappings, audit changelogs, and `references/index.json`
- Upstream adoption policy with 7-point adoption gate
- Clean attribution via `ATTRIBUTIONS.md` and `NOTICE.md`

#### Runtime Layer (Optional)
- JSON-first local state for tasks, memory, checkpoints, team, and sessions
- MCP server exposing task/memory/checkpoint tools
- Tmux team runner for parallel agent execution
- Daemon workflow support
- Vector memory search (optional)
- Idempotent installer (`runtime-install.mjs`)

#### Adapters
- **Claude Code**: plugin manifest (`.claude-plugin/plugin.json`), marketplace manifest, manual setup via `CLAUDE.md`
- **Codex CLI**: instruction surface via `AGENTS.md`
- **Cursor**: `.cursorrules` and manual chat workflow
- **Gemini CLI**: `GEMINI.md` instruction file

#### Validation System
- Repository structure validation
- Reference layer validation
- Traceability validation (broken internal references, orphan detection)
- Injection validation
- Secrets detection
- Provenance tracking

#### Documentation
- Bilingual documentation: Vietnamese (`docs/vi/`) and English
- Vietnamese README (`README.vi.md`)
- Vietnamese onboarding docs: index, skills-and-commands, folders-and-workflows, strategy-and-roadmap
- Adapter compatibility matrix
- Real engineering skills workflow documentation

#### Team-Agent Orchestration
- Team architecture templates
- Role routing (architect, implementer, tester, reviewer, memory architect)
- Handoff contracts and conflict handling
- Parallelization rules and review gates

#### Memory and Privacy Layer
- Session capture and summarization
- Privacy filter and redaction checklist
- Progressive memory disclosure
- Observation citation
- Secret and credential exclusion

### License

This project is licensed under the [MIT License](LICENSE).

[Unreleased]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v2.9.0...HEAD
[2.9.0]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v2.8.0...v2.9.0
[2.8.0]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v2.7.0...v2.8.0
[2.7.0]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v2.6.0...v2.7.0
[2.6.0]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v2.5.0...v2.6.0
[2.5.0]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v2.4.0...v2.5.0
[2.4.0]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v2.3.0...v2.4.0
[2.3.0]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v2.2.0...v2.3.0
[2.2.0]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v2.1.0...v2.2.0
[2.1.0]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v1.9.0...v2.0.0
[1.9.0]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v1.8.0...v1.9.0
[1.8.0]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v1.7.0...v1.8.0
[1.7.0]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v1.6.0...v1.7.0
[1.6.0]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v1.5.0...v1.6.0
[1.5.0]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v1.4.3...v1.5.0
[1.4.3]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v1.4.1...v1.4.3
[1.4.1]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v1.4.0...v1.4.1
[1.4.0]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v0.4.0...v1.0.0
[0.4.0]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v0.1.0...v0.4.0
[0.1.0]: https://github.com/roronoazoroshao369/vibe-coding-os/releases/tag/v0.1.0
