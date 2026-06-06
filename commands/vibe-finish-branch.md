# vibe-finish-branch

## Purpose

Finish a development branch.

## When to use

Use before PR, merge, handoff, or cleanup at the end of branch work.

## Required inputs

Branch status; diff; spec/plan; validation results; review state; attribution/memory needs.

## Step-by-step behavior

1. Inspect `git status`, branch, and recent commits.
2. Confirm diff matches scope and no ignored/upstream/generated artifacts are staged accidentally.
3. Run or summarize final validation.
4. Check review, attribution, changelog, and memory obligations.
5. Prepare final PR/handoff summary and cleanup notes.

## Outputs

Branch-finish report with summary, checks, risks, assumptions, follow-ups, and cleanup state.

## Verification or stopping conditions

Stop if working tree is unclear, validation failed unexpectedly, or required attribution/review is missing.
