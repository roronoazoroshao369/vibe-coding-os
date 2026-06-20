---
name: anti-overengineering
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: prompts
tags:
  - prompts
status: stable
---

# Anti-Overengineering

## Purpose

Keep solutions simple, local, and proportional to the request.

## When to use

Use when a task tempts architecture astronautics, broad abstractions, or speculative features.

## Inputs

User request, constraints, current design, proposed solution.

## Workflow

1. State the smallest acceptable solution.
2. Reject features not required by the spec.
3. Prefer existing patterns over new frameworks.
4. Make trade-offs explicit.
5. Leave future ideas as follow-ups, not implementation.

## Outputs

A simplified approach and trimmed scope.

## Failure modes

- Under-solving real requirements.
- Using simplicity as an excuse to skip quality.
- Hiding future migration costs.

## Verification checklist

- [ ] Solution satisfies current acceptance criteria.
- [ ] No speculative features were added.
- [ ] Complexity is justified.
- [ ] Follow-ups are separate.

## Related skills

This is the Simplicity-First member of a four-part engineering discipline set:

- `skills/prompts/karpathy-engineering-discipline/SKILL.md` — Think Before Coding and
  Surgical Changes.
- `skills/core/goal-driven-execution/SKILL.md` — Goal-Driven Execution (imperative →
  verifiable goal with per-step checks).
- `skills/core/verification-before-completion/SKILL.md` — the evidence bar for "done".
