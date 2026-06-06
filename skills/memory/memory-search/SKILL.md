# Skill: Memory Search

## Purpose

Provide a disciplined local procedure for memory search that is inspired by `supermemoryai/supermemory` concepts while remaining dependency-free, privacy-safe, and human-controlled.

## When to use

Use when work needs durable context, memory ingestion, retrieval before decisions, memory search, provider planning, or evaluation of memory usefulness. Prefer existing memory skills (`project-memory`, `context-retrieval`, `privacy-filter`, `session-summarizer`, `agent-handoff`) when the task is narrower.

## Inputs

- Task or decision that may need memory.
- Candidate memory content, source, scope, sensitivity, confidence, and staleness risk.
- Local files, prior memory entries, templates, and related commands.
- Optional provider constraints if a human explicitly requests an external backend.

## Workflow

1. Confirm the memory goal: ingest, retrieve, search, evaluate, protect, or plan an adapter.
2. Check local conventions and related memory skills before adding new behavior.
3. Apply privacy filtering before storing or sharing any memory.
4. Prefer local-first storage and cite sources for retrieved context.
5. Label confidence, expiry, contradictions, and unresolved questions.
6. If an external provider is considered, keep it optional and document fallback behavior.
7. Record verification using the relevant template or command.

## Outputs

- A concise memory entry, retrieval/search report, privacy review, evaluation note, or adapter plan.
- Clear applied/not-applied decisions and follow-up checks.

## Failure modes

- Duplicating an existing memory skill instead of composing with it.
- Storing secrets, credentials, private keys, or unnecessary personal data.
- Treating hosted provider behavior as required.
- Saving full transcripts instead of durable facts.
- Omitting source, confidence, scope, or staleness information.

## Verification checklist

- [ ] Existing memory skills were checked for overlap.
- [ ] Candidate content passed privacy filtering.
- [ ] Local-first behavior remains available.
- [ ] External provider use, if any, is explicitly optional.
- [ ] Sources, confidence, and stale/contradictory signals are documented.

## Applied / Not Applied

Applied from Supermemory-inspired design: explicit memory operations, retrieval-before-work, search as an interface, provider abstraction, evaluation, privacy gates, and local fallback. Not applied: hosted Supermemory requirement, dashboard clone, cloud auth/account flow, SDK client, database stack, connectors, benchmark data, or replacing local memory by default.

## Ghi chú tiếng Việt

Kỹ năng này giúp agent dùng bộ nhớ như một năng lực rõ ràng nhưng vẫn an toàn. Luôn ưu tiên bộ nhớ cục bộ, kiểm tra quyền riêng tư trước khi lưu, ghi nguồn và độ tin cậy, và không biến Supermemory thành phụ thuộc bắt buộc.
