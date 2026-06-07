# vibe-specify

## Purpose

Produce a behavior-focused specification (the "what") with goals, non-goals, user
scenarios, and observable acceptance criteria, deferring technical choices to planning.

## When to use

Use before non-trivial implementation, when requirements are ambiguous, or when a change
affects user-visible behavior. Complements `commands/vibe-spec.md`; use either entry point
and the same `templates/spec-template.md`.

## Required inputs

- User request or product requirement.
- Project constitution and relevant context.
- Existing spec path if updating.

## Step-by-step behavior

1. Restate the user's intent and the affected users.
2. Define goals and non-goals; respect the constitution.
3. Describe user scenarios, expected behavior, and edge cases.
4. Write observable, technology-agnostic acceptance criteria.
5. Apply what-before-how: move any technical decisions into deferred notes for the plan.
6. List open questions that would materially change the spec.
7. Save the spec using `templates/spec-template.md`.

## Outputs

A spec with intent, goals, non-goals, user scenarios, behavior, edge cases, acceptance
criteria, deferred technical decisions, and open questions.

## Stopping conditions

Stop and ask when acceptance criteria cannot be defined, requirements conflict, or the
request violates repository policy.

## Verification checklist

- [ ] Goals and non-goals are explicit.
- [ ] Acceptance criteria are observable and tech-agnostic.
- [ ] Technical choices are deferred to the plan.
- [ ] Open questions are listed.

## Related skills/templates

- `skills/core/spec-first-development/SKILL.md`, `skills/core/what-before-how/SKILL.md`, `skills/core/acceptance-criteria/SKILL.md`
- `templates/spec-template.md`

## Ghi chú tiếng Việt

Viết spec tập trung vào hành vi: goals, non-goals, user scenarios, tiêu chí chấp nhận quan
sát được; đẩy quyết định kỹ thuật sang pha plan. Dùng `templates/spec-template.md`. Học ý
tưởng từ `spec-kit`, không copy template/CLI.
