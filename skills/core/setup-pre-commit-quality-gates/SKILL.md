# Skill: Setup Pre Commit Quality Gates

## Purpose

Define lightweight pre-commit or pre-merge checks that catch common mistakes without adding brittle dependencies.

## When to use

Use when a repo needs repeatable quality gates or existing hooks are missing, flaky, or too heavy.

## Inputs

Project stack, package manager, existing scripts, test commands, formatting/linting tools, and team tolerance for hook strictness.

## Workflow

1. Inspect existing scripts and hooks.
2. Choose dependency-free or already-installed checks first.
3. Document what runs locally and in CI.
4. Avoid adding packages unless requested.
5. Validate hook instructions with dry runs where possible.

## Outputs

Quality-gate plan, hook instructions or docs, validation commands, and maintenance notes.

## Failure modes

Installing unnecessary dependencies, blocking commits with slow/flaky checks, or hiding how to bypass in emergencies.

## Verification checklist

Checks map to existing scripts; no surprise dependencies; runtime is reasonable; fallback is documented.

## Ghi chú tiếng Việt

Dùng để thiết lập quality gates trước commit một cách nhẹ và maintainable. Khi upstream đổi setup-pre-commit, kiểm tra ý tưởng nhưng giữ dependency-free nếu repo muốn.
