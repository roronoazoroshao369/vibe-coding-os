---
name: memory-evaluation
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: memory
tags:
  - memory
status: stable
---

# Skill: Memory Evaluation

## Purpose

Judge whether memory improved the work enough to keep, revise, or delete it.

## When to use

Use when auditing memory quality, validating retrieval usefulness, pruning stale entries, or deciding whether a memory workflow is worth keeping.

## Inputs

- Memory entry or retrieval bundle.
- Task outcome and validation evidence.
- User feedback, contradictions, misses, or stale entries.

## Workflow

1. Score usefulness: did the memory change a decision, reduce search, or prevent a mistake?
2. Score accuracy: was the cited source correct, current, and non-contradicted?
3. Score safety: did the entry avoid secrets, unnecessary personal data, and overbroad scope?
4. Apply a simple MemScore-style rubric: relevance, groundedness, and freshness.
5. Report the composite triple separately, never collapsed into one score: `accuracy%` (correct and current cited facts), `latencyMs` (time to retrieve/evaluate), and `contextTokens` (context cost injected).
6. Mark action: keep, revise, supersede, archive, or delete.
7. Capture any gap as a follow-up ingestion or architecture fix.

## Outputs

- Memory evaluation note.
- Keep/revise/delete recommendation.
- Freshness or contradiction update.

## Failure modes

- Keeping memory because it exists, not because it helped.
- Measuring only recall while ignoring privacy and freshness.
- Deleting historical context that explains current decisions.
- Failing to update stale but frequently retrieved entries.

## Verification checklist

- [ ] Relevance, groundedness, and freshness were checked.
- [ ] `accuracy%`, `latencyMs`, and `contextTokens` were reported separately.
- [ ] Privacy/scope safety was checked.
- [ ] Action is explicit: keep, revise, supersede, archive, or delete.
- [ ] Evaluation cites task outcome or evidence.

## Applied / Not Applied

Applied as original wording from Supermemory-inspired MemScore evaluation design: report accuracy, latency, and context cost as a separate triple rather than one collapsed score. Not applied: hosted benchmark datasets, MemoryBench data, SDK clients, or copied upstream text.

## Ghi chú tiếng Việt

Đánh giá bộ nhớ bằng ba trục: liên quan, có căn cứ, còn mới. Sau đó quyết định giữ, sửa, thay thế, lưu trữ, hoặc xóa.
