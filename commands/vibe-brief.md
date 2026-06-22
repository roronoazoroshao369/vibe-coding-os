---
description: "Create a compact implementation brief with scoped context, examples, and validation gates."
---

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
2. Research before writing: read the spec, plan, task row, and the closest existing code.
   Identify the patterns this repo already uses (naming, error handling, imports, test
   layout) and the file(s) that demonstrate them best.
3. Gather documentation: collect the few doc links or local references that actually settle a
   decision (API contract, library behavior, prior ADR). Note the exact section, not just the
   home page. Skip links that do not change the implementation.
4. Summarize only task-relevant context; omit broad transcript history.
5. Record source links and acceptance criteria covered.
6. Synthesize research findings into design decisions before defining the change: map each finding to what it means for the implementation, resolve any contradictions between sources, and record which patterns to follow or avoid.
7. Define the smallest in-scope change and explicit non-goals.
8. List files to inspect/change, patterns to follow, and constraints that matter.
9. Select examples to mimic — positive prior art to copy and negative patterns to avoid —
   with file paths and a one-line reason for each.
10. Define validation gates: the ordered, executable checks that must pass, each with an
    observable pass condition, plus the iterate-until-green expectation.
11. Self-score confidence (1-10) that the brief is sufficient for a one-pass, validation-green
    implementation. If the score is below 7, list the missing context and gather it before
    handing the brief off.
12. Save the brief using `templates/implementation-brief-template.md`.

## Outputs

An implementation brief with source traceability, objective, scope, research findings,
examples to mimic (positive and negative), required changes, validation gates, risks,
rollback, open questions, and a confidence score with rationale.

## Stopping conditions

Stop and ask when no task is ready, dependencies are unclear, source artifacts disagree, an
open question would change the implementation, or the confidence score stays below 7 because
required context cannot be gathered locally.

## Verification checklist

- [ ] Brief maps to one task or one cohesive task group.
- [ ] Acceptance criteria and source artifacts are cited.
- [ ] Scope and non-goals prevent drift.
- [ ] Research findings name real repo patterns and the docs that settle decisions.
- [ ] Positive and negative examples are named with file paths.
- [ ] Validation gates are executable, ordered, and have observable pass conditions.
- [ ] Confidence score is recorded with rationale; if below 7, gaps are listed.

## Related skills/templates

- `templates/implementation-brief-template.md`
- `templates/tasks-template.md`
- `skills/core/context-rich-implementation/SKILL.md`
- `skills/core/task-state-tracking/SKILL.md`
- `skills/core/checkpoint-validation/SKILL.md`
- `docs/workflows/context-engineering.md`

## Handoffs / next-step suggestion

After the brief is complete:

- Open questions remain or confidence is below 7 → gather missing context before coding.
- Brief is complete and readiness gate is clear → `commands/vibe-brief-execute.md` to load,
  implement, and validate, or `commands/vibe-implement.md` for a smaller inline change.
- Brief exposed missing acceptance criteria or missing tasks → return to `commands/vibe-spec.md`,
  `commands/vibe-plan.md`, or `commands/vibe-tasks.md` as needed.

## Ghi chú tiếng Việt

Tạo implementation brief sau spec/plan/tasks: chọn task sẵn sàng, NGHIÊN CỨU trước (đọc code,
tìm pattern repo, gom tài liệu cần thiết), gom ngữ cảnh vừa đủ, truy vết AC, khóa scope, nêu
ví dụ nên bắt chước và ví dụ cần tránh, đặt cổng kiểm thử chạy được (lặp đến khi xanh), và
TỰ CHẤM độ tự tin 1-10. Nếu dưới 7, bổ sung ngữ cảnh còn thiếu trước khi giao. Không biến
brief thành runtime/CLI hay hệ thống automation.
