# Feature: Spec-driven development

## Goal

Define how Vibe Coding OS supports spec-driven development as an original local capability:
specifications are the central, testable artifact that drives planning, tasks, and
implementation, while learning from tracked references.

## Reference sources

- github/spec-kit (primary)
- affaan-m/ECC

## Local implementation

- `CONSTITUTION.md`
- `docs/specs/README.md`, `docs/workflows/spec-driven-development.md`
- `templates/spec-template.md`, `templates/plan-template.md`, `templates/tasks-template.md`, `templates/checkpoint-template.md`
- `skills/core/spec-first-development/SKILL.md`, `skills/core/what-before-how/SKILL.md`, `skills/core/plan-from-spec/SKILL.md`, `skills/core/task-breakdown-from-plan/SKILL.md`, `skills/core/checkpoint-validation/SKILL.md`
- `commands/vibe-specify.md`, `commands/vibe-plan-from-spec.md`, `commands/vibe-tasks.md`, `commands/vibe-implement-from-tasks.md`

## Applied upstream ideas

- Specification as the central artifact.
- Phase ordering: constitution → specify → plan → tasks → implement.
- What-before-how discipline and an implementation-readiness gate.

## Not applied upstream ideas

- Specify CLI as a hard dependency.
- Upstream command names as mandatory.
- Copying upstream templates or prompt text.

## Must-have behavior

- Intent is converted into goals, non-goals, constraints, and acceptance criteria.
- Implementation does not begin until material ambiguity is resolved or recorded and the readiness gate clears.
- Specs stay compact and testable.

## Failure modes

- Copying upstream wording instead of adapting the idea.
- Adding process overhead that does not improve local outcomes.
- Letting a feature become stale because mappings and changelogs are not updated.
- Treating reference popularity as proof that the pattern fits this project.

## Update signals

- A tracked source changes its workflow model, command names, or recommended practices.
- Local users repeatedly hit ambiguity, verification gaps, or memory staleness related to this feature.
- A local skill, command, or template changes enough that mappings need to be refreshed.

## Evaluation ideas

- Can an agent find the relevant local files from this feature document in under a minute?
- Does the feature reduce mistakes without adding unnecessary ceremony?
- Are acceptance criteria, verification, and attribution implications visible?

## Ghi chú tiếng Việt

Spec-driven development: đặc tả là tài liệu trung tâm, đi qua các pha constitution →
specify → plan → tasks → implement, làm rõ "cái gì" trước "làm thế nào", và có cổng sẵn
sàng triển khai. Học ý tưởng từ `github/spec-kit`, không copy template/CLI, không bắt buộc
Specify CLI.
