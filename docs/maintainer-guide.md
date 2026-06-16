# Maintainer Guide

This guide is the practical operating checklist for maintaining Vibe Coding OS. It complements `CONTRIBUTING.md`, `docs/governance.md`, and the v1.0 workflow/release policies.

## Weekly Maintenance Checklist

- Review new issues and PRs; label or respond where possible.
- Check that open PRs have clear intent, validation evidence, and updated docs/registries when needed.
- Run or review CI for `npm run validate` failures.
- Triage dependency, security, licensing, or attribution concerns.
- Scan recent changes for stale roadmap, changelog, or compatibility claims.
- Confirm no upstream audit clones or generated local artifacts were staged accidentally.

## Monthly Maintenance Checklist

- Run the broader health checks:
  - `npm run validate`
  - `npm run validate:all` when preparing release-candidate work
  - `npm run eval:report`
  - `npm run dashboard:generate`
  - `npm run dashboard:data`
- Review `docs/ROADMAP-STATUS.md` for stale progress claims.
- Review `adapters/compatibility-matrix.md` and adapter READMEs for drift.
- Review `CHANGELOG.md` to ensure `[Unreleased]` is accurate.
- Check reference-layer freshness for active upstream sources.
- Review safety docs and validation scripts for new prompt-injection, secrets, or memory risks.

## How to Review PRs

1. **Confirm scope**
   - Is the intent clear?
   - Is the PR small enough to review?
   - Does it match the applicable workflow tier in `docs/core-workflow-contract.md`?

2. **Check changed area requirements**
   - Docs: links and claims are current.
   - Skills/commands/templates: format is consistent and registries are updated.
   - Adapters: compatibility claims match `docs/compatibility-support-policy.md`.
   - Scripts/schemas: behavior is tested or smoke-checked.
   - Upstream/reference changes: attribution and license handling are clean.

3. **Review safety**
   - No secrets or realistic credentials.
   - No unsafe prompt-injection patterns.
   - No unbounded destructive shell/file operations.
   - No copied upstream material without attribution and license review.

4. **Verify evidence**
   - `npm run validate` passes.
   - Targeted checks are included when relevant.
   - Changelog, roadmap, and docs are updated for user-facing or governance changes.

5. **Decide**
   - Approve when the change is correct, minimal, validated, and documented.
   - Request changes for correctness, safety, compatibility, missing validation, or unclear scope.
   - Prefer follow-up issues for non-blocking improvements that should not delay a good small change.

## Validation, Evaluation, and Dashboard Commands

Use these commands from the repository root:

```bash
npm run validate
```

Runs the default repository validation gate. This is required before committing and for ordinary PRs.

```bash
npm run validate:all
```

Runs the broader release-candidate gate, including additional safety/evaluation checks wired into the project.

```bash
npm run eval:report
```

Generates or refreshes the evaluation report used by the release checklist.

```bash
npm run dashboard:generate
npm run dashboard:data
```

Regenerates `docs/DASHBOARD.md` and emits dashboard data as JSON. Use these when dashboard inputs or release status may have changed.

Targeted checks commonly used during review:

```bash
npm run validate:schemas
npm run validate:references
npm run validate:traceability
npm run validate:secrets
npm run validate:injection
node scripts/smoke-test-adapters.mjs
npm run smoke-test:cli
```

Run the smallest targeted check first, then `npm run validate` before final approval.

## How to Cut a Release

Follow `docs/release-checklist.md` and the release packaging guide:

- `docs/RELEASE-PACKAGING.md`
- `docs/release-checklist.md`
- `docs/compatibility-support-policy.md`

High-level flow:

1. Confirm all planned changes are merged into the release branch.
2. Update `CHANGELOG.md`, `docs/ROADMAP-STATUS.md`, compatibility docs, and README claims as needed.
3. Run the release validation set from `docs/release-checklist.md`.
4. Use the version bump process documented in `docs/RELEASE-PACKAGING.md`.
5. Prepare release notes from the changelog and validation evidence.
6. Tag/publish only after release checklist sign-off.

Do not cut a release with failing validation unless the project maintainer explicitly documents a temporary exception and mitigation.

## Handling Compatibility Changes

Use `docs/compatibility-support-policy.md` as the authority.

- Classify the change as breaking or non-breaking before implementation.
- For breaking changes, prefer deprecation first: notice, one-minor-version grace period, migration notes, then removal.
- Update `CHANGELOG.md` with migration guidance.
- Update adapter docs and `adapters/compatibility-matrix.md` when instruction surfaces or support levels change.
- Use an ADR for changes that affect the core workflow contract, adapter guarantees, schemas, or long-term support policy.
- Security fixes may bypass normal deprecation only when keeping old behavior would cause harm; document the rationale.
