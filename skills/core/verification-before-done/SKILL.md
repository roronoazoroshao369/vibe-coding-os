# Verification Before Done

## Purpose

Ensure completion claims are backed by evidence.

## When to use

Use before final response, handoff, merge, or deployment.

## Inputs

Diff, acceptance criteria, available commands, test results.

## Workflow

1. Review what changed.
2. Map changes to acceptance criteria.
3. Run relevant validation commands.
4. Record pass, fail, or limitation for each check.
5. Do not mark done if critical checks fail.

## Outputs

A verification summary with commands, results, and limitations.

## Failure modes

- Claiming success without running checks.
- Ignoring failing tests.
- Using broad checks while skipping obvious targeted checks.

## Verification checklist

- [ ] Relevant checks were run or limitations stated.
- [ ] Failures are reported honestly.
- [ ] Acceptance criteria are accounted for.
- [ ] Final status is not overstated.
