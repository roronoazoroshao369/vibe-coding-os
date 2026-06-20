---
title: Memory Redaction Checklist
type: template
name: memory-redaction-checklist
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: memory
tags:
  - memory
status: stable
---

# Memory Redaction Checklist

Use this checklist before committing memory entries, memory examples, or summaries derived from chats, logs, issues, or terminal output. Follow `docs/memory-conventions.md` as the source of truth.

## Allowed category

- [ ] The memory captures at least one durable decision, architecture constraint, command that worked, gotcha, or follow-up.
- [ ] The memory is concise enough to help a future session without requiring the original transcript.

## Sensitive content removal

- [ ] Secrets, passwords, credentials, and confidential values are removed.
- [ ] API tokens, OAuth tokens, session cookies, bearer tokens, refresh tokens, CI tokens, and registry tokens are removed.
- [ ] Private keys, signing keys, certificate private keys, wallet keys, and key material in logs are removed.
- [ ] Private URLs and sensitive configuration values are removed or replaced with placeholders.
- [ ] Unnecessary personal data is removed or generalized.

## Transcript and log minimization

- [ ] Long raw transcripts are replaced with concise summaries.
- [ ] Verbose logs and stack traces are summarized to the durable lesson.
- [ ] Command output included in memory is short, relevant, and free of sensitive data.

## Metadata and staleness

- [ ] Date is present.
- [ ] Confidence is present and justified when not high.
- [ ] Source is present and points to a file, command, issue, PR, discussion, or session summary.
- [ ] Staleness status is present: `Fresh`, `Review by <date/event>`, or `Stale`.
- [ ] Old or uncertain memory has been reviewed, updated, or marked stale.

## Final commit safety

- [ ] Placeholders such as `<REDACTED_TOKEN>` are clearly fake and cannot be mistaken for live credentials.
- [ ] External material, if any, has attribution and licensing requirements recorded before commit.
- [ ] The memory still preserves enough technical context after redaction to be useful.
