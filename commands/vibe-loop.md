---
description: "Loop engineer — iterate implement → verify → fix until objective Done, with policy-gated safety and verifiable completion criteria."
---

# vibe-loop

## Purpose

Run as a **loop engineer**, not a one-shot prompt. Given an intent or accepted
spec, iterate `implement → verify → diagnose → fix` until **Done is proven by
objective gates** (tests, typecheck, imports, scope-match) or a stop condition
fires. The loop protects code quality on every round instead of reviewing once
at the end.

This is the disciplined counterpart to "vibe coding": same hands-off speed, but
completion is defined by passing gates — never by the assistant declaring "done".

## When to use

Use when:
- There is a spec or a narrow, well-defined intent the loop can verify against.
- You want to delegate the repetitive `run → read failure → fix → re-run` cycle.
- You want completion gated on objective checks, not on the assistant's word.

Do NOT use when:
- The task is exploratory with no verifiable success criteria yet (run `/vibe-spec` first).
- Each step needs case-by-case human judgement (use `/vibe-implement` instead).

## How to use

```
/vibe-loop "<intent>"                # auto-derive a spec, then loop to Done
/vibe-loop --spec=<file>             # loop against an existing spec
/vibe-loop --mode=lean|standard|strict
/vibe-loop --max-iterations=12       # hard cap on rounds (default 12)
/vibe-loop --budget=<tokens>         # soft cost ceiling
/vibe-loop --auto-approve            # auto-approve low/medium-risk actions only
/vibe-loop --watch                   # pause to show the diff each round
/vibe-loop --rollback                # restore the last passing checkpoint
/vibe-loop-status                    # show which round / gate the loop is on
```

Modes map to safety policy and quality depth:

| Mode | file.write | shell.command | network | Use for |
| --- | --- | --- | --- | --- |
| lean | auto | require | require | trusted local scratch work |
| standard | auto (≤60) | require | require | default day-to-day |
| strict | require | block | block | shared / production-bound code |

## The loop (invariants you MUST follow)

1. **Never declare done** until EVERY gate passes: tests, typecheck, imports, scope-match, and the spec's acceptance criteria.
2. **Re-read the spec at the start of each round** so a long loop cannot drift from intent.
3. **One small unit of work per round**, then verify — do not batch many unrelated edits.
4. **Stop and ask** if two consecutive rounds do not reduce the failure count (no guessing).
5. **Never widen scope** beyond the spec; a diff that escapes scope is a violation, not progress.
6. **High-risk actions** (delete files, `git push`, destructive shell) always require approval, even with `--auto-approve`.

### Round procedure

```
LOOP until DONE or STOP:
  1. RE-READ spec + acceptance criteria.
  2. IMPLEMENT the next smallest step from the plan.
  3. VERIFY: run `npm run validate:autopilot` + the relevant tests.
  4. IF all gates pass  -> DONE, print summary.
     IF failing         -> DIAGNOSE the specific failures, FIX, round++.
     IF no-progress (×2) -> ESCALATE to the human with the open failures.
     IF max-iterations / budget reached -> STOP with reason.
```

### Stop conditions (explicit, not vague)

| Condition | Result |
| --- | --- |
| All gates pass | `DONE` |
| `round >= max-iterations` | `STOPPED: max-iterations` |
| cost `>= budget` | `STOPPED: budget` |
| failure count not improving ×2 | `ESCALATE: no-progress` |
| action denied by policy | `BLOCKED: approve or change --mode` |
| diff escapes spec scope | `BLOCKED: scope` |

## Required inputs

- An intent or accepted spec narrow enough to verify.
- A test command (defaults to `npm test`) or the project's verification commands.
- Current git status (clean tree recommended so checkpoints/rollback are meaningful).

## Output format

Per round, print exactly one concise line:

```
[loop N/MAX] <step> -> verify: <pass|X fail> -> <next action>
```

On termination, print a summary:

- **Result**: DONE or STOPPED (reason).
- **Rounds**: number executed.
- **Final gates**: which passed / failed.
- **Files changed**: grouped list.
- **Cost**: approximate tokens used vs budget.
- **Follow-ups**: only if work is intentionally out of scope or blocked.

## Verification expectation

Completion is asserted ONLY from gate results. Never claim Done without showing
the final verify output, or clearly stating why a gate could not run.

## Stop/ask-clarifying-question condition

Stop and ask when: the spec conflicts with repository reality, failures stop
improving, a required action is blocked by policy, the change would need a broad
rewrite outside the spec, or inputs are missing.

## Runtime

Backed by `runtime/autopilot/vibe-loop.mjs` (orchestrator), reusing
`runtime/autopilot/loop.mjs` (bounded loop), `runtime/autopilot/policy.mjs`
(action gating), and `runtime/autopilot/verifier.mjs` (objective Done gates).
Done criteria schema: `schemas/done-criteria.schema.json`.

## Related skills/templates

- `skills/core/loop-engineering/SKILL.md`
- `skills/core/verification-before-done/SKILL.md`
- `skills/core/plan-driven-execution/SKILL.md`
- `skills/core/systematic-debugging/SKILL.md`
- `skills/prompts/anti-overengineering/SKILL.md`
- `skills/prompts/karpathy-guardrails/SKILL.md`
