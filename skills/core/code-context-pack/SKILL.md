---
name: code-context-pack
version: 1.0.0
author: Hermes Agent
license: MIT
tags:
  - context
  - coding
  - quality
  - planning
---

# Skill: Code Context Pack

## Purpose

Assemble a focused context pack before writing code so the agent works from
local patterns, not general training memory. This forces inspection of nearby
implementations, tests, conventions, and constraints before any edit.

## When to use

Use this skill before any non-trivial coding task: bug fixes, feature work,
refactors, migrations, or changes spanning multiple files. For tiny typo-only
edits, the pack can be lightweight, but context should still be checked.

## Why it matters

Even capable models produce inconsistent code when they skip nearby context.
A code context pack captures the actual local patterns for naming, error
handling, testing, API shape, and decisions, which reduces hallucination and
improves fit with the existing codebase.

## Workflow

1. Identify the task goal, affected area, and likely neighbors.
2. Inspect similar existing implementations nearby.
3. Find related tests and note assertion and setup patterns.
4. Check error handling, retries, and failure-path conventions.
5. Review type definitions, API contracts, and shared utilities.
6. Look for relevant ADRs, decisions, or task notes.
7. Note known gotchas for this task type.
8. Fill `templates/code-context-pack-template.md` with concrete findings.
9. Use the filled pack to guide the implementation plan or coding step.

## Inputs

Task description, acceptance criteria, repository context, and file inventory.

## Outputs

A completed Code Context Pack listing similar implementations, test patterns, error handling conventions, naming styles, API contracts, and known gotchas.

## Failure modes

- Skipping context collection because the task seems obvious.
- Reading only file names instead of inspecting actual code.
- Listing general best practices instead of repo-specific patterns.
- Copying stale conventions from memory rather than live files.
- Treating the pack as decorative instead of letting it drive the edit.

## Verification checklist

- [ ] Similar implementations were inspected, not just assumed.
- [ ] At least one related test file was reviewed.
- [ ] Naming, error handling, and assertion styles are recorded from code.
- [ ] Type/API constraints are checked when relevant.
- [ ] The pack is filled in before implementation begins.