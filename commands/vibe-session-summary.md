---
description: "Compress a session into a continuation-ready summary."
---

# vibe-session-summary

## When to use

Use to compress a session into a continuation-ready summary. This command is inspired by `thedotmack/claude-mem` concepts but must remain local, optional, and free of upstream runtime dependencies.

## Required inputs

- session observations, validation status, decisions, risks, follow-ups.
- Source, confidence, sensitivity, staleness risk, and expected output format.
- Relevant local memory skills, workflows, and templates.

## Step-by-step behavior

1. Read applicable repository and memory instructions.
2. Check existing memory skills for overlap before creating a new artifact.
3. Apply privacy exclusion first; stop or redact if secrets, credentials, tokens, private keys, or unnecessary personal data appear.
4. Capture or retrieve only durable, task-relevant context.
5. Compress noisy details into concise observations or summaries while preserving citations, uncertainty, and validation status.
6. Use progressive disclosure: search/index first, then include details only for relevant IDs or sources.
7. Produce the requested artifact and list what was applied, not applied, blocked, stale, or uncertain.

## Outputs

- A safe observation, summary, context injection bundle, progressive search report, citation list, configuration note, or troubleshooting report.
- Explicit privacy exclusions, assumptions, and follow-ups.

## Stopping conditions

Stop if memory would store secrets, a required source cannot be checked, an external provider would be used without authorization, retrieved context is stale/contradictory and cannot be labeled, or the request would require implementing upstream runtime architecture.

## Verification checklist

- [ ] Privacy exclusions completed.
- [ ] Existing skills and templates were used where applicable.
- [ ] Output is concise, source-aware, and citation-backed when memory claims are made.
- [ ] Stale or uncertain information is labeled.
- [ ] No upstream code, scripts, installer, database schema, service, or large text was copied.

## Ghi chú tiếng Việt

Lệnh này giúp dùng bộ nhớ theo cách an toàn: lọc bí mật trước, ghi ngắn gọn có nguồn, tìm kiếm theo từng lớp, và không phụ thuộc runtime của `claude-mem` trừ khi có nhiệm vụ tương lai yêu cầu rõ ràng.
