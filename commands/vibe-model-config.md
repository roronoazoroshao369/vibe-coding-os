---
description: "Configure model-aware quality gates from model capability, task risk, and project settings."
---

# vibe-model-config

## Purpose

Select model-aware Quality Engine gates by combining model capability, task risk, and project configuration. Backs `skills/core/model-aware-config/SKILL.md`.

## Options

- `--model <id>` — model identifier to match against configured profiles.
- `--task <description>` — task description used for risk and domain classification.
- `--profile lean|standard|heavy` — manual profile override; document rationale and residual risk.
- `--list-models` — show available model profiles and default fallbacks.
- `--list-tasks` — show task risk classifications and common risk signals.

## Step-by-step behaviour

1. If `--list-models` is present, list configured model IDs, aliases, profile tiers, and unknown-model fallback policy.
2. If `--list-tasks` is present, list low/medium/high task-risk definitions and domain amplifiers.
3. Confirm `--model` and `--task` are present unless running a list-only request.
4. Load project model-aware config if available; otherwise use documented defaults.
5. Classify task risk as `low`, `medium`, or `high` from the description and known project context.
6. Match the model ID to a profile, then apply the optional `--profile` override if supplied.
7. Run adaptive gate selection using profile, risk, task domain, model weaknesses, and project policy.
8. Present selected gates, skipped gates, and rationale for review.
9. Execute or hand off to the Quality Engine with the selected gates.

## Outputs

Model profile, task-risk classification, selected quality gates, skipped-gate rationale, and the Quality Engine command or execution plan.

## Stopping conditions

Stop and ask for clarification when the task cannot be classified, when an unknown model fallback is disallowed by project config, or when a profile override would skip required gates for a high-risk task.
