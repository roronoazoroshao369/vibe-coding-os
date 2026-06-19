# Feature: Memory Evaluation

## Goal

Define quality checks for recall usefulness, freshness, and safety for Vibe Coding OS while keeping memory optional, local-first, privacy-safe, and easy for AI agents to follow.

## Reference sources

- `references/sources/supermemoryai-supermemory.md` for Supermemory-inspired concepts.
- `references/changelogs/supermemoryai-supermemory.md` for audit history.
- Existing local memory conventions in `docs/memory-conventions.md` and `skills/memory/`.

## Local implementation

Local implementation is documentation and workflow-first: `skills/memory/memory-evaluation/SKILL.md`, related commands, templates, adapter docs, and mappings. No hosted service, SDK, database, connector, or cloud account is required.

## Applied upstream ideas

- Treat memory as an explicit agent capability.
- Separate ingestion, retrieval, search, privacy, evaluation, and provider concerns.
- Keep provider integrations behind an optional abstraction.
- Evaluate recall quality rather than assuming stored memory is useful.

## Not applied upstream ideas

- No dashboard clone, hosted service dependency, Supermemory API client, auth flow, connector stack, benchmark dataset, or infrastructure import.
- No replacement of local repository memory with a cloud-backed default.

## Must-have behavior

- Require source, confidence, scope, sensitivity, and expiry/staleness handling where relevant.
- Prefer concise durable facts over transcripts.
- Block secrets and high-risk personal data.
- Report retrieval uncertainty and stale memory.
- Keep provider-specific behavior isolated behind adapter documentation.

## Failure modes

- Storing secrets or private data.
- Treating external provider output as authoritative without citations or confidence.
- Saving noisy transcripts instead of durable decisions.
- Building a cloud dependency before a human explicitly requests it.
- Letting stale or contradictory memories influence work silently.

## Update signals

- Upstream changes API operations, retrieval/search behavior, provider integrations, privacy/security model, evaluation methodology, or local/self-hosting posture.
- Local memory commands, skills, templates, or adapters change names or semantics.

## Evaluation ideas

- Can an agent retrieve only task-relevant memories before work?
- Are secrets blocked before storage?
- Are stale, contradictory, or low-confidence memories labeled?
- Does local fallback work without network access or provider credentials?
- Are adapter assumptions documented without implementing a client?

## MemScore triple metric

MemScore is a Supermemory-inspired evaluation pattern that scores memory quality on three independent axes. The three metrics are always reported as a separate triple — never collapsed into a single combined score — so each dimension remains actionable.

| Metric | What it measures | Why it matters |
|---|---|---|
| `accuracy%` | Correctness and currency of cited facts in the memory entry or retrieval bundle | A retrieved memory that is wrong or stale is worse than no memory at all. Tracks groundedness and freshness. |
| `latencyMs` | Time cost to retrieve and evaluate the memory entry (milliseconds) | High retrieval latency defeats the purpose of memory. Keeps the efficiency of recall visible. |
| `contextTokens` | Context-window cost injected by the memory entry (tokens) | Every retrieved memory consumes prompt budget. Over-injection crowds out task-relevant context. |

### Local implementation

The scoring rubric is implemented in `skills/memory/memory-evaluation/SKILL.md`:

1. Score usefulness — did the memory change a decision, reduce search, or prevent a mistake?
2. Score accuracy — was the cited source correct, current, and non-contradicted? (drives `accuracy%`)
3. Score safety — did the entry avoid secrets, unnecessary personal data, and overbroad scope?
4. Apply a simple MemScore-style rubric: relevance, groundedness, and freshness.
5. Report the composite triple separately, never collapsed into one score: `accuracy%`, `latencyMs`, and `contextTokens`.
6. Mark action: keep, revise, supersede, archive, or delete.

### Verification checklist

- [ ] Relevance, groundedness, and freshness were checked.
- [ ] `accuracy%`, `latencyMs`, and `contextTokens` were reported separately.
- [ ] Privacy/scope safety was checked.
- [ ] Action is explicit: keep, revise, supersede, archive, or delete.
- [ ] Evaluation cites task outcome or evidence.

### Not applied

Hosted benchmark datasets, MemoryBench data, SDK clients, or copied upstream text are not part of the local implementation.

## Ghi chú tiếng Việt

Tài liệu này biến ý tưởng từ Supermemory thành quy trình cục bộ, an toàn và tùy chọn. Khi dùng bộ nhớ, hãy lưu quyết định bền vững và nguồn gốc rõ ràng; không lưu token, mật khẩu, khóa riêng tư hoặc dữ liệu cá nhân không cần thiết.
