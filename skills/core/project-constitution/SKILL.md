# Project Constitution

## Purpose

Define a short, durable set of governing principles that constrain every later phase of
work (spec, plan, tasks, implementation) so decisions stay consistent across sessions and
agents.

## When to use

Use when bootstrapping a project, when recurring disagreements reveal missing shared
principles, or when an agent keeps re-litigating the same trade-offs (quality vs speed,
simplicity vs flexibility). Re-read before any non-trivial spec or architecture decision.

## Inputs

Project goals, non-negotiable constraints (quality, simplicity, verification, privacy,
attribution, maintainability), team norms, and any prior `CONSTITUTION.md`.

## Workflow

1. Read the existing `CONSTITUTION.md` if present; otherwise start from `templates/constitution-template.md`.
2. State 4–9 principles as short, testable rules, each with a one-line rationale.
3. For each principle, note how it is enforced (review, validation, gate).
4. Record explicit non-goals so the constitution does not expand into process bloat.
5. Cross-link to the spec, plan, and checkpoint skills that enforce the principles.
6. Keep it under ~2 pages; cut anything that cannot be checked.

## Outputs

A `CONSTITUTION.md` (or section) with numbered principles, rationale, enforcement notes,
and non-goals.

## Failure modes

- Principles are aspirational slogans that cannot be verified.
- The constitution grows into a heavyweight process document.
- Principles conflict with each other and offer no tie-breaker.
- It is written once and never consulted.

## Verification checklist

- [ ] Each principle is short and testable.
- [ ] Each principle names how it is enforced.
- [ ] Non-goals are explicit.
- [ ] Conflicts have a stated priority order.
- [ ] Spec/plan/checkpoint skills reference the constitution.

## Applied / Not Applied

- Applied: the idea (from `github/spec-kit`) of an explicit, durable principles artifact
  that governs later phases.
- Not applied: upstream constitution file format, command names, or any generated CLI
  scaffolding. The local constitution is original and CLI-free.

## Ghi chú tiếng Việt

Hiến chương dự án là bộ nguyên tắc ngắn, kiểm chứng được, chi phối mọi pha sau (spec,
plan, tasks, implement). Học ý tưởng từ `spec-kit` nhưng viết lại bằng ngôn ngữ local,
không copy định dạng hay CLI upstream. Mỗi nguyên tắc phải nêu cách thực thi và có
non-goals rõ ràng. Liên kết: `skills/core/spec-first-development/SKILL.md`,
`skills/core/checkpoint-validation/SKILL.md`.
