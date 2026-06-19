---
description: "Load the model weakness log and recommend targeted checks for the current task."
---

# vibe-model-weakness

## Purpose

Guide the agent to load the model weakness log, match known failure patterns against the current task, and produce a targeted set of pre-flight checks to inject before execution.

## When to use

Use before starting any coding task when the model type is known, after a model-generated bug is identified and should be prevented from recurring, or when onboarding a new model. Backs `skills/core/model-weakness-memory/SKILL.md`.

## Required inputs

- Model type or provider (e.g. `claude-sonnet`, `gpt-4`, `llama-3`, `local-qwen`)
- Task description (what the model will be asked to produce)
- Weakness log path (defaults to `templates/model-weakness-log.md`)

## Step-by-step behaviour

1. Confirm the model type and task description with the user if not already clear.
2. Load the weakness log from `templates/model-weakness-log.md` (or a project-local override if present).
3. Scan the log for entries matching the current model type and task domain. Match on `Pattern Category` and `Example` fields.
4. For each matched weakness, formulate a specific, actionable pre-flight check. Example: "Verify all database query results are null-checked before property access."
5. Rank checks by relevance: same model type + same pattern category = high priority; same pattern category different model = medium; inferred risk = low.
6. Output the recommended checks as a numbered list with priority labels.
7. Ask the user to confirm which checks to inject before proceeding with the task.
8. After task completion, prompt the user to evaluate whether any weakness manifested and whether the log should be updated.

## Outputs

A prioritized, actionable checklist of model-weakness-specific pre-flight checks, ready to be composed with the task's other quality gates.

## Stopping conditions

Stop and ask when the model type cannot be determined, when the weakness log does not exist and needs to be created, or when the task description is too vague to match against known patterns.

## Verification checklist

- [ ] Model type is identified and recorded.
- [ ] Weakness log is loaded and scanned.
- [ ] At least one relevant check is recommended, or "no matches" is stated explicitly.
- [ ] Checks are specific and actionable, not generic reminders.
- [ ] Priority labels are assigned based on match strength.
- [ ] User confirms which checks to inject.

## Handoffs / next-step suggestion

- Checks confirmed → compose with the task's quality gates and proceed with implementation.
- New weakness discovered during task → update `templates/model-weakness-log.md` with evidence.
- Log empty → seed with initial entries from post-mortem analysis.

## Related skills/commands

- `skills/core/model-weakness-memory/SKILL.md` — the skill backing this command
- `templates/model-weakness-log.md` — the weakness log template
- `commands/vibe-adaptive-prompt.md` — complementary command for selecting quality packs alongside weakness checks
- `commands/vibe-lessons-learned.md` — cross-reference repeatable pattern fixes
- `skills/core/verification-before-completion/SKILL.md` — verify injected checks passed
- `skills/core/self-review-before-response/SKILL.md` — post-task self-review
