---
name: executing-plans
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: core
tags:
  - core
  - planning
status: stable
---

# Skill: Executing Plans

## Purpose

Carry out an accepted plan in small, reversible steps while keeping status, tests, and scope visible.

## When to use

Use when a plan exists and the next task requires edits, validation, or coordination with other agents or passes.

## Inputs

Accepted plan, current repository status, target files, validation commands, and any user or reviewer constraints.

## Workflow

1. Check the working tree and reread applicable instructions before editing.
2. Execute one logical task at a time and avoid unrelated cleanup.
3. Update the plan when facts change rather than silently drifting.
4. Run targeted checks as soon as they can catch mistakes.
5. Review the diff after each substantial step for scope, attribution, and generated-file mistakes.
6. End with a concise status: completed steps, changed files, validation, blockers, and follow-ups.

## Outputs

A focused patch or completed task sequence with plan status, changed files, verification results, and remaining work.

## Failure modes

- Implementation expands beyond the accepted plan.
- The agent skips status updates after discoveries.
- Validation is delayed until too much changed.
- Existing user edits are overwritten.

## Verification checklist

- [ ] Working tree was inspected before edits.
- [ ] Changes map back to plan steps.
- [ ] Checks were run or limitations are explicit.
- [ ] Remaining tasks or blockers are not hidden.

## Choose instead

Resuming a paused or crashed plan in-flight, or picking up after context loss.

If this skill is not the right phase for your task, use one of these instead:

- `skills/core/plan-driven-execution/SKILL.md` — if the plan is fresh and no work has started.
- `skills/core/crash-proof-planning/SKILL.md` — combined with this skill, for state persistence.

For the full decision tree across all 6 plan-family skills, see [docs/workflows/plan-skill-decision-tree.md](../../../docs/workflows/plan-skill-decision-tree.md).
