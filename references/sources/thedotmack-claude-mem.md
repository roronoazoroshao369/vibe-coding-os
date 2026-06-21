# Reference: thedotmack/claude-mem

## Metadata

- Repo: https://github.com/thedotmack/claude-mem
- Owner: thedotmack
- Name: claude-mem
- Category: persistent-agent-context
- Status: tracked
- Import mode: inspiration/adaptation
- License: Apache-2.0, verified from upstream `LICENSE` during the 2026-06-06 audit
- Last checked: 2026-06-06
- Last known commit: `671de5e3e20544f1d50e7488088063ffb5275646`

## Why this repo matters

`claude-mem` is a focused example of persistent coding-agent context: it captures session events, compresses useful history, stores observations and summaries, retrieves memories with progressive disclosure, injects context at session start, and exposes lifecycle hooks for multiple agent harnesses. Vibe Coding OS studies these ideas to improve continuity across sessions while remaining runtime-neutral, local-first, privacy-safe, and legally clean.

## Key concepts

- **Persistent context across sessions:** durable project facts survive agent restarts without storing whole transcripts.
- **Session observation model:** prompts, tool outcomes, and important events become concise observations with metadata.
- **Compression:** raw session activity is distilled into stable summaries and durable observations.
- **Progressive disclosure:** agents search indexes first, then fetch only the details required for the task.
- **Context injection:** relevant memory is intentionally inserted into the working context instead of assumed globally.
- **Lifecycle hooks:** start, prompt, post-tool, and stop events provide integration points without hard-coding one harness.
- **Privacy controls:** secrets and sensitive data are excluded before storage or retrieval.
- **Observation citations:** remembered claims should be traceable to IDs, summaries, source files, or handoff notes.

## Features to study

| Feature | Why it matters | Local equivalent | Status | Target local files | Maintenance notes |
| --- | --- | --- | --- | --- | --- |
| lifecycle-hooks | Defines memory moments without requiring one runtime. | Hook contract and hook-based skill. | partial | `adapters/hooks/memory-hooks-contract.md`, `skills/memory/memory-ingestion/SKILL.md` | Track event name changes, but do not copy scripts. |
| session-start-context-injection | Gives agents continuity before planning. | Context injection workflow and command. | implemented | `skills/memory/session-capture/SKILL.md`, `commands/vibe-context-inject.md`, `docs/workflows/persistent-context-lifecycle.md` | Keep injection scoped and citation-backed. |
| user-prompt-capture | Preserves intent and constraints. | Session capture observation template. | implemented | `skills/memory/session-capture/SKILL.md`, `templates/session-observation-template.md` | Capture summaries only; redact secrets. |
| post-tool-observation | Records material findings after commands/tools. | Observation lifecycle and citation templates. | implemented | `skills/memory/session-capture/SKILL.md`, `skills/memory/session-capture/SKILL.md` | Store outcomes and evidence, not full logs. |
| session-end-summary | Makes handoff/resume practical. | Session summary and handoff workflow. | implemented | `skills/memory/session-capture/SKILL.md`, `commands/vibe-session-summary.md`, `docs/workflows/session-summary-and-handoff.md` | Include validation state and follow-ups. |
| memory-compression | Reduces noise and token load. | Compression skill and summary template. | implemented | `skills/memory/session-capture/SKILL.md`, `templates/session-summary-template.md` | Never compress away uncertainty, privacy tags, or citations. |
| progressive-disclosure | Prevents over-injection and stale context overload. | Progressive retrieval workflow and command. | implemented | `skills/memory/session-capture/SKILL.md`, `commands/vibe-memory-progressive-search.md` | Search broad, narrow, then fetch details. |
| memory-search | Makes durable memory queryable. | Existing memory search plus progressive search command. | partial | `skills/memory/memory-search/SKILL.md`, `commands/vibe-memory-search.md`, `commands/vibe-memory-progressive-search.md` | No Chroma/SQLite requirement. |
| observation-citations | Lets agents justify memory-based claims. | Observation citation skill and template. | implemented | `skills/memory/session-capture/SKILL.md`, `commands/vibe-memory-cite.md` | Prefer IDs plus source file/line when available. |
| privacy-tags | Keeps memory safe and auditable. | Privacy exclusion skill/template. | implemented | `skills/memory/project-memory/SKILL.md`, `templates/privacy-exclusion-template.md` | Treat secrets as blocked, not merely tagged. |
| context-configuration | Lets projects tune what memory appears. | Memory configuration policy and template. | implemented | `skills/memory/memory-compression/SKILL.md`, `commands/vibe-memory-config.md`, `templates/memory-config-template.md` | Keep defaults conservative. |
| troubleshooting-docs | Helps diagnose missing/unsafe/stale memory. | Memory troubleshooting command and skill. | implemented | `skills/memory/memory-search/SKILL.md`, `commands/vibe-memory-troubleshoot.md` | Include validation and privacy checks. |
| multi-harness-plugin-support | Keeps Vibe Coding OS portable across Claude, Codex, Cursor, and IDEs. | Adapter docs and hook contract. | planned | `adapters/memory/claude-mem-adapter-plan.md`, `adapters/hooks/memory-hooks-contract.md` | Documentation only until explicitly implemented. |

## Applied to Vibe Coding OS

- Session capture lifecycle with start, prompt, post-tool, compression, retrieval, injection, summary, and handoff phases.
- Memory compression as a human-readable summarization discipline, not a copied algorithm.
- Context injection policy with scoped memory bundles, citations, staleness labels, and privacy filters.
- Progressive memory retrieval: index/search first, then fetch detailed observations only when needed.
- Observation IDs and citation habits for memory-backed claims.
- Privacy exclusion rules for secrets, credentials, unnecessary personal data, and sensitive raw transcripts.
- Hook-based memory design as an optional adapter contract.
- Configuration and troubleshooting docs for local memory behavior.

## Not applied to Vibe Coding OS

- No upstream hook scripts are copied.
- No Bun worker service, background daemon, installer clone, local web viewer clone, OpenClaw gateway, beta/endless mode, SQLite schema, Chroma/vector implementation, SDK dependency, or hard dependency on `claude-mem`.
- No architecture clone: Vibe Coding OS remains a documentation, skill, command, template, and adapter-contract framework.
- No large upstream text, prompts, code, assets, or docs are vendored.

## Local mapping

- Reference docs: `references/features/persistent-agent-context.md`, `references/features/session-capture.md`, `references/features/memory-compression.md`, `references/features/context-injection.md`, `references/features/progressive-disclosure.md`, `references/features/observation-citations.md`, `references/features/privacy-exclusion.md`, `references/features/hook-based-memory.md`.
- Skills: `skills/memory/session-capture/SKILL.md`, `skills/memory/session-capture/SKILL.md`, `skills/memory/session-capture/SKILL.md`, `skills/memory/session-capture/SKILL.md`, `skills/memory/project-memory/SKILL.md`, `skills/memory/memory-compression/SKILL.md`, `skills/memory/memory-search/SKILL.md`, `skills/memory/memory-ingestion/SKILL.md`.
- Workflows: `docs/workflows/persistent-context-lifecycle.md`, `docs/workflows/progressive-memory-retrieval.md`, `docs/workflows/privacy-safe-session-capture.md`, `docs/workflows/session-summary-and-handoff.md`.
- Commands: `commands/vibe-session-capture.md`, `commands/vibe-session-summary.md`, `commands/vibe-context-inject.md`, `commands/vibe-memory-progressive-search.md`, `commands/vibe-memory-cite.md`, `commands/vibe-memory-config.md`, `commands/vibe-memory-troubleshoot.md`.
- Templates: `templates/session-observation-template.md`, `templates/session-summary-template.md`, `templates/context-injection-template.md`, `templates/progressive-memory-search-template.md`, `templates/privacy-exclusion-template.md`, `templates/memory-config-template.md`.
- Adapter plans: `adapters/memory/claude-mem-adapter-plan.md`, `adapters/hooks/memory-hooks-contract.md`.

## Upstream structure notes

The 2026-06-06 audit observed upstream areas worth watching: `README.md`, documentation, plugin packaging directories, source/service code, scripts, and installation material. These areas indicate the lifecycle events, configuration surface, search model, storage architecture, and harness support that should inform future local docs. They are not copied into this repository.

## Integration strategy

1. Preserve `claude-mem` as a tracked inspiration source with license, commit, and changelog metadata.
2. Normalize ideas into Vibe Coding OS skills, commands, workflows, templates, and adapter contracts.
3. Compose with existing Supermemory-inspired local memory skills instead of duplicating provider or search abstractions.
4. Keep runtime implementation optional and future-facing; documentation must be useful without installing `claude-mem`.
5. Validate reference mappings and registries after changes.

## Update watchlist

Watch upstream changes to lifecycle hooks, context injection, memory compression, progressive disclosure, privacy controls, observation citation/search APIs, plugin packaging, multi-harness support, installation behavior, and storage/search architecture.

## Maintenance playbook

1. Run `npm run references:clone` or inspect upstream metadata without staging `references/upstreams/`.
2. Record date, commit, license status, applied ideas, not-applied ideas, and local impact in this changelog.
3. Update `references/index.json` and mapping docs before touching local skills or commands.
4. If an upstream idea requires runtime code, create a separate spec/ADR and keep it optional.
5. Run `npm run validate:references` and `npm run validate`.

## Do not copy

Do not vendor upstream code, hook scripts, installer logic, docs, prompts, database schemas, UI assets, worker services, examples, or large text blocks. Summarize concepts in original Vibe Coding OS language and keep attribution explicit.

## Last audit notes

- 2026-06-06: verified upstream HEAD as `671de5e3e20544f1d50e7488088063ffb5275646` with `git ls-remote`; verified Apache-2.0 license via upstream `LICENSE`; skimmed README headings and feature references for lifecycle, search, configuration, troubleshooting, worker/storage, plugin, and citation concepts. No upstream content was copied beyond repository metadata and short names.

## Ghi chú tiếng Việt

Tích hợp này chỉ dùng `claude-mem` làm nguồn tham khảo. Vibe Coding OS học cách ghi nhớ phiên làm việc, nén ngữ cảnh, tìm kiếm dần, chèn ngữ cảnh có trích dẫn và loại trừ dữ liệu nhạy cảm; không sao chép mã, không cài phụ thuộc, và không bắt buộc kiến trúc runtime của upstream.
