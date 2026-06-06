# Skill: Git Guardrails

## Purpose

Protect repository history and user work by treating destructive git operations as high-risk.

## When to use

Use before branch cleanup, rebases, resets, force pushes, or when an agent may run git commands.

## Inputs

Current branch, status, user intent, remote policy, uncommitted changes, and risky command under consideration.

## Workflow

1. Inspect `git status` before risky operations.
2. Never delete or overwrite user work without explicit instruction.
3. Prefer reversible commands and commits.
4. Document risks before destructive operations.
5. Run validation before commit/PR handoff.

## Outputs

Guardrail checklist, safe command plan, commit readiness notes, and blocked-command rationale when needed.

## Failure modes

Running reset/clean/force-push casually, committing unrelated changes, or ignoring untracked files.

## Verification checklist

Status was inspected; destructive commands avoided or justified; commit only includes intended files; validation status is recorded.

## Ghi chú tiếng Việt

Kỹ năng này bảo vệ git history và thay đổi của user. Dùng cho mọi thao tác nguy hiểm. File liên quan: `commands/vibe-git-guardrails.md`.
