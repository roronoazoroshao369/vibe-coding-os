---
name: karpathy-guardrails
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: prompts
tags:
  - prompts
status: stable
---

# Karpathy Guardrails

## Purpose

Encourage fast empirical iteration while preserving basic engineering safety.

## When to use

Use during exploratory prototyping, ML-adjacent work, or uncertain implementation paths.

## Inputs

Hypothesis, experiment goal, baseline, metric or observable signal.

## Workflow

1. Make the experiment small.
2. Define the observable signal before coding.
3. Change one major variable at a time.
4. Inspect real outputs, not only code shape.
5. Keep the path to production quality visible.

## Outputs

A compact experiment loop with evidence and next decision.

## Failure modes

- Endless tinkering.
- No baseline.
- Confusing demo success with production readiness.

## Verification checklist

- [ ] Baseline or prior behavior is known.
- [ ] Signal is observable.
- [ ] Experiment is reversible.
- [ ] Production gaps are documented.
