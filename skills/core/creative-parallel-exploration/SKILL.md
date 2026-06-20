---
name: creative-parallel-exploration
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: core
tags:
  - core
status: stable
---

# Creative Parallel Exploration

## Purpose

Explore multiple candidate approaches to a problem in parallel, compare them against
explicit criteria, and record a decision — so the chosen approach is deliberate rather
than the first idea that appeared.

## When to use

Use when a design space is wide, when a decision is high-impact or hard to reverse, or
when stakeholders disagree on direction. Skip for small, obvious changes.

## Inputs

The problem statement, decision criteria (cost, risk, simplicity, performance,
maintainability), constraints, and a time box.

## Workflow

1. State the problem and the criteria the decision will be judged on.
2. Generate 2–4 genuinely different candidate approaches.
3. For each candidate, sketch how it works, its trade-offs, and its risks.
4. Time-box the exploration so it does not become analysis paralysis.
5. Score candidates against the criteria; note where evidence is thin.
6. Choose one approach and record why, including the strongest ideas from rejected
   candidates worth carrying forward.
7. Feed the decision into the spec or plan.

## Outputs

A parallel-exploration record (`templates/parallel-exploration-template.md`) with
candidates, trade-offs, scoring, and a documented decision.

## Failure modes

- Candidates are minor variations, not real alternatives.
- Exploration runs unbounded and delays the work.
- The decision is made but the rationale is not recorded.
- Criteria are invented after the fact to justify a preferred option.

## Verification checklist

- [ ] Decision criteria are stated before scoring.
- [ ] Candidates are genuinely distinct.
- [ ] Exploration is time-boxed.
- [ ] The decision and rationale are recorded.
- [ ] Useful ideas from rejected candidates are captured.

## Applied / Not Applied

- Applied: creative parallel exploration of candidate approaches from `github/spec-kit`.
- Not applied: any upstream multi-agent runtime, preset engine, or command names. Locally
  this is a documented comparison ritual; if independent subtasks warrant real
  parallelism, compose with `skills/core/subagent-driven-development/SKILL.md`.

## Ghi chú tiếng Việt

Khám phá song song nhiều hướng giải khác nhau, so sánh theo tiêu chí rõ ràng, đặt time
box, rồi chọn và ghi lại lý do (kèm ý hay từ các hướng bị loại). Chỉ dùng cho quyết định
lớn/khó đảo ngược. Liên kết: `skills/core/subagent-driven-development/SKILL.md`,
`templates/parallel-exploration-template.md`.
