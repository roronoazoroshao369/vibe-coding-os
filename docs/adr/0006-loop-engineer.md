# ADR 0006: Loop Engineer (/vibe-loop)

**Status:** Accepted for v2.18.0
**Date:** 2026-06-23
**Deciders:** @roronoazoroshao369

## Status

Accepted for v2.18.0.

## Context

AI-assisted coding ("vibe coding") is fast but suffers recurring pains:

- **Babysitting** — the human re-prompts "continue / fix that / run it again" repeatedly.
- **False completion** — the assistant claims "done" while tests fail or edge cases remain.
- **Scope creep** — unrequested refactors inflate the diff and reduce reviewability.
- **Drift** — on long sessions the assistant loses the original spec.
- **Runaway loops** — fix-A-breaks-B cycles burn tokens with no progress.
- **Unsafe autonomy** — autonomous runs can perform destructive actions.

The repository already had the primitives to address this — `runtime/autopilot/loop.mjs`
(a bounded action loop with policy gating + stats) and `runtime/autopilot/policy.mjs`
(allow/deny/approval rules) — but the loop was abstract: it had no quality
feedback (run tests, read failures, decide to continue) and no objective
definition of "done". As a result, completion still depended on the assistant's
word, which is the core anti-pattern this project exists to remove.

## Decision

Introduce a **loop engineer** entry point, `/vibe-loop`, that closes the loop:

```
implement → verify → diagnose → fix → verify → ... → DONE | STOP
```

Implemented under the already-allowlisted `runtime/autopilot/` directory (no new
top-level runtime dir, no new `runtime:*` script — ADR 0002 compliant):

- `runtime/autopilot/verifier.mjs` — runs objective gates (tests, typecheck,
  imports, scope-match) and reports `{ passed, failures[], failureCount }`.
- `runtime/autopilot/vibe-loop.mjs` — orchestrator that reuses `runLoop` +
  `Policy` and adds DONE detection, no-progress detection, budget/iteration
  stops, spec re-injection, and per-round events.
- `commands/vibe-loop.md` + `commands/vibe-loop-status.md` — the command surface.
- `skills/core/loop-engineering/SKILL.md` — the operating discipline.
- `schemas/done-criteria.schema.json` — the machine-readable definition of "done".

### Invariants

1. Completion is asserted ONLY from gate results — never from the assistant's word.
2. The spec is re-injected each round to prevent drift.
3. One small unit of work per round, then verify.
4. The loop stops (does not guess) when failures stop improving for N rounds.
5. High-risk actions always require approval, even with `--auto-approve`.
6. Hard stops: max-iterations, budget, policy-block, scope-violation.

## Consequences

**Positive**

- Removes the six pains above with explicit, testable mechanisms.
- Gives newcomers one entry point instead of chaining many commands.
- Keeps quality gates on every round, not just at the end.

**Negative / risks**

- A closed loop can feel like a black box → mandatory per-round one-line output
  and `/vibe-loop-status` mitigate this.
- Auto-approval could enable unsafe actions → high-risk actions stay gated.
- Over-engineering the loop itself → the orchestrator only adds verifier + stop
  conditions on top of existing primitives; no new runtime surface.

## Alternatives considered

- **Expand `/vibe-autopilot`** — rejected: autopilot gates *actions* but has no
  quality feedback or Done definition; conflating the two would muddy both.
- **Pure prompt instructions, no runtime** — rejected: stop conditions and
  objective verification need executable logic to be trustworthy.

## Compliance with ADR 0002 (Runtime Scope Freeze)

This change adds files inside the existing `autopilot/` top-level directory
(already on the allowlist) and introduces only a `test:loop` script — not a
`runtime:*` script. It therefore does not expand frozen runtime scope and
requires no freeze exception.
