# Skill: Clarify Before Code

## Purpose

Prevent wasted implementation by resolving ambiguity before edits.

## When to use

Use when requirements, constraints, acceptance criteria, or target files are unclear.

## Inputs

User request, observed repo context, possible interpretations.

## Workflow

1. Restate the request in concrete terms.
2. Identify ambiguities that affect implementation.
3. Ask the fewest high-value questions possible.
4. If questions are not possible, record conservative assumptions.
5. Proceed only when the next action is safe.

## Outputs

Clarifying questions or documented assumptions and a narrowed task statement.

## Failure modes

- Asking excessive questions.
- Proceeding despite conflicting requirements.
- Inventing product behavior.

## Verification checklist

- [ ] Ambiguities that affect code are resolved or recorded.
- [ ] Assumptions are conservative.
- [ ] The user goal remains unchanged.

## Superpowers alignment

Use with `brainstorming` when the request needs option exploration before a spec.

Related mattpocock-inspired skill: `skills/core/grill-user-before-building/SKILL.md` for deeper pre-build interviewing.
