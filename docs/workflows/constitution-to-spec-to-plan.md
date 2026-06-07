# Constitution to Spec to Plan Workflow

## Purpose

Show how project principles flow into a spec and then into a plan, so every plan decision
is traceable to both acceptance criteria and governing principles.

## When to use

Use at the start of a non-trivial initiative, or when a plan seems to drift from the
project's stated principles or the agreed spec.

## Step-by-step workflow

1. **Read the constitution** — Confirm the principles that constrain this work.
2. **Specify** — Draft the spec; ensure goals and non-goals respect the constitution.
3. **Acceptance criteria** — Write observable criteria; flag any conflict with a principle.
4. **Spec checkpoint** — Clear the spec gate.
5. **Plan from spec** — Capture technical context; map each plan step to acceptance criteria.
6. **Principle check** — Confirm no plan step violates a constitution principle; if it must, record the trade-off and its justification.

## Required inputs

`CONSTITUTION.md`, the user request, constraints, and repository conventions.

## Outputs

A spec and plan that are traceable to acceptance criteria and constitution principles, plus
any recorded trade-offs.

## Related skills

- `skills/core/project-constitution/SKILL.md`
- `skills/core/spec-first-development/SKILL.md`, `skills/core/acceptance-criteria/SKILL.md`
- `skills/core/plan-from-spec/SKILL.md`, `skills/core/checkpoint-validation/SKILL.md`

## Related commands

- `commands/vibe-constitution.md`, `commands/vibe-specify.md`, `commands/vibe-plan-from-spec.md`, `commands/vibe-checkpoints.md`

## Applied / Not applied

- Applied: constitution-governed spec and plan with traceability.
- Not applied: upstream CLI, command names, or generated constitution/spec/plan files.

## Maintenance notes

Update when the constitution skill, spec skill, or plan skill changes. Keep traceability
expectations consistent with `templates/plan-template.md`.

## Ghi chú tiếng Việt

Nguyên tắc (constitution) chảy vào spec rồi vào plan; mỗi bước plan truy vết về tiêu chí
chấp nhận và nguyên tắc. Nếu phải vi phạm một nguyên tắc, ghi rõ trade-off và lý do. Học ý
tưởng từ `spec-kit`, không copy CLI/template.
