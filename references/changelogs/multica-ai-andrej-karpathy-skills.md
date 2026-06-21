# Changelog: multica-ai/andrej-karpathy-skills

## Purpose

Track upstream changes that may affect Vibe Coding OS.

## Entries

### 2026-06-07 deep-adapt of all four engineering-discipline principles

- Source: `multica-ai/andrej-karpathy-skills`.
- Commit: `2c606141936f1eeef17fa3043a72095b4765b9c2`.
- License status: MIT declared in metadata only (`.claude-plugin/plugin.json`, README) by
  author `forrestchang`; no standalone LICENSE file and no copyright line → grant
  incomplete/unverifiable. Remains inspiration-only re-write.
- Finding: The local layer previously covered only two of the four principles in
  `skills/prompts/karpathy-engineering-discipline` (Think Before Coding, Surgical Changes).
  Confirmed Simplicity First is covered by `skills/prompts/anti-overengineering` and the
  verification evidence bar by `skills/core/verification-before-done`. Goal-Driven
  Execution (rewrite an imperative into a verifiable goal with per-step checks for independent
  looping) was missing as a distinct discipline.
- Local follow-up: Added `skills/core/goal-driven-execution/SKILL.md` (original wording),
  cross-linked the four principles into one coherent set, updated the karpathy skill's
  out-of-scope pointers, and registered the new skill in `registry/skills.json`,
  `references/index.json`, mappings, control maps, and `ATTRIBUTIONS.md`. No upstream text
  copied.

### 2026-06-06 baseline local clone audit

- Source: `multica-ai/andrej-karpathy-skills`.
- Commit: `2c606141936f1eeef17fa3043a72095b4765b9c2`.
- License status: No root license found.
- Finding: Audited local clone for assumption-first, simplicity-first, surgical-change, and goal-driven guardrail patterns. License remains unresolved, so this source stays inspiration-only; no upstream content imported.
- Local follow-up: keep future audits in `references/changelogs/multica-ai-andrej-karpathy-skills.md`, update `references/index.json`, and use `references/upstream-audit-workflow.md` before adapting ideas.

### Unreleased / Next audit

- No upstream audit performed yet.
- Initial tracking file created.
