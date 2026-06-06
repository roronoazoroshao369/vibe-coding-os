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
3. Describe expected behavior and edge cases.
4. Add acceptance criteria that can be verified.
5. Review the spec for missing assumptions before planning.

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
