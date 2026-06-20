---
name: compact-agents-md-template
version: 1.0.0
author: Hermes Agent
license: MIT
tags:
  - context
  - agent-instructions
  - onboarding
  - quality-gates
  - templates
sandbox:
  level: trusted
  external_content: false  # Heuristic: pattern matched but content is documentation-only

---

# Skill: Compact AGENTS.md Template

## Purpose

Generate or adapt a concise, high-signal `AGENTS.md` (or `CLAUDE.md`, `CODER.md`, etc.) that gives coding agents the minimum context they need to work safely and correctly in a project. The template focuses on validation commands, project layout, architectural constraints, protected paths, approved dependencies, quality gates, and response format — not narrative history.

## When to use

- **New project onboarding**: when a project has no agent instruction file or the existing one is stale.
- **Session bootstrap**: when starting work in an unfamiliar repo and the agent instructions are missing or inadequate.
- **Command adaptation**: when the `vibe-agents-md` command needs to regenerate or patch the agent instructions.
- **Refactor / cleanup**: when an existing `AGENTS.md` is bloated, outdated, or mixes narrative with operational guidance.

## Inputs

- Repository root path and branch.
- Existing `AGENTS.md`, `CLAUDE.md`, or equivalent file (if any).
- Validation commands the project supports (e.g., `npm run validate`).
- Known protected paths, do-not-edit zones, and approved dependencies.
- Any architecture constraints, quality gate checklist, or preferred response format.

## Workflow

1. Read any existing agent instruction file at the repository root.
2. Run `ls` / directory inspection to confirm the real project layout.
3. Identify the primary validation commands by checking `package.json`, `Makefile`, or equivalent.
4. Identify protected paths (generated files, vendor directories, lock files, registry files).
5. Draft the compact `AGENTS.md` using `templates/agents-md-compact.md` as a skeleton.
6. Fill each section with concrete, project-specific facts — not generic advice.
7. Keep the file under 120 lines. Prefer bullet lists over prose.
8. Verify the generated file has no placeholder text left.
9. Save to the repository root.

## Outputs

A complete, concise `AGENTS.md` file at the repository root containing:
- Project overview (2–3 sentences).
- Validation commands.
- Project layout (top-level directories, key files).
- Architecture constraints.
- Do-not-edit paths.
- Approved dependencies.
- Quality gate checklist.
- Response format preferences.

## Failure modes

- Producing a generic template with no project-specific content.
- Exceeding 120 lines with narrative instead of actionable bullets.
- Omitting validation commands that the agent needs to run.
- Listing secrets, tokens, or credentials in any section.
- Leaving placeholder text like `[fill this in]` in the final file.
- Duplicating information already in `README.md` instead of pointing to it.

## Verification checklist

- [ ] File is under 120 lines.
- [ ] Every section contains concrete, project-specific information.
- [ ] Validation commands are listed and correct.
- [ ] Protected paths are explicit.
- [ ] No placeholder or template text remains.
- [ ] No secrets, tokens, or credentials appear anywhere.
- [ ] The file points to other docs rather than duplicating them.
