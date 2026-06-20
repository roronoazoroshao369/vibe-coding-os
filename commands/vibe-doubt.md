---
description: "Run in-flight doubt on an in-progress decision before it hardens."
---

# Command: Vibe Doubt

## When to use

Invoke before committing to a non-trivial decision: stack/library choice, architecture change, plan acceptance, code path that feels "obvious", or any moment a prior rationalization is about to go unchallenged. Pairs with `vibe-critique` (single-shot review of finished artifacts).

## Required inputs

- Current decision point or in-progress artifact
- Project context (stack, conventions, existing patterns)
- Active persona + their context budget state

## Step-by-step behavior

1. State the doubt trigger explicitly (the decision + the moment).
2. Run CLAIM → LOCATE → SCRUTINIZE → DOUBT → ADJUDICATE → RECORD (CLS-DAR).
3. Verify loading constraints: no persona-spawning-persona, budget <30%, interactive context.
4. Check the 6 red flags; remediate or escalate any that fire.
5. Record adjudication to `templates/doubt-log.md` with confidence 0-100%.
6. State the next action and owning persona.

## Outputs

Doubt log entry + 1-line summary in the session's `## Active doubts` section.

## Stopping conditions

Stop when: (a) adjudication is recorded, (b) 3+1 evidence points cited, (c) confidence stated, (d) next action is explicit and owned. Do not extend doubt into a blocking gate.

## Verification checklist

- [ ] Trigger named (CLAIM)
- [ ] Claim located to file/line/ADR (LOCATE)
- [ ] 3 FOR + 3 AGAINST evidence points
- [ ] Loading constraints verified
- [ ] No red flags fired silently
- [ ] Confidence 0-100% recorded
- [ ] Next action explicit
- [ ] Log entry exists

## Anti-patterns to avoid

- Adding this command to a persona that spawns other personas (recursion)
- Invoking in autonomous CI/loop contexts (use `verification-before-done` instead)
- Doubting every decision (paralysis) — apply the trigger list
- Skipping evidence (gut-feel) — unfalsifiable

## Related skills

- `skills/core/doubt-driven-development/SKILL.md` — full CLS-DAR protocol
- `skills/core/critique-pass-protocol/SKILL.md` — single-shot post-implementation review
- `skills/core/verification-before-done/SKILL.md` — completion gate
- `templates/doubt-log.md` — append-only doubt ledger
