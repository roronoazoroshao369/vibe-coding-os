# Changelog

All notable changes to Vibe Coding OS will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

Next: v1.0 hardening and release-candidate work.

### Added
- README status refresh with CI/status badges, compact current-status line (v0.4.0, 90 skills, 68 commands, 41 templates, validate:all 11/11, 0 broken refs/orphans), and links to DASHBOARD, RELEASE-PACKAGING, ROADMAP-STATUS, and QUICKSTART. Equivalent Vietnamese updates in README.vi.md.
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

[Unreleased]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v0.4.0...HEAD
[0.4.0]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v0.1.0...v0.4.0
[0.1.0]: https://github.com/roronoazoroshao369/vibe-coding-os/releases/tag/v0.1.0
