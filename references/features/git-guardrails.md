# Feature: Git Guardrails

## Goal

Prevent destructive git and quality-gate mistakes by making risk explicit.

## Reference sources

Upstream git-guardrails and setup-pre-commit concepts.

## Local implementation

Implemented by `skills/core/git-guardrails/SKILL.md`, `skills/core/setup-pre-commit-quality-gates/SKILL.md`, `commands/vibe-git-guardrails.md`, `commands/vibe-setup-pre-commit.md`.

## Must-have behavior

Inspect status, avoid destructive commands, use existing validation scripts, document hook behavior.

## Failure modes

Reset/clean/force-push without consent, surprise dependencies, slow flaky hooks.

## Update signals

Upstream changes hook behavior or pre-commit setup.

## Evaluation ideas

Simulate a risky git command and verify it is blocked or escalated with rationale.

## Ghi chú tiếng Việt

Bảo vệ git và quality gates. File ảnh hưởng: guardrail skills/commands và validation docs.
