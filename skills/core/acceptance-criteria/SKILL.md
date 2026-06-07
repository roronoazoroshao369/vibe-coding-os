# Acceptance Criteria

## Purpose

Write observable, testable acceptance criteria that connect intent to verification, so
"done" is defined before work starts and checked objectively afterward.

## When to use

Use during specification, when refining a vague request, and during checkpoint validation
to confirm a phase actually met its criteria.

## Inputs

The spec intent, user scenarios, constraints, and any existing partial criteria.

## Workflow

1. For each goal, write at least one criterion describing an observable outcome.
2. Phrase criteria so they can be checked by a test, a command, or direct observation.
3. Avoid implementation detail; criteria describe behavior, not mechanism.
4. Cover edge cases and error behavior, not just the happy path.
5. Mark each criterion with how it will be verified.
6. Remove criteria that cannot be observed or that restate the implementation.

## Outputs

A list of acceptance criteria, each observable and paired with a verification method.

## Failure modes

- Criteria are subjective ("works well") and cannot be checked.
- Criteria encode a specific implementation.
- Only the happy path is covered.
- Criteria exist but are never used as a gate.

## Verification checklist

- [ ] Each criterion is observable and testable.
- [ ] Each criterion names a verification method.
- [ ] Edge cases and errors are covered.
- [ ] No criterion restates implementation detail.

## Applied / Not Applied

- Applied: acceptance criteria as required, observable spec content from `github/spec-kit`.
- Not applied: upstream phrasing or template text. Criteria feed the local spec,
  checkpoint, and TDD skills.

## Ghi chú tiếng Việt

Viết tiêu chí chấp nhận quan sát được, kiểm chứng được, nối ý định với verification. Tránh
mô tả cách triển khai; bao phủ cả edge case và lỗi; mỗi tiêu chí nêu cách kiểm tra. Dùng
làm cổng tại checkpoint. Liên kết: `skills/core/spec-first-development/SKILL.md`,
`skills/core/checkpoint-validation/SKILL.md`.
