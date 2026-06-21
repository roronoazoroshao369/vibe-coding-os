---
name: karpathy-engineering-discipline
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: prompts
tags:
  - prompts
status: stable
---

# Karpathy Engineering Discipline

## Purpose

Cut two of the most common LLM coding mistakes: charging into code before the intent is settled, and sprawling edits that touch far more than the request. This skill enforces a brief think-first pause and a surgical edit boundary. These are two of four sibling engineering disciplines; the other two are deliberately out of scope here. Simplicity-first lives in `skills/prompts/anti-overengineering`, and goal-driven execution — rewriting an imperative instruction into a verifiable goal with per-step checks — lives in `skills/core/goal-driven-execution`, which is in turn backed by `skills/core/verification-before-done`. Together the four form one coherent discipline: think before coding, keep it simple, change surgically, and drive to a verifiable goal.

## When to use

Use at the start of any non-trivial code change, and whenever a diff begins to grow beyond the lines the request actually demands. Especially valuable when the request is ambiguous, when several interpretations are plausible, or when editing code someone else owns.

## Inputs

The request, the relevant existing code and its prevailing style, any constraints, and the change you are about to make.

## Workflow

### Think before coding

1. Name your working interpretation of the request in one sentence. If two or more readings are viable, surface them instead of silently choosing one.
2. State the assumptions the change depends on. If a load-bearing assumption is unverified, confirm it before writing code.
3. If a simpler route exists than the one implied, say so and let it be considered.
4. If something is genuinely unclear, stop and name the confusion rather than coding past it.

### Surgical changes

1. Touch only what the request requires. Leave adjacent code, comments, and formatting alone even when you would write them differently.
2. Match the surrounding style and conventions rather than imposing your own.
3. Do not refactor or "tidy" code that is not broken as part of an unrelated change.
4. Remove only the orphans your own edit created (now-unused imports or locals). Flag pre-existing dead code instead of deleting it uninvited.
5. Apply the trace test: every changed line should map directly back to the request.

## Outputs

A stated interpretation and assumptions before implementation, and a minimal diff whose every line is traceable to the request.

## Failure modes

- Picking one interpretation of an ambiguous request without surfacing the alternatives.
- Hiding uncertainty and discovering the misread only after the work is done.
- "Drive-by" improvements to untouched code that bloat the diff and review surface.
- Reformatting or restyling to personal preference inside an unrelated change.
- Deleting pre-existing dead code that was never in scope.

## Verification checklist

- [ ] Interpretation and key assumptions were stated before coding.
- [ ] Ambiguities were surfaced, not silently resolved.
- [ ] Every changed line traces to the request.
- [ ] No unrelated refactors, restyling, or formatting churn.
- [ ] Only self-created orphans were removed; other dead code was flagged, not deleted.

## Related skills

These four sibling disciplines are meant to be used together; this skill owns the first and
third, and points to the other two so the set stays coherent.

- Think before coding — this skill.
- `skills/prompts/anti-overengineering/SKILL.md` — Simplicity First.
- Surgical changes — this skill.
- `skills/core/goal-driven-execution/SKILL.md` — Goal-Driven Execution (imperative →
  verifiable goal with per-step checks), backed by
  `skills/core/verification-before-done/SKILL.md`.

## Ghi chú tiếng Việt

Kỹ năng này siết hai lỗi LLM hay mắc: lao vào code khi chưa chốt ý định, và sửa lan ra ngoài phạm vi yêu cầu. Hai trụ: "Nghĩ trước khi code" (nêu cách hiểu, giả định, lựa chọn thay thế, hỏi khi mơ hồ) và "Sửa đúng chỗ" (chỉ chạm phần cần thiết, giữ nguyên phong cách quanh đó, mỗi dòng đổi đều truy về yêu cầu). Đây là 2 trong 4 trụ kỷ luật anh em: tính đơn giản nằm ở `skills/prompts/anti-overengineering`, còn thực thi theo mục tiêu (viết lại mệnh lệnh thành mục tiêu kiểm chứng được, mỗi bước kèm check) nằm ở `skills/core/goal-driven-execution`, được hậu thuẫn bởi `skills/core/verification-before-done`. Ý tưởng lấy cảm hứng từ bình luận công khai của Karpathy (qua `multica-ai/andrej-karpathy-skills`, MIT-declared); viết lại hoàn toàn bằng lời của dự án, không sao chép văn bản upstream. Tên giữ khác biệt với `karpathy-guardrails` (chủ đề vòng lặp thực nghiệm ML).
