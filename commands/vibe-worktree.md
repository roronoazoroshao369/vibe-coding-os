# vibe-worktree

## Purpose

Create or use an isolated git worktree.

## When to use

Use for risky work, conflicting local changes, parallel branches, or explicit branch isolation requests.

## Required inputs

Base branch or commit; desired branch name; current `git status`; cleanup preference.

## Step-by-step behavior

1. Inspect existing branches, worktrees, and working tree state.
2. Choose a descriptive branch and path.
3. Create or enter the worktree without moving user changes.
4. Run edits and validation inside that worktree.
5. Report path, branch, base, status, and cleanup instructions.

## Outputs

Worktree/branch handoff with status and validation expectations.

## Verification or stopping conditions

Stop if current uncommitted work might be overwritten or the base branch is ambiguous.
