---
description: "Retrieve relevant memory before work using a phased retrieval workflow with evaluation scoring."
---

# vibe-memory-retrieve

## When to use

Use when you need to retrieve relevant memory before work and report confidence with evaluation scores. Use the smallest relevant memory skill and avoid duplicating existing `project-memory`, `context-retrieval`, `privacy-filter`, `session-summarizer`, or `agent-handoff` behavior.

## Required inputs

- Task description and retrieval question.
- Memory scope and intended decision support.
- Candidate search terms, entities, files, time window, and scope filters.
- Source, confidence, sensitivity, staleness risk, and relevant local files.
- Optional provider constraints only if explicitly requested.

## Phased Retrieval Command

### Phase 1: Define Question

Convert the task into a precise retrieval question. If the task is ambiguous, break into 2–5 sub-questions:

```
vibe-memory-retrieve --question "What database schema decisions were made for the user module?"
```

Document the question(s) explicitly in the retrieval report. Proceed without memory if no clear question can be formed.

### Phase 2: Search Broad

Search broad indexes and summaries first:

- Run `vibe-memory-search` with broad terms derived from the question.
- Scan session summaries, handoff notes, and project memory indexes.
- Record candidate entry IDs or citation pointers. Do not load full content yet.

```
vibe-memory-retrieve --broad --terms "database,schema,user,module,decision"
```

### Phase 3: Narrow by Scope

Filter candidates by scope relevance:

- `--scope project`: keep only project-level entries.
- `--scope worktree`: keep only worktree/branch-level entries.
- `--scope session`: keep only current session observations.
- `--scope all`: search all scopes and merge by relevance.

Discard off-scope entries. Document the scope filter used.

```
vibe-memory-retrieve --narrow --scope project
```

### Phase 4: Fetch Details

For the narrowed candidate set, fetch full structured content:

- Read each candidate's summary, citations, confidence, staleness, contradictions.
- Skip entries that exceed the task's authorization level (sensitivity check).
- Return only entries that pass deep inspection.

```
vibe-memory-retrieve --fetch --ids "mem-001,mem-003,mem-007"
```

### Phase 5: Evaluate

Score each fetched entry on four axes:

| Axis | Values | Pass Gate |
|---|---|---|
| Relevance | high / medium / low / none | medium+ |
| Freshness | fresh / stale / needs-verification | not stale |
| Groundedness | cited / uncited / missing-source | cited |
| Contradiction risk | none / possible / confirmed | not confirmed |

Use the entry only if relevance >= medium AND freshness != stale AND groundedness == cited AND contradiction != confirmed. Log failures.

```
vibe-memory-retrieve --evaluate --min-relevance medium --max-staleness fresh
```

### Phase 6: Cite or Discard

For accepted entries: produce a cited context block with source, confidence, staleness, and evaluation scores.

For discarded entries: list each with the specific reason it failed (off-scope, stale, low relevance, uncited, contradicted).

```
vibe-memory-retrieve --report --format concise
```

## Combined invocation

```
vibe-memory-retrieve --task "Add login feature" --scope project --min-relevance medium
```

This runs all six phases sequentially with the specified filters.

## Behavior

1. Read governing repo instructions and memory conventions.
2. Select the matching memory skill (memory-retrieval or memory-search).
3. Run the six-phase retrieval workflow.
4. Run privacy filtering before fetching or sharing content.
5. Prefer local-first memory and document provider use as optional.
6. Produce a concise retrieval report using the retrieval report template.
7. Report assumptions, blocked content, stale memories, contradictions, and evaluation scores.

## Outputs

- Phased retrieval report with evaluation scores (relevance, freshness, groundedness, contradiction risk).
- Cited entries with source, confidence, and context.
- Discarded entries with explicit rejection reasons.
- Missing-memory note if nothing useful was found.

## Stopping conditions

Stop if no clear retrieval question can be formed, the user has not authorized an external provider, required sources are unavailable, or privacy filtering blocks the candidate set entirely.

## Verification checklist

- [ ] Retrieval question defined and documented.
- [ ] Broad search completed before full entry loading.
- [ ] Scope narrowing applied with explicit scope argument.
- [ ] Full content fetched only for the narrowed set.
- [ ] Each entry evaluated on relevance, freshness, groundedness, contradiction.
- [ ] Accepted entries cited; discarded entries logged with reasons.
- [ ] Privacy check completed before sharing or storing results.
- [ ] Local fallback is available.
- [ ] No Supermemory dependency or client was added.
- [ ] Output is concise and useful to a future agent.

## Ghi chú tiếng Việt

Lệnh này truy xuất bộ nhớ theo 6 pha với điểm đánh giá. Luôn bắt đầu bằng câu hỏi rõ ràng, tìm rộng trước, thu hẹp phạm vi, lấy chi tiết, đánh giá, và chỉ trích dẫn những kết quả đạt ngưỡng. Không lưu bí mật, không gọi cloud khi chưa được yêu cầu.
