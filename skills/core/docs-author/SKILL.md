---
name: docs-author
version: 1.0.0
introduced_in: v2.14.0
last_reviewed: 2026-06-20
category: core
tags: [docs, documentation, writing, structure, conventions]
description: Five-section structure (Purpose → When to use → Workflow → Outputs → Failure modes) for authoring skills, commands, and templates that match repo conventions.
---

# Skill: Docs Author

## Purpose


The five-section structure (Purpose, When to use, Workflow, Outputs, Failure modes) is the **minimum viable structure** validated by `validate-skill-quality.mjs`. Adding optional sections (Inputs, Verification checklist, Cross-references) signals flagship-quality work.

## When to use

- Creating a new skill, command, or template
- Reviewing a PR that adds documentation
- Auditing existing docs for quality regressions
- Migrating content from another format (Notion, Confluence, internal wiki)

Do NOT use for:
- README files (use the bilingual README convention)
- ADR files (use the ADR template)
- Release notes (use the release notes template)

## Inputs

- A topic, audience, and the workflow being documented
- Existing patterns to mirror (search with `skill-content-search`)
- An optional reviewer / maintainer for the "Cross-references" section

## Workflow

1. **Run `node scripts/skill-content-search.mjs "<topic>"`** to find existing related docs and avoid duplication.
2. **Start with the required sections** — write Purpose, When to use, Workflow, Outputs, Failure modes. Use the doc structure table below.
3. **Add optional sections** — Inputs, Verification checklist, Cross-references. These elevate the doc from "minimum" to "flagship".
4. **Run `node scripts/validate-skill-quality.mjs`** and fix any errors (warnings are OK).
5. **Add cross-references** — link from related skills' "Cross-references" section back to yours.
6. **Update the registry** — add to `registry/skills.json` (or `commands/manifest.json`, `registry/prompts.json`).
7. **Run `node scripts/generate-dashboard.mjs`** to regenerate the project health dashboard.

### Doc structure table

| Section | Required? | Purpose | Length target |
|---------|-----------|---------|---------------|
| `# Title` | Yes | H1 heading, file purpose | ≤ 60 chars |
| `## Purpose` | Yes | What problem this solves | 2–4 sentences |
| `## When to use` | Yes | Trigger conditions + exclusions | 3–7 bullets |
| `## Inputs` | No | What the user provides | 3–6 bullets |
| `## Workflow` | Yes | Step-by-step instructions | 4–10 numbered steps |
| `## Outputs` | Yes | What gets produced | 3–6 bullets |
| `## Failure modes` | Yes | Known edge cases + recovery | 3–7 entries |
| `## Verification checklist` | No | How to confirm it worked | 4–8 checkboxes |
| `## Cross-references` | No | Links to related skills/docs | 3–6 links |

## Outputs

- A complete SKILL.md / command .md / template .md following the 5-section convention
- Optional sections added as needed for clarity
- Validation passing via `validate-skill-quality.mjs`
- Cross-references wired in both directions (your doc links out, related docs link in)

## Failure modes

1. **Skipping "Failure modes"** — leads to repeated questions and stale docs. Always include at least 3.
2. **Vague "When to use"** — readers don't know if this applies to them. Use explicit trigger phrases.
3. **Workflow without examples** — abstract steps don't transfer. Include at least one concrete example per major step.
4. **No cross-references** — orphaned docs rot. Always wire bidirectional links.
5. **Naming collisions** — check existing skills before naming; use `skill-content-search` to verify.
6. **Frontmatter drift** — keep YAML keys in sync across files; validate with `validate-repo.mjs`.

## Verification checklist

- [ ] All 5 required sections present (Purpose, When to use, Workflow, Outputs, Failure modes)
- [ ] Optional sections included where they add value
- [ ] At least one concrete example per Workflow step
- [ ] At least 3 Failure modes documented
- [ ] Cross-references are bidirectional (or at least point outward)
- [ ] YAML frontmatter matches repo schema (name, version, category, description, tags)
- [ ] `node scripts/validate-skill-quality.mjs` exits 0
- [ ] Entry added to `registry/skills.json` (or relevant manifest)
- [ ] `node scripts/generate-dashboard.mjs` regenerates clean
- [ ] At least one reviewer signed off

## Cross-references

- See `skills/core/quality-shield/SKILL.md` — quality contract before merging docs
- See `skills/core/skill-content-search/SKILL.md` — find related content first
- See `templates/adr-template.md` — for ADR-format decisions
- See `docs/quality-shield.md` — Quality Shield workflow context
- See `scripts/validate-skill-quality.mjs` — what the gate checks

## Review cadence

- Quarterly: review doc count, orphan docs, cross-reference completeness
- On new convention: update this skill + announce in release notes
- On retire: use `deprecate-skill` workflow (not delete) for backward compat
