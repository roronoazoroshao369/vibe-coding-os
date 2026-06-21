# Spec-Driven Development Workflow

## Purpose

Make specifications the central, executable artifact that drives planning, tasks, and
implementation in Vibe Coding OS, adapting ideas from `github/spec-kit` without copying
its templates or requiring the Specify CLI.

## When to use

Use for any non-trivial work: new features, behavior changes, public APIs, data changes,
or risky refactors. Skip the heavier phases for tiny, obvious edits.

## Step-by-step workflow

1. **Constitution** — Confirm or establish project principles (`skills/core/project-constitution/SKILL.md`).
2. **Specify** — Write the spec with goals, non-goals, user scenarios, and observable acceptance criteria; apply what-before-how.
3. **Checkpoint** — Clear the spec gate (acceptance criteria observable, assumptions recorded).
4. **Plan** — Turn the spec into a plan with separated technical context and spec traceability.
5. **Tasks** — Decompose the plan into ordered tasks with dependencies, parallel markers, and test-first ordering.
6. **Readiness gate** — Confirm spec, plan, and tasks are all green before any code.
7. **Implement** — Execute tasks in order; keep edits scoped and verifiable.
8. **Verify** — Run targeted tests and `npm run validate` / `npm run validate:references` as relevant.

## Required inputs

User intent, constraints, the project constitution, and repository conventions.

## Outputs

A spec, a plan, an ordered task list, checkpoint records, and verified implementation.

## Related skills

- `skills/core/project-constitution/SKILL.md`
- `skills/core/spec-first-development/SKILL.md`, `skills/core/acceptance-criteria/SKILL.md`
- `skills/core/plan-from-spec/SKILL.md`, `skills/core/task-breakdown-from-plan/SKILL.md`, `skills/core/dependency-aware-task-ordering/SKILL.md`
- `skills/core/checkpoint-validation/SKILL.md`

## Related commands

- `commands/vibe-constitution.md`, `commands/vibe-spec.md`, `commands/vibe-plan-from-spec.md`, `commands/vibe-tasks.md`, `commands/vibe-implement-from-tasks.md`, `commands/vibe-checkpoints.md`, `commands/vibe-spec-audit.md`

## Applied / Not applied

- Applied: constitution → specify → plan → tasks → implement, what-before-how, readiness gate, checkpoint validation.
- Not applied: Specify CLI dependency, upstream command names, copied templates, agent installer.

## Maintenance notes

Re-audit `github/spec-kit` per `references/mappings/update-impact-map.md`. Keep this doc in
sync with the spec-driven skills and commands. Run validation after edits.

## Ghi chú tiếng Việt

Workflow spec-driven: constitution → specify → plan → tasks → implement, làm rõ "cái gì"
trước "làm thế nào", có cổng sẵn sàng và checkpoint. Học ý tưởng từ `spec-kit`, không copy
template/CLI, không bắt buộc Specify CLI. Chạy `npm run validate` sau khi sửa.
