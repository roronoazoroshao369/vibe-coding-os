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
