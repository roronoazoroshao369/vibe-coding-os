# Release Hardening Playbook

> Version 2.5 · Advanced Orchestration release

This playbook is the final hardening sequence before tagging and releasing a Vibe Coding OS release. It covers validation, dashboard sync, generated-reports cleanup, tags/releases, and post-release council.

Use this for every release from v2.5.0 onward. For smaller patch releases, the maintainer may skip some sections if the risk is low, but each skipped item must have a recorded disposition.

---

## Table of Contents

- [1. Pre-hardening checklist](#1-pre-hardening-checklist)
- [2. Validation](#2-validation)
- [3. Dashboard and release notes sync](#3-dashboard-and-release-notes-sync)
- [4. Generated reports cleanup](#4-generated-reports-cleanup)
- [5. Tags and releases](#5-tags-and-releases)
- [6. Post-release council](#6-post-release-council)
- [7. Rollback](#7-rollback)
- [8. Release hardening checklist](#8-release-hardening-checklist)

---

## 1. Pre-hardening checklist

Before starting the hardening sequence, confirm:

- [ ] Release branch exists and is up to date with `main` (or the release branch is `main` itself).
- [ ] All planned release tasks are merged or explicitly deferred.
- [ ] Release notes draft exists at `docs/releases/v<version>-release-notes.md`.
- [ ] Known risks and limitations are documented and have a disposition (accepted, mitigated, or deferred).
- [ ] The release version is aligned with the version in `package.json` and `docs/releases/`.

---

## 2. Validation

Run all validation gates in order. Stop and fix any failure before proceeding.

### 2.1 Schema validation

```bash
node scripts/validate-schemas.mjs
```

Ensure all JSON schema files in `schemas/` are valid against JSON Schema draft-07 or newer.

### 2.2 Orchestration workflow validation (v2.5+)

```bash
npm run validate:orchestration-workflows
```

This runs gate #31 (`validate:orchestration-workflows`), which checks every `templates/workflow-*.json` against `schemas/orchestration-workflow.json` and verifies template compliance.

### 2.3 Traceability

```bash
npm run validate:traceability
```

Gate #3. Checks internal references: every doc link to a `commands/`, `skills/`, or `templates/` path must resolve to an existing file. Orphans (inventory items no narrative markdown links to) are warned but not failed.

### 2.4 Markdown links

```bash
npm run validate:links
```

If this command is not available in the current `package.json`, use a substitute:

```bash
# Find and report broken markdown links
find . -name '*.md' -not -path './node_modules/*' -not -path './.git/*' -exec grep -oP '\[.*?\]\([^)]+\)' {} \; | grep -v 'http' | head -20
```

Or use a link-checking library if one is configured. The important output is a list of unresolved internal references.

### 2.5 Full validation suite

```bash
npm run validate:all
```

This runs all registered gates. Capture the output to `validate-all.log`:

```bash
npm run validate:all | tee validate-all.log
```

### 2.6 Quality engine (recommended)

```bash
node scripts/quality-engine.mjs --profile=heavy --output-json
```

Run the quality engine with the `heavy` profile before release to catch edge cases missed by the standard gate set.

### 2.7 Secret scan

```bash
npm run validate:secrets
```

Ensure no credentials, tokens, or private keys are committed.

### 2.8 Smoke test

```bash
npm run test:smoke
```

If a smoke test script exists, run it to confirm basic operations work on a clean checkout.

### 2.9 Validation evidence

After all checks pass, record the evidence:

```markdown
## Validation evidence — v2.5.0

| Check | Status | Notes |
|---|---|---|
| validate-schemas | PASS | All 12 schemas valid |
| validate:orchestration-workflows | PASS | 3 workflow templates compliant |
| validate:traceability | PASS | No broken refs, 2 orphans noted (accepted) |
| validate:links | PASS | All internal links resolve |
| validate:all | PASS | 31/31 gates, 0 failures |
| quality-engine (heavy) | PASS | 0 critical, 2 warnings (disposition below) |
| validate:secrets | PASS | No secrets found |
| test:smoke | PASS | 5/5 smoke tests pass |
```

---

## 3. Dashboard and release notes sync

### 3.1 Update DASHBOARD.md

`docs/DASHBOARD.md` should reflect the new release:

- Add the new version to the version badges or list.
- Add or update the version's feature summary.
- Confirm any "current release" or "latest stable" markers point to the new version.
- If the dashboard lists validation gates, add any new gates added for this release.

### 3.2 Update ROADMAP-STATUS.md

`docs/ROADMAP-STATUS.md` should mark the released version as **Released** and update the release date.

### 3.3 Update README.md

If `README.md` lists version badges, current version references, or feature highlights, update them. The top-level README should say "Latest version: v2.5.0" or similar.

### 3.4 Create or finalize release notes

`docs/releases/v2.5.0-release-notes.md` should contain:

- Version number and release date.
- Summary of changes, organized by feature area.
- New validation gates (numbers and names).
- Upgrade instructions if applicable.
- Known issues or limitations.
- Credits and contributions.

### 3.5 Examples README

If the release adds a new examples directory (e.g., `examples/advanced-orchestration/`), ensure it is linked from `examples/README.md`.

### 3.6 Verify cross-references

Run `npm run validate:traceability` again after updating dashboards and READMEs to confirm no new broken refs were introduced.

---

## 4. Generated reports cleanup

### 4.1 Remove ephemeral reports

Before committing the final release state, remove or relocate generated reports that should not be in the release tree:

| Report type | Action | Rationale |
|---|---|---|
| `docs/reports/orchestration/*.md` | Remove unless intentionally archived | Private to the development sprint |
| `validate-all.log` | Remove | Generated artifact |
| `quality-engine.json` | Remove | Generated artifact |
| `quality-reports/` | Remove | Generated artifacts |
| `docs/metrics/*.ndjson` | Remove unless policy requires | Local telemetry storage |
| `npm-debug.log*` | Remove | Debug artifact |

### 4.2 Preserve intentional reports

Some reports are intentionally part of the release:

| Report type | Keep if | Location |
|---|---|---|
| Release notes | Always | `docs/releases/v2.5.0-release-notes.md` |
| Council records | If release scope includes governance | `docs/adr/` or `docs/reports/orchestration/` (archived intentionally) |
| Scorecard snapshots | If captured before release tag | `docs/reports/scorecard-v2.5.0.md` |

### 4.3 Update .gitignore

If new generated-report patterns were introduced during the sprint, add them to `.gitignore` so future sprints do not accidentally commit them.

Common patterns to add:

```
# Generated orchestration reports
docs/reports/orchestration/
```

---

## 5. Tags and releases

### 5.1 Create the tag

```bash
git tag -a v2.5.0 -m "Release v2.5.0 — Advanced Orchestration"
```

### 5.2 Push the tag

```bash
git push origin v2.5.0
```

### 5.3 Create the GitHub release

Using the GitHub CLI:

```bash
gh release create v2.5.0 \
  --title "v2.5.0 — Advanced Orchestration" \
  --notes-file docs/releases/v2.5.0-release-notes.md \
  --target main
```

Or manually on GitHub:

1. Go to **Releases** → **Draft a new release**.
2. Choose tag `v2.5.0`.
3. Release title: `v2.5.0 — Advanced Orchestration`.
4. Description: copy from `docs/releases/v2.5.0-release-notes.md`.
5. Attach any additional assets (exported reports, compiled artifacts if applicable).
6. Publish release.

### 5.4 Verify the release

- The tag exists on GitHub.
- The release page shows the release notes.
- CI checks on the tag (if any) passed.
- `npm pack` or `npm publish` (if this repo publishes packages) succeeds.

---

## 6. Post-release council

### 6.1 Convene the council

Within one week of the release, convene a post-release council to capture lessons and plan follow-up.

**Attendees:** Council chair, team leads (or their delegates), maintainers.

**Agenda:**

1. **What went well** — record positive outcomes, smooth areas, efficient processes.
2. **What went wrong** — record delays, missed gates, miscommunications, blockers.
3. **What to improve** — changes to workflows, validation, templates, or governance for the next release.
4. **Unresolved items** — known issues deferred to the next release, with owners and target versions.
5. **Lesson exports** — identify any patterns worth exporting as multi-repo lessons.

### 6.2 Record the council outcome

```markdown
# Post-release council — v2.5.0

| Field | Value |
|---|---|
| Date | 2026-06-26 |
| Attendees | @chair, @team1-lead, @team2-lead, @team3-lead |

## What went well

- Schema-first approach reduced integration conflicts.
- Escalation process resolved the gate-name flexibility conflict quickly.
- Team handoff summaries were consistently used.

## What went wrong

- validate:links command was not available at release time; had to use workaround.
- Two ephemeral reports were almost committed; needed cleanup step.

## What to improve

- Add `validate:links` to `package.json` for v2.6.
- Add `docs/reports/orchestration/` to `.gitignore`.
- Pre-agree on release tag name format and use `npm version` for consistency.

## Unresolved items

- [ ] Deprecate old `vibe-quality-gate.yml` in favor of new workflow (v2.6, owner @team3)
- [ ] Document orchestration report format (v2.6, owner @team1)

## Lesson exports

- None this sprint
```

### 6.3 Archive council records

Save the post-release council outcome to `docs/releases/post-release-v2.5.0-council.md` for future reference.

---

## 7. Rollback

If a critical issue is discovered after the release, the rollback process is:

```bash
# On the target environment:
git checkout v2.4.0
npm ci

# On GitHub:
# 1. Navigate to Releases
# 2. Click the release's title
# 3. Click "Edit release"
# 4. Check "Set as a pre-release" or archive the tag
# 5. Publish a new release with rollback notes
```

Record the rollback reason in the post-release council artifacts.

---

## 8. Release hardening checklist

Use this checklist during every release.

### Pre-hardening

- [ ] Release branch is up to date.
- [ ] All planned tasks are merged or deferred with documented reason.
- [ ] Release notes draft exists and is comprehensive.
- [ ] Known risks and limitations are documented.
- [ ] `package.json` version matches the planned release version.

### Validation

- [ ] Schema validation passed.
- [ ] Orchestration workflow validation passed (v2.5+).
- [ ] Traceability check passed (broken refs = 0).
- [ ] Markdown links check passed (internal refs resolved).
- [ ] `validate:all` passed (31/31 gates).
- [ ] Quality engine (heavy profile) passed (0 critical failures).
- [ ] Secret scan passed.
- [ ] Smoke test passed.
- [ ] Validation evidence recorded.

### Dashboard and docs sync

- [ ] `docs/DASHBOARD.md` updated.
- [ ] `docs/ROADMAP-STATUS.md` updated.
- [ ] `README.md` version badges updated.
- [ ] Release notes finalized.
- [ ] `examples/README.md` updated (if new examples added).
- [ ] Cross-references verified (traceability re-run).

### Reports cleanup

- [ ] Generated orchestration reports removed.
- [ ] `validate-all.log` and other temporary logs removed.
- [ ] Quality engine JSON output removed.
- [ ] `quality-reports/` directory removed.
- [ ] Local telemetry storage cleaned (unless policy requires keeping).
- [ ] Debug logs removed.
- [ ] `.gitignore` updated for new generated patterns.

### Tag and release

- [ ] Git tag created (`vX.Y.Z`).
- [ ] Tag pushed to remote.
- [ ] GitHub release created with notes.
- [ ] Release verified (tag exists, notes visible, CI passes).

### Post-release

- [ ] Post-release council held within one week.
- [ ] Council outcome recorded.
- [ ] Lesson exports reviewed.
- [ ] Follow-up items tracked in issue tracker or roadmap.

---

## See also

- [Advanced orchestration sprint example](../examples/advanced-orchestration/README.md)
- [Orchestration guide](orchestration-guide.md)
- [CI/CD Integration](cicd-integration.md)
- [Multi-Repo Learning](multi-repo-learning.md)
- [Release checklist (legacy)](release-checklist.md)
