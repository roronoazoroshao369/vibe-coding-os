---
name: authoring-skills
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: meta
tags: [authoring, skills, meta]
status: stable
---

# Skill: Authoring Skills

## Purpose

Guide for authoring new skills that integrate with the Vibe Coding OS skill system. Covers frontmatter (name, version, introduced_in, last_reviewed, category, tags, status), required sections (Purpose, When to use, Inputs, Workflow, Outputs, Failure modes, Verification checklist, Examples), and the per-skill example convention (see `templates/skill-example-template.md`).

## When to use

When you are about to create a new skill file in `skills/<category>/<skill-name>/SKILL.md`. Read this guide first to ensure your skill passes `validate:skill-quality` and `validate:traceability` on the first try.

## Inputs

- Skill purpose (one sentence)
- Target category (core, prompts, agents, meta, quality, security, memory, etc.)
- Use case (3-5 trigger phrases)
- Failure modes (what could go wrong)

## Workflow

1. Draft the skill's purpose in 1-2 sentences.
2. List 3-5 "When to use" trigger phrases.
3. Add YAML frontmatter with all required fields.
4. Write the body in this order: Purpose → When to use → Inputs → Workflow → Outputs → Failure modes → Verification checklist → Examples.
5. Run `npm run validate:skill-quality` to confirm compliance.
6. If a regression test is needed, follow `templates/skill-test-template.md`.

## Outputs

- A new SKILL.md file in the appropriate `skills/<category>/<skill-name>/` directory.
- A passing `validate:skill-quality` run.

## Failure modes

1. **Missing frontmatter** — gate FAIL on `validate:skill-quality`. Add all required fields.
2. **Missing required sections** — gate FAIL. Use the section order above.
3. **No examples** — convention recommends 3 (trivial/standard/advanced). Use `templates/skill-example-template.md`.
4. **Stale skill** — `last_reviewed` is too old. Update when the skill changes.
5. **No test file** — convention recommends 1 test per top-20 priority skill. See Wave B Deliverable 4.

## Verification checklist

- [ ] YAML frontmatter is valid (parse with `js-yaml`)
- [ ] All required sections present in the correct order
- [ ] At least 1 example included
- [ ] `last_reviewed` date is current
- [ ] `validate:skill-quality` exits 0
- [ ] Linked from at least one adapter or command (no orphan skills)
- [ ] Optional: test file at `tests/skills/<skill-name>.test.mjs`
