# Creative Parallel Exploration Workflow

## Purpose

Explore multiple candidate approaches to a hard or high-impact problem, compare them
against explicit criteria, and record a deliberate decision before committing to a spec or
plan.

## When to use

Use when the design space is wide, the decision is hard to reverse, or stakeholders
disagree. Skip for small, obvious changes.

## Step-by-step workflow

1. **Frame** — State the problem and the decision criteria.
2. **Generate** — Produce 2–4 genuinely different candidate approaches.
3. **Sketch** — For each candidate, describe how it works, trade-offs, and risks.
4. **Time-box** — Bound the exploration to avoid analysis paralysis.
5. **Score** — Rate candidates against the criteria; note thin evidence.
6. **Decide** — Choose one approach; record rationale and the best ideas from rejected candidates.
7. **Feed forward** — Carry the decision into the spec or plan.

## Required inputs

The problem statement, decision criteria, constraints, and a time box.

## Outputs

A parallel-exploration record with candidates, trade-offs, scoring, and a documented
decision.

## Related skills

- `skills/core/creative-parallel-exploration/SKILL.md`
- `skills/core/subagent-driven-development/SKILL.md` (for genuinely independent parallel subtasks)
- `skills/core/architecture-decision-records/SKILL.md` (to record the decision durably)

## Related commands

- `commands/vibe-parallel-explore.md`

## Applied / Not applied

- Applied: time-boxed comparison of distinct candidates with a recorded decision.
- Not applied: any upstream multi-agent runtime, preset engine, or command names.

## Maintenance notes

Keep aligned with `templates/parallel-exploration-template.md`. If a decision is durable,
also record an ADR.

## Ghi chú tiếng Việt

Khám phá song song: đóng khung vấn đề, tạo 2–4 hướng khác biệt, đặt time box, chấm theo
tiêu chí, chọn và ghi lý do (kèm ý hay từ hướng bị loại), rồi đưa vào spec/plan. Chỉ dùng
cho quyết định lớn. Học ý tưởng từ `spec-kit`, không tạo runtime.
