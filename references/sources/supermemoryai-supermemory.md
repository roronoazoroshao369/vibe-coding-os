# Reference: supermemoryai/supermemory

## Metadata

- Repo: https://github.com/supermemoryai/supermemory
- Owner: supermemoryai
- Name: supermemory
- Category: agent-memory-engine
- Status: tracked
- Import mode: inspiration/adaptation
- License: MIT, verified from upstream root `LICENSE` during the 2026-06-06 audit
- Last checked: 2026-06-06
- Last known commit: 5b129d7d323429cedc41a5c2d7c84fa0c859a991

## Why this repo matters

`supermemoryai/supermemory` is a high-signal reference for treating memory as a first-class AI capability: ingestion, retrieval, search, profiles, provider integrations, evaluation, and agent-facing memory operations. Vibe Coding OS uses it as inspiration for local memory contracts and workflows, not as a dependency or hosted product blueprint.

## Key concepts

- Agent memory should be explicit: agents ingest, retrieve, search, forget, and evaluate memory through named workflows.
- A personal or company brain is useful only when scoped, privacy-filtered, and source-aware.
- Retrieval should happen before planning or coding when prior context may change the answer.
- Memory quality needs evaluation for relevance, freshness, contradiction handling, latency/cost, and privacy safety.
- External providers can be useful adapters, but local-first memory must remain available and authoritative by default.

## Features to study

| Feature | Why it matters | Local equivalent | Status | Target local files | Maintenance notes |
| --- | --- | --- | --- | --- | --- |
| memory-api | Clarifies stable operations such as add, update, forget, recall, and context injection. | `adapters/memory/README.md`, `templates/memory-provider-adapter-template.md` | planned | `adapters/memory/README.md`, `skills/memory/memory-provider-adapter/SKILL.md` | Watch API shape only; do not implement a client yet. |
| agent-memory | Treats memory as a capability agents request deliberately. | `skills/memory/memory-architecture/SKILL.md`, `skills/memory/agent-handoff/SKILL.md` | partial | `skills/memory/memory-architecture/SKILL.md`, `docs/workflows/memory-lifecycle.md` | Keep human intent and local repo context authoritative. |
| memory-ingestion | Prevents transcript hoarding by selecting durable facts. | `skills/memory/memory-ingestion/SKILL.md` | planned | `commands/vibe-memory-ingest.md`, `templates/memory-entry-template.md` | Require privacy filtering before storage. |
| memory-retrieval | Ensures useful context is recalled before decisions. | `skills/memory/memory-search/SKILL.md` | planned | `commands/vibe-memory-retrieve.md`, `docs/workflows/memory-retrieval-before-work.md` | Cite sources and label uncertainty. |
| semantic-search | Supports meaning-based lookup while preserving local fallback. | `skills/memory/memory-search/SKILL.md` | planned | `commands/vibe-memory-search.md`, `references/features/memory-search.md` | Abstract search behavior; do not require vector infra. |
| memory-evaluation | Makes memory quality measurable instead of assumed. | `skills/memory/memory-evaluation/SKILL.md` | planned | `templates/memory-evaluation-template.md`, `references/features/memory-evaluation.md` | Track correctness, freshness, usefulness, privacy, latency, cost. |
| memorybench-or-evals | Inspires benchmark-style staged evaluation. | `references/features/memory-evaluation.md` | partial | `skills/memory/memory-evaluation/SKILL.md` | Study concepts only; no benchmark datasets vendored. |
| provider-integration | Allows future optional backends. | `skills/memory/memory-provider-adapter/SKILL.md` | planned | `adapters/memory/supermemory-adapter-plan.md` | Must remain opt-in and dependency-free by default. |
| privacy-safe-storage | Keeps secrets and sensitive data out of durable memory. | `skills/memory/privacy-filter/SKILL.md` | partial | `commands/vibe-memory-privacy-check.md`, `templates/memory-privacy-review-template.md` | Block unsafe memory rather than redact silently when risk is high. |
| cloud-vs-local-memory | Separates external convenience from local control. | `skills/memory/local-first-memory/SKILL.md` | planned | `adapters/memory/local-memory-adapter.md`, `references/features/local-first-memory.md` | Local memory remains the default fallback. |
| memory-adapter-interface | Defines provider contract without lock-in. | `adapters/memory/README.md` | planned | `templates/memory-provider-adapter-template.md`, `docs/workflows/memory-provider-adapter.md` | Interface documentation only; no Supermemory SDK dependency. |

## Applied to Vibe Coding OS

- Agent-memory contract for local skills, commands, templates, and adapter documentation.
- Memory ingestion, retrieval, search, privacy, and evaluation workflows.
- Optional provider abstraction with local-first fallback.
- Update impact rules so future upstream API, integration, privacy, retrieval, and evaluation changes map to local files.

## Not applied to Vibe Coding OS

- Hosted Supermemory service requirement.
- Full Supermemory API client, SDK dependency, MCP configuration, dashboard clone, database stack, connectors, auth flow, or cloud account flow.
- Proprietary or hosted-only behavior.
- Replacing Vibe Coding OS local memory with external memory by default.

## Local mapping

- Reference features: `references/features/agent-memory-engine.md`, `references/features/memory-ingestion.md`, `references/features/memory-retrieval.md`, `references/features/memory-search.md`, `references/features/memory-privacy.md`, `references/features/memory-evaluation.md`, `references/features/memory-provider-adapter.md`, `references/features/local-first-memory.md`.
- Memory skills: `skills/memory/memory-architecture/SKILL.md`, `skills/memory/memory-ingestion/SKILL.md`, `skills/memory/memory-search/SKILL.md`, `skills/memory/privacy-filter/SKILL.md`, `skills/memory/memory-evaluation/SKILL.md`, `skills/memory/memory-provider-adapter/SKILL.md`, `skills/memory/local-first-memory/SKILL.md`.
- Existing enhanced skills: `skills/memory/project-memory/SKILL.md`, `skills/memory/session-summarizer/SKILL.md`, `skills/memory/context-retrieval/SKILL.md`, `skills/memory/privacy-filter/SKILL.md`, `skills/memory/agent-handoff/SKILL.md`.
- Adapter docs: `adapters/memory/README.md`, `adapters/memory/supermemory-adapter-plan.md`, `adapters/memory/local-memory-adapter.md`.

## Upstream structure notes

The 2026-06-06 audit observed a monorepo with `apps/`, `packages/`, documentation under `apps/docs/`, memory/provider tooling, MCP/plugin surfaces, and a root MIT license. These notes are structural observations only; no code or long text was copied.

## Integration strategy

1. Track upstream as inspiration in the Reference Intelligence Layer.
2. Normalize useful concepts into local skills, commands, templates, docs, and adapter contracts.
3. Keep local memory dependency-free and privacy-first.
4. Treat external providers as optional adapters selected by a human.
5. Re-audit upstream before adapting new API, benchmark, privacy, or integration ideas.

## Update watchlist

- Memory API additions, deletions, or behavior changes.
- Retrieval/search ranking, hybrid search, profile, or contradiction-handling changes.
- New MemoryBench/evaluation claims or methodology.
- New integrations, MCP/plugin behavior, or provider SDKs.
- Privacy, security, retention, deletion, or self-hosting changes.
- Any license, notice, or attribution changes.

## Maintenance playbook

1. Run `npm run references:clone` or use a temporary clone outside tracked source paths.
2. Record current commit, license status, and audited paths in the changelog.
3. Update only local summaries and mappings; do not vendor source code or docs.
4. If a new local behavior is proposed, update feature docs, skills, commands, templates, adapters, and validation together.
5. Run `npm run validate:references` and `npm run validate`.

## Do not copy

Do not copy upstream implementation, prompts, docs, API examples, datasets, assets, SDK code, connector code, dashboard code, or benchmark data into Vibe Coding OS without a separate license and attribution decision. Prefer short original summaries, local contracts, and file mappings.

## Last audit notes

- Audited upstream root metadata, structure, README themes, and root license on 2026-06-06.
- Verified root license as MIT and current `main` commit as `5b129d7d323429cedc41a5c2d7c84fa0c859a991`.
- Adapted concepts only: agent memory, ingestion/retrieval/search workflows, privacy checks, provider abstraction, local fallback, and evaluation checklists.

## Ghi chú tiếng Việt

Tích hợp này chỉ dùng `supermemoryai/supermemory` làm nguồn cảm hứng cho kiến trúc bộ nhớ AI. Vibe Coding OS không sao chép mã nguồn, không yêu cầu dịch vụ cloud, không lưu bí mật, và luôn ưu tiên bộ nhớ cục bộ có kiểm soát trước khi cân nhắc adapter bên ngoài.
