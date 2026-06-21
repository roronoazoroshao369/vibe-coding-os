# Feature: What before how

## Goal

Keep user-visible behavior and acceptance criteria (the "what") agreed before technology
and implementation structure (the "how") are chosen.

## Reference sources

- github/spec-kit

## Local implementation

- `skills/core/spec-first-development/SKILL.md` (subsumes the former `what-before-how` skill in v2.17)
- `commands/vibe-specify.md`
- `templates/spec-template.md`

## Applied upstream ideas

- Behavior-first specification.
- Quarantining technical decisions into the plan phase.

## Not applied upstream ideas

- Upstream phrasing, command names, or template text.

## Must-have behavior

- Acceptance criteria are observable and technology-agnostic.
- Technical choices are deferred to the plan.
- Premature lock-ins are flagged as assumptions or real constraints.

## Failure modes

- Criteria are written in implementation terms.
- A favored technology silently constrains the spec.
- "What" and "how" are mixed and hard to review.

## Update signals

- Upstream changes how it separates behavior from technical context.
- Specs repeatedly leak technical decisions.

## Evaluation ideas

- Can the spec be satisfied by more than one implementation?
- Are technical decisions consistently found in the plan, not the spec?

## Ghi chú tiếng Việt

"Cái gì trước, làm thế nào sau": thống nhất hành vi và tiêu chí chấp nhận trước khi chọn
công nghệ; đẩy quyết định kỹ thuật sang pha plan. Học ý tưởng từ `spec-kit`, không copy
chữ.
