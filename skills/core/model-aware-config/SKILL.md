---
name: model-aware-config
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: core
tags:
  - core
status: stable
---

# Skill: Model-Aware Config

## Purpose

Select model-aware quality packs and checks by combining the current `model_id`, the task type, stack/domain signals, the model profile registry, and known model weakness memory. Use this skill before implementation or review so the prompt stack is proportional to both task risk and model capability.

## When to use

Use at the start of any coding or review task when the model is known and you want tailored quality-pack advice instead of a generic checklist. Common triggers include:

- choosing quality packs for a specific model such as `claude-sonnet-4`, `gpt-4o-mini`, `llama-3-70b`, or `hermes-3`;
- inspecting whether a model should use `lean`, `standard`, or `heavy` verification for a task;
- adapting `adaptive-prompt-selection` recommendations for a model's capability tier;
- adding extra guardrails for known model weaknesses before execution;
- preparing a `vibe-model-config` output for handoff to Quality Engine or manual review.

## Inputs

- **model_id** — required model identifier, matched against `templates/model-profiles.json` or the default profiles in `schemas/model-profile-registry.json`.
- **task_type** — one of the known task-risk profile keys such as `feature`, `bugfix`, `refactor`, `security`, `migration`, or `init`.
- **stack** — task stack/domain signals such as API, database, auth, frontend state, async jobs, CLI, docs, testing, or project-specific technologies.
- **Task description / changed files** — optional context used to refine task type and domain amplifiers.
- **Weakness log** — `templates/model-weakness-log.md` or project-local equivalent, used by `skills/core/model-weakness-memory/SKILL.md`.

## Workflow

1. **Lookup profile.** Normalize `model_id` and find the matching model profile in `templates/model-profiles.json`; if unavailable, use the default examples in `schemas/model-profile-registry.json`. Record `vendor`, `name`, `capability`, `qualityStack`, and `advisoryLevel`. If unknown, fall back to `standard` quality stack and raise a warning note.
2. **Lookup task risk.** Match `task_type` to `taskRiskProfiles` in `schemas/model-profile-registry.json`. Record `risk`, `minQualityStack`, and `requiredGates`. If the supplied task type is uncertain, use `skills/core/adaptive-prompt-selection/SKILL.md` to classify it or ask for clarification.
3. **Select quality packs.** Start with the adaptive prompt matrix for the task type, then add domain amplifiers from `stack`:
   - API changes → API quality pack.
   - Database schema/data changes → DB migration quality pack.
   - Auth/session/permission changes → Auth quality pack.
   - Frontend state/navigation changes → Frontend state quality pack.
   - Async/queue/retry changes → Async jobs quality pack.
   - Any non-trivial task → Self-review and verification packs.
4. **Adjust for model capability.** Compare model `qualityStack` with task `minQualityStack`; choose the stricter stack (`lean` < `standard` < `heavy`). High-risk task types (`security`, `migration`) must not be reduced below `heavy` without an explicit warning and human approval. Medium/low capability models should receive more explicit checklists and narrower implementation steps.
5. **Check model weakness.** Load `templates/model-weakness-log.md` and apply `skills/core/model-weakness-memory/SKILL.md`: match by model/provider and stack/task domain, then add actionable prevention checks to the tailored checklist. State "no weakness matches found" when none apply.
6. **Compose output.** Use `templates/model-config-output.md` to report model info, capabilities, selected stack, recommended quality packs, required gates, warning notes, and a tailored checklist.
7. **Confirm before execution.** For medium/high-risk work, ask the user or orchestrator to confirm the recommended packs before loading them. For overrides, document rationale and residual risk.

## Outputs

- **Recommended quality packs** — prioritized list of pack/skill names and paths, including task-type packs and stack/domain amplifiers.
- **Warning notes** — unknown model fallback, task-type uncertainty, quality-stack escalation, skipped gates, missing weakness log, or unsafe overrides.
- **Tailored checklist** — concrete pre-flight/review checks combining model capability, required gates, stack-specific risks, and matched weakness-memory prevention checks.

## Failure modes

- Treating an unknown model as high capability and under-verifying the task.
- Selecting packs only from task type while ignoring stack/domain amplifiers.
- Ignoring `minQualityStack` for high-risk security or migration work.
- Loading weakness memory but failing to convert matches into actionable checks.
- Producing a checklist without model profile evidence or rationale.
- Overloading tiny low-risk tasks with heavy packs when no risk signal justifies it.

## Verification checklist

- [ ] `model_id`, `task_type`, and `stack` are recorded.
- [ ] Model profile lookup result is shown, or unknown-model fallback is explicit.
- [ ] Task risk and minimum quality stack are shown.
- [ ] Recommended packs include task-type base packs plus relevant domain amplifiers.
- [ ] Final quality stack is at least as strict as the task minimum.
- [ ] Weakness memory is checked and matched checks are injected, or "no matches" is stated.
- [ ] Warning notes call out uncertainty, overrides, and skipped required gates.
- [ ] Tailored checklist is actionable enough to execute during review.

## Related skills/commands

- `commands/vibe-model-config.md` — command entry point for model-aware config output
- `templates/model-config-output.md` — standard report template
- `templates/model-profiles.json` — model profile registry data
- `schemas/model-profile-registry.json` — schema and default task-risk profiles
- `skills/core/adaptive-prompt-selection/SKILL.md` — task-type quality pack selection
- `skills/core/model-weakness-memory/SKILL.md` — model-specific weakness checks
- `skills/core/quality-engine/SKILL.md` — executes selected gates
- `skills/core/verification-before-done/SKILL.md` — final verification gate

## Ghi chú tiếng Việt

Skill này tra cứu profile model, chọn quality packs theo task/stack, rồi kiểm tra weakness memory để tạo checklist riêng cho model. Luồng chính: `model_id` → profile/capability → task risk/min stack → adaptive quality packs + domain amplifiers → weakness checks → output theo `templates/model-config-output.md`.
