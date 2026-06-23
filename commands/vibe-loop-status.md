---
description: "Show the current loop engineer status — round number, last verify result, open failures, and stop reason if finished."
---

# vibe-loop-status

## Purpose

Report the live state of a `/vibe-loop` run so a human can see what the loop
engineer is doing without it being a black box: which round it is on, the last
verification result, the open failures, and — if it has stopped — why.

## When to use

Use during or after a `/vibe-loop` run to inspect progress, decide whether to
approve a blocked action, or understand why the loop stopped.

## How to use

```
/vibe-loop-status            # human-readable status of the active/last loop
/vibe-loop-status --json     # machine-readable status for tooling
```

## Output format

```
Loop: <active|done|stopped>
Round: N / MAX
Last verify: <all gates PASS | X issue(s) in [gate, ...]>
Open failures:
  - [gate] <message>
Stop reason: <done|max-iterations|budget|no-progress|policy-blocked|error>
Cost: <used> / <budget> tokens
```

When no loop has run, report that plainly and suggest `/vibe-loop "<intent>"`.

## Verification expectation

This command only reports state; it never claims work is complete. Completion is
asserted solely by `/vibe-loop`'s gate results.

## Runtime

Reads the per-round events emitted by `runtime/autopilot/vibe-loop.mjs`.

## Related skills/templates

- `commands/vibe-loop.md`
- `skills/core/loop-engineering/SKILL.md`
- `skills/core/verification-before-done/SKILL.md`
