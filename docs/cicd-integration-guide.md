---
title: CI/CD Integration Guide
version: 2.4.0
updated: 2026-06-18
---

# CI/CD Integration Guide

This guide covers GitHub Actions integration for Vibe Coding OS quality gates, reusable actions, and weekly reporting.

## 1. Add the PR quality gate

Copy `.github/workflows/vibe-quality-gate.yml` into your repo.

### Required setup
- Repository must use Node.js with the workflow's `npm ci` and `npm run validate:all` commands.
- Enable GitHub Actions on the repository.
- Allow the workflow to write checks and pull request comments.

### What it does
- Triggers on PR open and synchronize events.
- Installs dependencies with npm caching.
- Runs `npm run validate:all` and `npm run validate:secrets`.
- Generates a quality report and uploads it as a workflow artifact.
- Posts or updates a bot comment with a quality summary.
- Emits GitHub annotations for failed gates.

## 2. Customize gates per project

### Option A: Use the reusable action in a wrapper workflow

Use the composite action from this repository:

```yaml
name: Custom vibe quality gate
on:
  pull_request:
    types: [opened, synchronize]
jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Run Vibe quality action
        id: vibe
        uses: roronoazoroshao369/vibe-coding-os/.github/actions/vibe-quality-action@main
        with:
          model: lean
          gates: repo-structure,injection-scan,secret-scan
          output-format: markdown
      - name: Fail if gates failed
        if: steps.vibe.outputs.status != 'passed'
        run: exit 1
```

### Option B: Change the default gate profile

Update the workflow's run step to choose a profile:

```yaml
- name: Run quality gates
  run: node scripts/quality-engine.mjs --output-json --profile=lean > quality-report.json
```

Profiles map to the presets in `scripts/quality-engine.mjs`:
- `lean`: fast subset for small or frequent PRs
- `standard`: default full gate set
- `heavy`: broad gate set for release candidates

## 3. Use the reusable action from other repos

Reference the action with:

```yaml
uses: roronoazoroshao369/vibe-coding-os/.github/actions/vibe-quality-action@main
```

### Inputs
- `model`: profile or model preset
- `gates`: comma-separated gate IDs
- `output-format`: `json` or `markdown`

### Outputs
- `status`: `passed` or `failed`
- `report-path`: path to generated report file
- `report-content`: text content of the report
- `gate-summary`: short summary string

## 4. Weekly report setup

Copy `.github/workflows/vibe-quality-report.yml` into your repo.

### What it does
- Runs every Monday at 09:00 UTC.
- Skips work if no telemetry data is present.
- Collects session metrics and trend data.
- Opens a GitHub issue with the report.

### Required setup
- Store quality telemetry under `docs/metrics/` or provide a valid `templates/session-metrics-aggregate.json` source.
- Allow the workflow to create issues.

## 5. Secrets and sensitive output handling

- The workflows do not store GitHub tokens or credentials in files.
- Reports are uploaded as workflow artifacts only.
- Avoid printing secrets to logs; the repository's secret scan is intentionally included in CI.

## 6. Troubleshooting

### Workflow fails on `npm ci`
- Confirm the repository has a valid `package.json` and `package-lock.json`.
- Confirm Actions runners can install dependencies.

### `validate:all` exits non-zero
- Review the workflow summary and downloaded report artifact.
- Run `npm run validate:all` locally to reproduce.

### Secret scan flags false positives
- Check for examples, allowlisted paths, or test fixtures.
- Review the patterns in `scripts/validate-secrets.mjs`.

### Report artifact missing
- Confirm `scripts/quality-engine.mjs` and `scripts/quality-engine-report.mjs` exist.
- The workflow includes fallback summary generation when scripts fail.

### PR comment not appearing
- Verify the workflow has permission to write comments.
- Look for GitHub API errors in the `Comment PR quality summary` step.

## 7. Optional extensions

- Add `workflow_dispatch` inputs to run custom profiles on demand.
- Trigger release checks after the quality gate passes.
- Combine the reusable action with repository-specific lint or test steps.
