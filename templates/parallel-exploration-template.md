---
title: Parallel Exploration: <problem>
type: template
name: parallel-exploration-template
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: template
tags:
  - template
status: stable
---

# Parallel Exploration: <problem>

> Vietnamese usage note / Ghi chú sử dụng: Dùng khi quyết định lớn hoặc khó đảo ngược. Tạo
> 2–4 hướng khác biệt, đặt time box, chấm theo tiêu chí, rồi chọn và ghi lý do. Học ý
> tưởng từ `github/spec-kit`, không tạo runtime đa-agent.

## Problem statement

<What decision must be made and why it matters.>

## Decision criteria

- <Criterion 1, e.g. simplicity>
- <Criterion 2, e.g. risk>
- <Criterion 3, e.g. performance / cost / maintainability>

## Time box

- <Duration allotted to this exploration.>

## Candidates

### Candidate A: <name>

- How it works: <...>
- Trade-offs: <...>
- Risks: <...>

### Candidate B: <name>

- How it works: <...>
- Trade-offs: <...>
- Risks: <...>

<!-- Add C/D if genuinely distinct. -->

## Scoring

| Criterion | A | B | C | Notes |
| --- | --- | --- | --- | --- |
| <criterion> | <score> | <score> | <score> | <evidence / uncertainty> |

## Decision

- Chosen approach: <candidate>.
- Rationale: <why it wins against the criteria>.
- Carried forward from rejected candidates: <useful ideas to keep>.

## Non-goals

- <What this exploration deliberately did not evaluate.>

## Assumptions

- <Assumptions behind the scoring.>

## Verification gates

- [ ] Criteria were fixed before scoring.
- [ ] Candidates are genuinely distinct.
- [ ] Decision and rationale are recorded.
- [ ] Decision fed into the spec/plan (and ADR if durable).

## Ghi chú tiếng Việt

So sánh 2–4 hướng theo tiêu chí cố định trước, có time box, chọn và ghi lý do kèm ý hay từ
hướng bị loại. Liên kết: `skills/core/brainstorming/SKILL.md`.
