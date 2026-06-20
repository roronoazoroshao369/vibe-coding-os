---
name: architecture-decision-records
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: core
tags:
  - core
status: stable
---

# Skill: Architecture Decision Records

## Purpose

Capture important technical decisions, tradeoffs, and consequences in small ADRs.

## When to use

Use for decisions that will matter after the session: architecture, data model, workflow policy, dependency choice, or irreversible constraints.

## Inputs

Decision topic, context, options considered, selected option, rationale, consequences, and follow-up checks.

## Workflow

1. Decide whether the choice is ADR-worthy.
2. Use `templates/adr-template.md`.
3. Record context, decision, alternatives, consequences, and verification.
4. Link related PRD/issues/context terms.
5. Do not create fake ADRs for choices not made.

## Outputs

An ADR draft or update, plus links from `docs/adr/README.md` or `CONTEXT.md` when appropriate.

## Failure modes

Documenting every tiny choice, hiding uncertainty, omitting rejected options, or turning ADRs into essays.

## Verification checklist

The ADR is dated; status is clear; decision drivers are named; consequences are honest; no secrets are included.

## Ghi chú tiếng Việt

ADR giúp nhớ “vì sao chọn cách này”. Dùng khi quyết định có tác động lâu dài. File liên quan: `docs/adr/README.md`, `templates/adr-template.md`, `CONTEXT.md`. Upstream update thì chỉ học cấu trúc/trigger, không chép ADR mẫu.
