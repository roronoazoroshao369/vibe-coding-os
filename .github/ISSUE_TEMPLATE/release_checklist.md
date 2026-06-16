---
name: Release Checklist
about: Track release candidate progress, validation gates, and release readiness
title: '[RELEASE] v'
labels: release
assignees: ''
---

## Release version

Target version and tag (e.g. `v1.0.0-rc.1`, `v1.0.0`).

## Release type

- [ ] Release candidate (RC)
- [ ] Patch release
- [ ] Minor release
- [ ] Major release

## Pre-release validation

- [ ] `npm run validate` passes
- [ ] `npm run validate:all` passes
- [ ] `npm run validate:schemas` passes (if registry or schema files changed)
- [ ] `npm run validate:references` passes (if reference files changed)
- [ ] `npm run validate:traceability` passes (if commands, skills, templates, or doc links changed)
- [ ] `npm run smoke-test:cli` passes
- [ ] `npm run test:e2e` passes
- [ ] `npm run eval:report` passes all safety checks
- [ ] Adapter smoke tests pass for all Tier 1 adapters

## Release dry-run

- [ ] `npm run release:dry-run` succeeds
- [ ] Git status is clean
- [ ] Changelog `[Unreleased]` section is accurate and complete

## Documentation checks

- [ ] `CHANGELOG.md` has version-appropriate entries
- [ ] `docs/DASHBOARD.md` is regenerated and current
- [ ] `docs/ROADMAP-STATUS.md` reflects release status
- [ ] `docs/support-matrix.md` matches adapter support tiers
- [ ] Release notes draft exists (e.g. `docs/releases/<version>.md`)

## Post-release

- [ ] Tag created from expected commit
- [ ] GitHub Release published with release notes
- [ ] Dashboard and roadmap not stale after merge

## Notes

<!-- Add release notes, blockers, or context here. -->
