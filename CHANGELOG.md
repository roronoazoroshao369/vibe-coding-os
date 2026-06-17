# Changelog

All notable changes to Vibe Coding OS will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

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

[Unreleased]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v1.4.1...HEAD
[1.4.1]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v1.4.0...v1.4.1
[1.4.0]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v0.4.0...v1.0.0
[0.4.0]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v0.1.0...v0.4.0
[0.1.0]: https://github.com/roronoazoroshao369/vibe-coding-os/releases/tag/v0.1.0
