---
name: deprecate-skill
version: 1.0.0
introduced_in: v2.14.0
last_reviewed: 2026-06-20
category: core
tags: [deprecation, lifecycle, retirement, migration, governance]
description: Workflow and tooling for deprecating skills properly. Marks the skill, logs to deprecation tracker, generates notice, updates frontmatter, and notifies consumers via search index.
sandbox:
  level: trusted
  external_content: false  # Heuristic: pattern matched but content is documentation-only

---

# Skill: Deprecate Skill

## Purpose

Provide a safe, auditable, append-only workflow for retiring skills. Deprecation is not deletion — it is the visible, time-boxed process of telling consumers "use the new thing instead" before any artifact is removed.

This skill prevents the most common mistake: deleting a skill without telling anyone, breaking downstream users, and forcing emergency rollbacks.

## When to use

- A skill is being replaced by a better version (e.g. v1 → v2)
- A skill has been merged into another skill and the standalone is now redundant
- A skill references deprecated upstream APIs that no longer work
- A skill has zero consumers for N quarters (use `skill-deps-graph` to verify)
- A skill violates a license or security policy and must be removed

Do NOT use for:
- Temporary hiding (use `disabled: true` in frontmatter instead)
- Renaming without functionality change (just rename + update refs)
- Marking things "experimental" (use `maturity: experimental`)

## Inputs

- Skill name to deprecate
- Reason (one paragraph explaining why)
- Replacement skill path (or "none — sunset only")
- Severity (compulsory or advisory)
- Sunset date (default 30 days from now)

## Workflow

1. **Verify zero or low usage**: `node scripts/skill-deps-graph.mjs stats` → check if the skill has incoming refs. If many consumers exist, deprecation will be more disruptive.
2. **Identify replacement**: which skill should consumers use instead? If none, note "sunset only" — the skill just goes away at sunset.
3. **Run mark action**: `node scripts/deprecate-skill.mjs mark <skill-name> "<reason>" <replacement>` — this:
   - Adds an entry to `registry/deprecation-tracker.json` (append-only)
   - Updates the skill's frontmatter with `deprecated: true`, `deprecation_id`, `replacement`, `sunset_date`
4. **Generate notice**: `node scripts/deprecate-skill.mjs notice <skill-name>` — writes a markdown notice to `docs/deprecations/DEP-XXX.md`
5. **Communicate**: post in CHANGELOG / release notes, mention in ADR if relevant
6. **Wait for sunset period**: 30 days advisory, 60 days compulsory
7. **At sunset**: physically remove the skill (now safe to delete) and remove from `registry/skills.json`
8. **Post-sunset cleanup**: archive the deprecation notice in `docs/archive/deprecations/`

### Example: Deprecate a skill with a replacement

```bash
node scripts/deprecate-skill.mjs mark old-skill-name "Replaced by new-skill-name with stricter validation" new-skill-name
node scripts/deprecate-skill.mjs notice old-skill-name
git add registry/deprecation-tracker.json docs/deprecations/ `<path-to-deprecated-skill>/SKILL.md`
git commit -m "deprecate(old-skill-name): replaced by new-skill-name"
```

### Example: Sunset only (no replacement)

```bash
node scripts/deprecate-skill.mjs mark legacy-thing "End-of-life: feature moved to marketplace"
```

### Example: List all deprecations

```bash
node scripts/deprecate-skill.mjs list
```

## Outputs

- `registry/deprecation-tracker.json` updated with new entry
- `docs/deprecations/DEP-XXXX.md` notice file generated
- `skills/<path>/SKILL.md` frontmatter updated with deprecation metadata
- All consumers can discover the deprecation via the tracker JSON

## Failure modes

1. **Double deprecation** — script refuses to mark an already-deprecated skill; check tracker first
2. **Skill not found** — script searches by `name:` in frontmatter; ensure name is correct
3. **Frontmatter malformed** — script adds deprecation fields but if frontmatter is broken the merge may fail; validate with `validate-repo.mjs` after
4. **Tracker file gone** — script creates a fresh one with version 0.1.0; existing entries will be lost (script does not auto-recover)
5. **No replacement specified** — replacement defaults to "none — sunset only"; consumers won't know what to use, so add at least an ADR pointing to alternatives
6. **Sunset too short** — 30 days is the floor; consumers need time to migrate; consider 60+ for compulsory

## Verification checklist

- [ ] Skill has zero or low incoming refs (verified via `skill-deps-graph`)
- [ ] Replacement skill exists and has the same use cases
- [ ] Reason is clear and one paragraph
- [ ] Sunset date is at least 30 days out (advisory) or 60 days (compulsory)
- [ ] Tracker entry added with unique notice ID
- [ ] Notice file generated in `docs/deprecations/`
- [ ] CHANGELOG / release notes mention the deprecation
- [ ] At sunset, physical removal happens in a separate PR with clear commit message
- [ ] Post-sunset: tracker entry stays for audit (do not delete)

## Cross-references

- See `templates/deprecation-notice-template.md` — the canonical notice template
- See `registry/deprecation-tracker.json` — append-only log of all deprecations
- See `skills/core/skill-deps-graph/SKILL.md` — find consumers before deprecating
- See `skills/core/skill-content-search/SKILL.md` — find all references to the skill
- See `scripts/deprecate-skill.mjs` — source code

## Review cadence

- Monthly: review tracker for entries past their sunset date (must be physically removed)
- Quarterly: review advisory entries — has the replacement been adopted?
- Annually: archive deprecation notices older than 1 year past sunset
