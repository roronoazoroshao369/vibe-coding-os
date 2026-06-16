# Release Checklist

Pre-release validation checklist for Vibe Coding OS releases.
Every release (patch, minor, or major) must pass all checks below before shipping.

> **How to use:** Copy this checklist into a release PR description or follow it manually.
> Mark each item with ✅ or ❌ and record the evidence.

---

## 1. Core Validation

- [ ] `npm run validate` passes (exit 0)
  - Repo structure validation
  - Reference validation (if reference files changed)
  - Traceability validation (no broken internal references)
  - Injection validation

Use `skills/prompts/release-it-stability/SKILL.md` when preparing release prompts or final stabilization passes for release candidates.

Evidence: paste validation output or CI log snippet.

## 2. Evaluation Report

- [ ] `npm run eval:report` (or `node scripts/evaluation-report.mjs`) runs and reports ≥ 4/4 checks passed
  - Repo Validation: PASS
  - Secret Scanning: PASS
  - Memory Redaction: PASS (30/30 tests)
  - Adapter Smoke Tests: PASS (all adapters)

Evidence: paste report summary or link to `docs/reports/evaluation-report.md`.

## 2b. Dashboard Regeneration

- [ ] `npm run dashboard:generate` regenerates `docs/DASHBOARD.md` from current data
- [ ] `docs/DASHBOARD.md` shows a recent "Last generated" date
- [ ] `npm run smoke-test:cli` passes (CLI smoke tests)
- [ ] `npm run dashboard:data` outputs valid JSON

Evidence: paste generation output or confirm date stamp.

## 3. Secret Scan

- [ ] No secrets, tokens, API keys, or credentials in new or changed files
- [ ] `node scripts/validate-secrets.mjs` passes on staged changes
- [ ] No realistic-looking mock secrets in test fixtures or examples (use obvious placeholders like `PLACEHOLDER_TOKEN`, `xxx`, or `test`)

Evidence: secret scan output showing 0 secrets found.

## 4. Adapter Smoke Tests

- [ ] `node scripts/smoke-test-adapters.mjs` passes for all adapter directories
  - Each adapter contains expected files (README, instruction surface file)
  - Adapter content is well-formed markdown
  - No broken cross-references between adapters and core docs

Evidence: smoke test output showing all adapters pass.

## 5. Changelog Updated

- [ ] `CHANGELOG.md` has a `[Unreleased]` section with an `### Added` entry describing the release changes
- [ ] Version and date are set if cutting a tagged release
- [ ] Format follows Keep a Changelog convention

Evidence: diff of CHANGELOG.md.

## 6. Documentation Sync

- [ ] README.md reflects the current state of the project (skills count, commands count, features)
- [ ] `docs/QUICKSTART.md` instructions work for each adapter (Claude Code, Codex, Cursor)
- [ ] `docs/ROADMAP-STATUS.md` is updated to reflect completed and in-progress deliverables
- [ ] Any new skill has a matching entry in `registry/skills.json`
- [ ] Any new command has a matching entry in `registry/prompts.json`
- [ ] Any new template is referenced in relevant docs
- [ ] Vietnamese docs (`docs/vi/`) are updated if English docs changed structural content

Evidence: file list of updated docs with brief notes.

## 7. Compatibility

- [ ] `adapters/compatibility-matrix.md` is current (no stale tool versions or feature claims)
- [ ] Adapter-specific README files are current
- [ ] No breaking changes to adapter instruction surfaces without documented migration steps
- [ ] All supported tools (Claude Code, Codex, Cursor, Gemini CLI) are listed and accurate

Evidence: compatibility matrix diff or confirmation.

## 8. No Broken References

- [ ] `npm run validate:traceability` passes (if reference files changed)
- [ ] All internal links in new/changed docs resolve to existing files
- [ ] Registry entries point to files that exist on disk
- [ ] No orphan inventory items without narrative markdown links (orphans are warnings, not failures, but review is expected)

Evidence: traceability output.

## 9. No Realistic Secrets in Fixtures

- [ ] Test fixtures contain only obvious placeholders (`test`, `xxx`, `PLACEHOLDER_*`, `<your-key>`)
- [ ] No JSON or config fixtures contain fields that look like real API keys, tokens, or passwords
- [ ] No environment variable values in fixtures are realistic (use empty strings or explicit test values)

Evidence: manual spot-check or secret scan confirms clean fixtures.

## 10. Attribution and Licensing

- [ ] `ATTRIBUTIONS.md` is current (any new upstream inspiration is recorded)
- [ ] `NOTICE.md` is current
- [ ] No unlicensed third-party content was imported
- [ ] `npm run validate:references` passes (if reference files changed)

Evidence: attribution file diff or confirmation.

---

## Release Approval

| Check | Status | Evidence |
|-------|--------|----------|
| 1. Core Validation | | |
| 2. Evaluation Report | | |
| 3. Secret Scan | | |
| 4. Adapter Smoke | | |
| 5. Changelog | | |
| 6. Docs Sync | | |
| 7. Compatibility | | |
| 8. No Broken Refs | | |
| 9. No Secrets in Fixtures | | |
| 10. Attribution | | |

**Release blocked if any check fails.** Fix the issue and re-run the relevant check.

**Signed off by:** ___________________
**Date:** ___________________
