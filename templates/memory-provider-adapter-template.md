---
title: Memory Provider Adapter Template
type: template
name: memory-provider-adapter-template
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: memory
tags:
  - template
  - memory
status: stable
---

# Memory Provider Adapter Template

> Do not store secrets: never include tokens, passwords, private keys, credentials, private URLs, regulated personal data, or unnecessary personal data. Use placeholders such as `<REDACTED_TOKEN>` only when context is still useful.

## Vietnamese usage note

Ghi chú tiếng Việt: Mẫu này dùng để describe an optional memory provider without implementing a client. Luôn kiểm tra quyền riêng tư trước khi lưu hoặc chia sẻ; không lưu bí mật.

## Purpose

Describe an optional memory provider without implementing a client.

## Placeholder fields

- `{memory_id}`
- `{date}`
- `{task_or_scope}`
- `{source}`
- `{summary}`
- `{evidence_or_citations}`
- `{sensitivity_level}`
- `{confidence}`
- `{staleness_or_expiry}`
- `{contradictions_or_risks}`
- `{local_fallback}`
- `{optional_provider_notes}`
- `{verification}`
- `{follow_ups}`

## Provider Contract Compliance Checklist

Before finalizing the adapter plan, verify compliance with the interface contract defined in `skills/memory/memory-provider-adapter/SKILL.md`:

### Required Operations

- [ ] `store(entry)` — signature documented, accepts structured entry, returns entry ID or error
- [ ] `retrieve(query)` — signature documented, supports scope filtering, returns matching entries or empty set
- [ ] `search(terms, filters)` — signature documented, supports keyword/entity/path search, returns ranked entries
- [ ] `delete(entry_id)` — signature documented, supports soft-delete or hard-delete, idempotent

### Optional Operations (mark as not-yet-implemented if absent)

- [ ] `batch(operations)` — documented as planned or not implemented
- [ ] `stream(query)` — documented as planned or not implemented
- [ ] `rank(entries, query)` — documented as planned or not implemented

### Error Semantics

- [ ] Connection errors return `provider_unavailable` with retry hint
- [ ] Auth errors return `auth_required` or `auth_expired`
- [ ] Rate limits return `rate_limited` with retry-after hint
- [ ] Schema validation returns `validation_error` with field-level details
- [ ] Timeout returns `timeout` with configurable duration
- [ ] Unimplemented optional ops return `not_implemented`

### Compliance Level

- [ ] `full` — all required operations implemented and tested
- [ ] `partial` — subset of required operations documented (list which)
- [ ] `planned` — not yet implemented, contract documented for future use

## Do not store secrets checklist

- [ ] No credentials, API keys, tokens, or private keys.
- [ ] No unnecessary personal data.
- [ ] No full transcript unless explicitly required and sanitized.
- [ ] Redactions preserve only useful technical context.
- [ ] External provider use is optional and authorized.

## Ghi chú tiếng Việt

Dùng mẫu này để lưu bộ nhớ một cách an toàn: không lưu bí mật, luôn ghi nguồn/trích dẫn, và chỉ giữ thông tin bền vững hữu ích cho phiên sau.
