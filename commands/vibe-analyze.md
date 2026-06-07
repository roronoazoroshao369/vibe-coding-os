---
description: "Check spec, plan, and tasks for cross-artifact consistency before implementation."
---

# vibe-analyze

## Purpose

Run a non-destructive, cross-artifact consistency gate before implementation. Compare the
spec, plan, and tasks against each other to find inconsistencies, duplications, ambiguities,
coverage gaps, and constitution conflicts. This is a read-only analysis that produces a
report — it never edits the artifacts.

## When to use

Use after tasks have been generated and before implementation begins, as the bridge between
single-artifact quality checks (`commands/vibe-spec-audit.md`,
`skills/core/requirements-quality-checklist/SKILL.md`) and the implementation-readiness gate
(`skills/core/checkpoint-validation/SKILL.md`). Run it whenever spec, plan, and tasks may
have drifted apart.

## Required inputs

- The spec, the plan, and the tasks list for the same feature.
- The project constitution (`CONSTITUTION.md` or the project's principles file).

## Step-by-step behavior

1. Confirm all three artifacts exist. If any is missing, stop and name the command that
   produces it (`vibe-specify`, `vibe-plan`, or `vibe-tasks`).
2. Load only the high-signal sections: requirements and acceptance criteria from the spec;
   architecture, phases, and constraints from the plan; task IDs, descriptions, parallel
   markers, and referenced files from the tasks.
3. Build a lightweight model: a requirements inventory (stable keys), a task→requirement
   coverage map, and the constitution's MUST/SHOULD rules.
4. Run detection passes:
   - **Duplication** — near-duplicate requirements or tasks.
   - **Ambiguity** — vague terms (fast, scalable, secure, intuitive) without measurable
     criteria; unresolved placeholders (TODO, ???, `<placeholder>`).
   - **Underspecification** — requirements with no measurable outcome; tasks referencing
     files/components absent from spec or plan.
   - **Coverage gaps** — requirements with zero tasks; tasks with no mapped requirement.
   - **Inconsistency** — terminology drift, entities in the plan but not the spec (or vice
     versa), task-ordering contradictions, conflicting technical choices.
   - **Constitution alignment** — anything conflicting with a MUST principle.
5. Assign severity: CRITICAL (constitution MUST violation, or uncovered requirement that
   blocks baseline behavior), HIGH (conflicting/duplicate requirement, untestable criterion),
   MEDIUM (terminology drift, missing non-functional coverage), LOW (wording/redundancy).
6. Produce a compact report (see output). Keep it deterministic: re-running with no changes
   should yield the same finding IDs and counts.
7. Offer — but do not apply — remediation suggestions for the top issues.

## Output format

A Markdown report (no file writes) containing:

- **Findings table**: ID | Category | Severity | Location(s) | Summary | Recommendation.
  Cap at the highest-signal findings; summarize any overflow.
- **Coverage summary**: each requirement key, whether it has a task, and the task IDs.
- **Constitution alignment issues** (if any).
- **Unmapped tasks** (if any).
- **Metrics**: total requirements, total tasks, coverage %, ambiguity count, duplication
  count, critical-issue count.
- **Next actions**: whether CRITICAL issues block implementation, and which command to run
  to fix each class of issue.

## Operating constraints

- Strictly read-only: do not modify spec, plan, tasks, or any file.
- Do not invent missing sections — report them as absent.
- Constitution conflicts are always CRITICAL and require fixing the artifact, not
  reinterpreting the principle.
- Report zero issues gracefully with a success summary and coverage stats.

## Stopping conditions

Stop and ask when one of the three artifacts is missing, when the constitution cannot be
located, or when the artifacts disagree so fundamentally that analysis cannot proceed.

## Verification checklist

- [ ] All three artifacts were loaded (or missing ones reported).
- [ ] Findings carry a category, severity, and location.
- [ ] Coverage maps every requirement to its tasks (or flags the gap).
- [ ] No files were modified.

## Related skills/templates

- `skills/core/checkpoint-validation/SKILL.md`, `skills/core/requirements-quality-checklist/SKILL.md`
- `commands/vibe-spec-audit.md` (single-artifact spec quality), `commands/vibe-checklist.md`
- `templates/spec-audit-template.md` for a comparable report layout.

## Handoffs / next-step suggestion

- CRITICAL or HIGH findings → re-run `commands/vibe-specify.md`, `commands/vibe-plan.md`, or
  edit tasks to close the gap, then re-run `vibe-analyze`.
- Only LOW/MEDIUM findings → proceed to `skills/core/checkpoint-validation/SKILL.md` (the
  implementation-readiness gate), then `commands/vibe-implement.md`.

## Ghi chú tiếng Việt

Cổng kiểm tra nhất quán chéo, chỉ đọc (không sửa file): đối chiếu spec ↔ plan ↔ tasks để tìm
trùng lặp, mơ hồ, thiếu đặc tả, lỗ hổng phủ (yêu cầu không có task / task không gắn yêu cầu),
mâu thuẫn, và vi phạm constitution (luôn là CRITICAL). Xuất báo cáo có bảng findings, bản đồ
phủ, số liệu, và bước kế; không tự động sửa. Khác với `vibe-spec-audit` (chỉ xét một spec).
Học ý tưởng từ `github/spec-kit` (MIT, GitHub, Inc.), viết lại nguyên bản, không copy
prompt/template/CLI.
