# Skill: Test-Driven Development

## Purpose

Drive behavior changes with tests or executable checks.

## When to use

Use when adding or changing logic, fixing bugs, or preventing regressions.

## Inputs

Spec, current test setup, target behavior, known failure.

## Workflow

1. Find the closest existing test pattern.
2. Write or update a failing test when feasible.
3. Implement the smallest change to pass.
4. Run targeted tests.
5. Refactor only after behavior is protected.

## Outputs

Tests or checks that prove the intended behavior and implementation that passes them.

## Failure modes

- No test seam exists.
- Tests assert implementation details.
- Skipping targeted checks after edits.

## Verification checklist

- [ ] A meaningful test or check exists.
- [ ] Targeted tests were run.
- [ ] Failure before fix was observed when practical.
- [ ] The test matches acceptance criteria.

## Superpowers alignment

This skill is the local TDD equivalent for Superpowers-style red/green/refactor discipline.
