---
description: "Inspect a model profile, print capabilities, and suggest tailored quality packs for a task."
---

# vibe-model-config

## Purpose

Inspect the selected model profile, print model capabilities, and recommend model-aware quality packs for the current task. Backs `skills/core/model-aware-config/SKILL.md` and uses `templates/model-config-output.md` as the preferred output shape.

## When to use

Use before implementation or review when the model ID is known and you want quality-pack advice tailored by model capability, task type, stack/domain signals, and known model weaknesses.

## Options

- `--model <id>` — model identifier to inspect, e.g. `claude-sonnet-4`, `gpt-4o-mini`, `hermes-3`.
- `--task-type <type>` — task type such as `feature`, `bugfix`, `refactor`, `security`, `migration`, or `init`.
- `--stack <items>` — comma-separated stack/domain hints such as `api,auth,db,frontend,async`.
- `--task <description>` — optional free-text task description used to refine type and domain signals.
- `--list-models` — list available profiles from `templates/model-profiles.json` and default registry examples.
- `--list-tasks` — list task-risk profiles and required gates from `schemas/model-profile-registry.json`.
- `--profile lean|standard|heavy` — optional manual quality-stack override; must print rationale and residual-risk warning.

## Step-by-step behaviour

1. If `--list-models` is present, print model IDs with vendor, display name, capability, quality stack, and advisory level.
2. If `--list-tasks` is present, print known task types with risk, minimum quality stack, and required gates.
3. Confirm `--model`, `--task-type`, and `--stack` are present unless running a list-only request. If `--task-type` is missing but `--task` is present, classify it using `skills/core/adaptive-prompt-selection/SKILL.md` or ask for confirmation.
4. Load `templates/model-profiles.json`; if a profile is missing there, use defaults documented in `schemas/model-profile-registry.json`. Unknown models fall back to `standard` and must emit a warning.
5. Inspect and print model capabilities: model ID, vendor, name, capability tier, default quality stack, and advisory level.
6. Load task-risk data from `schemas/model-profile-registry.json`: risk, `minQualityStack`, and `requiredGates` for `--task-type`.
7. Select the effective quality stack by taking the stricter of model default, task minimum, and optional override policy. Never silently downgrade high-risk task types.
8. Suggest tailored quality packs:
   - use the adaptive task-type pack matrix from `templates/adaptive-prompt-matrix.md`;
   - add stack/domain amplifiers for API, DB migration, auth, frontend state, and async jobs;
   - include self-review and verification for non-trivial tasks;
   - add model weakness checks from `templates/model-weakness-log.md` via `skills/core/model-weakness-memory/SKILL.md`.
9. Render the result using `templates/model-config-output.md`, including model info, capabilities, recommended packs, required gates, notes, and checklist.
10. Ask for confirmation before loading/running the recommended packs when the task risk is medium or high.

## Outputs

- Model info and capabilities.
- Task risk and effective quality stack.
- Recommended quality packs with skill paths and reasons.
- Required gates from the task-risk profile.
- Model-weakness notes and injected checks.
- Warning notes for unknown models, overrides, missing logs, skipped gates, or uncertainty.
- Tailored checklist ready for review or Quality Engine handoff.

## Stopping conditions

Stop and ask when the model cannot be identified and unknown fallback is disallowed, the task type cannot be classified, the stack/domain signals are too vague for pack selection, or a manual override would skip required gates for a high-risk task.

## Verification checklist

- [ ] Model profile is loaded or fallback is explicit.
- [ ] Model capabilities are printed.
- [ ] Task type, risk, and minimum quality stack are printed.
- [ ] Effective quality stack is at least as strict as the task minimum unless an approved override is documented.
- [ ] Recommended packs include both task-type and stack/domain reasons.
- [ ] Weakness memory is checked and converted into concrete checklist items, or "no matches" is stated.
- [ ] Output follows `templates/model-config-output.md`.

## Related skills/commands

- `skills/core/model-aware-config/SKILL.md` — skill backing this command
- `templates/model-config-output.md` — standard output template
- `templates/model-profiles.json` — model profile data
- `schemas/model-profile-registry.json` — profile/task-risk schema and defaults
- `commands/vibe-adaptive-prompt.md` — task-type quality pack selection
- `commands/vibe-model-weakness.md` — model-specific weakness checks
- `skills/core/quality-engine/SKILL.md` — run selected gates
