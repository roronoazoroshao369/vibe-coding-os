---
name: triage-workflow
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: core
tags:
  - core
status: stable
---

# Skill: Triage Workflow

## Purpose

Classify incoming issues or tasks into clear next states with evidence and next action.

## When to use

Use for backlog cleanup, bug intake, ambiguous requests, or deciding whether work is ready for implementation.

## Inputs

Issue text, labels, reproduction details, priority signals, owner, and project policies.

## Workflow

1. Read the issue without assuming priority.
2. Determine type: bug, feature, question, duplicate, blocked, or out-of-scope.
3. Ask for missing evidence when needed.
4. Assign next state and labels according to local conventions.
5. Produce the next action or closure rationale.

## Outputs

Triage decision, label/state recommendation, missing information request, and next owner/action.

## Failure modes

Using labels as a substitute for thinking, accepting incomplete bug reports, or closing work without rationale.

## Verification checklist

State is justified; missing info is requested; out-of-scope calls are polite and specific; next action is unambiguous.

## Ghi chú tiếng Việt

Triage là phân loại có bằng chứng, không chỉ gắn nhãn. Dùng cho backlog/issue. File liên quan: `templates/triage-template.md`, `commands/vibe-plan.md (replaced vibe-triage v2.17)`.
