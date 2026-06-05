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
