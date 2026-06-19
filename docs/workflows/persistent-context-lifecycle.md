# Persistent Context Lifecycle

## Purpose

Provide a local, legally safe memory workflow inspired by `thedotmack/claude-mem` that improves continuity without copying upstream code or requiring its runtime architecture.

## When to use

Use for end-to-end memory continuity across capture, compression, retrieval, injection, and handoff.

## Step-by-step workflow

1. Identify the task scope, current lifecycle phase, and memory objective.
2. Run privacy exclusion before recording, compressing, searching, or injecting memory.
3. Capture durable observations: intent, constraints, decisions, evidence, files, commands, validation, and follow-ups.
4. Compress observations into concise summaries with timestamps, confidence, stale/uncertain labels, and citations.
5. Search progressively: query broad memory, review result summaries, then fetch or include only relevant details.
6. Inject a small context bundle into the active task only when it directly changes planning or implementation.
7. Cite observation IDs, files, handoff notes, or summaries when relying on memory.
8. At session end, create a summary and handoff with validation status and remaining risks.

## Lifecycle event flow

The persistent context lifecycle progresses through six distinct events, each with a specific memory action:

1. **Session start** → *Retrieve.* Before beginning work, load relevant context from prior sessions: ongoing decisions, active constraints, unresolved risks, and the last handoff summary. Do not load the entire memory store — scope the retrieval to the current task plan or spec.
2. **Task definition** → *Index.* After the task scope is clear, tag the session with searchable context keys (feature name, module path, risk markers) so subsequent retrievals can find it. Record what the task is expected to produce and the acceptance criteria it must meet.
3. **Mid-task checkpoints** → *Capture.* At natural breakpoints — after completing a subtask, after verification, before a handoff — capture a thin observation: what changed, what was verified, and what remains. Keep observations under five lines unless a finding is novel or blocking.
4. **Phase transitions** → *Handoff.* When moving between spec → plan → tasks → implementation phases, create a phase-summary observation that records phase outputs, open questions, and decisions made. The next phase loads this summary rather than re-deriving context.
5. **Verification and review** → *Attach.* Link validation results and review findings to the session observations so the handoff includes evidence, not just claims. An observation without a verification link is an untested claim.
6. **Session end** → *Summarize and handoff.* Compress the session into a handoff note with validation status, remaining risks, files touched, and explicit next-start instructions. The handoff becomes the first context loaded on the next session start, closing the lifecycle loop.

Each event maps to one or more hook points in the general hook taxonomy (`docs/workflows/hook-patterns.md`): session-start/end hooks for events 1 and 6, command hooks for events 2-3, workflow phase-entry/exit hooks for event 4, and verification-pass/fail hooks for event 5. The taxonomy defines the contract; this lifecycle defines the order and the data each event carries.

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
