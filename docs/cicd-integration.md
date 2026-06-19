---
title: CI/CD Integration
version: 2.4.0
updated: 2026-06-19
---

# CI/CD Integration

This is the canonical guide for Vibe Coding OS CI/CD integration. It describes how quality gates, scorecard sessions, and telemetry pipelines integrate with GitHub Actions, how to run the same checks locally, and how to extract and archive reports.

---

## 1. Workflows

### 1.1 `quality-gates.yml` — PR quality gate

**Location:** `.github/workflows/quality-gates.yml`

**Triggers:**

| Event | Condition | Purpose |
| --- | --- | --- |
| `pull_request` | opened, synchronize, reopened | Gate every PR update |
| `push` | branch: `main` | Gate direct pushes to main |
| `workflow_dispatch` | manual (with profile/gates inputs) | On-demand ad-hoc run |

**What it does:**

1. **Checkout** — full history (`fetch-depth: 0`) for accurate diff detection.
2. **Setup Node.js** — v20 with npm caching.
3. **Install dependencies** — `npm ci`.
4. **Detect changed files** — writes `changed-files.txt` to the report directory.
5. **Run `validate:all`** — the full release validation gate (repo structure, references, schemas, traceability, injection scan, secret scan, smoke tests, e2e, dashboard, quality diff, quality engine, etc.). Output is captured to `validate-all.log`.
6. **Run quality engine** — executes `scripts/quality-engine.mjs` with the selected profile (`lean` by default, or overridden via `workflow_dispatch` inputs). Output is written to `quality-engine.json`.
7. **Generate engine report** — runs `scripts/quality-engine-report.mjs` to produce a markdown summary of gate results.
8. **Collect telemetry** — runs `scripts/quality-telemetry.mjs` in dry-run JSON mode, capturing telemetry events from the engine report without persisting to the events file.
9. **Run secret scan** — `npm run validate:secrets`.
10. **Generate summary** — writes `quality-summary.md` and appends to `GITHUB_STEP_SUMMARY`.
11. **Annotate failed gates** — uses `actions/github-script` to create GitHub annotations (errors/warnings) for each failed gate.
12. **Archive reports** — uploads the `quality-reports/` directory as a workflow artifact (14-day retention).
13. **Comment PR** — posts or updates a bot comment on the PR with a quality summary badge, gate status table, warnings, residual risks, and action items.
14. **Fail on errors** — exits non-zero if `validate:all` or secret scan failed.

**Artifact contents:**

```
quality-reports/
├── changed-files.txt
├── validate-all.log
├── quality-engine.json
├── quality-engine-report.md
├── engine-report.log
├── telemetry-events.json
├── secret-scan.log
└── quality-summary.md
```

### 1.2 `scorecard-session.yml` — Issue-triggered scorecard

**Location:** `.github/workflows/scorecard-session.yml`

**Trigger:** An issue is labeled `quality-scorecard`.

**What it does:**

1. **Checkout** — full history.
2. **Setup Node.js** — v20 with npm caching.
3. **Install dependencies** — `npm ci`.
4. **Check for scorecard data** — scans `docs/reports`, `docs/metrics`, and `templates/` for markdown files containing scorecard content.
5. **Run scorecard report** — executes `scripts/quality-scorecard-report.mjs`, which aggregates historical scorecard data from local markdown reports.
6. **Generate session summary** — writes `scorecard-summary.md` with run metadata, scorecard log output, and file counts.
7. **Archive session artifacts** — uploads the `scorecard-session/` directory as a workflow artifact (30-day retention).
8. **Comment on issue** — posts the summary as a comment on the triggering issue.

**Artifact contents:**

```
scorecard-session/
├── scorecard-report.log
└── scorecard-summary.md
```

---

## 2. Workflow Triggers — Quick Reference

| Workflow | Trigger | Scope |
| --- | --- | --- |
| `quality-gates.yml` | PR open/sync/reopen, push to main, manual | Validation, engine, telemetry, archiving |
| `scorecard-session.yml` | Issue label `quality-scorecard` | Historical scorecard aggregation |
| `vibe-quality-gate.yml` | PR open/sync | Legacy gate (see `docs/cicd-integration-guide.md`) |
| `vibe-quality-report.yml` | Schedule (weekly) | Trend report and session metrics |
| `validate.yml` | PR to main, push to main | Fast `validate:all` only |
| `smoke-test.yml` | Adapter changes | Path-focused adapter smoke coverage |

---

## 3. Local vs CI Execution

### 3.1 Running gates locally

The CI workflows use the same scripts you run locally. No CI-specific logic is hidden in the scripts.

| CI step | Local equivalent |
| --- | --- |
| `npm ci` | `npm install` (or `npm ci` for identical installs) |
| `npm run validate:all` | `npm run validate:all` |
| Quality engine | `node scripts/quality-engine.mjs --profile=lean --output-json` |
| Engine report | `node scripts/quality-engine-report.mjs --output-json=quality-engine.json --output-dir=.` |
| Telemetry collector | `node scripts/quality-telemetry.mjs --engine quality-engine.json --dry-run --json` |
| Secret scan | `npm run validate:secrets` |
| Scorecard report | `node scripts/quality-scorecard-report.mjs` |

### 3.2 Differences between local and CI

| Aspect | Local | CI |
| --- | --- | --- |
| **Output capture** | Terminal stdout | Log + artifact files |
| **Telemetry persistence** | Writes to `docs/metrics/quality-telemetry-events.ndjson` (or `--dry-run` / `--json`) | Uses `--dry-run --json` to capture events without persisting |
| **PR comments** | N/A | Posted via `actions/github-script` |
| **Artifacts** | Manual archive | Automatic upload via `actions/upload-artifact` |
| **Concurrency** | Manual | Cancel-in-progress for same PR |
| **Annotations** | Terminal output | GitHub check annotations |

### 3.3 When to run locally vs let CI do it

- **Run locally** when iterating on changes before push: `npm run validate:all` is the fastest feedback loop.
- **Let CI run** for every PR to ensure consistency and provide a recorded artifact trail.
- **Run scorecard report locally** with `node scripts/quality-scorecard-report.mjs` to get ad-hoc trend summaries without labeling an issue.
- **Run telemetry locally** with `--dry-run` to validate event structure before a PR.

---

## 4. Artifact Archiving

### 4.1 What gets archived

The `quality-gates.yml` workflow archives the entire `quality-reports/` directory:

| File | Purpose |
| --- | --- |
| `changed-files.txt` | List of files modified in the diff |
| `validate-all.log` | Full output of `npm run validate:all` |
| `quality-engine.json` | Structured JSON output from the quality engine (machine-readable) |
| `quality-engine-report.md` | Human-readable markdown report of quality gate results |
| `engine-report.log` | Log output from the report generator |
| `telemetry-events.json` | Captured telemetry events (dry-run mode, not persisted to storage) |
| `secret-scan.log` | Full output of the secret scan |
| `quality-summary.md` | Concise summary appended to the workflow step summary |

### 4.2 Retention

- Quality gate artifacts: **14 days** (configurable via `retention-days` in `quality-gates.yml`).
- Scorecard session artifacts: **30 days** (configurable in `scorecard-session.yml`).

### 4.3 Accessing artifacts

1. Navigate to the workflow run page on GitHub.
2. In the **Summary** section, find the **Artifacts** box.
3. Click the artifact name (`quality-reports-<PR-number>`) to download as ZIP.

---

## 5. Report Extraction

### 5.1 Extracting structured data from JSON

The `quality-engine.json` file is the primary machine-readable source:

```bash
# Get overall pass/fail summary
jq '.summary' quality-engine.json

# List all failed gates
jq '.results[] | select(.passed == false) | {id, name, durationMs, timedOut}' quality-engine.json

# Get per-gate duration breakdown
jq '.results[] | {id: .id, duration: .durationMs, status: (if .passed then "pass" else "fail" end)}' quality-engine.json
```

### 5.2 Extracting telemetry events

Telemetry events captured in `telemetry-events.json` can be analyzed:

```bash
# Count events by status
jq 'group_by(.status) | map({status: .[0].status, count: length})' telemetry-events.json

# Count events by gate
jq 'group_by(.gate_id) | map({gate: .[0].gate_id, count: length})' telemetry-events.json

# Find slowest gates
jq 'sort_by(.duration_ms) | reverse[:5]' telemetry-events.json
```

### 5.3 Creating ad-hoc reports from artifacts

After downloading a quality report artifact:

```bash
unzip quality-reports-<PR-number>.zip -d qr-<PR-number>
cd qr-<PR-number>

# Re-run telemetry collector (dry-run) against the engine report
node scripts/quality-telemetry.mjs --engine quality-engine.json --dry-run --json

# Re-generate the engine report
node scripts/quality-engine-report.mjs --output-json=quality-engine.json --output-dir=.
```

---

## 6. Adding New Workflows

### 6.1 Conventions

- Use `actions/checkout@v4` with `fetch-depth: 0` for accurate diff detection.
- Use `actions/setup-node@v4` with `node-version: 20` and `cache: npm`.
- Use `npm ci` (not `npm install`) for deterministic installs.
- Use `continue-on-error: true` for non-fatal steps and capture exit codes explicitly.
- Use `actions/upload-artifact@v4` for any generated reports.
- Use `concurrency` groups to cancel in-progress runs on the same PR.
- Use the `<!-- marker -->` comment pattern for bot comments that need updating.

### 6.2 Workflow permissions

Recommended minimum permissions:

```yaml
permissions:
  contents: read
  pull-requests: write   # for PR comments and annotations
  checks: write          # for check annotations
  issues: write          # for issue comments (scorecard sessions)
```

### 6.3 Referencing this repo's actions

Composite actions from this repo can be referenced from external repos:

```yaml
uses: roronoazoroshao369/vibe-coding-os/.github/actions/vibe-quality-action@main
```

---

## 7. Troubleshooting

### Workflow fails on `npm ci`

- Verify `package.json` and `package-lock.json` are in sync.
- Check that the lock file is committed.

### `validate:all` exits non-zero

- Download the workflow artifact and review `validate-all.log`.
- Reproduce locally with `npm run validate:all`.

### Secret scan flags false positives

- Check for example files or test fixtures.
- Review allowlist patterns in `scripts/validate-secrets.mjs`.

### PR comment not appearing

- Verify the workflow has `pull-requests: write` permission.
- Check for GitHub API errors in the `Comment PR quality summary` step logs.

### Telemetry step skipped

- The telemetry step requires a valid `quality-engine.json` file. If the quality engine step failed before producing output, telemetry will be skipped.

---

## See also

- [CI/CD Integration Guide (legacy)](cicd-integration-guide.md) — original guide covering `vibe-quality-gate.yml` and `vibe-quality-report.yml`
- [Quality Telemetry Guide](quality-telemetry-guide.md) — telemetry event format, collector usage, trend reports
- [Quality Scorecard Session Template](../templates/quality-scorecard-session.md) — per-file scorecard recording
- [PR Quality Summary Template](../templates/ci-pr-quality-summary.md) — fillable markdown for PR summaries
