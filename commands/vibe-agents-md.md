---
description: "Generate or adapt a compact AGENTS.md with validation commands, layout, constraints, and quality gates."
---

# vibe-agents-md

## Purpose

Create or update a concise `AGENTS.md` (or equivalent agent instruction file) that gives coding agents the minimum actionable context they need to work safely and correctly in a project.

## When to use

Use when onboarding a new project for agent use, when the existing agent instructions are stale or bloated, or when a session starts in an unfamiliar repo and the instructions file is missing or inadequate.

## Required inputs

- Repository root path and branch.
- Existing agent instruction file (if any).
- Validation commands, project layout, known constraints.

## Step-by-step behavior

1. Read any existing `AGENTS.md`, `CLAUDE.md`, or equivalent at the repo root.
2. Inspect the real project layout: top-level directories, key config files, validation scripts.
3. Identify validation commands from `package.json`, `Makefile`, or equivalent.
4. Identify protected paths: generated files, vendor dirs, registry files, lock files.
5. Draft the compact file using `templates/agents-md-compact.md` as a skeleton.
6. Fill every section with concrete, project-specific facts — remove placeholders.
7. Keep the file under 120 lines. Prefer bullet lists over prose.
8. Verify no placeholder text, secrets, or credentials remain.
9. Save to the repository root.

## Outputs

A complete, concise `AGENTS.md` at the repository root with sections for: project overview, validation commands, project layout, architecture constraints, do-not-edit paths, approved dependencies, quality gate checklist, and response format.

## Stopping conditions

Stop and ask when:
- Validation commands cannot be determined from project files.
- Protected paths or dependency policies are ambiguous.
- The project has multiple conflicting conventions that cannot be resolved automatically.

## Verification checklist

- [ ] File exists at repository root and is under 120 lines.
- [ ] All sections contain concrete, project-specific information.
- [ ] Validation commands are listed and tested.
- [ ] No secrets, tokens, or credentials appear in the file.
- [ ] No placeholder text remains.
