# Vibe Coding OS — Project Health Dashboard

> **Auto-generated** by `scripts/generate-dashboard.mjs` — do not edit manually.
> Last generated: 2026-06-19

## Quick Status

| Metric | Value |
|---|---|
| Version | 2.10.0 |
| Skills | 131 |
| Commands | 101 |
| Templates | 100 |
| Narrative files | 655 |
| Upstream sources | 20 |
| Broken refs | 0 |

### Skills by Category

| Category | Count |
|---|---|
| agents | 7 |
| checklists | 5 |
| core | 69 |
| memory | 20 |
| meta | 12 |
| prompts | 15 |
| quality-evaluation-scenarios | 1 |
| repo-map-concept | 1 |
| templates | 1 |

## Version Progress

| Version | Status | Target |
|---|---|---|
| v0.1.1 | ✅ Complete | Validation + VI docs |
| v0.2 | ✅ Complete | Adoption MVP |
| v0.3 | ✅ Complete | Evidence & Safety |
| v0.4 | ✅ Complete | Packaging & Skill Packs |
| v1.0 | ✅ Complete | Trusted Workflow Framework |
| v1.1.0 | ✅ Complete | Runtime/schema/adapter hardening |
| v1.2.0 | ✅ Complete | Multi-agent contracts, safety, migration |
| v1.3.0 | ✅ Complete | Runtime enforcement, claim/lease, safety & recovery |
| v1.4.0 | ✅ Complete | Runtime kernel, event store v2, observability, hardening |
| v1.4.1 | ✅ Complete | Docs polish, CLI cleanup, runtime boundary hardening |
| v1.4.2 | ✅ Complete | Runtime hardening, maxTaskLease enforcement, event schema v2, shell safety |
| v1.4.3 | ✅ Complete | Operational hygiene, docs hub, config validation, 0 orphan templates |
| v1.5.0 | ✅ Complete | Core adoption, runtime free
| v1.6.0 | ✅ Complete | Adoption Trust — adapter docs, CLI onboarding, validation gates
| v1.7.0 | ✅ Complete | Quality Shield — QS workflow, artifact audit, discovery sync
| v1.8.0 | ✅ Complete | Quality Engine — telemetry, scorecard, CI integration
| v1.9.0 | ✅ Complete | Expert Mode — task risk, model-aware adapter, critic pass |
| v2.10.0 | ✅ Complete | Guard Bypass Protocol — autonomous adversarial prompt agent |
| v2.0.0 | ✅ Complete | Quality Engine v2 — real-time quality deep queries, telemetry coverage
| v2.1.0 | ✅ Complete | Model-aware adapter, adaptive prompt, model profiles
| v2.2.0 | ✅ Complete | Quality telemetry — event-driven metrics, session scoring, trend report
| v2.3.0 | ✅ Complete | Platform suite — governance, CI integration, runtime safety
| v2.4.0 | ✅ Complete | Advanced orchestration — team-runner, MCP server, veteran evaluator
| v2.5.0 | ✅ Complete | Quality Engine v3 — quality packs, skill packs, compliance checks
| v2.6.0 | ✅ Complete | Full Reference Implementation — 20 sources, 43 new files, 70 modified
| v2.7.0 | ✅ Complete | AI Testing Suite — property testing, benchmark, test gen, trend dashboard, PR comments
| v2.8.0 | ✅ Complete | Adapter Expansion — Cline, Continue.dev, Aider, Windsurf |
| v2.9.0 | 🚧 In Progress | Release Pipeline & Plugin Polish — MCP tools, memory compression, agent alignment |

## Safety Metrics

| Check | Status |
|---|---|
| Secret scan | ✅ 0 secrets found |
| Memory redaction | ✅ 30/30 tests |
| Adapter smoke tests | ✅ 6/6 adapters (6 groups) |
| Repo validation | ✅ Passed |
| Injection scan | ✅ Passed |

## Quality Trend Dashboard

### Time-Series Trend (Last 7 Days)

| Date | Runs | Pass rate | Trend |
|-----|------|-----------|-------|
| 2026-06-13 | 18 | 88.9% | → |
| 2026-06-14 | 20 | 90.0% | ↑ |
| 2026-06-15 | 22 | 90.9% | → |
| 2026-06-16 | 19 | 89.5% | ↓ |
| 2026-06-17 | 24 | 91.7% | ↑ |
| 2026-06-18 | 21 | 95.2% | ↑ |
| 2026-06-19 | 21 | 90.5% | ↓ |

### Worst Gates (Last 7d)

| Gate | Failures | Pass rate |
|---|---|---|
| validate-references | 1/7 | 85.7% |
| validate-injection | 2/7 | 71.4% |

## Validation Gate

| Gate | Status | Duration |
|---|---|---|
| validate-repo | ✅ PASS | ~131ms |
| validate-references | ✅ PASS | ~55ms |
| validate-traceability | ✅ PASS | ~191ms |
| validate-injection | ✅ PASS | ~236ms |
| validate-secrets | ✅ PASS | ~62ms |
| validate-schemas | ✅ PASS | ~87ms |
| verify-memory-redaction | ✅ PASS | ~60ms |
| smoke-test-adapters | ✅ PASS | ~49ms |
| smoke-test-cli | ✅ PASS | ~450ms |
| e2e-workflow | ✅ PASS | ~465ms |
| dashboard-data | ✅ PASS | ~319ms |
| dashboard-sync | ✅ PASS | ~316ms |
| evaluation-report | ✅ PASS | ~959ms |
| release-metadata | ✅ PASS | ~55ms |
| bilingual-readme-sync | ✅ PASS | ~53ms |
| markdown-links | ✅ PASS | ~84ms |
| readme-heading-version | ✅ PASS | ~56ms |
| roadmap-status-integrity | ✅ PASS | ~57ms |
| runtime-behavior-tests | ✅ PASS | ~1600ms |

**Overall: 26/26 gates passed**

## Coverage Summary

| Area | Status |
|---|---|
| Skills (117) | All discovered dynamically from `skills/` |
| Commands (90) | All discovered dynamically from `commands/` |
| Templates (86) | All discovered dynamically from `templates/` |
| Adapters | Claude Code 🟢, Codex 🟢, Cursor 🟢, Gemini 🟢, Memory 🟢, Compatibility matrix 🟢 |
| References | 14 upstream sources tracked |
| Orphan commands | 3 (warnings — review signal) |
| Orphan skills | 2 (warnings — review signal) |
| Orphan templates | 3 |
| Broken references | 0 |

## How to Regenerate

```bash
# Dashboard data (JSON to stdout)
npm run dashboard:data

# Regenerate this dashboard markdown
npm run dashboard:generate

# Full validation gate (all checks)
npm run validate:all
```

## Related Documents

- [Evaluation Report](reports/evaluation-report.md) — detailed per-check output
- [Evaluation Report Runner](evaluation-report.md) — how the report works
- [Roadmap Status](ROADMAP-STATUS.md) — version progress tracker
- [Compatibility & Support Policy](compatibility-support-policy.md) — adapter tiers and validation requirements
- [Release Checklist](release-checklist.md) — operational release steps
