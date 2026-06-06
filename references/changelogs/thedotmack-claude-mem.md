# Changelog: thedotmack/claude-mem

## Purpose

Track upstream changes that may affect Vibe Coding OS persistent context, session memory, compression, retrieval, privacy, hook, and adapter guidance.

## Entries

### 2026-06-06 persistent context integration audit

- Audited upstream: yes. Verified `https://github.com/thedotmack/claude-mem` HEAD with `git ls-remote` at `671de5e3e20544f1d50e7488088063ffb5275646` and verified Apache-2.0 from upstream `LICENSE`.
- Applied features: session-capture-lifecycle, memory-compression, context-injection-policy, progressive-disclosure-retrieval, memory-search-workflow, privacy-exclusion-rules, observation-id-citations, hook-based-agent-memory as an optional contract, memory-configuration-policy, troubleshooting guidance, and multi-harness adapter planning.
- Not-applied features: actual upstream hook scripts, Bun worker service, SQLite/Chroma implementation, local web viewer clone, installer clone, background daemon, OpenClaw gateway, beta/endless mode, hard dependency, full runtime architecture clone, copied prompts/docs/code/assets.
- Local skills created/updated: `skills/memory/session-capture/SKILL.md`, `skills/memory/session-compression/SKILL.md`, `skills/memory/context-injection/SKILL.md`, `skills/memory/progressive-memory-disclosure/SKILL.md`, `skills/memory/observation-citations/SKILL.md`, `skills/memory/privacy-exclusion/SKILL.md`, `skills/memory/memory-configuration/SKILL.md`, `skills/memory/memory-troubleshooting/SKILL.md`, and `skills/memory/hook-based-memory/SKILL.md`.
- Commands/templates/docs updated: added session capture, summary, context injection, progressive search, citation, configuration, and troubleshooting commands; added observation, summary, injection, search, privacy, and config templates; added feature docs, workflows, and adapter contract docs.
- Index/mapping updates: updated `references/index.json`, `registry/sources.json`, `registry/skills.json`, `registry/prompts.json`, `references/mappings/source-to-local-skills.md`, `references/mappings/feature-to-local-files.md`, and `references/mappings/update-impact-map.md`.
- Attribution/license updates: updated `ATTRIBUTIONS.md` and `NOTICE.md` to record Apache-2.0 inspiration/adaptation only and no vendored code.
- Remaining follow-ups: consider a future opt-in local memory store spec, adapter tests, memory entry retention policy, and a small evaluator for progressive retrieval quality.

### 2026-06-06 baseline local clone audit

- Source: `thedotmack/claude-mem`.
- Commit: `671de5e3e20544f1d50e7488088063ffb5275646`.
- License status: Apache-2.0.
- Finding: Audited local clone for persistent memory safety, opt-out behavior, observer boundaries, installation checks, and unintended-recording tests. Reinforced local memory failure-mode coverage; no upstream content imported.
- Local follow-up: keep future audits in `references/changelogs/thedotmack-claude-mem.md`, update `references/index.json`, and use `references/upstream-audit-workflow.md` before adapting ideas.

### Unreleased / Next audit

- Watch lifecycle hooks, context injection, memory compression, progressive disclosure, privacy controls, search/citation model, plugin packaging, harness support, and database/search architecture.

## Ghi chú tiếng Việt

Changelog này ghi rõ đã học ý tưởng nào từ `claude-mem`, bỏ qua runtime nào, và file local nào được cập nhật. Không copy mã hoặc tài liệu lớn từ upstream.
