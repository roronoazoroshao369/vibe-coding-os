---
name: cicd-integration
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: core
tags:
  - core
status: stable
---

# CI/CD Integration

> Integrate Vibe Coding OS quality gates into GitHub Actions for automated PR checks, reusable composite actions, and weekly quality trend reports.

## Purpose

Automate quality verification in CI/CD pipelines so every pull request runs `validate:all`, emits quality telemetry, and surfaces results as PR comments and annotations. This skill covers the PR quality gate workflow, the reusable composite action, and the weekly quality report workflow.

## When to use

- You want every PR to automatically run repository validation, injection scan, secret scan, and quality engine gates.
- You want a reusable GitHub composite action that other repos can reference to run Vibe Coding OS quality gates.
- You want a weekly quality report that opens a GitHub issue with session metrics and trend data.
- You want `vibe-ci-quality-summary` to post or update a PR comment with structured quality results.

## Inputs

- GitHub repository with Vibe Coding OS installed and `npm run validate:all` passing locally.
- GitHub Actions enabled with workflow write permission for checks and PR comments.
- Optional: quality engine profile (`lean`, `standard`, `heavy`) for gate selection.
- Optional: telemetry data under `docs/metrics/` for weekly report generation.

## Workflow

1. **Add the PR quality gate** — copy `.github/workflows/vibe-quality-gate.yml` into the target repository.
2. **Customize gates per project** — choose preset profiles or use the reusable composite action at `.github/actions/vibe-quality-action/action.yml`.
3. **Configure the weekly report** — copy `.github/workflows/vibe-quality-report.yml` to generate automated weekly trend issues.
4. **Run `vibe-ci-quality-summary`** — generate and post a PR quality summary as a bot comment, including gate status, timing breakdown, and fix recommendations.
5. **Review annotations** — failed gates emit GitHub annotations inline in the changed file diff.

## Outputs

- PR quality gate workflow that runs validate:all and uploads a quality report artifact.
- Reusable composite action that other repos can reference with `uses:`.
- Weekly quality report opened as a GitHub issue.
- PR comment quality summary rendered by `vibe-ci-quality-summary`.

## Failure modes

- **Missing dependencies:** workflow fails because `npm ci` cannot resolve packages — ensure `package-lock.json` is committed.
- **Secrets in logs:** avoid printing credentials to workflow logs; the built-in secret scan is intentionally included.
- **False-positive secret scan:** review detector patterns in `scripts/validate-secrets.mjs` and add exclusions where appropriate.
- **Report artifact missing:** confirm `scripts/quality-engine.mjs` and `scripts/quality-engine-report.mjs` exist; the workflow includes a fallback summary.

## Verification checklist

- [ ] `.github/workflows/vibe-quality-gate.yml` runs `npm run validate:all` and `npm run validate:secrets`.
- [ ] Quality report is uploaded as a workflow artifact on every run.
- [ ] PR comment is posted or updated with quality summary.
- [ ] Weekly report workflow opens a GitHub issue with trend data.
- [ ] Reusable action passes inputs and produces valid outputs.
- [ ] No credentials, tokens, or secrets appear in workflow logs.
- [ ] All gates pass before merge (`validate:all` 26/26).

## Related assets

- Command: `commands/vibe-ci-quality-summary.md`
- Guide: `docs/cicd-integration-guide.md`
- Workflow: `.github/workflows/vibe-quality-gate.yml`
- Workflow: `.github/workflows/vibe-quality-report.yml`
- Action: `.github/actions/vibe-quality-action/action.yml`

## Notes

CI/CD integration is markdown-first and pipeline-local. It does not require a daemon, hosted service, or runtime expansion. Quality gates and report generation are composable and referenceable from any GitHub Actions workflow.
