# Command: Check git guardrails

## When to use

Use before risky git operations or commit handoff.

## Required inputs

Git status, intended operation, branch policy.

## Step-by-step behavior

1. Inspect status.
2. Identify destructive risk.
3. Prefer reversible path.
4. Commit only intended changes.

## Outputs

Safe git plan or blocked-command rationale.

## Stopping conditions

Stop before reset/clean/force-push unless explicitly authorized.

## Verification checklist

User work is protected; status is recorded.

## Ghi chú tiếng Việt

Bảo vệ git history và thay đổi chưa commit.
