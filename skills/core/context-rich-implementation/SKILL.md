# Context-Rich Implementation

## Purpose

Assemble enough verified context before coding that an executor can finish a task in one pass
with all validation gates green, instead of guessing and iterating blindly. The unit of work
is a context-rich brief: spec links, the research already done, curated examples to mimic and
avoid, executable validation gates, and an honest confidence score.

## When to use

Use for medium, large, or risky work, work delegated to another agent, or any task that spans
several files or repo patterns where missing context would cause rework. Skip it for tiny,
obvious edits where intent, files, and verification are already clear.

## Inputs

- An accepted spec with observable acceptance criteria, plus the agreed plan and task list.
- The closest existing code, repo conventions, and prior art (positive and negative).
- The documentation that settles real decisions for this task.
- The executable checks (lint, type/build, tests, `npm run validate`) that prove correctness.

## Workflow

1. Research first. Read the spec/plan/task and the nearest existing code; identify the
   patterns this repo already uses and the files that best demonstrate them.
2. Gather only decision-changing documentation, citing the exact section.
3. Curate examples: positive prior art to copy and negative patterns to avoid, each with a
   path and a one-line reason.
4. Define validation gates as ordered, executable commands with observable pass conditions.
5. Write the brief from `templates/implementation-brief-template.md`, keeping scope minimal
   and traced to acceptance criteria.
6. Self-score confidence 1-10. If below 7, gather the missing context before handing off.
7. Execute the brief (`commands/vibe-brief-execute.md`): implement the smallest correct
   change, then run the gates and iterate until every one is green, fixing root causes in the
   code rather than weakening checks.

## Outputs

- A completed context-rich brief with research findings, examples, validation gates, and a
  confidence score with rationale.
- An implementation whose every validation gate passes on a fresh run, with results reported.

## Failure modes

- Skipping research and re-deriving patterns the repo already establishes.
- Listing documentation links that do not change any decision (context bloat).
- Naming only positive examples, so known-bad patterns get repeated.
- Vague validation gates with no command or no observable pass condition.
- Editing a failing check to make it pass instead of fixing the implementation.
- Inflating the confidence score to avoid gathering missing context.
- Letting the brief grow into a runtime or CLI; it is markdown guidance only.

## Verification checklist

- [ ] Research findings name real repo patterns and the docs that settle decisions.
- [ ] Examples include both positive (mimic) and negative (avoid) entries with paths.
- [ ] Validation gates are executable, ordered, and have observable pass conditions.
- [ ] Confidence score is recorded with rationale; below 7 lists the missing context.
- [ ] Implementation iterated until all gates are green, with results reported.

## Applied / Not Applied

- Applied: context-rich brief (spec + curated examples + doc links + executable validation
  gates), iterate-until-green validation loop, and confidence self-scoring, adapted from
  `coleam00/context-engineering-intro` in original wording.
- Not applied: any PRP-runner tooling, command-runner scripts, or upstream prompt/template
  text. Gates are plain local commands composed with `npm run validate` where relevant.

## Ghi chú tiếng Việt

Gom đủ ngữ cảnh đã kiểm chứng trước khi code để executor làm một lần là xanh: nghiên cứu
trước, gom tài liệu cần thiết, tuyển ví dụ nên bắt chước và ví dụ cần tránh, đặt cổng kiểm
thử chạy được, viết brief tối thiểu truy vết AC, và tự chấm tự tin 1-10 (dưới 7 thì bổ sung
ngữ cảnh). Khi thực thi, lặp đến khi mọi cổng xanh, sửa nguyên nhân gốc trong code chứ không
nới lỏng check. Đây là hướng dẫn markdown, không phải runtime/CLI. Liên kết:
`templates/implementation-brief-template.md`, `commands/vibe-brief.md`,
`commands/vibe-brief-execute.md`, `docs/workflows/context-engineering.md`.
