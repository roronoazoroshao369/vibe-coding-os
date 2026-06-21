---
name: grill-user-before-building
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: core
tags:
  - core
status: stable
---

# Skill: Grill User Before Building

## Purpose

Interview the user until goals, constraints, risks, and acceptance criteria are explicit before implementation.

## When to use

Use for ambiguous requests, broad features, design choices, or any task where building immediately would invent requirements.

## Inputs

User goal, current context, known constraints, unknowns, success criteria, and any relevant files or docs.
When docs-aware alignment is needed: `CONTEXT.md`, existing ADRs, relevant docs, and the proposed change.

## Workflow

### Phase 1 — Grill for alignment

1. Restate the goal in your own words.
2. Ask the smallest set of high-leverage questions that remove implementation ambiguity.
3. Probe edge cases, non-goals, rollout, user impact, and verification.
4. **Stop condition: 95% confidence.** End the interview when confidence in the next artifact (spec, PRD, plan) is ≥ 95%. If confidence is below 95%, ask ONE more single-question. Do not extend the interview beyond what is needed to reach 95%.
5. **Single-question cadence.** Ask ONE question at a time, not a batch. Attach your best guess as a default so the user can confirm or correct, not re-derive.
6. Record assumptions that remain instead of hiding them.

### Phase 2 — Docs-aware alignment (optional)

Use this phase when the change affects durable project context, domain language, or long-lived knowledge:

1. Read `CONTEXT.md` and ADR index before questioning.
2. Grill for terms, decision drivers, constraints, and rejected options.
3. Propose updates to shared language or ADR notes only when durable.
4. Separate facts, assumptions, and decisions.
5. Hand off to PRD, issue slicing, or implementation once docs are aligned.

## Loading constraints (anti-pattern catalog)

| Anti-pattern | Why it fails | Avoid by |
| --- | --- | --- |
| Asking 5+ questions in one message | Overwhelms the user; lower response rate. | One question per turn. |
| Skipping the best-guess default | Forces the user to derive the answer from scratch. | Always attach your best guess. |
| Extending the interview past 95% confidence | Diminishing returns; user fatigue. | Stop at 95% confidence. |
| Asking "anything else?" as the final question | "Anything else" is unfalsifiable; never ends cleanly. | State your confidence + remaining assumptions; let the user close. |
| Treating the user's first response as final | First response often has implicit assumptions. | Restate the goal; ask edge-case follow-ups. |
| Continuing the interview in CI/loop contexts | No dialogue partner; produces nothing. | This skill is interactive-only. |

## 95% confidence stop condition

At any point, evaluate your confidence in the next artifact:

- **< 70%** — high ambiguity; continue with 1-2 questions.
- **70-89%** — moderate ambiguity; one focused question on the weakest dimension.
- **90-94%** — minor ambiguity; state your assumption explicitly; let the user close.
- **≥ 95%** — stop. State the confidence, summarize the assumptions, and proceed to the next artifact.

Do not pad the interview to reach 100% — that is impossible and signals that you have not learned to commit.

## Outputs

A concise alignment summary, answered questions, open assumptions, non-goals, and recommended next workflow.
When docs-aware phase is used: updated context proposals, ADR candidates, clarified terms, and an implementation-ready summary.

## Failure modes

Asking generic questions, interrogating after the user asked for a tiny edit, treating guesses as facts, or turning the interview into implementation.
Writing docs for temporary details, overwriting project philosophy, adding fake ADRs, or copying reference text.

## Verification checklist

The user intent is restated; blockers are resolved or named; non-goals are listed; acceptance criteria are testable; next step is explicit.
Context changes are durable; ADR candidates explain tradeoffs; user alignment is clear; no secrets or private data are stored.

## Ghi chú tiếng Việt

Kỹ năng này dùng để "grill" trước khi code: hỏi kỹ nhưng có mục tiêu, tránh agent tự bịa yêu cầu. Dùng khi task mơ hồ hoặc rủi ro. File liên quan: `commands/vibe-grill-me.md`, `templates/prd-template.md`, và `docs/workflows/grill-to-prd-to-issues.md`. Khi upstream thay đổi, chỉ học cách đặt câu hỏi tốt hơn, không chép prompt.

Khi câu hỏi không chỉ là "làm gì" mà còn ảnh hưởng ngôn ngữ chung và quyết định dài hạn, dùng Phase 2 (Docs-aware). Cần đọc `CONTEXT.md` và `docs/adr/README.md` trước. Khi upstream update, kiểm tra ý tưởng về context/ADR rồi diễn đạt lại theo Vibe Coding OS.
