# Checkpoint: <phase name>

> Vietnamese usage note / Ghi chú sử dụng: Dùng template này để xác nhận một pha đạt tiêu
> chí trước khi sang pha sau. Cổng quan trọng nhất là implementation-readiness. Ghi bằng
> chứng cụ thể; fail thì quay lại pha. Học ý tưởng từ `github/spec-kit`, dùng checklist
> local.

## Phase

Which phase is being gated: constitution / specify / plan / tasks / implementation.

## Exit criteria

- [ ] <Criterion 1 for this phase.>
- [ ] <Criterion 2.>
- [ ] <Criterion 3.>

## Evidence

| Criterion | Checked how | Result | Notes |
| --- | --- | --- | --- |
| <criterion> | <command / review / observation> | pass / fail | <evidence> |

## Implementation-readiness gate (implementation phase only)

- [ ] Spec checkpoint passed.
- [ ] Plan checkpoint passed.
- [ ] Tasks checkpoint passed.

## Decision

- Gate result: **passed** / **failed**.
- If failed, return to phase: <phase> and address: <items>.

## Non-goals

- <What this checkpoint does not verify.>

## Assumptions

- <Assumptions made while checking.>

## Verification gates

- [ ] Every exit criterion has recorded evidence.
- [ ] Failures block advancement.
- [ ] `npm run validate` / `npm run validate:references` run where relevant.

## Ghi chú tiếng Việt

Checkpoint xác nhận pha đạt tiêu chí (có bằng chứng) trước khi đi tiếp; cổng quan trọng
nhất là spec/plan/tasks đều đạt mới được code. Liên kết:
`skills/core/checkpoint-validation/SKILL.md`.
