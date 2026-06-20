---
name: memory-retrieval
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: memory
tags:
  - memory
status: stable
---

# Skill: Memory Retrieval

## Purpose

Retrieve task-relevant memory before planning, coding, debugging, or review using a phased retrieval workflow: define question → search broad → narrow by scope → fetch details → evaluate → cite or discard.

## When to use

Use before planning, debugging, reviewing, or implementing when prior sessions, decisions, commands, or constraints may change the answer. Use when a task depends on context that may already exist in project memory, session summaries, handoff notes, or cited observations.

## Inputs

- Current task description and retrieval goal.
- Search question or knowledge gap to fill.
- Known scope constraints (project, worktree, session, user).
- Prior memory entries, session summaries, handoffs, and cited observations.
- Optional provider hints if external memory is authorized.

## Retrieval Phases

The retrieval workflow follows six explicit phases:

### Phase 1: Define Question

Formulate a precise retrieval question from the task. Break ambiguous needs into 2–5 sub-questions targeting different memory dimensions:

- **entity question**: "What decisions were made about X?"
- **file/path question**: "What facts are associated with file Y?"
- **error question**: "Has error Z been diagnosed before?"
- **workflow question**: "What process was used for task type W?"
- **constraint question**: "Are there scope or privacy exclusions relevant here?"

State each question in a form that can be answered by a found entry or explicitly unanswered.

### Phase 2: Search Broad

Search broad indexes and summaries first. Never load raw transcripts or full entries by default. Use:

- File-path scans for exact-name matches.
- Keyword searches for named entities and domain terms.
- Summary-level scans of session observations and handoff notes.
- Provider-assisted broad search only if the user explicitly authorized it.

Collect a candidate set of entry IDs or citation pointers. Do not yet fetch full content.

### Phase 3: Narrow by Scope

Filter the candidate set by relevance to the current scope:

- **Project scope**: entries tagged with matching project name.
- **Worktree scope**: entries tied to the current branch or worktree.
- **Session scope**: observations from the current or recent session.
- **User scope**: user-level preferences or constraints.

Discard entries whose scope does not overlap with the task. Mark ambiguous entries for review in the next phase.

### Phase 4: Fetch Details

For the narrowed candidate set, fetch full structured content:

- Read entry summaries, citations, confidence labels, staleness markers.
- Check contradiction links — if an entry is superseded, fetch the newer version.
- Verify sensitivity labels — skip entries that exceed the task's authorization level.

Return only entries that pass this deep inspection. For each, record: source file, confidence, staleness, scope, contradictions, and whether it passed scope filtering.

### Phase 5: Evaluate

Score each fetched entry against the retrieval question:

- **Relevance**: does the entry directly answer or inform the question? (high / medium / low / none)
- **Freshness**: is the entry current, or does it need recheck? (fresh / stale / needs-verification)
- **Groundedness**: is the source cited and verifiable? (cited / uncited / missing-source)
- **Contradiction risk**: does a newer or countervailing entry exist? (none / possible / confirmed)

Apply a composite judgment: use the entry if relevance is at least medium AND freshness is not stale AND groundedness is cited. For entries that fail, log why they were not used.

### Phase 6: Cite or Discard

For accepted entries: produce a cited context block with the entry ID, source path, confidence, staleness, and relevance score. Include the direct quote or paraphrase.

For discarded entries: record a brief reason (off-scope, stale, low relevance, uncited, contradicted) so the retrieval report shows what was considered and rejected.

If nothing useful is found, say so explicitly and proceed without inventing memory.

## Workflow

1. Start with a clear retrieval question derived from the task.
2. Run Phase 1: Define question. Break into sub-questions if needed.
3. Run Phase 2: Search broad indexes and summaries.
4. Run Phase 3: Narrow candidates by scope filter.
5. Run Phase 4: Fetch full details for narrowed set.
6. Run Phase 5: Evaluate each entry for relevance, freshness, groundedness, contradiction risk.
7. Run Phase 6: Cite accepted entries; record discarded entries with reasons.
8. Label every returned fact with source, confidence, staleness, and contradictions.
9. If nothing useful is found, say so and proceed without inventing memory.

## Outputs

- Focused memory retrieval report with phased evaluation scores.
- Cited entries with relevance, freshness, groundedness, and contradiction risk.
- Discarded entries with explicit rejection reasons.
- Open questions or missing-memory note for gaps not answered.

## Failure modes

- Skipping question definition and searching without direction.
- Loading every matching entry into context without scope narrowing.
- Treating semantic similarity as evidence of relevance.
- Dropping source/citation labels during fetch.
- Ignoring stale or contradicted entries in the evaluation phase.
- Citing entries that fail the relevance/freshness/groundedness gate.

## Verification checklist

- [ ] Retrieval question defined and broken into sub-questions when ambiguous.
- [ ] Phase 2 searched broad indexes before loading full entries.
- [ ] Phase 3 narrowed by scope with explicit scope labels.
- [ ] Phase 4 fetched full structured content only for narrowed candidates.
- [ ] Phase 5 evaluated each entry (relevance, freshness, groundedness, contradiction).
- [ ] Phase 6 cited accepted entries and documented discarded reasons.
- [ ] Returned context is cited, scoped, and confidence-labeled.
- [ ] Irrelevant/stale/uncited matches were excluded or marked.
- [ ] Missing-memory note recorded when nothing useful was found.

## Ghi chú tiếng Việt

Truy xuất bộ nhớ theo 6 pha: định nghĩa câu hỏi → tìm rộng → thu hẹp phạm vi → lấy chi tiết → đánh giá → trích dẫn hoặc loại bỏ. Chỉ đưa vào ngữ cảnh phần thật sự liên quan, có nguồn, còn mới, và độ tin cậy rõ ràng. Không bịa ra bộ nhớ nếu không tìm thấy.
