# Skill: Plan-Driven Execution

## Purpose

Convert a spec or task into small ordered implementation steps.

## When to use

Use before multi-file edits, refactors, migrations, or debugging sessions.

## Inputs

Spec, repository map, constraints, verification requirements.

## Workflow

1. Identify files and components likely to change.
2. Break work into small tasks.
3. Order tasks by dependency and risk.
4. Attach verification to each major step.
5. Update the plan as facts change.

## Outputs

A practical plan with task order, file targets, risks, and checks.

## Failure modes

- Plan is too vague to execute.
- Plan ignores verification.
- Plan is not updated after discoveries.

## Verification checklist

- [ ] Steps are ordered and concrete.
- [ ] Risky areas are named.
- [ ] Verification commands are included.
- [ ] Scope remains aligned with the spec.

## Superpowers alignment

Use with `writing-plans` for plan creation and `executing-plans` for plan execution.

Related mattpocock-inspired skill: `skills/core/issue-slicing/SKILL.md` for independently grabbable vertical slices.

## Choose instead

Executing a written, approved plan checkpoint by checkpoint (fresh execution).

If this skill is not the right phase for your task, use one of these instead:

- `skills/core/executing-plans/SKILL.md` — if work was started, paused, or context was lost (resumption).
- `skills/core/writing-plans/SKILL.md` — if the plan does not yet exist or needs revision.

For the full decision tree across all 6 plan-family skills, see [docs/workflows/plan-skill-decision-tree.md](../../../docs/workflows/plan-skill-decision-tree.md).
