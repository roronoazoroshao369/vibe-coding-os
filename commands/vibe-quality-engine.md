---
description: "Run the Quality Engine to execute selected quality gates, report timing, and recommend targeted fixes."
---

# vibe-quality-engine

## Purpose

Execute a coordinated quality pass across selected gates, then return structured results and actionable recommendations.

## When to use

Use after implementation, before a PR, during periodic quality audits, or when reassessing a repository. Choose this command when you want one unified engine pass instead of manually chaining individual quality checks.

## Supported profiles

- `lean` — fast, minimal checks, low evidence burden, best for trivial or low-risk changes.
- `standard` — default balance of speed and rigor for most tasks.
- `heavy` — broad, deep checks with stronger evidence requirements for high-risk changes.

## Required inputs

- Task description and scope
- Optional model profile (`lean`, `standard`, or `heavy`)
- Optional config path for project-specific settings
- Optional explicit gate selection to include or exclude gates

## Step-by-step behavior

1. Load project config if provided, otherwise fall back to defaults.
2. Choose the model profile and derive gate selection and evidence expectations from it.
3. Run the selected gates against the task or repository scope.
4. Record per-gate pass, warn, and fail results with timing.
5. Cluster failures into root causes and distinguish blockers from warnings.
6. Produce a markdown report with summary, timing, gate results, and prioritized fix recommendations.
7. Return structured results suitable for automation or human review.

## Outputs

Gate results, timing per gate, overall status, and ranked fix recommendations.

## Verification or stopping conditions

Stop before applying fixes if the engine fails to load config, cannot determine scope, or produces contradictory gate signals. Ask for clarification rather than guessing.
