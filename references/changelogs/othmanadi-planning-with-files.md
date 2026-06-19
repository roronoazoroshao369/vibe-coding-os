# Changelog: othmanadi/planning-with-files

## Purpose

Track upstream changes that may affect Vibe Coding OS.

## Entries

### 2026-06-19 Initial tracking and adaptation

- Date: 2026-06-19.
- Source: `othmanadi/planning-with-files`.
- Owner: OthmanAdi
- URL: https://github.com/OthmanAdi/planning-with-files
- Stars: 23k+, License: MIT (declared in upstream README).
- Finding: Audited the upstream concept of persistent plan files that survive context resets.
  The core value is a file-based planning format with completion markers, checkpoint labels,
  and a recovery workflow. No upstream source code, templates, or documentation text imported.
- Applied features: persistent-plan-format, completion-markers, checkpoint-system,
  recovery-workflow, recovery-attempt-tracking, crash-scenario-taxonomy.
- Not applied: upstream file format conventions, runtime plan engine, daemon, cloud sync.
- Local skills created: `skills/core/crash-proof-planning/SKILL.md` (110+ lines).
- Commands created: `commands/vibe-session-catchup.md` (65+ lines).
- Templates created: `templates/crash-proof-plan-template.md` (55+ lines).
- Feature docs created: `references/features/crash-proof-planning.md` (55+ lines).
- Indexing/mapping updates: added `othmanadi-planning-with-files` entry to
  `references/index.json`, `registry/sources.json`; appended sections to
  `references/mappings/feature-to-local-files.md` and
  `references/mappings/source-to-local-skills.md`; registered new skill and command
  in `registry/skills.json` and `registry/prompts.json`.
- Attribution: `othmanadi/planning-with-files` added to `ATTRIBUTIONS.md` and `NOTICE.md`.

### Unreleased / Next audit

- No new upstream audit performed since 2026-06-19.
