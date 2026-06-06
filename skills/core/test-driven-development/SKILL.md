# Skill: Test Driven Development

## Purpose

Use a red-green-refactor loop for behavior changes and bug fixes.

## When to use

Use when behavior can be specified with tests, especially new features, regressions, and risky refactors.

## Inputs

Expected behavior, acceptance criteria, existing test framework, target slice, and validation commands.

## Workflow

1. Pick one vertical behavior slice.
2. Write or update a failing test first when practical.
3. Run the targeted test and confirm red for the right reason.
4. Implement the smallest code change to pass.
5. Refactor while tests stay green.
6. Repeat for the next slice and finish with broader validation.

## Outputs

Failing test evidence, passing test evidence, implementation notes, refactor notes, and remaining gaps.

## Failure modes

Writing tests after broad implementation, testing implementation details, skipping the red state, or expanding scope mid-loop.

## Verification checklist

Red state observed or justified; green state observed; refactor kept behavior; verification commands are recorded.

## Ghi chú tiếng Việt

TDD ở đây là red-green-refactor theo lát nhỏ. Dùng cho thay đổi hành vi và bug. File liên quan: `commands/vibe-tdd.md`, `references/features/diagnosis-loop.md`. Khi upstream update TDD, so sánh nguyên tắc, không sao chép ví dụ.
