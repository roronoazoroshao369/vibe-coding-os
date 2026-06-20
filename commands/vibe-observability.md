---
description: "Design observability for a feature by starting from on-call questions."
---

# Command: Vibe Observability

## When to use

Invoke when designing instrumentation for a new feature, when retrofitting observability to an under-signal'd feature, when proposing a new SLO/SLI, or after a "we had no signal" post-mortem.

## Required inputs

- Feature spec or implementation
- Existing instrumentation inventory (metrics/logs/traces already emitted)
- Recent incident reports or "we wished we had signal" notes

## Step-by-step behavior

1. Generate the on-call question list (2-4 questions) BEFORE any code.
2. Map each question to a signal type (metric/log/trace) using the trade-off table.
3. Reject any signal without a justifying question.
4. Define SLO envelope for top 1-2 questions (target + burn-rate alert).
5. Build the signal matrix: name, type, labels, cardinality, retention, owner, runbook.
6. Place instrumentation in the design (not retrofitted).
7. Define the verification: synthetic test, shadow traffic, replay, or staged rollout.
8. Run a blind test: can on-call answer each question from the new signals?

## Outputs

- Filled `templates/observability-plan-template.md` (question list + signal matrix)
- SLO/SLI entries in `templates/observability-plan-template.md` (or ADRs)
- Pre-merge verification step added to the feature's quality gate

## Stopping conditions

Stop when: (a) every question has a justifying signal, (b) SLO + burn-rate alert exist for top 1-2, (c) instrumentation is in the design, (d) verification plan exists and can be run pre-merge.

## Verification checklist

- [ ] 2-4 on-call questions generated
- [ ] Each question → ≥1 signal
- [ ] Signal matrix complete (cardinality, retention, owner)
- [ ] No orphan signals
- [ ] Top SLO has burn-rate alert
- [ ] PII fields redacted at emission
- [ ] Verification plan exists
- [ ] Blind test passes

## Anti-patterns to avoid

- "We'll add metrics if it breaks" (post-incident instrumentation misses the failure mode you didn't anticipate)
- "Logs are enough" (untyped logs are unsearchable at incident time)
- Random trace sampling (drops the slow ones you need)
- High-cardinality labels (user_id, raw request body)
- Alerting on raw signal instead of question-derived SLO
- Retrofitting observability after "done"

## Related skills

- `skills/core/observability-design/SKILL.md` — full questions-first protocol
- `skills/core/quality-telemetry/SKILL.md` — quality-gate metrics (different scope)
- `templates/observability-plan-template.md` — question list + signal matrix template
