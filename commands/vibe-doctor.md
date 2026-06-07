---
description: "Diagnose repository health across required files, registries, skills, commands, templates, and validation scripts."
---

# vibe-doctor

## Purpose

Diagnose repository health and surface concrete fixes. Check required files, registries, skills, commands, templates, package scripts, reference metadata, and obvious documentation gaps.

## When to use

Use this command when onboarding, after changing repository structure, when validation fails, before release or merge, or when command, skill, registry, or template consistency is in doubt.

## Required inputs

- Repository root and current branch.
- Current git status.
- Any known failing validation output or suspicious files.
- Scope preference, such as full repository health or reference-only health.

## Step-by-step workflow

1. Read applicable instructions and inspect repository structure.
2. Check required registries such as `registry/skills.json` and `registry/prompts.json` for missing, stale, or unclear entries.
3. Check command files, skill files, templates, and reference docs for expected presence and obvious mismatches.
4. Inspect `package.json` scripts and identify available validation commands.
5. Run `npm run validate` when available unless the requested scope is narrower.
6. If validation fails, identify the failing script, likely cause, and concrete next fix.
7. Report health findings without making changes unless explicitly asked.

## Output format

Return a diagnostic report with:

- **Overall status**: healthy, warnings, or failing.
- **Checks performed**.
- **Findings**: blockers first, then warnings, then informational notes.
- **Validation output summary**.
- **Recommended fixes**.
- **Files or registries to update**.

## Verification expectation

Run `npm run validate` for a full health check. If only reference files are in scope, run `npm run validate:references`. If validation cannot run, state the environment limitation and provide the best manual checks performed.

## Stop/ask-clarifying-question condition

Stop and ask when the requested diagnostic scope is unclear and running full validation would be too expensive, when a fix would require changing files without user approval, or when validation failure points to an ambiguous policy decision.

## Related skills/templates

- `skills/core/vibe-bootstrap/SKILL.md`
- `skills/core/verification-before-done/SKILL.md`
- `skills/core/upstream-intelligence-loop/SKILL.md`
- `templates/task-template.md`
