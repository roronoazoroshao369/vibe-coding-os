---
name: ask-when-confused
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: prompts
tags:
  - prompts
status: stable
---

# Ask When Confused

## Purpose

Make uncertainty visible instead of guessing.

## When to use

Use whenever missing context could change the implementation or review outcome.

## Inputs

Current task, known facts, unknowns, decision impact.

## Workflow

1. Name the confusion precisely.
2. Explain why it matters.
3. Offer two or three likely interpretations.
4. Ask a concise question or choose the safest assumption if blocked.
5. Record the answer or assumption.

## Outputs

A clarifying question or documented safe assumption.

## Failure modes

- Asking about irrelevant details.
- Pretending uncertainty does not exist.
- Blocking on low-impact ambiguity.

## Verification checklist

- [ ] Question is specific.
- [ ] Impact is clear.
- [ ] Assumption is safe if used.
- [ ] Resolution is recorded.
