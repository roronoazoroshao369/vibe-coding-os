---
name: memory-search
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: memory
tags:
  - memory
status: stable
---

# Skill: Memory Search

## Purpose

Find candidate memory entries for a task using staged search, then return only relevant, cited, confidence-labeled context.

## When to use

Use before planning, debugging, reviewing, or implementing when prior sessions, decisions, commands, or constraints may change the answer.

## Inputs

- Current task and search question.
- Available local memory, project memory, session summaries, handoffs, and cited observations.
- Search terms, entities, files, time window, and scope filters.

## Workflow

1. Convert the task into 2-5 search queries: entity, file/path, decision, error, and workflow terms.
2. Search broad indexes or summaries first; avoid loading raw transcripts by default.
3. Inspect only promising entries, following citation IDs or source paths.
4. Tune retrieval without binding to vector infrastructure: blend keyword/path hits for exact names with semantic summaries for fuzzy intent; start with a conservative relevance threshold, lower it only when recall is clearly missing, and rerank by source fit, recency, confidence, and contradiction risk.
5. Deduplicate by source and keep the newest non-contradicted entry unless history matters.
6. Label every returned fact with source, confidence, staleness, and contradictions.
7. If nothing useful is found, say so and proceed without inventing memory.

## Outputs

- Focused memory search report.
- Relevant citations and rejected/stale matches.
- Open questions or missing-memory note.

## Failure modes

- Injecting every matching entry into context.
- Treating semantic similarity as evidence.
- Dropping source/citation labels.
- Ignoring stale or contradicted entries.

## Verification checklist

- [ ] Search used more than one term or path when ambiguity existed.
- [ ] Hybrid keyword/path/semantic search was tuned only as far as the task required.
- [ ] Threshold and rerank choices are explainable without provider-specific claims.
- [ ] Raw context was loaded only after summary hits justified it.
- [ ] Returned context is cited, scoped, and confidence-labeled.
- [ ] Irrelevant/stale matches were excluded or marked.

## Applied / Not Applied

Applied as original wording from Supermemory-inspired retrieval/search design and claude-mem-inspired progressive disclosure: hybrid keyword/path/semantic search, threshold tuning, and reranking guidance without requiring vector infrastructure. Not applied: Chroma, SQLite, embedding services, hosted search, SDK clients, or copied upstream text.

## Ghi chú tiếng Việt

Tìm bộ nhớ theo từng lớp: tìm rộng trước, đọc chi tiết sau. Chỉ đưa vào ngữ cảnh phần thật sự liên quan, có nguồn, độ tin cậy, và nhãn cũ/mâu thuẫn.
