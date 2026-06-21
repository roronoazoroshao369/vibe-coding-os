# Feature: Creative parallel exploration

## Goal

Explore multiple candidate approaches in parallel, compare them against explicit criteria,
and record a deliberate decision.

## Reference sources

- github/spec-kit

## Local implementation

- `skills/core/brainstorming/SKILL.md`
- `templates/parallel-exploration-template.md`
- `commands/vibe-parallel-explore.md`
- `docs/workflows/brainstorming.md`

## Applied upstream ideas

- Comparing several candidate approaches before committing.
- Recording the decision and carrying forward useful rejected ideas.

## Not applied upstream ideas

- Any upstream multi-agent runtime or preset engine.
- Upstream command names.

## Must-have behavior

- Decision criteria are stated before scoring.
- Candidates are genuinely distinct and time-boxed.
- The decision and rationale are recorded.

## Failure modes

- Candidates are minor variations.
- Exploration runs unbounded.
- Criteria are invented after the fact.

## Update signals

- Upstream changes its exploration model.
- High-impact decisions are repeatedly made without comparison.

## Evaluation ideas

- Were criteria fixed before scoring?
- Is the decision rationale recoverable later?

## Ghi chú tiếng Việt

Khám phá song song: nhiều hướng giải khác biệt, tiêu chí rõ trước khi chấm, có time box,
và ghi lại quyết định kèm ý hay từ hướng bị loại. Chỉ dùng cho quyết định lớn. Học ý tưởng
từ `spec-kit`, không tạo runtime.
