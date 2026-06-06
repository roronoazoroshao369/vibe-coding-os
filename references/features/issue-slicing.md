# Feature: Issue Slicing

## Goal

Turn PRDs/plans into small independently grabbable vertical slices.

## Reference sources

Upstream to-issues concept; local plan-driven execution.

## Local implementation

Implemented by `skills/core/issue-slicing/SKILL.md`, `commands/vibe-to-issues.md`, and `templates/issue-slicing-template.md`.

## Must-have behavior

Prefer vertical user outcomes, include dependencies and checks, keep issues reviewable.

## Failure modes

Layer-only tasks, hidden dependencies, vague acceptance.

## Update signals

Upstream changes issue generation or tracker support.

## Evaluation ideas

Review generated issues for independent acceptance criteria and validation commands.

## Ghi chú tiếng Việt

Chia issue giúp nhiều agent làm song song. Khi upstream đổi tracker/slicing, cập nhật mapping và template.
