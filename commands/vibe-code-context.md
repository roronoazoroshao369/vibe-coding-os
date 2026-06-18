---
description: "Assemble a code context pack before writing code by inspecting nearby patterns, tests, conventions, and constraints."
---

# vibe-code-context

## Purpose

Force context gathering before implementation so the agent works from
repo-specific patterns instead of assumptions.

## When to use

Run before any non-trivial coding task, especially when touching unfamiliar
areas, multiple files, or behavior that should match existing conventions.

## Required inputs

Task description, target files or area, and any known constraints or goals.

## Step-by-step behavior

1. Identify the task goal and likely neighboring files.
2. Inspect similar existing implementations, related tests, and shared patterns.
3. Note naming, error handling, API shape, and testing conventions from code.
4. Gather relevant ADRs, decisions, or known gotchas.
5. Fill `templates/code-context-pack-template.md` with concrete findings.
6. Use the completed pack to guide the next planning or coding step.

## Outputs

A completed code context pack summarizing observed local patterns and constraints.

## Verification or stopping conditions

Stop if you cannot inspect enough local code to fill the pack reliably.
In that case, say what is missing and what remains uncertain.