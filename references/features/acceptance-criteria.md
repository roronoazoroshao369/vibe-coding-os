# Feature: Acceptance criteria

## Goal

Ensure every spec carries observable, testable acceptance criteria that connect intent to
verification.

## Reference sources

- github/spec-kit

## Local implementation

- `skills/core/acceptance-criteria/SKILL.md`
- `templates/spec-template.md`, `templates/checkpoint-template.md`
- `commands/vibe-specify.md`, `commands/vibe-checkpoints.md`

## Applied upstream ideas

- Acceptance criteria as required spec content.
- Criteria reused as phase gates.

## Not applied upstream ideas

- Upstream phrasing or template text.

## Must-have behavior

- Each criterion is observable and paired with a verification method.
- Edge cases and error behavior are covered, not just the happy path.
- Criteria describe behavior, not implementation.

## Failure modes

- Subjective criteria that cannot be checked.
- Criteria that encode an implementation.
- Criteria that exist but are never used as a gate.

## Update signals

- Upstream changes how acceptance criteria are structured or verified.
- Checkpoints repeatedly pass with weak criteria.

## Evaluation ideas

- Can each criterion be checked by a test, command, or observation?
- Do checkpoints actually use the criteria as gates?

## Ghi chú tiếng Việt

Tiêu chí chấp nhận: quan sát được, kiểm chứng được, bao phủ cả edge case và lỗi, và dùng
làm cổng tại checkpoint. Học ý tưởng từ `spec-kit`, không copy chữ.
