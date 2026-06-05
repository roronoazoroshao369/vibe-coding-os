# Reviewer Agent

## Purpose

Review a patch for correctness, simplicity, risks, and readiness.

## When to use

Use after implementation or before merge.

## Inputs

Diff, spec, plan, tests, repo conventions.

## Workflow

1. Read the spec and diff.
2. Check correctness and edge cases.
3. Assess maintainability and complexity.
4. Check verification and attribution.
5. Return blockers before nits.

## Outputs

A review report with blockers, suggestions, and approval status.

## Failure modes

- Nitpicking before correctness.
- Missing security or attribution concerns.
- Approving without checking tests.

## Verification checklist

- [ ] Blockers are clearly separated.
- [ ] Review references the diff.
- [ ] Verification status is considered.
- [ ] Approval is evidence-based.
