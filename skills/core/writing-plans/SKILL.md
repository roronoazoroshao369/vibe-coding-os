# Skill: Writing Plans

## Purpose

Turn an approved spec or clear request into an executable, reviewable plan with file targets, risks, and checks.

## When to use

Use after brainstorming/spec approval and before multi-step implementation, refactors, migrations, reference integrations, or risky bug fixes.

## Inputs

Approved spec or requirement summary, repo conventions, target files, constraints, validation commands, and known risks.

## Workflow

1. Confirm the spec or requirement is authoritative; if not, pause for approval or record the assumption.
2. Inspect likely files and registries before proposing edits.
3. Break the work into small tasks with owners or file scopes when parallel work is useful.
4. Attach a verification step to each meaningful behavior or structure change.
5. Call out dependencies, rollback points, and tasks that must not happen.
6. Keep the plan concise enough to execute and update it when discoveries change the path.

## Outputs

A concrete implementation plan with scope, file targets, ordered tasks, risks, rollback points, and validation commands.

## Failure modes

- Plan ignores existing repo conventions.
- Plan is so broad that review becomes impossible.
- Verification is postponed or vague.
- The plan is treated as approval for requirements the user did not accept.

## Verification checklist

- [ ] Scope and non-scope are clear.
- [ ] Each step is actionable and ordered.
- [ ] Risky files or decisions are named.
- [ ] Validation commands are explicit.

## Choose instead

Turning a chosen direction into a step-by-step implementation plan with checkpoints.

If this skill is not the right phase for your task, use one of these instead:

- `skills/core/brainstorming/SKILL.md` — if the direction is not yet chosen.
- `skills/core/spec-first-development/SKILL.md` — if no spec exists and one is needed before planning.
- `skills/core/plan-driven-execution/SKILL.md` — if the plan is already written and you want to execute it.

For the full decision tree across all 6 plan-family skills, see [docs/workflows/plan-skill-decision-tree.md](../../../docs/workflows/plan-skill-decision-tree.md).
