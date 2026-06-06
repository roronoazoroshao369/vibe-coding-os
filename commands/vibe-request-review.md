# vibe-request-review

## Purpose

Request code review.

## When to use

Use after a self-reviewed patch and before merge readiness or handoff.

## Required inputs

Task/spec; current diff; changed files; validation results; known risks; reviewer questions.

## Step-by-step behavior

1. Self-review the diff and remove unrelated changes.
2. Summarize scope, behavior, and non-goals.
3. List changed files by purpose.
4. Provide exact validation commands and outcomes.
5. Ask focused questions for risky or uncertain areas.

## Outputs

Review request with scope, changed files, risks, checks, and questions.

## Verification or stopping conditions

Stop if validation status is unknown or unrelated changes are still present.
