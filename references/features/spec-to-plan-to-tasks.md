# Feature: Spec to plan to tasks

## Goal

Define the lifecycle that turns an agreed spec into a verifiable plan and then into
ordered, reviewable tasks, with technical context separated from behavior.

## Reference sources

- github/spec-kit

## Local implementation

- `skills/core/plan-from-spec/SKILL.md`, `skills/core/task-breakdown-from-plan/SKILL.md`, `skills/core/dependency-aware-task-ordering/SKILL.md`
- `commands/vibe-plan-from-spec.md`, `commands/vibe-tasks.md`
- `templates/plan-template.md`, `templates/tasks-template.md`
- `docs/workflows/spec-to-tasks-to-implementation.md`

## Applied upstream ideas

- Spec → plan → tasks ordering.
- Technical context captured in the plan, not the spec.
- Dependency-aware, parallelizable, test-first task decomposition.

## Not applied upstream ideas

- Upstream plan/tasks template text or marker syntax verbatim.
- Specify CLI or upstream command names.

## Must-have behavior

- Every plan step maps to acceptance criteria.
- Every task has a done condition, named files, and explicit dependencies.
- Test tasks precede the implementation tasks they cover.

## Failure modes

- Plan reopens behavioral decisions.
- Tasks are too large or have hidden dependencies.
- Acceptance criteria lack covering tasks.

## Update signals

- Upstream changes its plan/tasks structure or ordering semantics.
- Local tasks repeatedly run out of order or miss criteria.

## Evaluation ideas

- Can a reviewer trace each task back to a criterion?
- Is the dependency graph acyclic and the parallel set conflict-free?

## Ghi chú tiếng Việt

Vòng đời spec → plan → tasks: tách technical context khỏi hành vi, chia task có
`depends-on`, đánh dấu song song, xếp test trước code, và truy vết về tiêu chí chấp nhận.
Học ý tưởng từ `spec-kit`, không copy template/CLI.
