---
title: Memory Privacy Review Template
type: template
name: memory-privacy-review-template
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: review
tags:
  - template
  - review
  - memory
status: stable
---

# Memory Privacy Review Template

> Do not store secrets: never include tokens, passwords, private keys, credentials, private URLs, regulated personal data, or unnecessary personal data. Use placeholders such as `<REDACTED_TOKEN>` only when context is still useful.

## Vietnamese usage note

Ghi chú tiếng Việt: Mẫu này dùng để document why content is safe or blocked before storage or sharing. Luôn kiểm tra quyền riêng tư trước khi lưu hoặc chia sẻ; không lưu bí mật.

## Purpose

Document why content is safe or blocked before storage or sharing.

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

## Do not store secrets checklist

- [ ] No credentials, API keys, tokens, or private keys.
- [ ] No unnecessary personal data.
- [ ] No full transcript unless explicitly required and sanitized.
- [ ] Redactions preserve only useful technical context.
- [ ] External provider use is optional and authorized.

## Ghi chú tiếng Việt

Dùng mẫu này để lưu bộ nhớ một cách an toàn: không lưu bí mật, luôn ghi nguồn/trích dẫn, và chỉ giữ thông tin bền vững hữu ích cho phiên sau.
