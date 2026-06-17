# Support Matrix

This document summarizes adapter support tiers, runtime optionality, and compatibility expectations for current stable Vibe Coding OS releases.

## Adapter Support Tiers

| Tier | Label | What It Means |
|------|-------|---------------|
| Tier 1 | 🟢 Full | Actively tested in CI for each release; documented in QUICKSTART.md and adapter README; issues triaged with priority. |
| Tier 2 | 🟡 Community | Core workflow known to work; not actively tested in CI; community contributions accepted; adapter README exists but may be less detailed. |
| Tier 3 | 🔵 Experimental | Prototype or incoming adapter; gaps may exist; issues accepted on a best-effort basis. |

### Current Adapter Tier Map

| Adapter | Tier | Primary Instruction Surface | CI Coverage |
|---------|------|-----------------------------|-------------|
| Claude Code | Tier 1 | `CLAUDE.md` / plugin surface | Adapter smoke tests + validation |
| Codex CLI | Tier 1 | `AGENTS.md` | Adapter smoke tests + validation |
| Cursor | Tier 2 | `.cursorrules` / manual paste | Smoke tests only |
| Gemini CLI | Tier 2 | `GEMINI.md` / `AGENTS.md` | Smoke tests only |

### Tier 1 Requirements

To remain or become Tier 1, an adapter must satisfy:

- Dedicated adapter README in `adapters/<tool>/`
- Working instructions referenced or linked from `docs/QUICKSTART.md`
- CI-compatible adapter smoke test in the release gate set
- Entry in `adapters/compatibility-matrix.md`
- Post-merge verification that install/onboarding instructions work without undocumented changes

## Optional Runtime vs Core Markdown Expectations

Vibe Coding OS separates framework identity from optional runtime behavior.

### Core Layer (Release-Blocking)

Core is the project's portable identity and must meet the current stable release standards.

Core includes:

- Skills in `skills/`
- Commands in `commands/`
- Templates in `templates/`
- Docs and reference documentation
- Validation scripts and registry contracts

Core expectations:

- Stable workflow contract
- Stable registry schemas
- Full validation gate coverage
- Published release checklist, RC checklist, support policy, and support matrix
- No secrets, broken refs, or unreleased-breaking changes to workflow semantics

### Optional Runtime Layer (Not Release-Blocking)

The optional runtime extends the framework but is not the framework itself.

Runtime includes:

- Runtime scripts under `runtime/`
- Optional MCP and daemon workflow support
- Optional memory, task, or team runner features beyond the core markdown workflow

Runtime expectations:

- **Scope frozen from v1.5.0.** Runtime additions require an explicit ADR exception per [ADR 0002](adr/0002-runtime-scope-freeze.md).
- Must not alter core workflow semantics.
- Must not be required for normal markdown-first usage.
- Changes limited to: bug fixes, security/safety hardening, compatibility maintenance, test/validation coverage, documentation.
- Should not expand release blocking scope beyond what is documented in the core gates.

### Boundary Rule

Core work should not be hidden inside runtime requirements. If a capability is needed for v1.0 release readiness, it belongs in the core layer, validation gates, documentation, or compatibility policy.

## Compatibility Policy Summary

These points summarize the v1.0 compatibility posture.

- Vibe Coding OS follows Semantic Versioning.
- A major version bump is required for breaking changes to the workflow contract, pipeline phases, or mandatory task-tier artifacts.
- New adapters, commands, skills, templates, and non-breaking enhancements are appropriate for minor versions.
- Bug fixes, docs updates, and validation script fixes are appropriate for patch versions.
- Breaking changes include renaming or removing phases, commands, skills, Tier 1 adapter status, or required artifacts in a way that invalidates existing workflow evidence.
- Adding optional capabilities, relaxing requirements, or improving validation are generally non-breaking.
- Deprecated items should be announced, left functional for one minor version, and removed only after migration guidance is published.
- Release-blocking compatibility gates include Tier 1 adapter smoke tests, core validation, traceability checks, and secret scanning.

## Related Documents

- [Compatibility & Support Policy](compatibility-support-policy.md)
- [Adapter Compatibility Matrix](../adapters/compatibility-matrix.md)
- [v1.0 Release Plan](v1.0-release-plan.md)
- [Core Workflow Contract](core-workflow-contract.md)
