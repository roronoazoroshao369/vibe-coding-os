# Reference: othmanadi/planning-with-files

## Metadata

- Repo: https://github.com/OthmanAdi/planning-with-files
- Owner: OthmanAdi
- Name: planning-with-files
- Category: planning-workflow
- Status: tracked
- Import mode: inspiration
- License: MIT (23k★)
- Last checked: 2026-06-19
- Last known commit: unknown

## Why this repo matters

`othmanadi/planning-with-files` (23,000+ stars, MIT) introduces the concept of persistent
plan files that survive agent context resets. The core insight is that plans should be stored
as regular files with a structured format that an agent can re-read after a context loss and
immediately understand what was done, what remains, and what to do next.

The repo demonstrates a pattern where plans use a consistent markdown structure with
checkpoint markers and progress indicators that are unambiguous after re-read. This is
especially valuable for multi-session work where an agent may need to resume after a
session timeout, a tab close, or a handoff to another agent.

## Key concepts

- Plans as persistent files, not ephemeral scratchpad state.
- Completion markers that survive context resets (bracket-based, part of markdown source).
- Checkpoint system: a named label per milestone that records the last known-good state.
- Recovery workflow: a structured procedure for resuming from a plan file after context loss.
- Recovery-count tracking: incrementing a counter each time recovery runs helps detect
  repeated recovery loops.

## Features to study

| Feature | Why it matters | Local equivalent | Status | Target local files |
|---------|---------------|------------------|--------|-------------------|
| persistent-plan-format | Plans survive context loss when stored as files with structured metadata. | `templates/crash-proof-plan-template.md` | implemented | `skills/core/crash-proof-planning/SKILL.md` |
| completion-markers | Unambiguous step state that survives re-read. | Bracket markers `[ ]`/`[~]`/`[x]`/`[!]`/`[-]` | implemented | `skills/core/crash-proof-planning/SKILL.md` |
| checkpoint-system | Named checkpoints record the last known-good state. | `templates/crash-proof-plan-template.md` checkpoint block | implemented | `skills/core/crash-proof-planning/SKILL.md` |
| recovery-workflow | Structured procedure for resuming after context loss. | `commands/vibe-session-catchup.md` | implemented | `skills/core/crash-proof-planning/SKILL.md` |
| recovery-attempt-tracking | Incrementing counter detects repeated recovery loops. | `recovery-count` in frontmatter | implemented | `commands/vibe-session-catchup.md` |
| crash-scenario-taxonomy | Categorizing crash types to ensure coverage. | Crash scenarios table in SKILL.md | implemented | `skills/core/crash-proof-planning/SKILL.md` |

## Applied to Vibe Coding OS

- Persistent plan format with YAML frontmatter (plan-id, status, checkpoint, recovery-count).
- Bracket completion markers (`[ ]`, `[~]`, `[x]`, `[!]`, `[-]`) that survive re-read.
- Checkpoint block at end of plan recording last known-good state.
- Recovery workflow executable via `vibe-session-catchup` command.
- Recovery-count tracking to detect repeated recovery loops.
- Crash scenario taxonomy covering timeout, handoff, partial completion, git operations.

## Not applied to Vibe Coding OS

- The upstream repository's specific file format or naming conventions.
- Any runtime plan engine, daemon, or watcher.
- Cloud-synced plan state or external plan storage.
- Upstream text, templates, or examples (no vendoring).

## Local mapping

- `skills/core/crash-proof-planning/SKILL.md` — Crash-proof planning skill
- `commands/vibe-session-catchup.md` — Session catchup recovery command
- `templates/crash-proof-plan-template.md` — Persistent plan template
- `references/features/crash-proof-planning.md` — Design rationale

## Upstream structure notes

Observed during initial tracking (do not copy content): the upstream repo provides a
markdown-based planning system where plans are files with a specific structure including
section headers, completion checkboxes, and progress summaries. The approach is purely
file-based with no runtime dependencies. Vibe Coding OS adapts the concept of
context-resilient planning but uses its own format, templates, and workflow conventions.

## Ghi chú tiếng Việt

Nguồn cảm hứng `othmanadi/planning-with-files` (23k★, MIT): kế hoạch dạng file bền vững,
marker trạng thái bước không bị mất khi đọc lại, checkpoint ghi trạng thái cuối, quy trình
phục hồi sau mất ngữ cảnh. Vibe Coding OS chuyển thành skill/command/template nguyên bản
với format YAML frontmatter + bracket markers + checkpoint block. Không copy upstream.
