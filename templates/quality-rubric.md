---
title: Universal Code Quality Rubric
type: template
name: quality-rubric
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: template
tags:
  - quality
status: stable
---

# Universal Code Quality Rubric

1. Restate the goal in one clear sentence before changing anything.
2. Identify the acceptance criteria: what must be true for this to be done.
3. Inspect the relevant files, tests, docs, and existing patterns first.
4. Name the smallest correct change that can satisfy the goal.
5. List the files likely to be touched and the files that must not be touched.
6. Call out risks, edge cases, unknowns, and assumptions.
7. If the request is ambiguous in a way that changes the work, ask before editing.
8. Write or update tests when behavior changes.
9. Make a surgical, minimal diff; avoid drive-by rewrites.
10. Run verification and report it honestly: passed, failed, or not run with the reason.
