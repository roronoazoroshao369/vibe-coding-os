---
title: Spec Audit: <scope / date>
type: template
name: spec-audit-template
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: spec
tags:
  - template
  - specification
status: stable
---

# Spec Audit: <scope / date>

> Vietnamese usage note / Ghi chú sử dụng: Dùng để kiểm tra chất lượng spec và template:
> đủ mục bắt buộc, tiêu chí chấp nhận quan sát được, non-goals, assumptions, và cổng
> verification. Học ý tưởng từ `github/spec-kit`, không copy template upstream.

## Scope

Which specs and templates were audited, and why.

## Required sections checklist

For each audited spec:

| Spec | Goals | Non-goals | Scenarios | Acceptance criteria | Assumptions | Verification | Result |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `<path>` | ✓/✗ | ✓/✗ | ✓/✗ | ✓/✗ | ✓/✗ | ✓/✗ | pass / fail |

## Findings

| Spec | Gap | Severity | Recommended fix |
| --- | --- | --- | --- |
| `<path>` | <missing/weak section> | high/med/low | <concrete fix> |

## Acceptance criteria quality

- [ ] Criteria are observable and tech-agnostic.
- [ ] Edge cases and errors are covered.

## Template recommendations

- <Systemic gaps that warrant a template change, if any.>

## Non-goals

- <What this audit did not cover.>

## Assumptions

- <Assumptions made during the audit.>

## Verification gates

- [ ] Every required section was checked.
- [ ] Findings include concrete fixes.
- [ ] Template changes (if any) are recorded.

## Ghi chú tiếng Việt

Audit spec/template: kiểm đủ mục bắt buộc, tiêu chí quan sát được, non-goals, assumptions,
cổng verification; ghi gap kèm cách sửa và đề xuất sửa template nếu gap mang tính hệ thống.
Liên kết: `skills/meta/write-reusable-skill/SKILL.md`.
