# PR Quality Summary

> **Instructions:** Replace all `__` placeholders with actual values from your CI run. Delete sections that do not apply.

## validate:all Result

- **Status:** `__passed / failed__`
- **Exit code:** __0 / 1__
- **Total checks:** __X/Y passed__
- **Failed checks:** __check1, check2, ...__

### Gate Results Table

| Gate | Status (✅ / ❌ / ⚠️) | Duration | Notes |
| --- | --- | --- | --- |
| Repo structure | __passed / failed__ | __Xs / N/A__ | __—__ |
| References | __passed / failed__ | __Xs / N/A__ | __—__ |
| Registry schemas | __passed / failed__ | __Xs / N/A__ | __—__ |
| Traceability | __passed / failed__ | __Xs / N/A__ | __—__ |
| Injection scan | __passed / failed__ | __Xs / N/A__ | __—__ |
| Secret scan | __passed / failed__ | __Xs / N/A__ | __—__ |
| Markdown links | __passed / failed__ | __Xs / N/A__ | __—__ |
| Quality diff audit | __passed / failed__ | __Xs / N/A__ | __—__ |
| Quality scorecard report | __passed / failed__ | __Xs / N/A__ | __—__ |
| Quality engine | __passed / failed__ | __Xs / N/A__ | __—__ |
| _(add rows as needed)_ | __passed / failed__ | __Xs__ | __—__ |

### Quality Engine Profile

- **Profile:** `__lean / standard / heavy__`
- **Total gates run:** __X__
- **Passed:** __X__
- **Failed / Warning:** __X__

### Telemetry

- **Events collected:** __X events__
- **Collector dry-run:** __passed / failed / skipped__

## Residual Risks

| Risk | Severity (low/med/high/critical) | Mitigation |
| --- | --- | --- |
| __Describe any residual risk__ | __severity__ | __mitigation plan__ |
| _Example: Secret scan flagged false positives in test fixtures_ | low | _Confirmed all matches are in test data; waived for this PR_ |
| _Example: Traceability warning for an orphan template_ | low | _Template is keyword-triggered and does not require narrative links_ |

If no residual risks, write: **No residual risks identified.**

## Action Items

- [ ] __Action item 1 (e.g., "Fix traceability errors in scripts/")__
- [ ] __Action item 2__
- [ ] _(delete if none)_

## Artifact References

- **Workflow run:** `__workflow-run-url__`
- **Artifact name:** `quality-reports-__PR-number__`
- **Logs:** `validate-all.log`, `secret-scan.log`, `quality-engine.json`

---

*Generated from [`templates/ci-pr-quality-summary.md`](../templates/ci-pr-quality-summary.md)*
