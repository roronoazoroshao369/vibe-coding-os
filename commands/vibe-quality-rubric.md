---
description: "Apply the Universal Code Quality Rubric before a coding task."
---

# Command: Apply quality rubric

## When to use

Use before any coding task, especially when the request is small enough to tempt skipping planning or verification.

## Required inputs

Task goal, relevant files or area if known, constraints, and any acceptance criteria from the user.

## Step-by-step behavior

1. Restate the goal in one sentence.
2. Define what done looks like.
3. Inspect relevant files, tests, and patterns.
4. Name the smallest correct change.
5. List files likely touched and files not to touch.
6. Identify risks, edge cases, and unknowns.
7. Ask before editing if ambiguity changes the work.
8. Add or update tests when behavior changes.
9. Make a surgical, minimal diff.
10. Run verification and report passed, failed, or not run with reason.

## Outputs

Brief rubric pass, minimal change, and honest verification summary.

## Stopping conditions

Stop before editing if acceptance criteria, scope boundaries, or required files are materially ambiguous.
