# Memory Retrieval Report Template

> Do not store secrets: never include tokens, passwords, private keys, credentials, private URLs, regulated personal data, or unnecessary personal data. Use placeholders such as `<REDACTED_TOKEN>` only when context is still useful.

## Vietnamese usage note

Ghi chú tiếng Việt: Mẫu này dùng để summarize what was searched, what was found, how retrieval scored, and how it affects the task. Luôn kiểm tra quyền riêng tư trước khi lưu hoặc chia sẻ; không lưu bí mật.

## Purpose

Summarize what was searched, what was found, how retrieval scored on quality axes, and how it affects the task.

## Placeholder fields

- `{memory_id}`
- `{date}`
- `{task_or_scope}`
- `{retrieval_question}`
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

## Retrieval Quality Scoring

Each retrieved entry should be scored on four axes:

- **relevance_score**: high | medium | low | none — how directly the entry answers the retrieval question
- **freshness_score**: fresh | stale | needs-verification — whether the entry is current
- **groundedness_score**: cited | uncited | missing-source — whether the source is verifiable
- **contradiction_risk**: none | possible | confirmed — whether a newer or countervailing entry exists

Only entries with relevance >= medium, freshness != stale, groundedness == cited, and contradiction != confirmed should be used for decision support.

## Rejected Entries Log

List entries that were considered but discarded:

| Entry ID | Rejection Reason | Detail |
|---|---|---|
| `{id}` | off-scope / stale / low-relevance / uncited / contradicted | Brief explanation |

## Do not store secrets checklist

- [ ] No credentials, API keys, tokens, or private keys.
- [ ] No unnecessary personal data.
- [ ] No full transcript unless explicitly required and sanitized.
- [ ] Redactions preserve only useful technical context.
- [ ] External provider use is optional and authorized.

## Ghi chú tiếng Việt

Dùng mẫu này để ghi lại kết quả truy xuất bộ nhớ có điểm đánh giá: relevance, freshness, groundedness, contradiction. Chỉ dùng các mục đạt ngưỡng để hỗ trợ quyết định. Không lưu bí mật, luôn ghi nguồn/trích dẫn.
