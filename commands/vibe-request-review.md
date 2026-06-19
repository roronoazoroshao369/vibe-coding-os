---
description: "Package a patch for useful review with scope, risks, changed files, and validation evidence."
---

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

## Options

- `--incremental` — Indicate that this change has been reviewed before. Include the previous review output and baseline diff so the reviewer can use incremental review mode.
- `--intelligence` — Request that the reviewer build a code intelligence map before analysis. Best for cross-module or high-risk changes.
- `--spec-compliance` — Request explicit spec-compliance analysis as part of the review. The reviewer maps each acceptance criterion and user scenario to the diff, reports scenario coverage, flags scope creep, and cites the originating spec lines. Default when a spec, PRD, or issue is available.

## Outputs

Review request with scope, changed files, risks, checks, and questions.

## Verification or stopping conditions

Stop if validation status is unknown or unrelated changes are still present.
