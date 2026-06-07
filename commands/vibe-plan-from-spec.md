---
description: "Turn an agreed spec into a verifiable plan with separated technical context and traceability."
---

# vibe-plan-from-spec

## Purpose

Turn an agreed spec into a concrete, verifiable implementation plan with separated
technical context, reviewable steps, risks, and spec traceability.

## When to use

Use after a spec is agreed and before broad implementation, for any multi-file or risky
change. Complements `commands/vibe-plan.md` and reuses `templates/plan-template.md`.

## Required inputs

- The agreed spec with acceptance criteria.
- Repository conventions and constraints.
- The technical context deferred from the spec.

## Step-by-step behavior

1. Read the spec and confirm acceptance criteria are observable.
2. Capture technical context separately: stack, data, interfaces, constraints.
3. Break work into the smallest reviewable steps.
4. For each step, name files to touch, expected outcome, and the verification command.
5. Trace each step to one or more acceptance criteria.
6. Record risks and rollback points.
7. Save the plan; hand off to `commands/vibe-tasks.md`.

## Outputs

A plan with technical context, ordered steps, spec traceability, risks, rollback, and
verification, using `templates/plan-template.md`.

## Stopping conditions

Stop and ask when the spec is missing or ambiguous, when acceptance criteria are not
observable, or when a required technical decision was never resolved.

## Verification checklist

- [ ] Every step maps to an acceptance criterion.
- [ ] Technical context is explicit and separate from behavior.
- [ ] Each step names files, outcome, and verification.
- [ ] Risks and rollback are recorded.

## Related skills/templates

- `skills/core/plan-from-spec/SKILL.md`, `skills/core/plan-driven-execution/SKILL.md`
- `templates/plan-template.md`

## Ghi chú tiếng Việt

Chuyển spec thành kế hoạch: tách technical context, chia bước nhỏ kiểm chứng được, truy vết
về tiêu chí chấp nhận, ghi rủi ro và rollback. Dùng `templates/plan-template.md`. Học ý
tưởng từ `spec-kit`, không copy template/CLI.
