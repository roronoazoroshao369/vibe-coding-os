---
description: "Execute an implementation brief: load, plan, implement, run validation gates, and iterate until green."
---

# vibe-brief-execute

## Purpose

Execute an existing implementation brief end to end: load the brief, plan the concrete edits,
implement the smallest correct change, run the brief's validation gates, and iterate until
every gate is green before declaring the work complete.

## When to use

Use after `commands/vibe-brief.md` has produced a brief whose confidence score is 7 or higher
and whose readiness gate is clear. Use it when the work is large/risky enough to deserve a
context-rich brief, or when the implementation is delegated to another agent. For a small,
obvious inline change, `commands/vibe-implement.md` is lighter and sufficient.

## Required inputs

- A completed implementation brief (`templates/implementation-brief-template.md`) with
  research findings, examples, validation gates, and a confidence score.
- The cited spec, plan, and tasks the brief traces to.
- Repository instructions, current git status, and the commands behind each validation gate.

## Step-by-step workflow

1. Load the brief. Reread its objective, scope, and non-goals so the change stays bounded.
2. Confirm readiness: confidence score is at least 7 and open questions are resolved. If not,
   return to `commands/vibe-brief.md` and gather the missing context first.
3. Plan the edits. Turn the brief's required-changes table into an ordered, minimal edit list,
   reusing the positive examples and avoiding the negative ones.
4. Implement one slice at a time. Make the smallest correct change that satisfies the relevant
   acceptance criteria; match the patterns named in the research findings.
5. Run the validation gates in order, cheap to expensive, exactly as the brief lists them.
6. Iterate until green. If a gate fails, diagnose the root cause in the implementation (never
   weaken the check), fix it, and re-run the full ordered gate list. Repeat until all pass.
7. Validate against research: cross-check the implementation against the research findings captured in the brief. Confirm that documented edge cases are handled, positive patterns are followed, and known pitfalls are avoided. Record any discrepancies as assumptions discovered.
8. Review the diff for unrelated churn, secrets, attribution issues, and full acceptance
   criteria coverage.
9. Complete: report changed files, gate results, assumptions discovered, and any follow-ups.

## Output format

- **Changes made**: grouped by file or feature, traced to acceptance criteria.
- **Validation gates**: each command run and its result (green / fixed-then-green).
- **Assumptions discovered**.
- **Follow-ups**: only what is intentionally out of scope or blocked.

## Verification expectation

Every validation gate in the brief must pass on a fresh run before completion is claimed. For
structure, command, registry, or reference changes, include `npm run validate` as a gate
unless an environment limitation prevents it; state clearly when a check could not run.

## Stop/ask-clarifying-question condition

Stop and ask when the brief's confidence is below 7, a gate exposes an ambiguity the brief and
plan do not resolve, the implementation would require broad rewrites beyond the brief's scope,
there are unsafe uncommitted user changes, or a gate keeps failing for a reason that points
back to the spec rather than the code.

## Related skills/templates

- `templates/implementation-brief-template.md`
- `commands/vibe-brief.md`
- `commands/vibe-implement.md`
- `skills/core/context-rich-implementation/SKILL.md`
- `skills/core/checkpoint-validation/SKILL.md`
- `skills/core/verification-before-done/SKILL.md`
- `skills/prompts/anti-overengineering/SKILL.md`
- `docs/workflows/context-engineering.md`

## Ghi chú tiếng Việt

Thực thi một implementation brief đã có: nạp brief, xác nhận đủ điều kiện (điểm tự tin ≥ 7,
hết câu hỏi mở), lập danh sách sửa tối thiểu, code từng phần, chạy các cổng kiểm thử theo thứ
tự, và LẶP đến khi tất cả xanh (sửa nguyên nhân gốc trong code, không nới lỏng check). Sau khi
xanh mới báo hoàn tất kèm file đã đổi và kết quả kiểm thử. Không tạo runtime/CLI.
