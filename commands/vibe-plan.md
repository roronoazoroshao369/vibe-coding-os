---
description: "Convert an accepted spec into ordered implementation steps, target files, risks, rollback points, and validation commands."
---

# vibe-plan

## Purpose

Turn an accepted spec into a concrete execution plan. Identify the files or areas likely to change, ordered tasks, risks, rollback points, and exact checks to run.

## When to use

Use this command after the spec is accepted and before implementation, when coordinating multi-step work, when the change spans multiple files, or when validation and rollback points need to be explicit.

## Required inputs

- Accepted spec or clear requirement summary.
- Current repository state and any existing user changes.
- Relevant files, registries, templates, and skills discovered during initialization or specification.
- Required validation commands and any known environment limitations.

## Step-by-step workflow

1. Confirm the spec is accepted or record the assumption that the current requirement summary is authoritative.
2. Inspect likely target files and adjacent conventions before listing implementation steps.
3. Identify dependencies between tasks and order the work to keep changes small and reviewable.
4. Define the exact files or directories expected to change, plus any files that should remain untouched.
5. Call out risks, unknowns, and rollback points where the plan should be reconsidered.
6. List validation commands in the order they should run.
7. Keep the plan current as facts change during implementation.

## Output format

Return a plan with:

- **Scope**: what will and will not change.
- **Files/areas to inspect or edit**.
- **Ordered steps**.
- **Risks and rollback points**.
- **Verification commands**.
- **Assumptions or open questions**.

## Verification expectation

Verify the plan by cross-checking it with the spec, applicable instructions, and existing repository conventions. Do not claim implementation success from the plan alone; validation happens during or after `vibe-implement`.

## Stop/ask-clarifying-question condition

Stop and ask when the spec is not accepted, the proposed file scope is too broad to review safely, required decisions are unresolved, existing user changes create conflict risk, or the validation path is unknown for a risky change.

## Related skills/templates

- `skills/core/plan-driven-execution/SKILL.md`
- `skills/core/spec-first-development/SKILL.md`
- `skills/prompts/anti-overengineering/SKILL.md`
- `templates/plan-template.md`
- `templates/task-template.md`

## Handoffs / next-step suggestion

After the plan is agreed, suggest the likely next command:

- Plan is ready to decompose → `commands/vibe-tasks.md` to break it into ordered tasks.
- Spec, plan, and tasks all exist → `commands/vibe-analyze.md` to check cross-artifact
  consistency before implementation.
- Plan revealed gaps in the spec → return to `commands/vibe-spec.md`.
