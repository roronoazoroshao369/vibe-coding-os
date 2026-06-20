---
name: using-vibe-coding-os
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: meta
tags:
  - meta
status: stable
---

# Skill: Using Vibe Coding OS

## Purpose

Select and combine Vibe Coding OS skills, commands, templates, and registries for disciplined AI-assisted software work.

## When to use

Use at session start, when choosing a workflow path, onboarding a new agent harness, or recovering from uncertainty about which artifact to use next.

## Inputs

User intent, repository status, available skills/commands/templates, relevant instructions, and validation expectations.

## Workflow

1. Read the repo-level instructions and check `registry/skills.json` and `registry/prompts.json` for available procedures.
2. Choose the lightest workflow that still protects correctness and user intent.
3. For non-trivial work, prefer Brainstorming → Spec/design → Plan → Execute → TDD/checks → Review → Verify → Finish branch → Memory.
4. Use commands as reusable prompts and skills as operating procedures; do not over-orchestrate tiny edits.
5. When adapting upstream ideas, consult the Reference Intelligence Layer before editing local artifacts.
6. End every task with honest verification status and clear next steps.

## Skill discovery workflow

When you need a skill for an unfamiliar domain, use this discovery loop:

1. **Category scan.** Check `registry/skills.json` and filter by category (core, memory, prompts, checklists, agents, meta, quality) that matches the task type.
2. **Tag search.** Search skills by relevant tags: "api", "database", "security", "memory", etc. Tags are listed in each skill's registry entry.
3. **Bundle lookup.** If the task fits a common domain (web-dev, data-science, security-review, cli-tools, memory-workflow), read `registry/bundles.json` for the curated skill list.
4. **Composability check.** Before loading multiple skills, check each skill's Works with / Conflicts with / Depends on sections in the SKILL.md body to avoid contradictory guidance.
5. **Load selectively.** Activate only the skills that match the current task phase. Do not load every skill in a bundle.

## Bundle activation workflow

When a task falls into a recognized domain, activate the relevant bundle:

1. Identify the domain from the user's goal, file paths, or explicit request.
2. Look up the matching bundle in `registry/bundles.json`.
3. Read the listed skills from their SKILL.md files. Check composability metadata.
4. Present the selected bundle to the user for confirmation before loading skills.
5. Use `vibe-init --bundle <name>` at session start for explicit bundle activation.

## Proficiency-path alignment

This skill is relevant across all four levels of the Vibe Coding OS proficiency path (`docs/proficiency-path.md`):

- **Level 1 (Vibe Basics):** Use this skill's basic workflow — read CLAUDE.md, check registries, choose a light workflow, end with verification. Focus on the skill discovery loop.
- **Level 2 (Prompt Engineering with Skills):** Use the bundle activation workflow to compose domain-specific skill stacks. Study the composability sections to avoid loading contradictory skills.
- **Level 3 (Agentic Engineering):** Combine this skill with SuperAgent orchestration patterns. Load skills selectively per subtask, not globally. Use `vibe-proficiency` to confirm readiness for deeper workflows.
- **Level 4 (Orchestration):** Use this skill to design the skill-loading strategy for multi-agent teams. Apply progressive disclosure — give each agent only the skills relevant to their role.

Run `commands/vibe-proficiency.md` to determine your current level if unsure.

## Outputs

A workflow selection note, chosen commands/skills/templates, and a clear next action or completion report.

## Failure modes

- Using every skill for trivial work.
- Skipping spec/plan/review for risky work.
- Ignoring registries and creating unindexed artifacts.
- Learning from upstream without reference or attribution checks.

## Verification checklist

- [ ] Chosen workflow is proportional.
- [ ] Relevant skills/commands are named.
- [ ] Reference and attribution rules were followed when needed.
- [ ] Verification status is explicit.
