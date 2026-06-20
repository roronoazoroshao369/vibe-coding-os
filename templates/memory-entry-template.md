---
title: Memory Entry Template
type: template
name: memory-entry-template
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: memory
tags:
  - template
  - memory
status: stable
---

# Memory Entry Template

> Do not store secrets: never include tokens, passwords, private keys, credentials, private URLs, regulated personal data, or unnecessary personal data. Use placeholders such as `<REDACTED_TOKEN>` only when context is still useful.

## Vietnamese usage note

Ghi chú tiếng Việt: Mẫu này dùng để capture one durable memory item with source, sensitivity, and expiry. Luôn kiểm tra quyền riêng tư trước khi lưu hoặc chia sẻ; không lưu bí mật.

## Purpose

Capture one durable memory item with source, sensitivity, confidence, staleness, and citations.

## Placeholder fields

- `{memory_id}`
- `{date}`
- `{task_or_scope}`
- `{source_type}` — one of: session, decision, review, debug
- `{lifecycle_stage}` — one of: captured, filtered, extracted, formatted, stored
- `{quality_checks_passed}` — comma-separated list of checks that passed before storage
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

## Schema fields

- `source_type`: session | decision | review | debug
- `lifecycle_stage`: captured | filtered | extracted | formatted | stored
- `quality_checks_passed`: list of verification checks that completed
- `sensitivity`: public | internal | sensitive | secret-redacted
- `confidence`: low | medium | high
- `staleness`: natural-language freshness hint (e.g., "fresh", "needs-recheck-after-v1.1")
- `related_files`: paths referenced by this memory entry
- `citations`: source pointers (file paths, commit hashes, docs, URLs)

## Do not store secrets checklist

- [ ] No credentials, API keys, tokens, or private keys.
- [ ] No unnecessary personal data.
- [ ] No full transcript unless explicitly required and sanitized.
- [ ] Redactions preserve only useful technical context.
- [ ] External provider use is optional and authorized.

## Ghi chú tiếng Việt

Dùng mẫu này để lưu bộ nhớ một cách an toàn: không lưu bí mật, luôn ghi nguồn/trích dẫn, và chỉ giữ thông tin bền vững hữu ích cho phiên sau.
