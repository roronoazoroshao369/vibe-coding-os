---
name: model-weakness-memory
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: core
tags:
  - core
  - memory
status: stable
---

# Skill: Model Weakness Memory

## Purpose

Track known failure patterns for different model types and auto-inject relevant checks before tasks. This skill builds an institutional memory of where models tend to fail — hallucinated imports, incorrect API usage, fragile error handling, off-by-one logic, missing edge cases — and uses that memory to preemptively guard against repeated mistakes.

## When to use

Use when starting any coding task where the model type is known, when reviewing output from a model that has documented weaknesses, after a model-generated failure is identified and wants to be prevented from recurring, or when onboarding a new model and you want to seed initial guardrails. Triggers include "the model keeps getting X wrong", "add a check for the known model weakness", or any post-failure analysis that should feed back into prevention.

## Inputs

- **Model type / provider** — which model generated the code (e.g. `claude-sonnet`, `gpt-4`, `llama-3`, `local-qwen`)
- **Task description** — what the model was asked to do
- **Weakness log** — the current `templates/model-weakness-log.md` or equivalent persisted log
- **Current diff or output** — the code the model produced (optional, for post-task evaluation)

## Workflow

1. **Load the weakness log.** Read `templates/model-weakness-log.md` (or the project-local copy if overridden). If no log exists, start with an empty one.
2. **Match task to weaknesses.** Scan the log for entries whose `Pattern Category` or `Example` relates to the current task. Consider model type, task type (feature, bugfix, refactor, migration), and domain (API, database, frontend, auth, async).
3. **Inject checks.** For each matched weakness, add a specific, actionable check to the task's pre-flight checklist. Example: if the model is known to skip null-checks on database results, add "verify every DB query result is null-checked before use".
4. **Execute the task** with the injected checks visible in the working context. Treat the checks as mandatory quality gates, not suggestions.
5. **Post-task evaluate.** After task completion, compare the output against each injected check. Did any weakness manifest? Did the check prevent a failure?
6. **Update the log.** If a new weakness was observed (not already logged), add an entry. If an existing weakness did not manifest this time, consider adjusting its severity or adding context. Remove entries confirmed obsolete by model updates.

## Outputs

- **Enriched checklist** — the task's pre-flight quality checks, augmented with model-weakness-specific items
- **Optional log update** — new entries or adjustments to `templates/model-weakness-log.md`
- **Post-task report** — which injected checks passed, which caught issues, which were irrelevant

## Failure modes

- Overfitting the log to a single incident without broader pattern confirmation
- Never pruning stale entries when models update and weaknesses are fixed
- Injecting too many checks that overwhelm the task context without prioritization
- Treating the log as definitive truth rather than a living document that needs evidence
- Failing to capture the model type, making future matching impossible

## Verification checklist

- [ ] Weakness log is loaded before task execution begins
- [ ] At least one relevant weakness is matched (or explicit "no matches" noted)
- [ ] Injected checks are specific and actionable, not vague reminders
- [ ] Post-task evaluation compares output against each injected check
- [ ] New weaknesses observed during the task are logged with evidence
- [ ] Log entries include model type, pattern category, and prevention strategy
- [ ] Stale or disproven entries are flagged for review

## Related skills/commands

- `commands/vibe-model-weakness.md` — command entry point for loading weakness log and recommending checks
- `templates/model-weakness-log.md` — the weakness log template
- `skills/core/adaptive-prompt-selection/SKILL.md` — complementary skill for selecting quality packs
- `skills/core/self-review-before-response/SKILL.md` — post-task self-review
- `skills/core/verification-before-done/SKILL.md` — mandatory verification gate
- `skills/prompts/quality-rubric/SKILL.md` — universal quality checks to compose with

## Ghi chú tiếng Việt

Theo dõi các mô hình lỗi đã biết của từng loại model và tự động chèn các kiểm tra liên quan trước mỗi task. Khi model thường mắc lỗi — import giả, sử dụng API sai, xử lý lỗi kém, sai edge-case — skill này ghi lại và ngăn chặn lặp lại. Workflow: tải nhật ký → khớp task với weaknesses → thêm checks → thực thi → đánh giá sau task → cập nhật nhật ký.
