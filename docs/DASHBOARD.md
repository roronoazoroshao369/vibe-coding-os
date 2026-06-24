# Vibe Coding OS — Project Health Dashboard

> **Generated from source-of-truth metadata** (`scripts/repo-metadata.mjs`) on 2026-06-24.
> Release-facing counts come from package.json, active manifests, and the validation script list.

## Quick Status

| Metric | Value |
|---|---|
| Version | 2.18.0 |
| Skills | 112 |
| Commands | 115 |
| Templates | 107 |
| Upstream sources | 22 |
| Validation gates | 16 |

## Source-of-truth policy

| Item | Source |
|---|---|
| Version | `package.json` |
| Validation gate count | `package.json:scripts.validate:all` |
| Skill count | filesystem: `skills/<category>/<name>/SKILL.md`, excluding root aggregator |
| Command count | `commands/manifest.json` active public command list |
| Template count | `templates/manifest.json` active template list |
| Dashboard sync | `npm run dashboard:check` |
| Docs sync | `npm run validate:docs-sync` |
| Roadmap sync | `npm run validate:roadmap-sync` |

## Version Progress

| Version | Status | Target |
|---|---|---|
| v2.18.0 | ✅ Complete | Surface Simplification, Core 10 golden path, privacy coverage, maintainer runbook, source-of-truth sync |
| v2.17.7 | ✅ Complete | MCP auth CI wiring, token priority tests, runtime wording fix |
| v2.17.6 | ✅ Complete | MCP token handshake and runtime injection scan |
| v2.17.5 | ✅ Complete | Stat sync, CI consolidation, orphan/deprecated command checks |
| v2.17.4 | ✅ Complete | Council finding closure, stale refs fixed, dead validators removed |
| v2.17.3 | ✅ Complete | Newcomer UX fix, template manifest regen, autopilot tests |
| v2.17.2 | ✅ Complete | CODEOWNERS and ADR frontmatter safety |
| v2.17.1 | ✅ Complete | Tool-contract allowlist expansion, workflow CLI commands |
| v2.17.0 | ✅ Complete | Expert Council Trim, Core surface reduction, Autopilot runtime |
| v2.16.x and earlier | ✅ Historical complete | See `CHANGELOG.md` and `docs/ROADMAP-STATUS.md` |
| v2.19 → v3.0 | 🔄 Active roadmap | Behavior proof, one front door, structural uniformity, sustainability, FTQS |

## Validation Gate

| Gate | Status | Source |
|---|---|---|
| validate-repo | ✅ PASS expected | `scripts/validate-repo.mjs` |
| validate-references | ✅ PASS expected | `scripts/validate-references.mjs` |
| validate-traceability | ✅ PASS expected | `scripts/validate-traceability.mjs` |
| validate-injection | ✅ PASS expected | `scripts/validate-injection.mjs` |
| validate-imports | ✅ PASS expected | `scripts/validate-imports.mjs` |
| validate-typecheck | ✅ PASS expected | `scripts/validate-typecheck.mjs` |
| validate-scope-match | ✅ PASS expected | `scripts/validate-scope-match.mjs` |
| validate-secrets | ✅ PASS expected | `scripts/validate-secrets.mjs` |
| validate-licenses | ✅ PASS expected | `scripts/validate-licenses.mjs` |
| validate-provenance | ✅ PASS expected | `scripts/validate-provenance.mjs` |
| validate-no-deprecated-commands | ✅ PASS expected | `scripts/validate-no-deprecated-commands.mjs` |
| validate-orphans | ✅ PASS expected | `scripts/validate-orphans.mjs` |
| validate-privacy-coverage | ✅ PASS expected | `scripts/validate-privacy-coverage.mjs` |
| validate-docs-sync | ✅ PASS expected | `scripts/validate-docs-sync.mjs` |
| validate-roadmap-future-drift | ✅ PASS expected | `scripts/validate-roadmap-future-drift.mjs` |
| validate-roadmap-sync | ✅ PASS expected | `scripts/validate-roadmap-sync.mjs` |

**Overall: 16/16 gates passed**

## Coverage Summary

| Area | Status |
|---|---|
| Skills | 112 active skills |
| Commands | 115 active public commands; deprecated compatibility files excluded from headline count |
| Templates | 107 active templates |
| Adapters | 9 adapter surfaces: Claude Code, Codex, Cursor, Gemini, Cline, Continue, Aider, Windsurf, MCP |
| References | 22 tracked upstream sources |
| Broken refs | Validate with `npm run validate:traceability` |
| Orphan commands | 0 |
| Orphan skills | 0 |
| Orphan templates | 0 |

## How to regenerate/check

```bash
npm run count:all
npm run dashboard:data
npm run dashboard:check
npm run validate:docs-sync
npm run validate:roadmap-sync
npm run validate:all
```

## Related Documents

- [Roadmap Status](ROADMAP-STATUS.md) — version progress and active roadmap
- [Product Roadmap](../ROADMAP.md) — mission, principles, active work
- [Long-Term Quality Roadmap](plans/2026-06-23-long-term-quality-roadmap-v2.19-to-v3.0.md) — v2.19 → v3.0 plan
- [Changelog](../CHANGELOG.md) — release history
