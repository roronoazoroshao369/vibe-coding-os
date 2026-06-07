# Requirements Checklist: <feature / focus area>

> Ghi chú sử dụng / usage note: Đây là "unit test cho tiếng Anh" — kiểm tra chất lượng yêu
> cầu (cách viết spec), KHÔNG kiểm tra phần code chạy đúng. Học ý tưởng từ `github/spec-kit`
> (MIT, GitHub, Inc.), viết lại nguyên bản, không copy template upstream.

**Purpose**: <what requirement quality this checklist validates>
**Focus area**: <ux / api / security / performance / accessibility / ...>
**Audience**: <author / reviewer / QA / release>
**Spec**: <path to the spec being checked>
**Created**: <date>

<!--
  Each item is a QUESTION about requirement quality, tagged with a dimension and a
  traceability marker. Dimensions: Completeness, Clarity, Consistency, Measurability,
  Coverage, Edge Case. Markers: a spec section reference, or [Gap], [Ambiguity],
  [Conflict], [Assumption]. Do NOT write implementation/QA checks here.
-->

## Requirement Completeness

- [ ] CHK001 Are all necessary requirements documented for <scenario>? [Completeness, Spec §X]
- [ ] CHK002 Is <missing aspect> specified anywhere in the spec? [Gap]

## Requirement Clarity

- [ ] CHK003 Is <vague term> quantified with specific, measurable criteria? [Clarity, Spec §X]

## Requirement Consistency

- [ ] CHK004 Do <requirement A> and <requirement B> agree without conflict? [Consistency]

## Acceptance Criteria & Measurability

- [ ] CHK005 Can <requirement> be objectively verified? [Measurability, Spec §X]

## Scenario Coverage

- [ ] CHK006 Are alternate / exception / recovery flows addressed in requirements? [Coverage]

## Edge Case Coverage

- [ ] CHK007 Is behavior defined for <boundary / failure condition>? [Edge Case, Gap]

## Dependencies & Assumptions

- [ ] CHK008 Is the assumption that <X> is validated or documented? [Assumption]

## Notes

- Mark items complete with `[x]`; record findings inline.
- Resolve a failing item by editing the spec, not by relaxing the question.
- Items are numbered sequentially (CHK###); append new items, never renumber.

## Ghi chú tiếng Việt

Mỗi mục là một câu hỏi kiểm tra chất lượng yêu cầu, gắn nhãn chiều chất lượng
(Completeness / Clarity / Consistency / Measurability / Coverage / Edge Case) và dấu truy
vết (mục spec hoặc `[Gap]`/`[Ambiguity]`/`[Conflict]`/`[Assumption]`). Sửa lỗi bằng cách
chỉnh spec, không hạ tiêu chuẩn câu hỏi. Liên kết:
`skills/core/requirements-quality-checklist/SKILL.md`, `commands/vibe-checklist.md`.
