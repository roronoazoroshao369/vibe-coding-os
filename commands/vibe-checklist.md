# vibe-checklist

## Purpose

Generate a requirements-quality checklist — "unit tests for English" — that validates the
spec's requirements for completeness, clarity, consistency, measurability, and coverage. It
checks how the requirements are *written*, not whether the implementation *works*.

## When to use

Use after a spec exists and before implementation, when requirements look vague or risky, or
when a reviewer/QA/release gate needs an explicit requirements-quality pass. Backs
`skills/core/requirements-quality-checklist/SKILL.md`.

## Required inputs

- The spec to check (and plan/tasks if present).
- Project constitution and relevant context.
- The requested focus area and audience (author, reviewer, QA, release), if known.

## Step-by-step behavior

1. Restate the requested focus area. If intent is unclear, ask at most five clarifying
   questions (focus, depth, audience, scope boundaries) and skip any already answered.
2. Load only the spec/plan/tasks sections relevant to the focus area; summarize long
   sections instead of pasting them.
3. Derive the checklist theme (e.g., ux, api, security, performance, accessibility).
4. Write each item as a question about requirement quality, tagged with a dimension
   (Completeness / Clarity / Consistency / Measurability / Coverage / Edge Case) and a
   traceability marker (spec section, or `[Gap]`, `[Ambiguity]`, `[Conflict]`, `[Assumption]`).
5. Group items under dimension headings; number them CHK001, CHK002, ... sequentially.
6. Consolidate near-duplicates; fold many low-impact edge cases into a single coverage item.
7. Save with `templates/requirements-checklist-template.md`. If a checklist of that theme
   already exists, append and continue the numbering rather than overwriting.

## Outputs

A checklist file under the feature's `checklists/` area (or alongside the spec), plus a
summary of focus area, depth, audience, and any must-have items the user named.

## Stopping conditions

Stop and ask when no spec exists, when the focus area is undefined and cannot be inferred,
or when requirements conflict so badly that no meaningful item can be written.

## Verification checklist

- [ ] Every item questions requirement quality, not system behavior.
- [ ] No item begins with Verify / Test / Confirm / Check + behavior.
- [ ] Each item has a dimension tag and (≥80% of items) a traceability marker.
- [ ] Items are grouped by dimension and numbered sequentially.

## Related skills/templates

- `skills/core/requirements-quality-checklist/SKILL.md`, `skills/core/acceptance-criteria/SKILL.md`
- `templates/requirements-checklist-template.md`
- `commands/vibe-analyze.md` for cross-artifact consistency once plan and tasks exist.

## Handoffs / next-step suggestion

After the checklist passes, suggest the likely next command:

- Unresolved gaps in the spec → re-run `commands/vibe-specify.md` to tighten requirements.
- Spec is solid and a plan exists → `commands/vibe-analyze.md` to check spec ↔ plan ↔ tasks alignment.
- No plan yet → `commands/vibe-plan.md`.

## Ghi chú tiếng Việt

Sinh checklist chất lượng yêu cầu ("unit test cho tiếng Anh"): mỗi mục là câu hỏi kiểm tra
yêu cầu có đầy đủ / rõ ràng / nhất quán / đo được / phủ kịch bản hay không — KHÔNG kiểm tra
code chạy đúng. Hỏi tối đa năm câu làm rõ, gắn nhãn chiều chất lượng và tham chiếu spec.
Lưu bằng `templates/requirements-checklist-template.md`, nối tiếp nếu đã có. Gợi ý bước kế
(`vibe-analyze`/`vibe-plan`). Học ý tưởng từ `github/spec-kit` (MIT, GitHub, Inc.), viết lại
nguyên bản, không copy prompt/template/CLI.
