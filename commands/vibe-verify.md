---
description: "Verify acceptance criteria before completion with exact commands, outcomes, and limitations."
---

# vibe-verify

## Purpose

Verify before completion.

## When to use

Use before claiming done, opening a PR, merging, or handing off.

## Required inputs

Acceptance criteria; changed files; commands run; test output; known limitations.

## Step-by-step behavior

1. Map criteria to evidence.
2. Run targeted checks, then broader validation when feasible.
3. Record exact commands and outcomes.
4. Inspect final diff for scope, secrets, attribution, and generated files.
5. Report final status honestly: passed, failed, blocked, or partial.

## Outputs

Verification report with commands, outcomes, coverage, limitations, and readiness.

## Verification or stopping conditions

Stop short of completion if required checks fail or cannot run without a clear limitation.
