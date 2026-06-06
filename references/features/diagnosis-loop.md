# Feature: Diagnosis Loop

## Goal

Fix bugs by evidence rather than guesswork, pairing diagnosis with regression tests and TDD where possible.

## Reference sources

Upstream diagnose and tdd skills; local systematic-debugging and TDD skills.

## Local implementation

Implemented by `skills/core/disciplined-diagnosis/SKILL.md`, enhanced `skills/core/test-driven-development/SKILL.md`, `commands/vibe-diagnose.md`, `commands/vibe-tdd.md`, and `templates/diagnosis-template.md`.

## Must-have behavior

Reproduce, compare expected/actual, rank hypotheses, test one variable, patch minimally, verify.

## Failure modes

Shotgun patches, skipped red state, no regression evidence.

## Update signals

Upstream changes diagnose or TDD guidance.

## Evaluation ideas

Seed a small failing test and verify red-green-refactor notes are recorded.

## Ghi chú tiếng Việt

Dùng để debug và TDD có kỷ luật. File ảnh hưởng: diagnosis/TDD skills, commands, templates. Khi upstream đổi, audit changelog và cập nhật checklist.
