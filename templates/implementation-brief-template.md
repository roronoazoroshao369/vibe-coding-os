# Implementation Brief: <title>

> Vietnamese usage note / Ghi chú sử dụng: Đây là bản tóm tắt thực thi gom đủ ngữ cảnh
> cho một task (hoặc cụm task) trước khi code, để người/agent thực thi không phải đoán.
> Học ý tưởng "context-rich brief / PRP" làm nguồn cảm hứng, viết lại bằng ngôn ngữ riêng;
> không copy template hay prompt upstream.

## Source

- Spec: `<path or link>` (acceptance criteria covered: <AC ids>)
- Plan: `<path or link>` (step(s): <step ids>)
- Tasks: `<path or link>` (task ids: <T ids>)

## Objective

One or two sentences: the observable change this brief delivers and why it matters.

## Scope

- In scope: <smallest set of behavior/files this brief covers>
- Out of scope: <explicitly excluded work so the executor does not drift>

## Relevant context

- Files to read first: `<path>` — <why it matters>
- Patterns to follow: <naming, error handling, imports, test style observed in the repo>
- Existing examples: `<path>` — <the closest prior art to imitate>
- Constraints: <constitution rules, perf/security limits, compatibility needs>

## Required changes

| Area | File(s) | Change | Acceptance criteria covered |
| --- | --- | --- | --- |
| <component> | `<path>` | <what changes and why> | AC<id> |

## Verification

- Command: `<command>`
- Expected result: <observable pass condition>
- Tests to add/update: `<path>` — <what they assert>

## Risks and rollback

- Risk: <what could break> → Mitigation: <how to contain it>
- Rollback: <how to undo if verification fails>

## Open questions

- <Anything that, if answered differently, changes the work. Resolve before coding when material.>

## Ghi chú tiếng Việt

Brief phải đủ để thực thi mà không cần hỏi lại: nguồn (spec/plan/tasks), mục tiêu quan sát
được, scope rõ ràng, ngữ cảnh (file cần đọc, pattern, ví dụ, ràng buộc), thay đổi cần làm
truy vết về acceptance criteria, cách verify, rủi ro/rollback, và câu hỏi mở. Liên kết:
`commands/vibe-brief.md`, `templates/tasks-template.md`, `templates/plan-template.md`.
