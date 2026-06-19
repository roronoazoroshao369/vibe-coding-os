# Changelog: yvgude/lean-ctx

## Purpose

Track upstream changes that may affect Vibe Coding OS.

## Entries

### 2026-06-19 Initial tracking and adaptation

- Date: 2026-06-19.
- Source: `yvgude/lean-ctx`.
- Owner: yvgude
- URL: https://github.com/yvgude/lean-ctx
- Stars: 2.7k+, License: Apache-2.0 (declared in upstream README).
- Finding: Audited the upstream concept of policy-based context control for AI coding agents.
  The core value is a rule system (allow/block/flag) for controlling what files enter the
  agent's context window, with severity levels, scope declarations, and sensitive content
  patterns. No upstream source code, configuration files, or documentation text imported.
- Applied features: policy-based-context-control, allow-block-flag-rules, severity-levels,
  default-modes, sensitive-content-patterns, scope-declaration.
- Not applied: upstream rule file format, CLI tool, runtime policy daemon, inotify watcher.
- Local skills created: `skills/core/context-policy/SKILL.md` (110+ lines).
- Templates created: `templates/context-policy-template.md` (55+ lines).
- Existing files enhanced: `skills/memory/privacy-filter/SKILL.md` (context-policy ref),
  `docs/workflows/context-engineering.md` (policy-based context section).
- Indexing/mapping updates: added `yvgude-lean-ctx` entry to `references/index.json`,
  `registry/sources.json`; appended sections to
  `references/mappings/feature-to-local-files.md` and
  `references/mappings/source-to-local-skills.md`; registered new skill
  in `registry/skills.json`.
- Attribution: `yvgude/lean-ctx` added to `ATTRIBUTIONS.md` and `NOTICE.md`.

### Unreleased / Next audit

- No new upstream audit performed since 2026-06-19.
