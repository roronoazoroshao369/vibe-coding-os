# Skill: Session Capture

## Purpose

Capture session activity as safe, concise observations. This skill adapts `thedotmack/claude-mem` concepts into Vibe Coding OS while composing with existing memory skills such as `project-memory`, `session-summarizer`, `context-retrieval`, `memory-search`, `memory-retrieval`, `memory-privacy`, `privacy-filter`, and `agent-handoff`.

## When to use

Use when a task needs persistent context across sessions, session observations, compressed summaries, context injection, progressive retrieval, citation IDs, privacy exclusions, hook planning, memory configuration, or troubleshooting. Prefer an existing narrower skill when it already covers the need.

## Inputs

- Current task, session goal, and repository scope.
- Candidate observations, commands run, files touched, decisions, risks, validation, and follow-ups.
- Source references, confidence level, staleness risk, sensitivity/privacy tags, and optional observation IDs.
- Applicable templates in `templates/` and workflows in `docs/workflows/`.

## Workflow

1. Read local memory conventions and check overlapping memory skills before creating new memory.
2. Define the memory lifecycle phase: capture, compress, search, inject, cite, configure, troubleshoot, or hand off.
3. Apply privacy exclusion first; remove secrets, credentials, private keys, tokens, unnecessary personal data, and raw sensitive transcripts.
4. Capture only durable facts: user intent, constraints, decisions, evidence, commands/checks, file paths, risks, and follow-ups.
5. Compress noisy context into concise observations or summaries while preserving uncertainty, timestamps, source, and citations.
6. Retrieve progressively: search/index first, inspect summaries, then fetch details only for relevant observation IDs.
7. When injecting context, include only task-relevant entries with citations, confidence, and stale/contradictory labels.
8. Record applied/not-applied upstream ideas and avoid implementing runtime infrastructure unless explicitly requested.

## Outputs

- Safe observation, summary, citation bundle, memory configuration note, troubleshooting note, context injection bundle, or hook/adapter planning artifact.
- Explicit blocked content or privacy exclusions when relevant.
- Follow-up actions and verification status.

## Failure modes

- Duplicating existing memory skills instead of composing with them.
- Storing secrets, private credentials, raw transcripts, or sensitive personal data.
- Compressing away uncertainty, source, validation status, or privacy warnings.
- Injecting stale or excessive memory without relevance filtering.
- Treating `claude-mem` runtime architecture as required.

## Verification checklist

- [ ] Existing memory skills and docs were checked for overlap.
- [ ] Privacy exclusion ran before storage, retrieval, injection, or sharing.
- [ ] Output is concise, source-aware, and useful to a future agent.
- [ ] Observation IDs or source citations are present when making memory-backed claims.
- [ ] Staleness, uncertainty, contradictions, and follow-ups are labeled.
- [ ] No upstream code, scripts, database schema, installer, or large text was copied.

## Applied / Not Applied

Applied: lifecycle-aware memory capture, compression, progressive disclosure, context injection, observation citations, privacy exclusions, configuration, troubleshooting, and optional hook vocabulary. Not applied: copied hook scripts, Bun worker, SQLite/Chroma implementation, web viewer clone, installer clone, background daemon, OpenClaw gateway, beta/endless mode, hard dependency, or full architecture clone.

## Ghi chú tiếng Việt

Kỹ năng này giúp agent nhớ việc quan trọng giữa các phiên nhưng vẫn an toàn. Luôn lọc bí mật trước, ghi nhớ ngắn gọn có nguồn/trích dẫn, tìm kiếm theo từng lớp, và không biến `claude-mem` thành phụ thuộc bắt buộc.
