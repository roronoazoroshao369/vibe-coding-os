# vibe-debug

## Purpose

Debug systematically.

## When to use

Use for failures, flaky tests, regressions, validation errors, or unclear root causes.

## Required inputs

Failure symptoms; reproduction steps; logs; recent changes; environment constraints.

## Step-by-step behavior

1. Reproduce or narrow the failure when practical.
2. Separate observations from hypotheses.
3. Rank hypotheses and test the cheapest useful one first.
4. Change one meaningful variable at a time.
5. After fixing, run a regression check and summarize root cause confidence.

## Outputs

Debug log with reproduction status, hypotheses, experiments, fix, and verification.

## Verification or stopping conditions

Stop if the next experiment could destroy data, exceed scope, or needs credentials/access you do not have.
