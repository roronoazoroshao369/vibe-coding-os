# Vibe Coding OS — Project Health Dashboard

> **Auto-generated** by `scripts/generate-dashboard.mjs` — do not edit manually.
> Last generated: 2026-06-19

## Quick Status

| Metric | Value |
|---|---|
| Version | 2.3.0 |
| Skills | 115 |
| Commands | 89 |
| Templates | 85 |
| Narrative files | 543 |
| Upstream sources | 14 |
| Broken refs | 0 |

### Skills by Category

| Category | Count |
|---|---|
| agents | 6 |
| checklists | 5 |
| core | 60 |
| memory | 17 |
| meta | 9 |
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
| v1.5.0 | ✅ Complete | Core adoption, runtime freeze |
| v1.6.0 | ✅ Complete | Adoption trust, onboarding docs, CLI onboarding UX |
| v1.7.0 | ✅ Complete | Quality Shield, copy-paste workflow, example |
| v1.8.0 | ✅ Complete | Expert Mode, critique pass, quality packs, council |
| v1.9.0 | ✅ Complete | Smart Adapt, adaptive prompts, scorecards, lessons |
| v2.0.0 | ✅ Complete | Quality Engine, schemas, integration tests, gate #26 |
| v2.1.0 | ✅ Complete | Model-Aware Config, model registry, config skill |
| v2.2.0 | ✅ Complete | Quality Telemetry, schema, collector, trend reports |
| v2.3.0 | ✅ Complete | Multi-Repo Learning, lesson exchange, import/export |

## Safety Metrics

| Check | Status |
|---|---|
| Secret scan | ✅ 0 secrets found |
| Memory redaction | ✅ 30/30 tests |
| Adapter smoke tests | ✅ 6/6 adapters (6 groups) |
| Repo validation | ✅ Passed |
| Injection scan | ✅ Passed |

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
| Skills (115) | All discovered dynamically from `skills/` |
| Commands (89) | All discovered dynamically from `commands/` |
| Templates (85) | All discovered dynamically from `templates/` |
| Adapters | Claude Code 🟢, Codex 🟢, Cursor 🟢, Gemini 🟢, Memory 🟢, Compatibility matrix 🟢 |
| References | 14 upstream sources tracked |
| Orphan commands | 0 (warnings — review signal) |
| Orphan skills | 0 (warnings — review signal) |
| Orphan templates | 2 |
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
