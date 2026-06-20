---
name: requirements-quality-checklist
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: core
tags:
  - core
  - quality
status: stable
---

# Requirements Quality Checklist

## Purpose

Validate the quality of written requirements before implementation — treat the spec as
English "code" and run unit tests against it. This skill checks whether requirements are
complete, clear, consistent, measurable, and cover the necessary scenarios. It does not
test the implementation.

## When to use

Use after a spec exists and before (or alongside) planning, when requirements feel vague,
when a feature is risky, or when reviewers keep finding gaps late. Compose with
`skills/core/spec-first-development/SKILL.md` and `skills/core/acceptance-criteria/SKILL.md`.

## Inputs

The spec (and plan/tasks if they exist), the project constitution, and the requested focus
area (e.g., UX, API, security, performance, accessibility).

## Core principle: test the requirements, not the implementation

Every item asks whether the requirement is *written well*, never whether the code *works*.

- Wrong (implementation test): "Verify the upload button works." / "Test that the API returns 200."
- Right (requirements test): "Are file-size and type limits specified for uploads? [Completeness]" /
  "Is the error response defined for each failure mode? [Coverage, Gap]"

If an item starts with Verify / Test / Confirm / Check + system behavior, it belongs in QA,
not in this checklist.

## Quality dimensions

Group checklist items by these dimensions:

- **Completeness** — are all necessary requirements present?
- **Clarity** — are requirements specific and unambiguous (vague terms quantified)?
- **Consistency** — do requirements agree with each other, with no conflicts?
- **Measurability** — can each requirement be objectively verified?
- **Coverage** — are primary, alternate, exception, recovery, and non-functional scenarios addressed?
- **Edge cases** — are boundary and failure conditions defined?

## Workflow

1. Confirm intent. Ask at most five clarifying questions to fix the checklist's focus,
   depth, and audience; skip any question already answered. (See
   `skills/core/clarify-before-code/SKILL.md`.)
2. Load only the relevant spec/plan/tasks sections for the chosen focus area.
3. Generate items as questions about requirement quality, each tagged with a dimension and a
   traceability marker: a spec section reference, or `[Gap]`, `[Ambiguity]`, `[Conflict]`,
   or `[Assumption]`.
4. Group items under dimension headings; number them sequentially (CHK001, CHK002, ...).
5. Merge near-duplicates; if low-impact edge cases pile up, fold them into one coverage item.
6. Save using `templates/requirements-checklist-template.md`. Append to an existing checklist
   rather than overwriting; continue the numbering.
7. Resolve findings by sharpening the spec, then re-run if needed.

## Outputs

A requirements-quality checklist file (questions, dimensions, traceability markers) plus a
short summary of focus area, depth, and any must-have items the user requested.

## Failure modes

- Writing implementation/QA checks instead of requirements-quality questions.
- Items with no traceability marker (aim for ≥80% referencing a section or marker).
- Overwriting an existing checklist instead of appending.
- Hallucinating requirements that the spec never states; flag gaps instead.

## Verification checklist

- [ ] Every item questions requirement quality, not system behavior.
- [ ] Each item carries a dimension tag and a traceability marker.
- [ ] Items are grouped by quality dimension and numbered sequentially.
- [ ] Findings map back to concrete spec edits.

## Spec-driven development layer (github/spec-kit inspiration)

This skill adapts the "checklists as unit tests for English" idea from `github/spec-kit`
(MIT, GitHub, Inc.) as original wording. No upstream prompt text, template, or CLI is
vendored, and no upstream command names are required. Backing command:
`commands/vibe-checklist.md`. Template: `templates/requirements-checklist-template.md`.
Related: `commands/vibe-analyze.md` for cross-artifact consistency once a plan and tasks exist.

### Ghi chú tiếng Việt

Coi spec như "mã viết bằng tiếng Anh" và viết "unit test" cho nó: mỗi mục là một câu hỏi
kiểm tra chất lượng yêu cầu (đầy đủ / rõ ràng / nhất quán / đo được / phủ kịch bản / biên),
KHÔNG kiểm tra phần code chạy đúng hay sai. Mỗi mục gắn nhãn chiều chất lượng và tham chiếu
mục spec hoặc dấu `[Gap]`/`[Ambiguity]`/`[Conflict]`/`[Assumption]`. Học ý tưởng từ
`github/spec-kit` (MIT, GitHub, Inc.), viết lại nguyên bản, không copy template/prompt/CLI.
