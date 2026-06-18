---
description: "Complete the Quality Execution Contract before any code edit. Declares intent, risk, acceptance evidence, test plan, and scope."
---

# vibe-quality-gate

## Purpose

Enforce pre-coding discipline by requiring the Quality Execution Contract to be
completed and committed before any edit is made.

## When to use

Run at the start of any non-trivial coding task — after understanding the request
but before touching any files.

## Required inputs

Task description, acceptance criteria (from user or self-derived), repository context.

## Step-by-step behavior

1. Load `templates/quality-contract.md`.
2. Fill in every section with honest, specific answers — no placeholders.
3. Assess risk tier: tiny (one-line), small (one file), medium (multiple files),
   large (cross-cutting), risky (data/API/public surface).
4. List files to inspect, likely changes, and forbidden files.
5. Identify any new dependencies or public API changes; justify each.
6. Inspect existing patterns and locate relevant tests.
7. Write the test plan with exact commands and manual fallback.
8. Sign all four commitments.
9. Present the completed contract and wait for approval (if user is present)
   or proceed only after the contract is fully populated.

## Outputs

A completed Quality Execution Contract ready to guide implementation.

## Verification or stopping conditions

Stop if you cannot honestly fill in any section — that signals insufficient
understanding. Ask a clarifying question rather than guessing.
