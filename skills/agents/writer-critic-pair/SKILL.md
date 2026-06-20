---
name: writer-critic-pair
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: agents
tags:
  - agents
status: stable
---

# Writer-Critic Pair

## Purpose

Use a two-role agent pattern where a writer or implementer creates the artifact and a critic or reviewer independently challenges it before final delivery.

## When to use

Use for complex implementations, risky changes, architecture decisions, high-stakes user communication, ambiguous requirements, security-sensitive work, or any task where same-context self-approval would be too weak.

## Inputs

Original task, acceptance criteria, scope boundaries, writer output or diff, validation results, repository conventions, known risks, and time or tool constraints.

## Workflow

1. Assign the **writer** to understand the task, inspect context, propose or implement the smallest correct solution, and report verification honestly.
2. Assign the **critic** to read the original task and evidence independently before reading the writer's summary.
3. The critic challenges correctness, assumptions, scope, tests, compatibility, safety, and maintainability.
4. The writer responds with a fix plan, applies necessary changes, and records any deferred risks.
5. The critic re-reviews the revised artifact or explicitly states why re-review was not possible.
6. The final owner synthesizes the result and decides whether to ship, revise, or ask for clarification.

## Outputs

A handoff with:

- **Task**: original goal and constraints.
- **Writer output**: summary, changed files or artifact, and verification run.
- **Critic findings**: critical, important, and minor findings with evidence.
- **Writer response**: fixes applied, deferred items, and rationale.
- **Re-review**: critic result after fixes.
- **Final decision**: ship, revise, or ask.

## Failure modes

- Writer and critic share the same assumptions and miss the same bug.
- Critic rubber-stamps instead of adversarially checking evidence.
- Roles edit the same files concurrently and create conflicting changes.
- Handoff omits validation results or known limitations.
- Critic blocks on taste rather than task risk.
- Final owner ignores unresolved critical findings.

## Verification checklist

- [ ] Writer and critic responsibilities are distinct.
- [ ] Critic reviewed against the original task, not only the writer summary.
- [ ] Findings are severity-ranked and evidence-based.
- [ ] Writer response addresses or explicitly defers each critical and important finding.
- [ ] Final decision reflects re-review status and residual risk.
