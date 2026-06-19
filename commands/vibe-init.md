---
description: "Orient a new session by inspecting instructions, repository state, registries, templates, skills, and next workflow step."
---

# vibe-init

## Purpose

Prime the repository for disciplined AI-assisted work before changing files. Build a shared understanding of the current instructions, project structure, registries, templates, git state, relevant skills, and the safest next workflow step.

## When to use

Use this command at the start of a new session, after switching repositories or branches, when onboarding a new agent, or when the next action is unclear and the repository needs a quick orientation pass.

## Required inputs

- The user's current goal or task statement.
- Repository root and current branch, if not already known from the environment.
- Any explicit constraints from the user, such as files to avoid, validation expectations, or time limits.

## Step-by-step workflow

1. Read applicable `AGENTS.md` files and any session-level instructions that govern the files likely to be touched.
2. Inspect repository structure without making edits. Prefer targeted file discovery over broad recursive dumps.
3. Check git status and note the current branch, dirty files, and whether existing user changes are present.
4. Inspect relevant registries, including `registry/skills.json`, `registry/prompts.json`, `registry/bundles.json`, and `references/index.json` when upstream inspiration may matter.
5. If the user specified `--bundle <name>`, look up the bundle in `registry/bundles.json` and read the listed skills for the session.
6. Identify likely skills, templates, commands, and validation scripts for the user's goal.
7. Summarize assumptions, risks, and the next safest workflow step.
8. Stop before editing files unless the user explicitly asked for immediate changes.

## Output format

Return a concise orientation report with:

- **Goal**: the interpreted user goal.
- **Repository state**: branch, dirty files, and important constraints.
- **Relevant assets**: commands, skills, templates, registries, and references to consult.
- **Assumptions and risks**: only facts that affect execution.
- **Recommended next step**: usually `vibe-spec`, `vibe-plan`, `vibe-implement`, or a clarifying question.

## Verification expectation

Do not run full validation unless initialization includes a health check. Verify by citing the files inspected and by reporting git status accurately. If the repository has a validation script that is quick and relevant, mention it as a later check rather than running it by default.

## Stop/ask-clarifying-question condition

Stop and ask when the task goal is missing, the requested scope conflicts with repository instructions, there are uncommitted user changes that could be overwritten, or the next safe workflow step depends on a decision only the user can make.

## Related skills/templates

- `skills/core/vibe-bootstrap/SKILL.md`
- `skills/core/clarify-before-code/SKILL.md`
- `skills/memory/context-retrieval/SKILL.md`
- `templates/task-template.md`
