# Skill: Grill With Docs

## Purpose

Align with the user while updating durable project context, domain language, and ADR candidates.

## When to use

Use when a change affects terminology, product behavior, architecture, or long-lived repository knowledge.

## Inputs

Conversation context, `CONTEXT.md`, existing ADRs, relevant docs, and the proposed change.

## Workflow

1. Read `CONTEXT.md` and ADR index before questioning.
2. Grill for terms, decision drivers, constraints, and rejected options.
3. Propose updates to shared language or ADR notes only when durable.
4. Separate facts, assumptions, and decisions.
5. Hand off to PRD, issue slicing, or implementation once docs are aligned.

## Outputs

Updated context proposals, ADR candidates, clarified terms, and an implementation-ready summary.

## Failure modes

Writing docs for temporary details, overwriting project philosophy, adding fake ADRs, or copying reference text.

## Verification checklist

Context changes are durable; ADR candidates explain tradeoffs; user alignment is clear; no secrets or private data are stored.

## Ghi chú tiếng Việt

Dùng khi câu hỏi không chỉ là “làm gì” mà còn ảnh hưởng ngôn ngữ chung và quyết định dài hạn. Cần đọc `CONTEXT.md` và `docs/adr/README.md` trước. Khi upstream update, kiểm tra ý tưởng về context/ADR rồi diễn đạt lại theo Vibe Coding OS.
