# Progressive Memory Retrieval

## Purpose

Provide a local, legally safe memory workflow inspired by `thedotmack/claude-mem` that improves continuity without copying upstream code or requiring its runtime architecture.

## When to use

Use when memory may help but dumping all context would be noisy or risky.

## Step-by-step workflow

1. Identify the task scope, current lifecycle phase, and memory objective.
2. Run privacy exclusion before recording, compressing, searching, or injecting memory.
3. Capture durable observations: intent, constraints, decisions, evidence, files, commands, validation, and follow-ups.
4. Compress observations into concise summaries with timestamps, confidence, stale/uncertain labels, and citations.
5. Search progressively: query broad memory, review result summaries, then fetch or include only relevant details.
6. Inject a small context bundle into the active task only when it directly changes planning or implementation.
7. Cite observation IDs, files, handoff notes, or summaries when relying on memory.
8. At session end, create a summary and handoff with validation status and remaining risks.

## Required inputs

- Task description and repository scope.
- Candidate session observations or retrieval query.
- Privacy exclusions, sensitivity tags, confidence, and staleness risk.
- Related files, commands, validation results, and follow-ups.

## Outputs

- Safe memory observations, compressed session summary, progressive retrieval report, context injection bundle, or handoff note.
- Explicit blocked content and assumptions when relevant.

## Related skills

- `skills/memory/session-capture/SKILL.md`
- `skills/memory/session-summarizer/SKILL.md`
- `skills/memory/progressive-memory-disclosure/SKILL.md`
- `skills/memory/progressive-memory-disclosure/SKILL.md`
- `skills/memory/observation-citations/SKILL.md`
- `skills/memory/privacy-filter/SKILL.md`
- Existing overlap skills: `memory-search`, `progressive-memory-disclosure`, `privacy-filter`, `session-summarizer`, and `agent-handoff`.

## Related commands

- `commands/vibe-session-capture.md`
- `commands/vibe-session-summary.md`
- `commands/vibe-context-inject.md`
- `commands/vibe-memory-progressive-search.md`
- `commands/vibe-memory-cite.md`
- `commands/vibe-memory-config.md`
- `commands/vibe-memory-troubleshoot.md`

## Applied / Not applied

Applied: session lifecycle, compression, progressive disclosure, context injection, citations, privacy exclusions, and hook-aware planning. Not applied: copied upstream scripts, Bun service, SQLite/Chroma stack, local web viewer clone, installer, daemon, OpenClaw gateway, or beta/endless mode.

## Maintenance notes

Update this workflow when upstream changes lifecycle hooks, compression, search/progressive disclosure, privacy controls, context configuration, citation model, or plugin packaging. Keep local content original and run `npm run validate:references` after reference edits.

## Ghi chú tiếng Việt

Quy trình này giúp agent tiếp tục công việc giữa các phiên bằng bộ nhớ ngắn gọn, có trích dẫn và đã lọc bí mật. Không lưu transcript thô hoặc thông tin nhạy cảm; chỉ chèn ngữ cảnh thật sự cần cho nhiệm vụ hiện tại.
