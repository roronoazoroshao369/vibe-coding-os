# vibe-brief

## Purpose

Create a compact implementation brief that gives an executor enough verified context to
implement one task or a tightly related task group without guessing or expanding scope.

## When to use

Use after spec, plan, and tasks exist, before implementation starts, when the work is
medium/large/risky, delegated to another agent, or dependent on several files or patterns.
Skip for tiny edits where intent, files, and verification are obvious.

## Required inputs

- Accepted spec with observable acceptance criteria.
- Agreed plan with technical context and rollback notes.
- Task list with IDs, dependencies, status, and target files.
- Relevant repo examples or patterns to follow.

## Step-by-step behavior

1. Select the next ready task: status is `todo`, `ready`, or blank; dependencies are done; no
   exclusive conflict is active.
2. Read the spec, plan, task row, and the closest existing examples.
3. Summarize only task-relevant context; omit broad transcript history.
4. Record source links and acceptance criteria covered.
5. Define the smallest in-scope change and explicit non-goals.
6. List files to inspect/change, patterns to follow, and constraints that matter.
7. Add verification commands with expected results.
8. Save the brief using `templates/implementation-brief-template.md`.

## Outputs

An implementation brief with source traceability, objective, scope, repo context, required
changes, verification, risks, rollback, and open questions.

## Stopping conditions

Stop and ask when no task is ready, dependencies are unclear, source artifacts disagree, or
an open question would change the implementation.

## Verification checklist

- [ ] Brief maps to one task or one cohesive task group.
- [ ] Acceptance criteria and source artifacts are cited.
- [ ] Scope and non-goals prevent drift.
- [ ] Repo patterns/examples are named.
- [ ] Verification command and expected result are explicit.

## Related skills/templates

- `templates/implementation-brief-template.md`
- `templates/tasks-template.md`
- `skills/core/task-state-tracking/SKILL.md`
- `skills/core/checkpoint-validation/SKILL.md`

## Handoffs / next-step suggestion

After the brief is complete:

- Open questions remain → resolve them before coding.
- Brief is complete and readiness gate is clear → `commands/vibe-implement.md`.
- Brief exposed missing acceptance criteria or missing tasks → return to `commands/vibe-specify.md`,
  `commands/vibe-plan.md`, or `commands/vibe-tasks.md` as needed.

## Ghi chú tiếng Việt

Tạo implementation brief sau spec/plan/tasks: chọn task sẵn sàng, gom ngữ cảnh vừa đủ,
truy vết AC, khóa scope, nêu file/pattern cần theo, lệnh verify, rủi ro và rollback. Không
biến brief thành runtime/CLI hay hệ thống automation.
