---
description: "Mark a skill, command, template, or registry entry as deprecated with a structured sunset timeline."
---

# Command: Vibe Deprecate

## When to use

Invoke when an artifact (skill, command, template, registry entry, schema) is being replaced, removed, or marked end-of-life. Pairs with `vibe-migrate` (the consumer-facing migration command).

## Required inputs

- Target artifact path or identifier
- Reason for deprecation
- Replacement artifact (if any)
- Migration path (steps users must take)
- Severity classification (compulsory vs advisory)

## Step-by-step behavior

1. Answer the 5 pre-deprecation questions (system value, consumers, replacement, migration cost, maintenance cost of NOT deprecating).
2. Classify severity:
   - **Compulsory** → 2 minor versions OR 30 days notice, whichever is longer.
   - **Advisory** → 1 minor version OR 14 days notice, whichever is longer.
3. Fill `templates/deprecation-notice-template.md`.
4. Add `status: "deprecated"` to the registry entry.
5. Add `## Deprecation` section to the target file (severity, replacement, sunset date, link).
6. Add entry to `registry/deprecation-tracker.json` (or extension).
7. Update `CHANGELOG.md` under `### Deprecated`.
8. For compulsory: also update README, layer READMEs, adapter docs.
9. Update validation gate to warn (advisory) or error (compulsory) on references.

## Outputs

- Filled deprecation notice
- Updated registry entry with `status: "deprecated"`
- Updated target file with `## Deprecation` section
- `CHANGELOG.md` entry
- `registry/deprecation-tracker.json` entry

## Stopping conditions

Stop when: (a) all 5 questions answered, (b) severity classified with justification, (c) notice filled, (d) artifact marked, (e) tracker updated, (f) changelog updated, (g) validation gate updated.

## Verification checklist

- [ ] 5 pre-deprecation questions answered
- [ ] Severity classified
- [ ] Deprecation notice filled
- [ ] Artifact has `status: "deprecated"`
- [ ] Target file has `## Deprecation` section
- [ ] `CHANGELOG.md` updated
- [ ] Compulsory: README/layer-READMEs updated
- [ ] Tracker entry exists
- [ ] Validation gate warns/errors on references
- [ ] Sunset date set

## Anti-patterns to avoid

- Deprecating without a replacement (users stranded)
- Marking compulsory when advisory would suffice (panic)
- Marking advisory when compulsory is required (security incident)
- Sunset date without notice period
- Deprecation notice without migration path
- Removing the artifact before sunset date
- Deprecation without tracker entry

## Related skills

- `skills/core/deprecation-migration/SKILL.md` — full Compulsory/Advisory protocol
- `commands/vibe-migrate.md` — consumer-facing migration command
- `templates/deprecation-notice-template.md` — notice template
- `registry/deprecation-tracker.json` — append-only tracker
