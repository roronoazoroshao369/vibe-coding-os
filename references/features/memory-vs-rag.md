# Feature: Memory vs RAG (Documents vs Memories)

## Goal

Give Vibe Coding OS a clear, original distinction between two kinds of recalled
context: **stateless Documents** (RAG-style reference material) and **stateful,
temporal Memories** (durable agent knowledge that changes over time). The goal is
to help agents pick the right recall model for a task, store the right shape of
information, and avoid treating mutable knowledge as if it were a frozen document.

## Reference sources

- `references/sources/supermemoryai-supermemory.md` for the agent-memory-as-capability framing.
- `references/sources/thedotmack-claude-mem.md` for persistent-context and observation concepts.
- Existing local memory conventions in `docs/memory-conventions.md` and `skills/memory/`.

## Local implementation

Documentation and workflow-first. This doc defines the conceptual split and the
selection rule; the behavior is enforced through existing memory skills, not new
infrastructure. No vector database, embedding service, SDK, or hosted index is
required. Both models degrade gracefully to local files.

## The core distinction

| Dimension | Documents (RAG) | Memories (agent memory) |
| --- | --- | --- |
| Mutability | Stateless, frozen at ingestion | Stateful, updated over time |
| Time model | No timeline; latest copy wins by re-ingestion | Temporal; entries supersede, extend, or derive from earlier ones |
| Identity | Chunk of a source file | A claim/decision with provenance and confidence |
| Truth over time | Whatever the source said when indexed | Tracks what is currently believed plus its history |
| Typical query | "What does the docs/spec say about X?" | "What did we decide about X, and is it still current?" |
| Failure if misused | Stale or contradictory facts treated as settled | Reference material bloats memory and crowds out decisions |
| Privacy posture | Usually project artifacts already in the repo | Higher risk: may capture intent, constraints, secrets |

**Documents** are retrieval over a body of source text: read-mostly, re-indexed
when the source changes, and answered by quoting or summarizing what the source
currently contains. There is no notion of "this fact replaced that fact."

**Memories** are durable agent knowledge: decisions, constraints, gotchas, and
outcomes that accumulate and evolve. A memory can update, extend, or derive from
an earlier memory, and only the latest version should drive current work while the
prior versions remain auditable.

## Selection rule

1. If the answer is "what does this source text say," use a **Document** lookup.
   Re-read or re-index the source; do not store a paraphrase as a memory.
2. If the answer is "what do we currently know/decide/avoid, and how did that
   change," use a **Memory**. Store a durable, provenance-tagged claim and mark it
   as the latest version.
3. If a task needs both (e.g., a spec quote plus the decision that overrode it),
   recall the Document for the text and the Memory for the current decision, and
   keep them labeled separately so the mutable decision is never mistaken for the
   frozen source.

## Applied upstream ideas

- Treat agent memory as an explicit, stateful capability distinct from document
  retrieval (Supermemory framing).
- Use a temporal model where newer knowledge supersedes older knowledge while the
  history stays inspectable (claude-mem persistent-context framing).
- Keep recall provider-neutral and local-first; the distinction is conceptual, not
  tied to any storage engine.

## Not applied upstream ideas

- No embedding pipeline, vector store, Chroma/SQLite index, or hosted RAG service.
- No requirement to ingest a corpus; Documents can be plain repo files read on demand.
- No replacement of local repository context with an external index by default.

## Must-have behavior

- Label every recalled item as Document or Memory so agents apply the right trust model.
- For Memories, require source, confidence, scope, sensitivity, and an `isLatest`-style
  current-version flag; supersede rather than silently overwrite.
- For Documents, re-derive from source instead of trusting a cached paraphrase.
- Block secrets and high-risk personal data before anything becomes a Memory.
- When a Document and a Memory conflict, surface the conflict; do not let the frozen
  Document override a newer explicit decision (or vice versa) without flagging it.

## Failure modes

- Storing a spec paraphrase as a Memory, then acting on it after the spec changed.
- Letting reference Documents accumulate in durable memory and drown out decisions.
- Treating an outdated Memory as current because no temporal/latest flag was set.
- Mixing mutable decisions and frozen source text in one undifferentiated bundle.
- Capturing intent or secrets into Documents that were assumed to be "just files."

## Update signals

- Upstream changes how it separates documents from memories, or how it models
  supersession, freshness, or temporal validity.
- Local memory skills change how they tag latest-version, scope, or provenance.

## Evaluation ideas

- Can an agent state, for a given recalled item, whether it is a Document or a Memory?
- Are superseded Memories excluded from current work but still retrievable for history?
- When source text changes, is the Document answer re-derived rather than served stale?
- Are conflicts between a Document and a Memory surfaced instead of silently resolved?
- Does recall still function with only local files and no index/provider?

## Ghi chú tiếng Việt

Tài liệu này phân biệt hai loại ngữ cảnh: **Documents** (tài liệu tham khảo tĩnh,
kiểu RAG, không có dòng thời gian) và **Memories** (kiến thức tác nhân có trạng thái,
thay đổi theo thời gian, có cờ phiên bản mới nhất). Hãy gắn nhãn rõ ràng từng mục
được truy hồi, ưu tiên cục bộ, chặn bí mật trước khi lưu thành Memory, và khi
Document mâu thuẫn với Memory thì phải nêu rõ thay vì âm thầm chọn một bên. Ý tưởng
lấy cảm hứng từ `supermemoryai/supermemory` (MIT) và `thedotmack/claude-mem`
(Apache-2.0, Alex Newman); chỉ diễn giải lại, không sao chép mã hay văn bản gốc.
