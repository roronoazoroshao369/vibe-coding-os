---
name: session-capture
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: memory
tags:
  - memory
status: stable
---

# Skill: Session Capture

## Purpose

Capture the facts of an active session as concise observations while the evidence is fresh.

## When to use

Use after meaningful tool results, decisions, files changed, failed attempts, validation, or user constraints that future agents should know.

## Inputs

- Current task and outcome.
- Files touched, commands run, decisions, blockers, risks, and follow-ups.
- Validation status and source references.

## Workflow

1. Capture only durable facts, not every conversation turn.
2. Record exact file paths and commands when material.
3. Include failed attempts and why they failed if they affect future work.
4. Add validation status: passed, failed, not run, or blocked.
5. Run privacy filtering before storage.
6. Assign observation citations or source references.
7. Hand off to `session-summarizer` when the session needs a compact narrative.

## Outputs

- Session observations with citations.
- Validation and follow-up notes.
- Privacy exclusions for rejected content.

## Failure modes

- Capturing raw transcripts.
- Omitting failed checks or blockers.
- Saving debug noise that future agents cannot use.
- Forgetting files touched or exact validation commands.

## Verification checklist

- [ ] Captured facts are durable and actionable.
- [ ] Files, commands, and validation status are present when relevant.
- [ ] Privacy filtering ran.
- [ ] Observations include citations/source labels.

## Ghi chú tiếng Việt

Ghi lại sự kiện bền vững của phiên: quyết định, file, lệnh, lỗi, kiểm chứng, rủi ro. Không lưu transcript thô.
