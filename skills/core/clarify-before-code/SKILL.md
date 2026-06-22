---
name: clarify-before-code
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: core
tags:
  - core
status: stable
---

# Skill: Clarify Before Code

## Purpose

Prevent wasted implementation by resolving ambiguity before edits.

## When to use

Use when requirements, constraints, acceptance criteria, or target files are unclear.

## Inputs

User request, observed repo context, possible interpretations.

## Workflow

1. Restate the request in concrete terms.
2. Identify ambiguities that affect implementation.
3. Ask the fewest high-value questions possible — cap at five per round. Skip any question
   already answered by the request or existing artifacts; prefer precision over breadth.
4. Encode the answers back into the spec artifact. A clarification that lives only in chat
   is lost; update the spec's goals, constraints, acceptance criteria, or assumptions so the
   resolved decision becomes part of the source of truth.
5. If questions are not possible, record conservative assumptions in the spec's Assumptions
   section.
6. Proceed only when the next action is safe.

## Question discipline

- At most five questions per round; ask follow-ups only when ≥2 scenario classes (alternate,
  exception, recovery, non-functional) remain unclear, with a one-line justification each.
- Each question must materially change the implementation or the spec; drop the rest.
- Never ask the user to restate what they already said.
- After answers arrive, write them into the spec (not just the reply) and narrow the task
  statement accordingly.

## Outputs

Clarifying questions (≤5), the answers encoded back into the spec artifact, or documented
conservative assumptions, plus a narrowed task statement.

## Failure modes

- Asking excessive questions.
- Proceeding despite conflicting requirements.
- Inventing product behavior.

## Verification checklist

- [ ] Ambiguities that affect code are resolved or recorded.
- [ ] No more than five questions were asked per round.
- [ ] Answers are encoded back into the spec artifact, not left only in chat.
- [ ] Assumptions are conservative.
- [ ] The user goal remains unchanged.

## Superpowers alignment

Use with `brainstorming` when the request needs option exploration before a spec.

Related mattpocock-inspired skill: `skills/core/grill-user-before-building/SKILL.md` for deeper pre-build interviewing.

## Spec-driven development layer (github/spec-kit inspiration)

The ≤5-question cap and the "encode answers back into the spec" discipline adapt the
`clarify` idea from `github/spec-kit` (MIT, GitHub, Inc.) as original wording. No upstream
prompt text or CLI is vendored. Related: `commands/vibe-spec.md`,
`skills/core/requirements-quality-checklist/SKILL.md`.

### Ghi chú tiếng Việt

Hỏi tối đa năm câu mỗi vòng, bỏ qua câu đã được trả lời, và quan trọng nhất: ghi câu trả lời
NGƯỢC vào artifact spec (goals / constraints / acceptance criteria / assumptions), không để
trôi trong chat. Chỉ hỏi khi câu hỏi thực sự thay đổi cách làm. Học ý tưởng từ
`github/spec-kit` (MIT, GitHub, Inc.), viết lại nguyên bản, không copy prompt/CLI.
