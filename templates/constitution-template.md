---
title: Constitution: <project name>
type: template
name: constitution-template
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: template
tags:
  - template
status: stable
---

# Constitution: <project name>

> Vietnamese usage note / Ghi chú sử dụng: Đây là hiến chương dự án — bộ nguyên tắc ngắn,
> kiểm chứng được, chi phối mọi pha (spec, plan, tasks, implement). Giữ ngắn (~2 trang),
> mỗi nguyên tắc nêu cách thực thi, và có non-goals rõ ràng. Học ý tưởng từ `github/spec-kit`,
> không copy định dạng/CLI upstream.

## Purpose

One or two sentences on what this constitution governs and who it binds.

## Principles

1. **<Principle name>** — <short, testable rule>.
   - Rationale: <one line>.
   - Enforced by: <review / validation / gate>.
2. **<Principle name>** — <rule>.
   - Rationale: <one line>.
   - Enforced by: <mechanism>.

<!-- Aim for 4–9 principles. Example areas: quality, simplicity, verification, attribution, privacy, maintainability, no blind copying, bilingual docs where useful. -->

## Conflict priority

When principles conflict, resolve in this order:

1. <highest-priority principle>
2. <next>
3. <next>

## Non-goals

- <What this constitution deliberately does not do.>
- <Process this project will not adopt.>

## Assumptions

- <Assumptions behind these principles.>

## Acceptance criteria (for the constitution itself)

- [ ] Each principle is short and testable.
- [ ] Each principle names how it is enforced.
- [ ] Non-goals and conflict priority are explicit.

## Verification gates

- [ ] `npm run validate` passes after structural changes.
- [ ] Spec/plan/checkpoint skills reference this constitution.

## Ghi chú tiếng Việt

Hiến chương phải ngắn, kiểm chứng được; mỗi nguyên tắc nêu cách thực thi; có non-goals và
thứ tự ưu tiên khi xung đột. Liên kết: `skills/core/project-constitution/SKILL.md`.
