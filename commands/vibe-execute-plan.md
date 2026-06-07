---
description: "Execute an accepted plan in small scoped steps with visible validation."
---

# vibe-execute-plan

## Purpose

Execute an accepted plan.

## When to use

Use when a plan exists and file changes or validation should proceed in small steps.

## Required inputs

Accepted plan; repo status; target files; validation commands; constraints.

## Step-by-step behavior

1. Check working tree and instructions before editing.
2. Complete one logical plan step at a time.
3. Keep changes scoped and update the plan if facts change.
4. Run targeted checks as soon as useful.
5. Review the diff and report completed steps, checks, blockers, and follow-ups.

## Outputs

Focused patch or task status with changed files and verification results.

## Verification or stopping conditions

Stop if implementation would exceed scope, conflict with user changes, or fail without a decision.
