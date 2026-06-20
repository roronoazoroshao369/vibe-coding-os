---
name: writing-skills
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: core
tags:
  - core
status: stable
---

# Skill: Writing Skills

## Purpose

Provide a structural recipe for authoring new skills in the `skills/` tree. The recipe enforces section contracts (Purpose, When to use, Inputs, Workflow, Outputs, Failure modes, Verification checklist, Related skills) that keep the catalog consistent and machine-lintable.

## When to use

Use when adding a new skill, refactoring an existing skill that drifts in quality, or migrating a hard-coded prompt into a proper skill. Choose this skill when you need the section contract — not a freeform "good docs" hand-wave.

## Inputs

- The skill's purpose (one sentence, verb-first).
- The failure modes the skill is meant to prevent.
- The related skills (to populate the "Related skills" section).
- The verification gates that prove the skill worked.

## Workflow

1. Open `templates/skill-template.md` and copy its 8 required sections.
2. Fill each section in the order listed; do not skip any.
3. Write the Verification checklist with falsifiable gates (each `- [ ]` must be checkable).
4. List at least 2 Related skills.
5. Run `npm run validate:skill-quality` and resolve every error.
6. Run `npm run validate:references` and resolve every missing reference.

## Outputs

- One new `SKILL.md` with all 8 required sections.
- One new entry in `registry/skills.json` matching the file path.
- A passing `npm run validate:skill-quality` exit 0.

## Failure modes

- Skipping the Verification checklist (the skill is then un-falsifiable).
- Writing Failure modes as prose (the linter requires bullet points).
- Skipping the Related skills section (skill becomes a silo).

## Verification checklist

- [ ] All 8 required sections present.
- [ ] Each `- [ ]` in Verification checklist is concretely checkable.
- [ ] `npm run validate:skill-quality` exit 0.
- [ ] `npm run validate:references` exit 0.
- [ ] Skill entry exists in `registry/skills.json`.

## Related skills

- `skills/core/prompt-architecture/SKILL.md` — sister recipe for prompts
- `skills/core/writing-plans/SKILL.md` — sister recipe for plans
- `skills/core/clarify-before-code/SKILL.md` — restate before authoring
