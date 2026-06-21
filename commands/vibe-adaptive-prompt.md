---
description: "Classify task type and recommend the right quality prompt stack from the registry."
---

# vibe-adaptive-prompt

## Purpose

Classify the current task into a type (feature, bugfix, refactor, security, migration), identify which quality packs apply, and produce a ready-to-load prompt stack so quality gates are selected proportionally rather than manually.

## When to use

Use at the start of any non-trivial coding task to decide which quality packs to compose into the working context. Backs `skills/core/adaptive-prompt-selection/SKILL.md`.

## Required inputs

- Task description (what the user asked for)
- Changed files or blast radius (if known)
- Access to `templates/adaptive-prompt-matrix.md` for the pack matrix

## Step-by-step behaviour

1. Read the task description and any available diff or file list.
2. Classify the task into one of: `feature`, `bugfix`, `refactor`, `security`, `migration`. If ambiguous, ask the user or default to the heavier type.
3. Identify domain amplifiers: does the task touch API endpoints, database schema, authentication, frontend state, or async/background jobs?
4. Look up the base quality pack list from `templates/adaptive-prompt-matrix.md` for the classified task type.
5. Add domain amplifier packs that are not already in the base list.
6. Apply adaptive-flow tier logic: if the task is tiny or small, suggest the lightest useful subset of packs; if medium or larger, suggest the full set.
7. Output the recommended prompt stack as a numbered list with skill paths and a one-line purpose for each.
8. Ask the user to confirm or adjust the stack before proceeding.

## Outputs

A prioritized, task-specific stack of quality pack skill paths, ready to be loaded and executed as part of the task workflow.

## Stopping conditions

Stop and ask when the task description is too vague to classify, when the matrix does not cover the task type, or when the user wants to override the recommendation.

## Verification checklist

- [ ] Task type is classified and stated.
- [ ] Domain amplifiers are identified.
- [ ] Base packs are selected from the matrix.
- [ ] Domain packs are added where relevant.
- [ ] Pack count is proportional to task tier.
- [ ] Each pack has a valid path in the registry.
- [ ] User confirms the stack before execution.

## Handoffs / next-step suggestion

- Stack confirmed → load each pack and compose into the task context, then proceed with implementation.
- Task type changes mid-flight → reclassify and adjust the pack stack.
- New quality pack available → update `templates/adaptive-prompt-matrix.md`.

## Related skills/commands

- `skills/core/adaptive-prompt-selection/SKILL.md` — the skill backing this command
- `templates/adaptive-prompt-matrix.md` — canonical task-type-to-pack matrix
- `commands/vibe-model-weakness.md` — add model-specific weakness checks after selecting quality packs
- `commands/vibe-lessons-learned.md` — add prior lesson prevention rules before implementation
- `skills/core/adaptive-flow/SKILL.md` — tier-based proportional workflow selection
- `skills/core/quality-execution-contract/SKILL.md` — quality contract before coding
- `skills/prompts/quality-rubric/SKILL.md` — baseline quality rubric
- `skills/core/verification-before-done/SKILL.md` — final verification gate

