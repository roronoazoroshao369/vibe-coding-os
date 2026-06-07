# Spec to Tasks to Implementation Workflow

## Purpose

Show how an agreed spec becomes an ordered task list and then verified implementation,
with an explicit readiness gate before any code is written.

## When to use

Use after a spec is agreed, especially for multi-file work, parallelizable work, or work
with regression risk.

## Step-by-step workflow

1. **Plan from spec** — Capture technical context and reviewable steps.
2. **Task breakdown** — Convert plan steps into tasks with done conditions and named files.
3. **Dependency ordering** — Build the dependency graph, mark parallel-safe tasks, and sequence tests before implementation.
4. **Readiness gate** — Confirm spec, plan, and tasks are green (`skills/core/checkpoint-validation/SKILL.md`).
5. **Implement** — Execute tasks in order; write the test task first, then make it pass.
6. **Per-task checkpoint** — Verify each task's done condition before moving on.
7. **Final verification** — Run targeted tests and `npm run validate` / `npm run validate:references`.

## Required inputs

The agreed spec, acceptance criteria, and repository conventions.

## Outputs

An ordered task list, checkpoint records, and verified implementation.

## Related skills

- `skills/core/plan-from-spec/SKILL.md`, `skills/core/task-breakdown-from-plan/SKILL.md`, `skills/core/dependency-aware-task-ordering/SKILL.md`
- `skills/core/test-driven-development/SKILL.md`, `skills/core/checkpoint-validation/SKILL.md`, `skills/core/verification-before-completion/SKILL.md`

## Related commands

- `commands/vibe-tasks.md`, `commands/vibe-implement-from-tasks.md`, `commands/vibe-checkpoints.md`, `commands/vibe-verify.md`

## Applied / Not applied

- Applied: dependency-aware, test-first task ordering and an implementation-readiness gate.
- Not applied: upstream tasks template text, marker syntax verbatim, or Specify CLI.

## Maintenance notes

Keep aligned with `templates/tasks-template.md` and `templates/checkpoint-template.md`.
Update when ordering or gate semantics change.

## Ghi chú tiếng Việt

Spec → tasks → implementation: chia task có thứ tự (depends-on, song song, test trước),
qua cổng sẵn sàng rồi mới code, verify từng task và verify cuối. Học ý tưởng từ `spec-kit`,
không copy template/CLI.
