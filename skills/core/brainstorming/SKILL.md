---
name: brainstorming
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: core
tags:
  - core
status: stable
---

# Skill: Brainstorming

## Purpose

Explore intent, constraints, options, and open questions before committing to a design or code path.

## When to use

Use before non-trivial coding, ambiguous requests, product choices, architecture changes, debugging with unclear cause, or any work where a wrong assumption would be expensive.

## Inputs

User request, known constraints, repo context, relevant prior specs or memory, and any hard deadline or acceptance criteria.

## Workflow

1. Restate the user intent in your own words and separate facts from assumptions.
2. List the smallest set of clarifying questions that would materially change the solution.
3. Offer 2-4 viable approaches with trade-offs, risks, and likely validation paths.
4. Identify non-goals and scope boundaries so brainstorming does not become implementation.
5. Recommend one approach only after the uncertainty is visible.
6. For non-trivial work, transition into a spec/design artifact before implementation.

## Outputs

A concise decision brief: clarified intent, assumptions, options, recommendation, unresolved questions, and suggested next workflow step.

## Failure modes

- Brainstorming becomes hidden implementation planning without user-visible choices.
- The agent asks too many low-value questions instead of making safe assumptions explicit.
- A recommendation is presented without risks, non-goals, or validation strategy.

## Verification checklist

- [ ] Intent, assumptions, and unknowns are separated.
- [ ] At least one alternative was considered for meaningful work.
- [ ] The recommended path is proportional to the task.
- [ ] Next step is clear: ask, spec, plan, implement, or stop.

## Choose instead

Generating 2-4 options before committing to a direction.

If this skill is not the right phase for your task, use one of these instead:

- `skills/core/spec-first-development/SKILL.md` — once a direction is chosen and a spec is needed.
- `skills/core/writing-plans/SKILL.md` — once a direction is chosen and you want a step-by-step plan.

For the full decision tree across all 6 plan-family skills, see [docs/workflows/plan-skill-decision-tree.md](../../../docs/workflows/plan-skill-decision-tree.md).
