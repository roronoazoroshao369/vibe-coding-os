---
description: "Create a continuation-ready handoff for another agent/session."
---

# Command: Create agent handoff

## When to use

Use before context switch, session end, or transferring work.

## Required inputs

Goal, status, changed files, commands, failures, next steps.

## Step-by-step behavior

1. Summarize scope.
2. List file changes.
3. Record validation.
4. Capture blockers and next steps.
5. Remove secrets.

## Outputs

Handoff document/message.

## Stopping conditions

Stop if sensitive data would be included.

## Verification checklist

Another agent can resume safely.

## Ghi chú tiếng Việt

Tóm tắt để agent khác tiếp tục không mất ngữ cảnh.
