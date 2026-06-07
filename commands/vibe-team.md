# vibe-team

## Purpose

Design and run a proportional team-agent workflow for large or risky work.

## When to use

Use when Adaptive Flow classifies work as `large` or `risky`, when multiple domains need parallel coverage, or when separate producer/reviewer/tester lanes reduce risk.

## Required inputs

Task goal; spec/plan/tasks if present; affected domains; risk surfaces; validation commands; allowed write scopes; integration owner; attribution constraints.

## Step-by-step behavior

1. Confirm team use is justified; otherwise fall back to `vibe-subagents` or direct work.
2. Complete domain analysis: files, systems, owners, tests, unknowns.
3. Pick one team pattern: Pipeline, Fan-out/Fan-in, Expert Pool, Producer-Reviewer, Supervisor, or Hierarchical Delegation.
4. Fill `templates/team-architecture-template.md` with roles, scopes, handoffs, watchdog rules, and validation.
5. Create/assign tasks with explicit dependencies and file ownership.
6. Give each role progressive context only: goal, constraints, relevant files, output contract.
7. Integrate outputs through one owner; do not blindly apply worker conclusions.
8. Run dry-run validation, then real checks on the integrated result.
9. Record with-team vs without-team value and any follow-up memory/reference updates.

## Outputs

Team architecture, role briefs, task table, handoffs, final integration notes, and verification status.

## Verification or stopping conditions

Stop or downshift if scopes overlap heavily, no independent lanes exist, workers would edit the same shared files, or validation cannot be run. Team work is done only after integrated verification passes or limitations are explicit.
