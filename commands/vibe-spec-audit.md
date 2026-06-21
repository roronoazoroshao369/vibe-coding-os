---
description: "Audit specs and templates for required sections, observable criteria, and verification gates."
---

# vibe-spec-audit

## Purpose

Audit one or more specs (and the spec/plan/tasks templates) for quality: required sections,
observable acceptance criteria, non-goals, assumptions, and verification gates.

## When to use

Use periodically, before a major implementation, or when specs repeatedly miss sections or
ship with weak acceptance criteria.

## Required inputs

- The spec(s) to audit and the relevant templates.
- The required-section list from `skills/meta/write-reusable-skill/SKILL.md`.

## Step-by-step behavior

1. List the required sections a high-quality spec must contain.
2. For each spec, check each required section is present and non-empty.
3. Verify acceptance criteria are observable and tech-agnostic.
4. Confirm non-goals, assumptions, and verification gates are present.
5. Flag missing or weak sections with a concrete fix.
6. Record findings using `templates/spec-audit-template.md`.
7. Optionally revise the templates if a gap is systemic.

## Outputs

A spec-audit record listing each spec's gaps, severity, and recommended fixes.

## Stopping conditions

Stop and escalate when a spec is fundamentally unverifiable, when criteria conflict, or
when a template change is needed that affects many specs.

## Verification checklist

- [ ] Each required section was checked.
- [ ] Acceptance criteria are observable.
- [ ] Non-goals, assumptions, and gates are present.
- [ ] Findings include concrete fixes.

## Related skills/templates

- `skills/meta/write-reusable-skill/SKILL.md`, `skills/core/acceptance-criteria/SKILL.md`
- `templates/spec-audit-template.md`

## Ghi chú tiếng Việt

Audit spec và template: kiểm tra đủ mục bắt buộc, tiêu chí chấp nhận quan sát được,
non-goals, assumptions, và cổng verification; ghi gap kèm cách sửa. Học ý tưởng từ
`spec-kit`, không copy template upstream.
