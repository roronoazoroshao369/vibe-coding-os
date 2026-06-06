# Feature: Memory Provider Adapter

## Goal

Define optional backend abstraction without required cloud dependency for Vibe Coding OS while keeping memory optional, local-first, privacy-safe, and easy for AI agents to follow.

## Reference sources

- `references/sources/supermemoryai-supermemory.md` for Supermemory-inspired concepts.
- `references/changelogs/supermemoryai-supermemory.md` for audit history.
- Existing local memory conventions in `docs/memory-conventions.md` and `skills/memory/`.

## Local implementation

Local implementation is documentation and workflow-first: `skills/memory/memory-provider-adapter/SKILL.md`, related commands, templates, adapter docs, and mappings. No hosted service, SDK, database, connector, or cloud account is required.

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

## Ghi chú tiếng Việt

Tài liệu này biến ý tưởng từ Supermemory thành quy trình cục bộ, an toàn và tùy chọn. Khi dùng bộ nhớ, hãy lưu quyết định bền vững và nguồn gốc rõ ràng; không lưu token, mật khẩu, khóa riêng tư hoặc dữ liệu cá nhân không cần thiết.
