# PR Quality Comment Guide

## Overview

The **PR Quality Comment** feature automatically posts a detailed quality summary as a comment on every pull request. When a PR is opened or updated, the `pr-quality-comment.yml` GitHub Actions workflow:

1. Runs the full validation gate suite (`validate:all`)
2. Executes quality engine (lean profile)
3. Generates a quality scorecard report
4. Collects telemetry events
5. Checks for existing trend data
6. Posts or updates a formatted markdown comment on the PR with pass/fail summary, timing, and trend links

## How it works

Workflow file: `.github/workflows/pr-quality-comment.yml`

The workflow uses the reusable action `.github/actions/quality-summary-action/action.yml` which encapsulates all the quality checks.

### Trigger

The workflow triggers on:

- `pull_request` opened, synchronized (new commits), or reopened

### Comment lifecycle

- **First run on a PR**: A new comment is created
- **Subsequent runs**: The existing comment is **updated in place** (found by a hidden marker `<!-- quality-summary-pr-comment -->`)
- The comment is posted by the `github-actions` bot using `GITHUB_TOKEN`

## What the comment includes

### Quality Score Badge

![quality-score](https://img.shields.io/badge/quality-100%25-brightgreen)

- **100%** (bright green) — all critical gates passed
- **0%** (red) — one or more critical gates failed

### Summary Table

| Metric | Value |
|---|---|
| Status | ✅ PASSED / ❌ FAILED |
| Changed files | Number of files modified |
| Overall score | 100% or 0% |

### Gate Results

| Gate | Status | Details |
|---|---|---|
| `validate:all` | ✅ PASS / ❌ FAIL | Timing output below |
| Secret scan | ✅ PASS / ❌ FAIL | Detailed in artifact |
| Quality engine | ✅ PASS / ⚠️ flagged | Detailed in artifact |
| Scorecard | ✅ generated / ⚠️ skipped | Link to artifact |
| Telemetry | ✅ collected / ⚠️ skipped | Link to artifact |

### Warnings

Lists which gates failed and what action to take. If all pass, shows "No warnings — all quality checks passed."

### Timing & Validate Output

The last few lines from `npm run validate:all` showing which specific checks passed or failed and the overall count.

### Trend Data (30d)

If trend data is available, shows:
- Daily data points
- Weekly data points
- Overall pass rate

### Action Items

- **All passed**: PR is ready for review
- **Some failed**: Instructions to review logs and push fixes

### Links

Convenient links to:
- Quality trend dashboard
- Quality trend guide
- Telemetry guide
- PR comment guide (this file)

## Required permissions

The workflow requires these permissions in `.github/workflows/pr-quality-comment.yml`:

```yaml
permissions:
  contents: read
  pull-requests: write
  checks: write
```

- `contents: read` — to check out the repository
- `pull-requests: write` — to post and update PR comments
- `checks: write` — to create check runs for gate annotations

These are set at the workflow level and scoped to the specific PR.

## How to use in your own projects

### Minimum setup

1. Copy `.github/workflows/pr-quality-comment.yml` to your repository
2. Copy `.github/actions/quality-summary-action/` directory
3. Ensure your project has the required Node.js scripts (validate:all, quality-engine, etc.)
4. The `GITHUB_TOKEN` is automatically available — no configuration needed

### Customizing gates

To run a different set of quality gates, modify the `model` input in the workflow:

```yaml
- name: Run quality summary action
  uses: ./.github/actions/quality-summary-action
  with:
    model: standard  # or lean, heavy, or leave empty for default
```

To run specific gates instead of a profile:

```yaml
- name: Run quality summary action
  uses: ./.github/actions/quality-summary-action
  with:
    gates: 'traceability,secret-scan,injection'
```

### Disabling scorecard or telemetry

```yaml
- name: Run quality summary action
  uses: ./.github/actions/quality-summary-action
  with:
    generate-scorecard: 'false'
    collect-telemetry: 'false'
```

## Troubleshooting

| Problem | Solution |
|---|---|
| Comment not posted | Check that `pull-requests: write` permission is set in the workflow |
| Comment not updated on push | The marker `<!-- quality-summary-pr-comment -->` must be present in the comment body |
| "validate:all failed" in comment | Review the `quality-summary-reports` artifact for full logs |
| Trend data shows "not available" | Run `npm run dashboard:trend` locally first to generate trend data, or collect telemetry events |
| Scorecard not generated | Ensure quality engine JSON exists — the scorecard step requires it |

## Ghi chú tiếng Việt

Tính năng PR Quality Comment tự động đăng báo cáo chất lượng lên mỗi pull request. Workflow chạy validate:all, quality engine, tạo scorecard, thu thập telemetry, và đăng comment với kết quả pass/fail, thời gian chạy, và link đến trend dashboard. Comment được cập nhật mỗi lần push commit mới.
