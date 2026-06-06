# Memory Evaluation Template

> Do not store secrets: never include tokens, passwords, private keys, credentials, private URLs, regulated personal data, or unnecessary personal data. Use placeholders such as `<REDACTED_TOKEN>` only when context is still useful.

## Vietnamese usage note

Ghi chú tiếng Việt: Mẫu này dùng để evaluate recall quality, safety, freshness, latency, and cost. Luôn kiểm tra quyền riêng tư trước khi lưu hoặc chia sẻ; không lưu bí mật.

## Purpose

Evaluate recall quality, safety, freshness, latency, and cost.

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
