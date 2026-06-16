# Changelog

All notable changes to Vibe Coding OS will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Memory redaction test suite (30 cases in docs/tests/ + scripts/verify-memory-redaction.mjs)
- CLI helper MVP (`vibe init`, `vibe doctor`, `vibe stats`, `vibe list-skills`, `vibe list-commands`) in scripts/vibe-cli.mjs
- Adapter smoke tests + CI workflow (scripts/smoke-test-adapters.mjs, .github/workflows/smoke-test.yml)
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

### Roadmap

Future releases planned from the project roadmap:

- **0.1.1** — Validation Recovery & Vietnamese Onboarding
- **0.2** — Adoption MVP
- **0.3** — Evidence & Safety
- **0.4** — Packaging & Skill Packs
- **1.0** — Trusted Workflow Framework

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

[Unreleased]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/roronoazoroshao369/vibe-coding-os/releases/tag/v0.1.0
