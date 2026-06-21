# Memory Lifecycle

## Purpose

Use this workflow to manage memory from candidate capture through privacy review, storage, retrieval, evaluation, and retirement.

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

## Harness-memory lifecycle

When operating within a SuperAgent orchestration session, an additional **harness-scoped memory** layer is active:

- **Session start**: harness memory is initialized by the orchestrator. No prior harness state is inherited.
- **During orchestration**: subtask lifecycle states, handoff summaries, integration notes, orchestrator decisions, and ephemeral findings are stored in harness memory.
- **Promotion gate**: at any point, the orchestrator may promote harness memory entries to durable memory if they have lasting value (e.g., a rescoping decision that future sessions should know).
- **Session end**: harness memory is cleared. All entries are either promoted to durable memory or discarded. No orphaned harness state persists across sessions.

This keeps ephemeral orchestration state separate from the durable memory that future sessions depend on. See `skills/memory/memory-ingestion/SKILL.md` for the harness-scoped memory layer definition.

## Required inputs

- Task or decision.
- Candidate content or retrieval query.
- Source files, memory entries, and sensitivity constraints.
- Optional provider goals if explicitly requested.

## Outputs

- Memory entry, retrieval report, privacy review, evaluation note, or adapter plan.
- Clear applied/not-applied decisions and validation status.

## Related skills

- memory-architecture, memory-ingestion, privacy-filter, memory-evaluation

## Related commands

- vibe-memory-ingest, vibe-memory-audit

## Applied / Not applied

Applied: agent memory as an explicit local workflow, ingestion/retrieval/search separation, privacy rules, evaluation, optional provider abstraction, and local fallback. Not applied: hosted service requirement, Supermemory SDK/client, dashboard clone, cloud auth, connector stack, database infrastructure, or vendor code.

## Maintenance notes

When `supermemoryai/supermemory` changes API, retrieval/search, privacy/security, integrations, evals, or self-hosting behavior, inspect this workflow plus `references/mappings/update-impact-map.md` before changing local behavior.

## Ghi chú tiếng Việt

Quy trình này giúp dùng bộ nhớ có kiểm soát: chỉ lưu thông tin bền vững, luôn kiểm tra quyền riêng tư, ghi nguồn và độ tin cậy, và giữ adapter bên ngoài ở trạng thái tùy chọn.
