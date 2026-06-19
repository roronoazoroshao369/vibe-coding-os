# CI Quality Summary

| Gate | Result |
| --- | --- |
| repo-structure | ✅ PASS |
| references-validate | ✅ PASS |
| registry-schemas | ✅ PASS |
| pack-schemas | ✅ PASS |
| traceability | ✅ PASS |
| injection-scan | ✅ PASS |
| secret-scan | ✅ PASS |
| memory-redaction | ✅ PASS |
| quality-diff-audit | ✅ PASS |
| cli-smoke-tests | ✅ PASS |
| dashboard-data | ✅ PASS |
| provisioning-smoke | ✅ PASS |
| provenance | ✅ PASS |
| runtime-freeze | ✅ PASS |
| roadmap-future-drift | ✅ PASS |
| bilingual-sync | ✅ PASS |
| markdown-links | ✅ PASS |
| heading-version | ✅ PASS |
| release-dry-run | ✅ PASS |
| quality-scorecard-report | ✅ PASS |
| quality-engine | ✅ PASS |
| quality-engine-report | ✅ PASS |
| telemetry-emit-validation | ✅ PASS |
| lesson-export-import-cycle | ✅ PASS |
| lesson-quality-checker | ✅ PASS |
| reference-health-report | ✅ PASS |

**26/26 gates PASS**

## Quick reference

Run the full guard again:

```bash
npm run validate:all
```

Generate a fresh quality report for the PR:

```bash
node scripts/quality-engine.mjs --profile=standard --task-type=unknown --output-json > report.json
node scripts/quality-engine-report.mjs --output-json=report.json
```
