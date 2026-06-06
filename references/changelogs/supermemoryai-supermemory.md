# Changelog: supermemoryai/supermemory

## Purpose

Track upstream changes that may affect Vibe Coding OS memory architecture, retrieval workflows, privacy rules, provider adapter plans, and evaluation practices.

## Entries

### 2026-06-06 scalable memory reference integration

- Date: 2026-06-06.
- Upstream repo audited: `https://github.com/supermemoryai/supermemory`.
- Commit audited: `5b129d7d323429cedc41a5c2d7c84fa0c859a991`.
- License status: MIT verified from upstream root `LICENSE`.
- Concepts adapted: agent memory as a first-class capability, personal/company brain framing, memory ingestion, memory retrieval, semantic search interface, memory evaluation, provider abstraction, optional external backend, local-first fallback, and privacy-safe memory practices.
- Applied features: `agent-memory-contract`, `memory-ingestion-workflow`, `memory-retrieval-workflow`, `memory-search-interface`, `memory-privacy-rules`, `optional-memory-backend-adapter`, `memory-evaluation-checklist`, `memory-provider-abstraction`, `local-first-memory-fallback`.
- Not-applied features: hosted service requirement, full Supermemory API client, dashboard clone, cloud account/auth flow, database/infrastructure stack, connectors, hosted-only behavior, replacing local memory by default, vendored code/docs/datasets.
- Local skills created/updated: created `memory-architecture`, `memory-ingestion`, `memory-retrieval`, `memory-search`, `memory-privacy`, `memory-evaluation`, `memory-provider-adapter`, `local-first-memory`; enhanced `project-memory`, `session-summarizer`, `context-retrieval`, `privacy-filter`, and `agent-handoff`.
- Commands created/updated: created `vibe-memory-ingest`, `vibe-memory-search`, `vibe-memory-retrieve`, `vibe-memory-audit`, `vibe-memory-privacy-check`, and `vibe-memory-provider-plan`; kept `vibe-memory` as the general memory summary command.
- Templates created/updated: created memory entry, retrieval report, privacy review, provider adapter, and evaluation templates.
- Docs created/updated: created feature docs, workflow docs, and memory adapter docs; updated attribution and notices.
- Mapping/index updates: updated `references/index.json`, source-to-skill mapping, feature-to-file mapping, update impact map, registries, and source registry.
- Remaining follow-ups: future PRs may add schema examples, mock adapter tests, memory quality fixtures, and optional provider implementation only after explicit approval.

### 2026-06-06 baseline local clone audit

- Source: `supermemoryai/supermemory`.
- Commit: `1b1bd4d2214f7dcf80f95646ae4ea0e46bb6cb2a`.
- License status: MIT.
- Finding: Audited local clone for memory operations, retrieval surfaces, and integration boundaries. Reinforced local memory principles around durable context, privacy filtering, and avoiding transcript hoarding; no upstream content imported.
- Local follow-up: keep future audits in `references/changelogs/supermemoryai-supermemory.md`, update `references/index.json`, and use `references/upstream-audit-workflow.md` before adapting ideas.

### Unreleased / Next audit

- Re-check upstream API, integrations, privacy/security, evaluation, retrieval/search, and self-hosting changes before adapting additional memory behavior.
