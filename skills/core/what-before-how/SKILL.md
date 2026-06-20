---
name: what-before-how
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: core
tags:
  - core
status: stable
---

# What Before How

## Purpose

Keep the discipline of agreeing on user-visible behavior and acceptance criteria (the
"what") before choosing technology, libraries, or implementation structure (the "how").

## When to use

Use during specification and early planning, whenever a discussion jumps to tools,
frameworks, or code structure before the desired behavior is clear, or when reviewing a
spec that already contains premature technical decisions.

## Inputs

The user request, the draft or existing spec, known constraints, and any technical
assumptions that have crept in.

## Workflow

1. Restate the desired outcome in user-visible terms: who, what they observe, and why.
2. List acceptance criteria that are observable and testable, independent of technology.
3. Identify and quarantine any "how" content (stack, schema, libraries) into the plan,
   not the spec.
4. Flag premature technical lock-in and ask whether it is a real constraint or an
   assumption.
5. Only after the what is agreed, allow technical-context decisions in the plan phase.

## Outputs

A behavior-focused spec section plus a separate list of deferred technical decisions to
resolve during planning.

## Failure modes

- Acceptance criteria are written in implementation terms.
- A favored technology silently constrains the spec.
- "What" and "how" are mixed, making the spec hard to review or change.

## Verification checklist

- [ ] Acceptance criteria are observable and tech-agnostic.
- [ ] Technical choices are deferred to the plan.
- [ ] Premature lock-ins are flagged as assumptions or real constraints.
- [ ] The spec can be satisfied by more than one implementation.

## Applied / Not Applied

- Applied: the what-before-how discipline from `github/spec-kit`.
- Not applied: upstream phrasing, command names, or template text. The separation is
  enforced locally through the spec and plan skills.

## Ghi chú tiếng Việt

"Cái gì trước, làm thế nào sau": thống nhất hành vi người dùng và tiêu chí chấp nhận
(what) trước khi chọn công nghệ (how). Đẩy mọi quyết định kỹ thuật sang pha plan. Học ý
tưởng từ `spec-kit`, không copy chữ. Liên kết: `skills/core/spec-first-development/SKILL.md`,
`skills/core/plan-from-spec/SKILL.md`.
