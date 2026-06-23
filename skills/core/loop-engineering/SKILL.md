---
name: loop-engineering
version: 1.0.0
introduced_in: v2.18.0
last_reviewed: 2026-06-23
category: core
tags:
  - core
status: stable
---

# Skill: Loop Engineering

## Purpose

Operate as a loop engineer: drive an autonomous `implement → verify → fix` cycle
that ends only when completion is proven by objective gates, or stops itself with
a clear reason. Replace "prompt, read, re-prompt" babysitting with a bounded,
self-correcting loop that never sacrifices code quality for speed.

## When to use

Use when a task has verifiable success criteria and you want hands-off iteration:
fixing a failing test suite, implementing an accepted spec, or closing a bug to
green. Pair it with `/vibe-loop`.

Do NOT use for open-ended exploration with no pass/fail signal yet — define a spec
and acceptance criteria first.

## The pain this removes

| Pain in AI-assisted coding | How a loop engineer removes it |
| --- | --- |
| Babysitting ("continue", "fix that", "run it again") | The loop self-iterates without re-prompting. |
| AI claims done while tests fail | Done = gates pass, never the assistant's word. |
| Scope creep / unrequested refactors | Each round is checked against the spec scope. |
| Drift on long sessions | The spec is re-injected every round. |
| Infinite loops / token burn | No-progress, iteration, and budget stops. |
| Dangerous autonomous actions | Policy gates high-risk actions for approval. |

## Inputs

Spec or narrow intent, acceptance criteria, a verification command set
(tests / typecheck / scope-match), iteration cap, and optional cost budget.

## Workflow

1. **Anchor**: read the spec and acceptance criteria; restate them as the round's goal.
2. **Implement one step**: make the smallest correct change toward the goal.
3. **Verify objectively**: run the gate set; capture concrete pass/fail evidence.
4. **Decide**:
   - all gates pass → DONE, summarize.
   - failing, improving → diagnose the specific failures, fix, next round.
   - failing, not improving (×2) → ESCALATE with the open failures; do not guess.
   - iteration / budget limit → STOP with the reason.
5. **Record**: emit a per-round event (round, step, gate results, diff size) for audit/rollback.

## Invariants

- Completion is asserted only from gate results.
- One small unit of work per round; verify before continuing.
- Never widen scope beyond the spec.
- High-risk actions always require approval, even when auto-approve is on.
- Stop instead of looping when progress stalls.

## Stop conditions

`DONE` (gates pass) · `max-iterations` · `budget` · `no-progress` (×2) ·
`policy-blocked` · `scope-violation`.

## Runtime

`runtime/autopilot/vibe-loop.mjs` orchestrates the loop, reusing
`loop.mjs` (bounded loop), `policy.mjs` (action gating), and
`verifier.mjs` (objective Done gates). Criteria: `schemas/done-criteria.schema.json`.

## Related skills/templates

- `skills/core/verification-before-done/SKILL.md`
- `skills/core/plan-driven-execution/SKILL.md`
- `skills/core/systematic-debugging/SKILL.md`
- `skills/prompts/anti-overengineering/SKILL.md`
- `commands/vibe-loop.md`
