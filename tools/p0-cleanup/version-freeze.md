# Version Freeze Policy (P0)

**Goal:** stop the version churn that took this repo from `v0.1` to
`v2.17.7` in ~17 days (≈1 release/day). To an evaluator that pattern
reads as instability, not progress.

## The rule

> **A version bump requires a user-facing change to the framework's
> behavior or contract** — a new/changed skill, command, adapter,
> schema, or runtime capability that a *consumer* of the package would
> notice.

The following do **NOT** bump the version:

- Repo cleanup (removing binaries, gitignore edits, archiving reports)
- Internal refactors with no behavior change
- Docs / README / website-only edits
- Adding or merging validators/CI that don't change shipped artifacts
- Council/process reports

## Freeze window

During the P0 cleanup sprint, **do not bump `version` in
`package.json` at all.** Land cleanup as `chore:` commits. Resume
semantic versioning only when the next *real* feature ships.

## Enforcement (optional, recommended)

A guard script fails CI if `package.json` `version` changed in a commit
whose files are all cleanup/docs:

```bash
node tools/p0-cleanup/check-version-bump.mjs
```

It allows a bump only when at least one file under
`skills/ commands/ adapters/ schemas/ runtime/` also changed.

## Cadence going forward

- Batch changes into **weekly** minor releases at most, unless a fix is
  urgent (security/regression → patch immediately).
- Keep ONE `CHANGELOG.md`; group by release, not by day.
