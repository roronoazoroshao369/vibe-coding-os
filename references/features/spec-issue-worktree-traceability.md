# Feature: Spec Issue Worktree Traceability

## Purpose

Track how accepted spec criteria map to implementation issues and branches/worktrees using markdown only.

## Local files

- `templates/traceability-map-template.md`
- `skills/core/task-state-tracking/SKILL.md`
- `templates/tasks-template.md`
- `commands/vibe-tasks.md`
- `commands/vibe-worktree.md`

## Policy

Every issue should cover observable spec criteria. Every in-progress issue should name owner and branch/worktree when the work is split across isolated slices. No GitHub automation, MCP server, queue engine, or runtime dependency is implied.

## Task-state conventions

Traceability depends on trustworthy task states. Each issue's implementation status must
follow the state machine defined in `skills/core/task-state-tracking/SKILL.md`: `proposed`
→ `approved` → `in-progress` → `review` → `done | blocked | abandoned`. A task in `review`
that has an open worktree branch should name the branch in the traceability map so the
reviewer knows where to look. A `done` task with a `depends-on` relationship records which
branch the implementation landed on.

## Ghi chú tiếng Việt

Bảng truy vết nối spec → issue → branch/worktree bằng markdown để tránh mất scope khi nhiều slice chạy song song.
