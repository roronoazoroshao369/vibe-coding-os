# Changelog: github/spec-kit

## Purpose

Track upstream changes that may affect Vibe Coding OS.

## Entries

### 2026-06-06 baseline local clone audit

- Source: `github/spec-kit`.
- Commit: `7106858c4e636098815fffa23f6c6b99eb0e156b`.
- License status: MIT.
- Finding: Audited local clone for spec-driven workflows, command packaging, templates, and tests around agent integrations. Adopted the general principle that spec and plan workflows should be represented as validated local artifacts; no upstream content imported.
- Local follow-up: keep future audits in `references/changelogs/github-spec-kit.md`, update `references/index.json`, and use `references/upstream-audit-workflow.md` before adapting ideas.

### 2026-06-06 spec-driven-development integration

- Date: 2026-06-06.
- Audited upstream: `github/spec-kit` at commit `7106858c4e636098815fffa23f6c6b99eb0e156b` (MIT). Reviewed README, `spec-driven.md` methodology narrative, `templates/`, `src/` (Specify CLI), `scripts/`, and `pyproject.toml` from the local audit clone. No upstream content imported.
- Applied features: project-constitution, spec-first-development (sharpened), what-before-how, plan-from-spec, task-breakdown-from-plan, acceptance-criteria, dependency-aware-task-ordering, parallel-task-markers, tdd-task-ordering, checkpoint-validation, implementation-readiness-gate, brownfield-enhancement, creative-parallel-exploration, spec-template-quality.
- Not applied: full Specify CLI as a dependency, upstream command names as mandatory, copying upstream templates/prompts, agent installer, full extension/preset runtime, language-specific generated projects, replacing the PRD-from-context docs.
- Local skills created: `skills/core/project-constitution`, `skills/core/what-before-how`, `skills/core/plan-from-spec`, `skills/core/task-breakdown-from-plan`, `skills/core/acceptance-criteria`, `skills/core/dependency-aware-task-ordering`, `skills/core/checkpoint-validation`, `skills/core/brownfield-spec-enhancement`, `skills/core/brainstorming (merged v2.17)`, `skills/meta/write-reusable-skill`, `skills/meta/write-reusable-skill`. Enhanced: `skills/core/spec-first-development`.
- Commands created: `vibe-constitution`, `vibe-specify`, `vibe-plan-from-spec`, `vibe-tasks`, `vibe-implement-from-tasks`, `vibe-checkpoints`, `vibe-brownfield-spec`, `vibe-parallel-explore`, `vibe-spec-audit`.
- Templates created: `constitution-template`, `tasks-template`, `checkpoint-template`, `brownfield-spec-template`, `parallel-exploration-template`, `spec-audit-template` (reused existing `spec-template`/`plan-template` with spec-traceability cross-links).
- Docs created: `CONSTITUTION.md`, `docs/specs/README.md`, and workflow docs `spec-driven-development`, `constitution-to-spec-to-plan`, `spec-to-tasks-to-implementation`, `brownfield-spec-enhancement`, `creative-parallel-exploration`. Feature docs created/updated under `references/features/`.
- Indexing/mapping updates: refreshed `references/index.json` spec-kit entry (category `spec-driven-development`, full feature list, `local_targets`, `maintenance_priority`, `upstream_watch_paths`, `update_triggers`); appended spec-kit sections to `source-to-local-skills.md`, `feature-to-local-files.md`, and `update-impact-map.md`. Updated `ATTRIBUTIONS.md`, `NOTICE.md`, and `registry/sources.json`.
- Remaining follow-ups: optionally wire a lightweight spec-status check into validation; evaluate a preset/extension design doc into a future runtime only if demand appears; revisit upstream agent-integration assets on next audit.

### Unreleased / Next audit

- No new upstream audit performed since 2026-06-06.
