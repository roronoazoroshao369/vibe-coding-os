# Privacy-safe Memory

## Purpose

Use this workflow to block unsafe content before it enters memory, prompts, examples, commits, or provider calls.

## When to use

Use for non-trivial memory changes, before work that may depend on prior context, before storing sensitive-looking information, or before planning an optional provider integration.

## Step-by-step workflow

1. State the task, memory scope, and expected decision support.
2. Check `docs/memory-conventions.md`, relevant `skills/memory/` files, and reference mappings.
3. Run privacy filtering before ingesting or sharing candidate content.
4. Prefer local-first memory and record source, confidence, sensitivity, and staleness.
5. Retrieve or search only the context needed for the task.
6. Evaluate whether retrieved memory was relevant, fresh, and safe.
7. Record follow-ups, audit triggers, and any provider assumptions.

## Required inputs

- Task or decision.
- Candidate content or retrieval query.
- Source files, memory entries, and sensitivity constraints.
- Optional provider goals if explicitly requested.

## Outputs

- Memory entry, retrieval report, privacy review, evaluation note, or adapter plan.
- Clear applied/not-applied decisions and validation status.

## Related skills

- memory-privacy, privacy-filter, project-memory

## Related commands

- vibe-memory-privacy-check, vibe-memory-ingest

## Applied / Not applied

Applied: agent memory as an explicit local workflow, ingestion/retrieval/search separation, privacy rules, evaluation, optional provider abstraction, and local fallback. Not applied: hosted service requirement, Supermemory SDK/client, dashboard clone, cloud auth, connector stack, database infrastructure, or vendor code.

## Maintenance notes

When `supermemoryai/supermemory` changes API, retrieval/search, privacy/security, integrations, evals, or self-hosting behavior, inspect this workflow plus `references/mappings/update-impact-map.md` before changing local behavior.

## Ghi chú tiếng Việt

Quy trình này giúp dùng bộ nhớ có kiểm soát: chỉ lưu thông tin bền vững, luôn kiểm tra quyền riêng tư, ghi nguồn và độ tin cậy, và giữ adapter bên ngoài ở trạng thái tùy chọn.
