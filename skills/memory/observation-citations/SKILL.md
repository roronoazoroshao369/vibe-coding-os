---
name: observation-citations
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: memory
tags:
  - memory
status: stable
---

# Skill: Observation Citations

## Purpose

Create citation IDs and source labels so memory-backed claims can be audited and updated.

## When to use

Use when storing, retrieving, injecting, summarizing, or evaluating memory that may later be cited as evidence.

## Inputs

- Observation text.
- Source artifact: file, command, issue, PR, session summary, handoff, or prior memory entry.
- Timestamp, scope, confidence, and relationship to older observations.

## Workflow

1. Assign a stable observation ID or source label.
2. Record source path or artifact reference; summarize command output instead of storing raw logs.
3. Add scope, confidence, and stale-risk labels.
4. Link related observations with `derives_from`, `updates`, `extends`, `contradicts`, or `supersedes`.
5. When making a claim, cite the observation ID and label uncertainty.
6. When updating a claim, mark the old citation as superseded rather than silently replacing history.

## Outputs

- Citation-ready observation.
- Relationship links between observations.
- Supersession or contradiction note when relevant.

## Failure modes

- Making memory-backed claims without evidence.
- Using unstable references like “earlier in chat”.
- Losing history when a new observation supersedes an old one.
- Citing a raw sensitive transcript.

## Verification checklist

- [ ] Observation has stable ID or source reference.
- [ ] Claim cites source, confidence, and scope.
- [ ] Superseded/contradicted entries are labeled.
- [ ] Sensitive raw content was not cited or stored.

## Ghi chú tiếng Việt

Mỗi quan sát quan trọng cần ID hoặc nguồn ổn định. Khi kiến thức thay đổi, đánh dấu bản cũ là bị thay thế thay vì xóa dấu vết.
