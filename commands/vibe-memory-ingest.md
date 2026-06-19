---
description: "Create a privacy-filtered durable memory entry using structured ingestion phases."
---

# vibe-memory-ingest

## When to use

Use when you need to create a privacy-filtered memory entry from durable facts. Use the smallest relevant memory skill and avoid duplicating existing `project-memory`, `context-retrieval`, `privacy-filter`, `session-summarizer`, or `agent-handoff` behavior.

## Required inputs

- Task, memory scope, and intended output.
- Candidate memory content or retrieval/search query.
- Source, confidence, sensitivity, staleness risk, and relevant local files.
- `--source` flag: session | decision | review | debug.
- Optional provider constraints only if explicitly requested.

## Structured ingestion steps

1. **Classify** — Identify source type and set `--source` flag. Default: `session` if uncertain. Route through the source-type routing table for scope and retention defaults.
2. **Capture** — Isolate the durable fact from raw output. Discard transient coordination and conversational framing.
3. **Filter** — Run `privacy-filter` at this gate. Block secrets, credentials, personal data. Record rejected-content note for excluded material.
4. **Extract** — Parse structured elements: core fact, source artifact, affected files, confidence, contradictions. Drop noise.
5. **Format** — Map to the canonical memory entry schema. Set lifecycle_stage to `formatted`, mark quality_checks_passed.
6. **Store** — Persist at the correct scope. Set lifecycle_stage to `stored`. Never store secrets or full transcripts.

## Behavior (`--source` flag)

- `--source session`: default scope is session or worktree; moderate privacy risk; expire-after-next-session.
- `--source decision`: default scope is project; low privacy risk; indefinite retention under project.
- `--source review`: default scope is worktree or project; low privacy risk; keep-until-branch-cleanup.
- `--source debug`: default scope is worktree or session; low privacy risk; expire-after-fix-verified.

When `--source` is omitted, default to `session` and document the assumption.

## Behavior

1. Read governing repo instructions and memory conventions.
2. Select the matching memory skill.
3. Run privacy filtering before storing, sharing, or sending content to a provider.
4. Prefer local-first behavior and document provider use as optional.
5. Produce a concise artifact using the relevant template.
6. Report assumptions, blocked content, stale memories, contradictions, and verification status.

## Outputs

- Memory entry with source_type, lifecycle_stage, quality_checks_passed, source, scope, confidence, and citations.
- Rejected-content note for excluded sensitive or low-value material.
- Explicit applied/not-applied feature decisions when upstream inspiration is involved.

## Stopping conditions

Stop if candidate content contains secrets that cannot be safely removed, the user has not authorized an external provider, required sources are unavailable, or the memory would be speculative/noisy rather than durable. Also stop if privacy filter rejects the entry and no safe redaction is possible.

## Verification checklist

- [ ] `--source` flag set (session/decision/review/debug) or explicitly defaulted.
- [ ] Ingestion lifecycle phases followed: capture → filter → extract → format → store.
- [ ] Privacy check completed at each phase gate.
- [ ] Local fallback is available.
- [ ] No Supermemory dependency or client was added.
- [ ] Sources, confidence, and staleness are documented.
- [ ] lifecycle_stage and quality_checks_passed recorded.
- [ ] Output is concise and useful to a future agent.

## Ghi chú tiếng Việt

Lệnh này tạo bộ nhớ an toàn theo quy trình 5 bước (capture → filter → extract → format → store). Luôn dùng `--source` để phân loại nguồn, không lưu bí mật, và ghi lại lifecycle_stage cùng quality_checks_passed.
