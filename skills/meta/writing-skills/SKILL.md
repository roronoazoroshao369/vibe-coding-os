# Skill: Writing Skills

## Purpose

Create or revise portable skill procedures that are original, practical, indexed, and safe for multiple coding-agent harnesses.

## When to use

Use when adding a new `SKILL.md`, improving an existing skill, adapting upstream methodology, or standardizing a repeated workflow.

## Inputs

Skill purpose, triggering situations, expected inputs/outputs, local conventions, reference sources, license constraints, and validation requirements.

## Workflow

1. Define the behavior the skill changes, not just a topic name.
2. Use the required sections: Purpose, When to use, Inputs, Workflow, Outputs, Failure modes, Verification checklist.
3. Write original, concise instructions that work across Claude Code, Codex, Cursor, and similar agents.
4. Mention related skills or aliases only when that prevents duplication.
5. Update `registry/skills.json`, mapping docs, and Vietnamese indexes when the skill is user-facing.
6. Run validation and record attribution if external inspiration materially shaped the skill.

## Outputs

A complete skill file plus registry, mapping, documentation, attribution, and validation updates as needed.

## Failure modes

- Copying upstream skill text instead of writing local original procedure.
- Creating duplicate skills instead of aligning aliases.
- Skipping registry or documentation indexing.
- Making the skill tool-specific when the behavior should be portable.

## Verification checklist

- [ ] Required headings are present.
- [ ] Instructions are original and actionable.
- [ ] Registry and indexes include the skill.
- [ ] Attribution and validation are complete where applicable.

Related mattpocock-inspired skill: `skills/meta/write-reusable-skill/SKILL.md` for compact reusable skill authoring.
