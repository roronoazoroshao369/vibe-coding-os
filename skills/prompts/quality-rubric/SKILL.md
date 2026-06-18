---
name: quality-rubric
description: Universal code quality checklist to inject before every coding task.
version: 1.0.0
author: Hermes Agent
license: MIT
platforms:
  - portable
tags:
  - coding
  - quality
  - verification
  - planning
---

# Quality Rubric Skill

## Purpose

Force a minimum quality process before any coding task, especially when the model might otherwise skip context, acceptance criteria, tests, or verification.

## When to use

Use always before coding tasks: bug fixes, features, refactors, tests, docs-as-code changes, migrations, and repository maintenance.

## Why it matters

Average and mid-tier models often jump straight to edits. An explicit rubric slows the work just enough to preserve intent, inspect patterns, limit scope, and prevent false verification claims.

## Inputs

Task goal, known constraints, acceptance criteria if provided, target files or area, and any files or scope boundaries that must not change.

## Workflow

1. Restate the goal in one clear sentence before changing anything.
2. Identify the acceptance criteria: what must be true for this to be done.
3. Inspect the relevant files, tests, docs, and existing patterns first.
4. Name the smallest correct change that can satisfy the goal.
5. List the files likely to be touched and the files that must not be touched.
6. Call out risks, edge cases, unknowns, and assumptions.
7. If the request is ambiguous in a way that changes the work, ask before editing.
8. Write or update tests when behavior changes.
9. Make a surgical, minimal diff; avoid drive-by rewrites.
10. Run verification and report it honestly: passed, failed, or not run with the reason.

## How to apply

Inject the rubric at the start of the coding task context. Answer the checklist briefly before editing, then use it to constrain implementation and final reporting.

## Outputs

A concise pre-edit quality pass, a minimal implementation, and an honest verification report.

## Failure modes

- Skipping steps because the change looks small.
- Inspecting only the target file when surrounding tests or patterns matter.
- Broadening scope into opportunistic cleanup.
- Claiming tests, builds, or validation passed when they did not run.
- Treating ambiguity as permission to guess instead of asking first.

## Verification checklist

- [ ] Goal and acceptance criteria are stated before edits.
- [ ] Relevant files, tests, and patterns were inspected.
- [ ] Scope boundaries and files not to touch are explicit.
- [ ] Behavior changes have tests or a stated reason tests were not added.
- [ ] Final verification is reported as passed, failed, or not run with reason.
