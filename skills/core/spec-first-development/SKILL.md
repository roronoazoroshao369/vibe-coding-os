# Spec-First Development

## Purpose

Turn intent into a compact specification before non-trivial code changes.

## When to use

Use for new features, behavior changes, public APIs, data changes, or risky refactors.

## Inputs

Intent, constraints, users, existing behavior, acceptance criteria.

## Workflow

1. Create or update a spec using the template.
2. Define goals, non-goals, and constraints.
3. Describe expected behavior, user scenarios, and edge cases.
4. Add acceptance criteria that can be verified.
5. Apply what-before-how: keep technical choices out of the spec.
6. Review the spec for missing assumptions before planning, then clear the spec checkpoint.

## Outputs

A concise spec with goals, non-goals, behavior, edge cases, and acceptance criteria.

## Failure modes

- Spec becomes too broad.
- Acceptance criteria are not testable.
- Implementation starts before agreement on behavior.

## Verification checklist

- [ ] Goals and non-goals are explicit.
- [ ] Acceptance criteria are observable.
- [ ] Open questions are listed.
- [ ] Spec matches the user request.

Related mattpocock-inspired skill: `skills/core/prd-from-context/SKILL.md` for product-shaped specs from existing conversation context.

## Spec-driven development layer (github/spec-kit inspiration)

This skill is the `specify` phase of the local spec-driven workflow. For the full lifecycle, compose with:

- `skills/core/project-constitution/SKILL.md` — principles that constrain the spec.
- `skills/core/what-before-how/SKILL.md` — keep technical choices out of the spec.
- `skills/core/acceptance-criteria/SKILL.md` — observable, verifiable criteria.
- `skills/core/plan-from-spec/SKILL.md` — turn the agreed spec into a plan.
- `skills/core/task-breakdown-from-plan/SKILL.md` and `skills/core/dependency-aware-task-ordering/SKILL.md` — decompose and order tasks.
- `skills/core/checkpoint-validation/SKILL.md` — the implementation-readiness gate.
- `skills/core/brownfield-spec-enhancement/SKILL.md` — spec discipline for existing systems.

Inspiration source and mapping: `references/sources/github-spec-kit.md`, `references/features/spec-driven-development.md`. No upstream content is vendored, and the Specify CLI is not required.

### Ghi chú tiếng Việt

Skill này là pha `specify`. Kết hợp với các skill spec-driven khác (constitution, what-before-how, acceptance-criteria, plan-from-spec, task breakdown, checkpoint) để có vòng đời đầy đủ. Học ý tưởng từ `spec-kit`, không copy, không bắt buộc Specify CLI.
