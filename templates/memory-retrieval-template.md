---
title: Memory Retrieval Bundle Template
type: template
name: memory-retrieval-template
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: memory
tags:
  - template
  - memory
status: stable
---

# Memory Retrieval Bundle Template

Use this bundle when retrieving prior context for a task, agent handoff, or planning session.

## Header

- **Task:** `<short task description>`
- **Date:** `<YYYY-MM-DD>`
- **Retriever:** `<person or agent>`
- **Scope:** `<repo, feature, issue, or workflow>`

## Retrieval query

- Keywords used:
- Files searched:
- Memory indexes or summaries checked:
- Exclusions applied:

## Retrieved context

### Relevant decisions
- `<decision>` — Source: `<file/session/observation>` — Confidence: `High | Medium | Low`

### Relevant constraints
- `<constraint>` — Source: `<file/session/observation>` — Staleness: `Fresh | Review by <event> | Stale`

### Commands that worked
- `<command>` — Result: `<pass/fail/unknown>` — Source: `<source>`

### Gotchas
- `<gotcha>` — Mitigation: `<how to avoid>`

### Follow-ups
- `<follow-up>` — Owner: `<owner or unknown>` — Status: `<open/done/deferred>`

## Sensitivity review

- [ ] No secrets, credentials, tokens, keys, or private URLs included.
- [ ] No unnecessary personal data included.
- [ ] Raw logs or transcripts are summarized, not copied.
- [ ] Stale or uncertain context is labeled.

## Injection-ready summary

A short, safe summary that can be inserted into the next agent context.

```text
<concise memory summary>
```
