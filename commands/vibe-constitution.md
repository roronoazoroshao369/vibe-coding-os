# vibe-constitution

## Purpose

Create or update the project constitution: a short, durable set of governing principles
that constrain spec, plan, tasks, and implementation.

## When to use

Use when bootstrapping a project, when recurring trade-off disagreements reveal a missing
principle, or when the constitution is stale relative to how the project actually works.

## Required inputs

- Project goals and non-negotiable constraints (quality, simplicity, verification, privacy, attribution, maintainability).
- Existing `CONSTITUTION.md` if updating.
- `templates/constitution-template.md`.

## Step-by-step behavior

1. Read the existing `CONSTITUTION.md`; otherwise start from the template.
2. Draft 4–9 principles, each short, testable, with a one-line rationale.
3. For each principle, note how it is enforced (review, validation, gate).
4. State explicit non-goals and a priority order for resolving conflicts.
5. Cross-link the spec, plan, and checkpoint skills that enforce the principles.
6. Save `CONSTITUTION.md` and keep it under ~2 pages.

## Outputs

An updated `CONSTITUTION.md` with numbered principles, rationale, enforcement, non-goals,
and conflict priority.

## Stopping conditions

Stop and ask when principles conflict with no resolution, when a requested principle cannot
be enforced or verified, or when the constitution would contradict repository policy.

## Verification checklist

- [ ] Each principle is short and testable.
- [ ] Each principle names how it is enforced.
- [ ] Non-goals and conflict priority are explicit.
- [ ] Run `npm run validate` after structural changes.

## Related skills/templates

- `skills/core/project-constitution/SKILL.md`
- `templates/constitution-template.md`
- `docs/workflows/constitution-to-spec-to-plan.md`

## Ghi chú tiếng Việt

Tạo/cập nhật hiến chương dự án: 4–9 nguyên tắc ngắn, kiểm chứng được, mỗi nguyên tắc nêu
cách thực thi, có non-goals và thứ tự ưu tiên. Học ý tưởng từ `spec-kit`, không copy
định dạng/CLI. Chạy `npm run validate` sau khi sửa.
