# Vibe Coding OS — Project Health Dashboard

Last generated: 2026-06-16

## Quick Status

| Metric | Value |
|---|---|
| Version | 0.1.0 |
| Skills | 90 |
| Commands | 68 |
| Templates | 41 |
| Narrative files | 351 |
| Upstream sources | 14 |
| Broken refs | 0 |

### Skills by Category

| Category | Count |
|---|---|
| core | 47 |
| memory | 17 |
| prompts | 13 |
| meta | 9 |
| agents | 4 |

## Version Progress

| Version | Status | Target |
|---|---|---|
| v0.1.1 | ✅ Complete | Validation + VI docs |
| v0.2 | ✅ Complete | Adoption MVP |
| v0.3 | ✅ Complete | Evidence & Safety |
| v0.4 | 🟡 ~80% | Packaging & Skill Packs |
| v1.0 | 🟡 ~40% | Trusted Workflow Framework |

## Safety Metrics

| Check | Status |
|---|---|
| Secret scan | ✅ 0 secrets found |
| Memory redaction | ✅ 30/30 tests |
| Adapter smoke tests | ✅ 4/4 adapters |
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
| verify-memory-redaction | ✅ PASS | ~60ms |
| smoke-test-adapters | ✅ PASS | ~49ms |
| evaluation-report | ✅ PASS | ~959ms |

**Overall: 8/8 gates passed**

## Coverage Summary

| Area | Status |
|---|---|
| Skills (90) | All have SKILL.md with required sections |
| Commands (68) | All discovered dynamically from `commands/` |
| Templates (41) | All discovered dynamically from `templates/` |
| Adapters | Claude Code 🟢, Codex 🟢, Cursor 🟡 |
| References | 14 upstream sources tracked |
| Orphan commands | 6 (warnings — review signal) |
| Orphan skills | 6 (warnings — review signal) |
| Orphan templates | 0 |
| Broken references | 0 |

## How to Regenerate

```bash
# Full dashboard data (JSON to stdout)
node scripts/dashboard-data.mjs

# Full validation gate (all checks)
npm run validate:all

# Evaluation report only
npm run eval:report
```

## Related Documents

- [Evaluation Report](reports/evaluation-report.md) — detailed per-check output
- [Evaluation Report Runner](evaluation-report.md) — how the report works
- [Roadmap Status](ROADMAP-STATUS.md) — version progress tracker
- [Compatibility & Support Policy](compatibility-support-policy.md) — adapter tiers and validation requirements
- [Release Checklist](release-checklist.md) — operational release steps
