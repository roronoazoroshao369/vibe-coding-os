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

Guide for authoring new skills that integrate with the Vibe Coding OS skill system.

## When to use

When you are about to create a new skill file in `skills/<category>/<skill-name>/SKILL.md`.

## Inputs

- Skill purpose (one sentence)
- Target category
- Use case (3-5 trigger phrases)
- Failure modes

## Workflow

1. Draft the skill's purpose in 1-2 sentences.
2. List 3-5 "When to use" trigger phrases.
3. Add YAML frontmatter with all required fields.
4. Write the body in this order: Purpose → When to use → Inputs → Workflow → Outputs → Failure modes → Verification checklist → Examples.
5. Run `npm run validate:skill-quality` to confirm compliance.

## Outputs

- A new SKILL.md file in the appropriate `skills/<category>/<skill-name>/` directory.
- A passing `validate:skill-quality` run.

## Failure modes

1. **Missing frontmatter** — gate FAIL.
2. **Missing required sections** — gate FAIL.
3. **No examples** — convention recommends 3.
4. **Stale skill** — `last_reviewed` too old.

## Verification checklist

- [ ] YAML frontmatter is valid
- [ ] All required sections present
- [ ] At least 1 example included
- [ ] `last_reviewed` is current
- [ ] `validate:skill-quality` exits 0
- [ ] Linked from at least one adapter or command

## See also

- `templates/registry.json` — conceptual template for registry files
- `templates/skill-example-template.md` — example template
