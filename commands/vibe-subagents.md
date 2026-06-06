# vibe-subagents

## Purpose

Coordinate subagent or parallel-agent work.

## When to use

Use when independent exploration, implementation, testing, or review passes can safely run in parallel.

## Required inputs

Main plan; independent subtasks; file ownership; expected outputs; integration owner.

## Step-by-step behavior

1. Keep immediate blocking work on the main critical path.
2. Delegate only bounded, independent subtasks.
3. Assign clear write scopes and warn agents not to revert others.
4. Integrate returned work through review, not blind trust.
5. Run checks on the integrated result.

## Outputs

Delegation briefs, subtask results, integration notes, and verification status.

## Verification or stopping conditions

Stop if subtasks overlap heavily, require the same files, or add orchestration overhead without benefit.
