# Workflow: Debug Diagnose TDD

## Purpose

Debug Diagnose TDD.

## When to use

Use when a bug or behavior change needs proof, not guesses.

## Step-by-step workflow

1. Reproduce symptom.
2. Write diagnosis notes.
3. Create failing regression test when possible.
4. Implement minimal fix.
5. Refactor after green.
6. Run broader validation.

## Required inputs

Bug report, expected behavior, logs, test commands.

## Outputs

Diagnosis, regression test, fix, validation results.

## Related skills

disciplined-diagnosis, test-driven-development, systematic-debugging.

## Related commands

`vibe-diagnose`, `vibe-tdd`, existing `vibe-debug`, `vibe-verify`.

## Maintenance notes

Audit upstream diagnose/TDD changes for checklist improvements.

## Ghi chú tiếng Việt

Dùng cho bug và regression. Không sửa mò; phải có bằng chứng và test nếu khả thi.
