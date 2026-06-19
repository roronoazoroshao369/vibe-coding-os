# Memory Retrieval Before Work

## Purpose

Use this workflow to retrieve task-relevant memory before planning, coding, debugging, or review using a phased retrieval pipeline.

## When to use

Use for non-trivial memory changes, before work that may depend on prior context, before storing sensitive-looking information, or before planning an optional provider integration.

## Step-by-step workflow

1. State the task, memory scope, and expected decision support.
2. Check `docs/memory-conventions.md`, relevant `skills/memory/` files, and reference mappings.
3. **Define retrieval question** — Convert the task into 1–5 precise questions that memory could answer. Document each question before searching.
4. **Search broad** — Scan indexes, summaries, and handoff notes first. Collect candidate entry IDs without loading full content.
5. **Narrow by scope** — Filter candidates to the relevant project, worktree, session, or user scope. Discard off-scope entries.
6. **Fetch details** — Load the full structured content only for the narrowed set. Inspect citations, confidence, staleness, contradictions.
7. **Evaluate** — Score each entry on relevance, freshness, groundedness, and contradiction risk. Use only entries that pass all gates (relevance >= medium, freshness != stale, groundedness == cited, contradiction != confirmed).
8. **Cite or discard** — Produce cited context for accepted entries. Log discarded entries with specific rejection reasons.
9. Run privacy filtering before ingesting or sharing candidate content.
10. Prefer local-first memory and record source, confidence, sensitivity, and staleness.
11. Evaluate whether retrieved memory was relevant, fresh, and safe.
12. Record follow-ups, audit triggers, and any provider assumptions.

## Retrieval Phases Reference

| Phase | Action | Gate | Output |
|---|---|---|---|
| Define Question | Convert task to search questions | 1–5 clear questions | Question set |
| Search Broad | Scan indexes, summaries | Collect candidate IDs | Candidate list |
| Narrow by Scope | Filter by project/worktree/session | Only on-scope entries survive | Narrowed set |
| Fetch Details | Read full content for narrowed set | Sensitivity check passed | Full-entry set |
| Evaluate | Score relevance, freshness, groundedness, contradiction | All gates pass | Evaluated entries |
| Cite or Discard | Produce cited context or rejection log | Each entry has an outcome | Retrieval report |

## Required inputs

- Task or decision.
- Retrieval question(s) derived from the task.
- Candidate content or retrieval query.
- Source files, memory entries, and sensitivity constraints.
- Optional provider goals if explicitly requested.

## Outputs

- Phased retrieval report with evaluation scores and cited entries.
- Discarded entries with explicit rejection reasons.
- Missing-memory note for unanswered questions.
- Clear applied/not-applied decisions and validation status.

## Related skills

- memory-retrieval, memory-search, progressive-memory-disclosure, context-retrieval

## Related commands

- vibe-memory-retrieve, vibe-memory-search

## Applied / Not applied

Applied: agent memory as an explicit local workflow, phased retrieval with evaluation scoring, ingestion/retrieval/search separation, privacy rules, evaluation, optional provider abstraction, and local fallback. Not applied: hosted service requirement, Supermemory SDK/client, dashboard clone, cloud auth, connector stack, database infrastructure, or vendor code.

## Maintenance notes

When `supermemoryai/supermemory` changes API, retrieval/search, privacy/security, integrations, evals, or self-hosting behavior, inspect this workflow plus `references/mappings/update-impact-map.md` before changing local behavior.

## Ghi chú tiếng Việt

Quy trình này giúp dùng bộ nhớ có kiểm soát theo 6 pha: định nghĩa câu hỏi → tìm rộng → thu hẹp → lấy chi tiết → đánh giá → trích dẫn hoặc loại bỏ. Luôn kiểm tra quyền riêng tư, ghi nguồn và độ tin cậy, và giữ adapter bên ngoài ở trạng thái tùy chọn.
