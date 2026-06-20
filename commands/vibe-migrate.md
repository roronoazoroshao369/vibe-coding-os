---
description: "Migrate a project from a deprecated artifact to its replacement."
---

# Command: Vibe Migrate

## When to use

Invoke when a project (your repo, a consumer's repo, or a config file) is referencing a deprecated artifact and you need to migrate to the replacement. Pairs with `vibe-deprecate` (the artifact-side deprecation command).

## Required inputs

- Deprecated artifact identifier (path, command name, template name)
- Project path (or list of files) that references the artifact
- Replacement artifact identifier
- Migration script or steps (from the deprecation notice)

## Step-by-step behavior

1. Read the deprecation notice for the target artifact (`registry/deprecation-tracker.json` or extension).
2. Identify all references to the deprecated artifact in the project (search for the artifact path/name/identifier).
3. Classify each reference:
   - **Direct usage** (the artifact is invoked directly) — must migrate before sunset.
   - **Indirect usage** (the artifact is referenced in docs/comments) — should migrate before sunset.
   - **Orphaned reference** (the artifact is mentioned but not used) — safe to remove without migration.
4. For each direct usage, apply the migration path from the deprecation notice:
   - Run the migration script if provided.
   - Manually apply the steps if no script.
   - Verify the replacement works (run the project's quality gates).
5. For each indirect usage, update the docs/comments to point to the replacement.
6. For each orphaned reference, remove it.
7. Re-run all quality gates to verify no breakage.
8. Update the project's `CHANGELOG.md` to record the migration.

## Outputs

- Migrated project files (all references updated to replacement)
- `CHANGELOG.md` entry recording the migration
- Verification report (all quality gates pass)

## Stopping conditions

Stop when: (a) all direct references migrated, (b) all indirect references updated, (c) all orphaned references removed, (d) quality gates pass, (e) `CHANGELOG.md` updated.

## Verification checklist

- [ ] All direct references migrated
- [ ] All indirect references updated
- [ ] All orphaned references removed
- [ ] `npm run validate:all` PASSES
- [ ] Project's quality gates PASS
- [ ] Replacement artifact works as expected
- [ ] `CHANGELOG.md` updated

## Anti-patterns to avoid

- Migrating without reading the deprecation notice (misses migration steps)
- Direct usage with no migration applied (will break at sunset)
- Skipping indirect usage updates (docs become misleading)
- Removing orphaned references during a partial migration (incremental confusion)
- Forgetting to update `CHANGELOG.md` (no audit trail)

## Related skills

- `skills/core/deprecation-migration/SKILL.md` — full Compulsory/Advisory protocol
- `commands/vibe-deprecate.md` — artifact-side deprecation command
- `templates/deprecation-notice-template.md` — notice template
- `registry/deprecation-tracker.json` — append-only tracker
