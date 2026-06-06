# vibe-receive-review

## Purpose

Receive and act on review.

## When to use

Use when review comments, blockers, or suggestions arrive.

## Required inputs

Review comments; spec/plan; current diff; validation output; user priorities.

## Step-by-step behavior

1. Triage feedback into blockers, correctness issues, suggestions, questions, and follow-ups.
2. Fix blockers and correctness issues first.
3. Ask before changing requirements or expanding scope.
4. Rerun relevant checks after fixes.
5. Respond with changes made, validation, and deferred items.

## Outputs

Review-response summary, follow-up patch, validation results, and deferred item rationale.

## Verification or stopping conditions

Stop if feedback contradicts user requirements or needs a product decision.
