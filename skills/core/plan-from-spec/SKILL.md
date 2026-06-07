# Plan From Spec

## Purpose

Translate an agreed specification into a concrete, verifiable implementation plan that
captures technical context, sequencing, risks, and checks — without re-opening the
behavioral "what".

## When to use

Use after a spec is agreed and before broad implementation, for any change that spans
multiple files, introduces new dependencies, or carries meaningful risk.

## Inputs

The agreed spec (goals, non-goals, acceptance criteria), repository conventions, known
constraints, and the technical context deferred from the spec phase.

## Workflow

1. Read the spec and confirm acceptance criteria are observable.
2. Capture technical context separately: stack, data, interfaces, and constraints.
3. Identify the smallest set of reviewable steps that satisfy the spec.
4. For each step, name the files to touch and the expected outcome.
5. Note risks, rollback points, and the verification command(s) per step.
6. Trace each plan step back to one or more acceptance criteria.
7. Hand the plan to task breakdown; do not start coding from the plan directly.

## Outputs

A plan using `templates/plan-template.md` with technical context, ordered steps,
spec traceability, risks, rollback, and verification.

## Failure modes

- The plan reopens behavioral decisions instead of implementing the spec.
- Steps are too large to review or verify independently.
- Technical context is missing, so tasks make hidden assumptions.
- No traceability between steps and acceptance criteria.

## Verification checklist

- [ ] Every step maps to at least one acceptance criterion.
- [ ] Technical context is explicit and separate from behavior.
- [ ] Each step names files and expected outcome.
- [ ] Risks, rollback, and verification are recorded.

## Applied / Not Applied

- Applied: the spec→plan transition and separated technical context from `github/spec-kit`.
- Not applied: upstream plan template text, command names, or CLI generation. Reuses the
  existing local `plan-template.md` and `plan-driven-execution` skill.

## Ghi chú tiếng Việt

Chuyển spec đã thống nhất thành kế hoạch triển khai cụ thể: tách technical context, chia
bước nhỏ kiểm chứng được, truy vết từng bước về tiêu chí chấp nhận. Không mở lại quyết
định hành vi. Dùng lại `templates/plan-template.md`. Liên kết:
`skills/core/plan-driven-execution/SKILL.md`, `skills/core/task-breakdown-from-plan/SKILL.md`.
