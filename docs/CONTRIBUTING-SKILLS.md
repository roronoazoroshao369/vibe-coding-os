# How to contribute skills

This file explains how to add or improve a skill in Vibe Coding OS.

## Where skills live

All skills are under:

```text
skills/<category>/<skill-name>/SKILL.md
```

For example:

- `skills/core/test-driven-development/SKILL.md`
- `skills/memory/project-memory/SKILL.md`
- `skills/meta/context-budget/SKILL.md`

## When to add a skill

Add a skill when:
- A workflow pattern repeats across sessions.
- A failure mode keeps recurring.
- A prompt discipline improves quality or reduces drift.
- A role-specific workflow is missing.

Do not add a skill for:
- One-off examples.
- Framework opinions you cannot maintain.
- Anything that duplicates an existing skill without meaningful improvement.

## Skill structure

Every `SKILL.md` should contain at least:

- Purpose
- When to use
- Inputs
- Workflow
- Outputs

Recommended additions:
- Failure modes
- Verification checklist

Example shape:

```text
# Skill: Example Skill

## Purpose
One or two sentences.

## When to use
When this applies and when it does not.

## Inputs
What the caller should provide.

## Workflow
1. First step.
2. Second step.
3. Final validation.

## Outputs
What is produced.

## Failure modes
Common mistakes.

## Verification checklist
How to confirm it worked.
```

## Categories

Choose one primary category:
- `core` — discipline and engineering workflow skills
- `memory` — context and project memory
- `meta` — how to write and extend Vibe Coding OS itself
- `agents` — role-specific agent workflows
- `prompts` — curated prompt disciplines

Keep each skill focused on one workflow or safeguard.

## Quality rules

1. Prefer actionable steps over philosophy.
2. Say when the skill should not be used.
3. Do not duplicate another skill without justification.
4. Make inputs and outputs explicit.
5. Link related skills in the “Ghi chú tiếng Việt” section if helpful.

## Adding the skill

1. Create the folder:
   `skills/<category>/<new-skill>/SKILL.md`
2. Add a short purpose sentence at the top.
3. Fill the workflow in numbered steps.
4. Add failure modes.
5. Run:
   ```bash
   npm run validate:all
   ```
6. Open a PR.

## How a skill becomes a pack

A good pack is:
- Focused on one working style.
- Small enough to load quickly.
- Not redundant with every other pack.

Example packs:
- `core-solo` for solo AI coding
- `react-nextjs` for frontend product work
- `memory-safe` for memory hygiene
- `multi-agent` for role-based coordination

If a skill helps most users regardless of workflow, it belongs in `core` or `meta` instead of a specialized pack.

## Review checklist

Before merging:
- File path is correct
- Purpose is obvious in 1 line
- Steps are specific
- Inputs / outputs exist
- `validate:all` passes
- Related docs and packs still make sense

## Final advice

Good skills are small, clear, and reusable. The goal is not a big catalog — it is a reliable, maintainable workflow system.
