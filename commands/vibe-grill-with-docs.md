---
description: "Grill the user while updating durable context and ADR candidates."
---

# Command: Grill while updating docs

## When to use

Use when alignment affects durable domain language, context, or ADRs.

## Required inputs

User request, CONTEXT.md, ADRs, relevant docs.

## Step-by-step behavior

1. Read context/ADRs.
2. Ask alignment questions.
3. Identify glossary updates and ADR candidates.
4. Summarize doc changes separately from implementation.

## Outputs

Alignment notes, context updates, ADR candidates.

## Stopping conditions

Stop before writing fake decisions or storing secrets.

## Verification checklist

Durable docs only; decisions and assumptions separated.

## Ghi chú tiếng Việt

Vừa hỏi rõ yêu cầu vừa bảo trì ngôn ngữ chung/ADR.
