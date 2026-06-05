# Review Before Merge

## Purpose

Catch correctness, maintainability, security, and attribution issues before merge.

## When to use

Use after implementation and verification, before merge or PR.

## Inputs

Diff, spec, plan, test results, attribution registry.

## Workflow

1. Inspect the diff file by file.
2. Check behavior against the spec.
3. Look for unnecessary complexity and hidden scope changes.
4. Check tests, docs, and registries.
5. Record blockers and follow-ups.

## Outputs

A review note with approval status, blockers, risks, and follow-ups.

## Failure modes

- Rubber-stamp review.
- Only checking style.
- Missing license or attribution implications.

## Verification checklist

- [ ] Diff matches intended scope.
- [ ] Tests and docs are adequate.
- [ ] No obvious secret or attribution issue exists.
- [ ] Follow-ups are explicit.
