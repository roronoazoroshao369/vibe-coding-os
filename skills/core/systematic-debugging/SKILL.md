---
name: systematic-debugging
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: core
tags:
  - core
  - debugging
status: stable
---

# Skill: Systematic Debugging

## Purpose

Diagnose failures by forming hypotheses, collecting evidence, and changing one meaningful variable at a time.

## When to use

Use for bugs, flaky tests, validation failures, unexpected agent output, or regressions where the cause is not obvious.

## Inputs

Failure report, reproduction steps, logs or test output, recent changes, environment constraints, and suspected components.

## Workflow

1. Reproduce or narrow the failure before proposing fixes when practical.
2. State observations separately from hypotheses.
3. Rank hypotheses by likelihood and cost to test.
4. Run the smallest experiment that can falsify the top hypothesis.
5. Change one meaningful variable at a time and record results.
6. After the fix, add or run a regression check and summarize the root cause at the right confidence level.

## Outputs

A debugging log with reproduction status, hypotheses, experiments, root cause confidence, fix, and regression verification.

## Failure modes

- Jumping to a fix without reproducing or inspecting evidence.
- Changing multiple variables so the result is uninterpretable.
- Treating a workaround as root cause.
- Failing to add or run a regression check.

## Verification checklist

- [ ] Reproduction or limitation is documented.
- [ ] Hypotheses and observations are separated.
- [ ] Experiments are small and evidence-based.
- [ ] Fix is verified by targeted check or clear limitation.

Related mattpocock-inspired skill: `skills/core/disciplined-diagnosis/SKILL.md` for evidence-first bug diagnosis.
