# Compatibility & Support Policy — v1.0

This document defines the support levels, adapter compatibility expectations, breaking change policy, and minimum validation requirements for Vibe Coding OS.

> **Policy version:** 1.0
> **Effective from:** v1.0.0

---

## 1. Support Levels

Each tool/adapter is assigned one of three support levels:

| Level | Label | Meaning |
|-------|-------|---------|
| **Tier 1 — Full** | 🟢 Full | Actively tested with every release; documented in QUICKSTART.md and adapter README; issues are triaged with priority. |
| **Tier 2 — Community** | 🟡 Community | Core workflow is known to work; not actively tested in CI; community contributions accepted; adapter README exists but may be less detailed. |
| **Tier 3 — Experimental** | 🔵 Experimental | Prototype or incoming adapter; may have gaps; issues accepted but best-effort turnaround; documented in a README or plan. |

### Tool Support Matrix

| Tool | Level | Instruction Surface | Notes |
|------|-------|---------------------|-------|
| **Claude Code** | 🟢 Full | `CLAUDE.md`, `.claude-plugin/` | Primary target; plugin install recommended; all commands and skills available via `\`/vibe-*\` plugin commands or manual paste. |
| **Codex CLI** | 🟢 Full | `AGENTS.md` | Works via instruction file and manual command paste; skills attached by path; smoke-tested in CI. |
| **Cursor** | 🟡 Community | `.cursorrules` or chat paste | Manual paste workflow; no native skill loader; commands and skills work via copy-paste. |
| **Gemini CLI** | 🟡 Community | `GEMINI.md` or `AGENTS.md` | Instruction file at session start; manual command/skill paste; same workflow as Codex but less CI coverage. |

### Support Level Changes

- Upgrading from Community to Full requires:
  - Dedicated adapter README in `adapters/<tool>/`
  - Tested quickstart instructions in `docs/QUICKSTART.md`
  - CI smoke test in `.github/workflows/smoke-test.yml`
  - Entry in `adapters/compatibility-matrix.md`
- Downgrading from Full to Community requires a documented reason (e.g., breaking tool changes, low usage, resource constraints).

---

## 2. Adapter Compatibility Expectations

### What Every Adapter Must Provide

1. **Instruction surface** — A file (or documented mechanism) telling the AI assistant to follow the Vibe Coding OS workflow. Examples: `CLAUDE.md`, `AGENTS.md`, `.cursorrules`.
2. **Phase commands** — The ability to invoke the 8 pipeline phases (Intent → Spec → Plan → Implement → Test → Review → Memory → Merge) either via plugin commands (`/vibe-*`), pasted `commands/*.md` files, or documented manual steps.
3. **Skill access** — A way to reference or attach skills from `skills/*/*/SKILL.md` (by file path, content paste, or plugin trigger).
4. **Validation** — Ability to run `npm run validate` (or project equivalent) as a verification step.

### What Each Adapter Is NOT Expected To Do

- Automatically load all skills (use selective attachment)
- Guarantee identical behavior across tools (each assistant has unique capabilities and limitations)
- Support every advanced workflow feature (some are tool-specific)

### Adapter Validation Gate

All Tier 1 adapters must pass `node scripts/smoke-test-adapters.mjs` before a release. The smoke test verifies:

- Expected files exist in the adapter directory
- Adapter README is syntactically valid markdown
- Adapter references the core workflow contract
- Adapter mentions supported commands/skills/templates

---

## 3. Breaking Change Policy

### Definition of Breaking Change

A **breaking change** is any modification that:

1. Removes, renames, or changes the semantics of an existing pipeline phase (`Intent → Spec → Plan → Implement → Test → Review → Memory → Merge`)
2. Deletes or renames an existing `vibe-*` command without a deprecation period
3. Removes or renames a published skill directory or `SKILL.md`
4. Changes the required artifact set for an existing task tier (Tiny, Small, Medium, Large, Risky) in a way that invalidates existing artifacts
5. Alters an instruction surface contract (e.g., what `CLAUDE.md` tells the agent) in a way that breaks existing user workflows
6. Drops a Tier 1 adapter to Community or Experimental without notice

### Non-Breaking Changes

The following are **not** considered breaking:

- Adding new phases, commands, skills, tiers, or adapters
- Relaxing evidence requirements for a tier
- Adding optional fields to registries
- Changing documentation that is not part of the workflow contract
- Fixing validation scripts to catch previously undetected issues (provided they do not break valid existing usage)

### Deprecation Process

1. **Announce** — Mark the deprecated item with a `> **Deprecated:**` notice in the relevant file, pointing to the replacement.
2. **Grace period** — Keep the deprecated item functional for **one minor version** (e.g., if deprecated in v1.1, remove in v1.2).
3. **Migrate** — Update `CHANGELOG.md` with migration instructions.
4. **Remove** — Remove the deprecated item in the next minor version.

### Exceptions

Security fixes or critical bug patches may bypass the deprecation process if keeping the old behavior would cause harm. Such changes must be documented in `CHANGELOG.md` with the rationale.

---

## 4. Minimum Validation Expectations

Every adapter setup must support these validation checks:

| Check | Command | Why It Matters |
|-------|---------|---------------|
| Repo structure | `npm run validate` | Ensures all registry entries match files on disk; catches structural drift |
| Traceability | `npm run validate:traceability` | Catches broken internal links and orphan artifacts |
| Secrets | `npm run validate:secrets` | Prevents accidental credential leaks |
| Memory redaction | `npm run verify-memory-redaction.mjs` | Confirms memory safety filter works |
| Adapter smoke | `node scripts/smoke-test-adapters.mjs` | Confirms adapter directories are complete and well-formed |

### Release Gate

Before any v1.0+ release, **all** validation checks must pass. A failing check blocks the release.

### Development Gate

During development, contributors must run `npm run validate` before committing. The opt-in gates (`validate:secrets`, `validate:provenance`) are recommended before submitting a PR.

---

## 5. Versioning Policy

Vibe Coding OS follows [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html):

- **Major (x.0.0):** Breaking change to the workflow contract, pipeline phases, or task tier requirements
- **Minor (0.y.0):** New adapters, commands, skills, templates, or non-breaking enhancements to existing features
- **Patch (0.0.z):** Bug fixes, documentation improvements, validation script fixes

---

## 6. Related Documents

- **Core Workflow Contract** (`core-workflow-contract.md`): Defines the pipeline and task tiers that this policy governs.
- **Release Checklist** (`release-checklist.md`): Operational steps for validating a release against this policy.
- **Adapter Compatibility Matrix** (`adapters/compatibility-matrix.md`): Detailed per-tool capabilities.
- **CONTRIBUTING.md**: Development workflow for contributors.
- **CHANGELOG.md**: Version history and migration notes.
