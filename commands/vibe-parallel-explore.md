# vibe-parallel-explore

## Purpose

Explore multiple candidate approaches to a hard or high-impact problem, compare them
against explicit criteria, and record a deliberate decision.

## When to use

Use when the design space is wide, the decision is hard to reverse, or stakeholders
disagree. Skip for small, obvious changes.

## Required inputs

- The problem statement and constraints.
- Decision criteria (cost, risk, simplicity, performance, maintainability).
- A time box.

## Step-by-step behavior

1. State the problem and the decision criteria.
2. Generate 2–4 genuinely different candidate approaches.
3. For each, sketch how it works, its trade-offs, and risks.
4. Time-box the exploration.
5. Score candidates against the criteria; note thin evidence.
6. Choose one approach; record rationale and useful ideas from rejected candidates.
7. Save the record using `templates/parallel-exploration-template.md` and feed the decision into the spec or plan.

## Outputs

A parallel-exploration record with candidates, trade-offs, scoring, and a documented
decision.

## Stopping conditions

Stop when the time box expires, when candidates are not genuinely distinct, or when a
decision cannot be justified against the criteria.

## Verification checklist

- [ ] Criteria are stated before scoring.
- [ ] Candidates are genuinely distinct.
- [ ] Exploration was time-boxed.
- [ ] The decision and rationale are recorded.

## Related skills/templates

- `skills/core/creative-parallel-exploration/SKILL.md`, `skills/core/subagent-driven-development/SKILL.md`, `skills/core/architecture-decision-records/SKILL.md`
- `templates/parallel-exploration-template.md`

## Ghi chú tiếng Việt

Khám phá song song: tạo 2–4 hướng khác biệt, đặt time box, chấm theo tiêu chí, chọn và ghi
lý do (kèm ý hay từ hướng bị loại), rồi đưa vào spec/plan. Chỉ dùng cho quyết định lớn. Học
ý tưởng từ `spec-kit`, không tạo runtime.
