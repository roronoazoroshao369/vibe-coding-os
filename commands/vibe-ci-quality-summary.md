---
description: "Generate a GitHub PR quality summary from CI gate results, quality reports, and validation output."
---

# vibe-ci-quality-summary

## Purpose

Create or update a pull request quality summary for CI/CD runs. Use it to turn `validate:all`, quality engine output, secret-scan results, and report artifacts into a concise PR comment with pass/fail status, gate breakdown, and next actions.

## When to use

- A GitHub Actions workflow needs to post a PR quality summary.
- A maintainer wants to summarize CI gate output before merge.
- A failed validation run needs a compact remediation checklist.
- A weekly quality report should include a CI gate status snapshot.

## Inputs

- Validation status from `npm run validate:all`.
- Optional quality engine JSON or markdown report.
- Optional secret scan result.
- Optional GitHub PR metadata: repository, pull request number, commit SHA, run URL.

## Output format

Produce a markdown comment with:

- Overall status: passed, failed, or needs attention.
- Gate summary: `26/26` when all release gates pass.
- Failed gates with exact command names and short remediation hints.
- Links to workflow run and uploaded report artifact when available.
- Runtime scope note: no daemon or hosted service required.

## Prompt

When invoked, do the following:

1. Read the CI outputs or pasted logs.
2. Extract gate counts, failed checks, report path, and workflow URL.
3. Classify status:
   - `passed`: all required gates passed.
   - `failed`: at least one required gate failed.
   - `needs attention`: result is incomplete or missing required evidence.
4. Draft a GitHub-safe markdown summary with no secrets, tokens, or raw private logs.
5. Include commands for local reproduction:
   - `npm run validate:all`
   - `npm run dashboard:check`
   - `node scripts/validate-release-metadata.mjs`
6. If updating an existing PR comment, preserve the stable marker:
   `<!-- vibe-ci-quality-summary -->`

## Example comment

```markdown
<!-- vibe-ci-quality-summary -->
## Vibe Quality Gate

**Status:** ✅ PASS
**Gates:** 26/26 passed
**Commit:** `<sha>`

### Highlights
- Repository validation passed.
- Secret scan passed.
- Dashboard sync passed.
- Release metadata is in sync.

### Reproduce locally
```bash
npm run validate:all
npm run dashboard:check
node scripts/validate-release-metadata.mjs
```
```

## Safety rules

- Do not include secrets, tokens, private URLs, or raw sensitive logs.
- Prefer summarized failures over dumping full CI output.
- Link to artifacts instead of embedding large reports.
- If status is ambiguous, mark the summary as `needs attention` instead of claiming pass.

## Related assets

- Skill: `skills/core/cicd-integration/SKILL.md`
- Guide: `docs/cicd-integration-guide.md`
- Workflow: `.github/workflows/vibe-quality-gate.yml`
- Weekly report: `.github/workflows/vibe-quality-report.yml`
