---
description: "Audit memory entries, reference mappings, and provider assumptions."
---

# vibe-memory-audit

## When to use

Use when you need to audit memory entries, mappings, and upstream memory references. Use the smallest relevant memory skill and avoid duplicating existing `project-memory`, `context-retrieval`, `privacy-filter`, `session-summarizer`, or `agent-handoff` behavior.

## Required inputs

- Task, memory scope, and intended output.
- Candidate memory content or retrieval/search query.
- Source, confidence, sensitivity, staleness risk, and relevant local files.
- Optional provider constraints only if explicitly requested.

## Behavior

1. Read governing repo instructions and memory conventions.
2. Select the matching memory skill.
3. Run privacy filtering before storing, sharing, or sending content to a provider.
4. Prefer local-first behavior and document provider use as optional.
5. Produce a concise artifact using the relevant template.
6. Report assumptions, blocked content, stale memories, contradictions, and verification status.

## Outputs

- Memory entry, retrieval/search report, privacy review, audit note, evaluation note, or adapter plan.
- Explicit applied/not-applied feature decisions when upstream inspiration is involved.

## Stopping conditions

Stop if candidate content contains secrets that cannot be safely removed, the user has not authorized an external provider, required sources are unavailable, or the memory would be speculative/noisy rather than durable.

## Verification checklist

- [ ] Privacy check completed.
- [ ] Local fallback is available.
- [ ] No Supermemory dependency or client was added.
- [ ] Sources, confidence, and staleness are documented.
- [ ] Output is concise and useful to a future agent.

## Ghi chú tiếng Việt

Lệnh này chỉ tạo quy trình/tài liệu bộ nhớ an toàn. Không lưu bí mật, không gọi dịch vụ cloud khi chưa được yêu cầu rõ ràng, và luôn ghi rõ nguồn cùng độ tin cậy.
