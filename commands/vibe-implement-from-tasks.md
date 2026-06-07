# vibe-implement-from-tasks

## Purpose

Execute an ordered task list into verified implementation, but only after the
implementation-readiness gate clears.

## When to use

Use after tasks are ordered and the spec, plan, and tasks have passed their checkpoints.

## Required inputs

- The ordered task list with dependencies and markers.
- The spec and plan.
- Passed checkpoint records for spec, plan, and tasks.

## Step-by-step behavior

1. Confirm the readiness gate: spec, plan, and tasks are all green. If not, stop.
2. Pick the next task whose dependencies are satisfied.
3. For a test-first task, write the test and confirm it fails for the right reason.
4. Implement the smallest change to satisfy the task's done condition.
5. Run the task's verification; confirm the done condition is met.
6. Record a per-task checkpoint and move to the next task.
7. After all tasks, run final verification and report status honestly.

## Outputs

Verified implementation, per-task checkpoint records, and a final verification report.

## Stopping conditions

Stop when the readiness gate is not clear, when a task's dependencies are unmet, when a
verification fails and cannot be resolved, or when implementation would contradict the
spec.

## Verification checklist

- [ ] The implementation-readiness gate was confirmed before coding.
- [ ] Tasks executed in dependency order.
- [ ] Each task's done condition was verified.
- [ ] Final `npm run validate` / targeted tests were run and reported.

## Related skills/templates

- `skills/core/checkpoint-validation/SKILL.md`, `skills/core/plan-driven-execution/SKILL.md`, `skills/core/test-driven-development/SKILL.md`, `skills/core/verification-before-completion/SKILL.md`
- `templates/checkpoint-template.md`

## Ghi chú tiếng Việt

Chỉ code sau khi cổng sẵn sàng (spec/plan/tasks đều đạt). Làm theo thứ tự phụ thuộc, test
trước, verify từng task và verify cuối, báo cáo trung thực. Học ý tưởng từ `spec-kit`,
không bắt buộc Specify CLI.
