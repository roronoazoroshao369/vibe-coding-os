# Brownfield Spec: <feature / area>

> Vietnamese usage note / Ghi chú sử dụng: Dùng cho hệ thống sẵn có. Ghi hành vi hiện tại
> (quan sát thật, không đoán), định nghĩa hành vi mong muốn, đánh giá rủi ro hồi quy, và
> lên kế hoạch di trú từng bước có thể rollback. Học ý tưởng từ `github/spec-kit`, không
> copy template.

## Current behavior

- <Observed behavior, including edge cases and known quirks.>
- Source of truth: <tests / logs / manual observation>.

## Characterization tests

- [ ] <Test that pins current behavior before any change.>

## Desired behavior

- <Target behavior after the change.>

## Acceptance criteria

- [ ] <Observable criterion for the desired behavior.>
- [ ] <Edge case / error behavior criterion.>

## Change diff (current vs desired)

| Aspect | Current | Desired | Notes |
| --- | --- | --- | --- |
| <aspect> | <now> | <target> | <note> |

## Risks

- Regression risk: <...>
- Compatibility: <...>
- Data / migration: <...>

## Incremental migration plan

1. [ ] <Smallest reversible step, with rollback.>
2. [ ] <Next step.>

## Non-goals

- <What this change will not do.>

## Assumptions

- <Assumptions about current behavior or environment.>

## Verification gates

- [ ] Characterization tests pass before and after (where behavior should be preserved).
- [ ] New acceptance criteria are verified.
- [ ] Each migration step is reversible.

## Ghi chú tiếng Việt

Ghi hành vi hiện tại từ quan sát, thêm test ghim, định nghĩa hành vi mong muốn, đánh giá
rủi ro, và di trú từng bước. Liên kết: `skills/core/brownfield-spec-enhancement/SKILL.md`.
