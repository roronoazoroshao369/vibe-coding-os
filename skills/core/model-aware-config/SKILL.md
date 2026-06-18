# Skill: Model-Aware Config

## Purpose

Configure quality gates based on model capability and task risk so the Quality Engine applies proportional verification. Use this skill to translate a model ID, task description, and project config into an explicit gate profile before execution.

## When to use

Use this skill when you need to configure which Quality Engine gates to run based on the model that produced the code and the risk of the task. Common triggers are choosing between `lean`, `standard`, and `heavy` verification, overriding automatic gate selection for a known model or domain, and deciding whether to skip or tighten checks for auth, data, API, frontend state, or migration tasks.

## Inputs

- **Model ID** — the model identifier used for the task, such as `claude-haiku-3.5`, `claude-sonnet`, `gpt-4`, `local-qwen`, or a project-defined alias.
- **Task description** — the requested change or review target, including known domains such as auth, API, database, frontend state, or async jobs.
- **Project config** — model profiles, task-risk rules, quality gate defaults, and project-specific overrides when available.
- **Optional profile override** — `lean`, `standard`, or `heavy` when the operator intentionally overrides automatic selection.

## Outputs

- Selected model profile: `lean`, `standard`, or `heavy`, with rationale.
- Task risk classification: `low`, `medium`, or `high`, with matched risk signals.
- Quality gate selection: required, recommended, and skipped gates.
- Quality Engine execution plan using the selected gates and evidence expectations.
- Review notes for any overrides, missing config, or uncertainty.

## Workflow

1. **Classify task risk.** Read the task description and project context. Treat security, auth, data migrations, production incidents, broad refactors, and irreversible changes as higher risk. Treat docs-only, comments, formatting, and isolated low-impact changes as lower risk.
2. **Select model profile.** Map the model ID to a configured capability profile. If unknown, use `standard` unless project policy says fail closed; raise uncertainty for review.
3. **Combine model capability with risk.** Start from the selected model profile, then increase rigor when task risk is high or when model capability is weaker than the task demands. Respect explicit `--profile` overrides, but record the reason.
4. **Run the adaptive gate selector.** Use the task risk, model profile, domain amplifiers, and project config to choose quality gates. Compose with `adaptive-prompt-selection`, `model-weakness-memory`, and task-specific checklist skills when relevant.
5. **Review selection.** Present the chosen gates, skipped gates, and rationale before execution. Confirm high-risk skips and resolve contradictions such as `lean` profile on security-sensitive work.
6. **Execute Quality Engine.** Run `quality-engine` with the selected gates, profile, task scope, and evidence expectations. Capture pass/warn/fail results and remediation guidance.
7. **Record feedback.** If the run exposes model-specific weakness patterns or inaccurate risk classification, update the appropriate project notes or weakness log.

## Failure modes

- Unknown model ID is silently treated as strong and under-verifies the task.
- Low-risk classification misses hidden security, data, compatibility, or migration impact.
- Profile override is accepted without documenting the risk trade-off.
- Project config is stale, missing, or conflicts with registry paths.
- Gate selector chooses too many checks for a tiny task, causing review fatigue.
- Gate selector skips required project or compliance checks.
- Quality Engine results are treated as final without reviewing warnings and evidence quality.

## Verification checklist

- [ ] Model ID is recorded and matched to a profile, or the unknown-model fallback is explicit.
- [ ] Task risk is classified with concrete signals from the task description or project context.
- [ ] Profile choice reflects both model capability and task risk.
- [ ] Any manual override is documented with rationale and residual risk.
- [ ] Selected gates include domain-specific checks for auth, API, DB migration, frontend state, or async work when applicable.
- [ ] Skipped gates are listed with reasons, especially for medium/high-risk tasks.
- [ ] Quality Engine is executed with the selected gates or a clear blocking reason is reported.
- [ ] Results include pass/warn/fail status, evidence, and next actions.

## Related skills/commands

- `skills/core/quality-engine/SKILL.md`
- `skills/core/adaptive-prompt-selection/SKILL.md`
- `skills/core/model-weakness-memory/SKILL.md`
- `commands/vibe-model-config.md`
