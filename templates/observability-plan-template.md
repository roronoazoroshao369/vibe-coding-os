---
title: Observability Plan
type: template
name: observability-plan-template
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: planning
tags:
  - template
  - planning
status: stable
---

# Observability Plan

Design instrumentation **before shipping**. This template enforces the "questions before signals" workflow.

## 1. On-call question list (2-4 questions)

Generate the questions an on-call engineer will ask at 3am when this feature misbehaves. Do not write signals first.

1. **Q1:** _______________________________________________________________
2. **Q2:** _______________________________________________________________
3. **Q3:** _______________________________________________________________
4. **Q4:** _______________________________________________________________

## 2. Question → signal mapping

| Question | Signal type | Signal name | Justification |
| --- | --- | --- | --- |
| Q1 | metric / log / trace | `__________` |  |
| Q2 | metric / log / trace | `__________` |  |
| Q3 | metric / log / trace | `__________` |  |
| Q4 | metric / log / trace | `__________` |  |

Reject any signal that cannot be linked back to a question.

## 3. SLO envelope (top 1-2 questions)

For the top 1-2 questions, define a target and a burn-rate alert.

| Question | SLO target | Window | Burn-rate alert |
| --- | --- | --- | --- |
|  |  |  |  |
|  |  |  |  |

Signals without an SLO must be marked **diagnostic only** (no alert).

## 4. Signal matrix

For every signal, document the full contract.

| Field | Value |
| --- | --- |
| Signal name |  |
| Type | metric / log / trace |
| Question answered |  |
| Labels (with cardinality bound) |  |
| Sampling rate (traces) |  |
| Retention |  |
| Owner |  |
| Runbook link |  |
| PII risk |  |
| Redaction strategy |  |
| Approx cost (CPU/network/storage) |  |

## 5. Instrumentation placement

Where in the code does each signal get emitted? Document the call sites in the design, not retrofitted.

| Signal | Call site | When emitted | What fields |
| --- | --- | --- | --- |
|  |  |  |  |

## 6. Verification plan

How will we prove the signal works **before** merge?

- [ ] Synthetic test (generate event, verify signal emitted)
- [ ] Shadow traffic (replay production traffic, verify signal)
- [ ] Staged rollout (canary 1% → 10% → 100%, verify per stage)
- [ ] Other: __________

## 7. Blind test

On-call engineer, given ONLY the new signals, must answer each question from §1. Document the answer:

- **Q1 answered by:** __________ (signal name)
- **Q2 answered by:** __________ (signal name)
- **Q3 answered by:** __________ (signal name)
- **Q4 answered by:** __________ (signal name)

If any question cannot be answered from the new signals, the design is incomplete. Iterate.

## 8. Quality gate

- [ ] On-call question list complete (2-4 questions)
- [ ] All questions map to signals
- [ ] SLO + burn-rate alert for top 1-2
- [ ] Signal matrix complete
- [ ] PII redaction verified
- [ ] Verification plan executable pre-merge
- [ ] Blind test passes
