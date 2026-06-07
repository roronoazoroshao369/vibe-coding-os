# Optional Runtime Architecture

Vibe Coding OS remains markdown-first. The optional runtime provides local JSON state for tasks, memory, checkpoints, teams, and sessions when users want CLI-assisted coordination.

## Baseline

- Canonical guidance: `skills/`, `commands/`, `templates/`, `docs/`, `CONTEXT.md`, `ROADMAP.md`, `STANDARDS.md`.
- Optional runtime state: `.omc/runtime/*.json` plus `.omc/runtime/events.jsonl`.
- Setup: `npm run runtime:init -- --force`.
- Validation: `npm run runtime:validate`.

## Modules

| Area | Files | Purpose |
| --- | --- | --- |
| Core | `runtime/core/*.mjs` | IDs, atomic JSON store, lock files, events, schema checks, privacy redaction. |
| Tasks | `runtime/tasks/task-store.mjs` | CRUD, dependency-aware next task, markdown checkbox import. |
| Memory | `runtime/memory/*.mjs` | Local JSON ingest/search with source metadata and redaction. |
| Checkpoints | `runtime/checkpoints/checkpoint-engine.mjs` | Readiness/done gate evidence records. |
| Teams | `runtime/teams/team-store.mjs` | Import generated or template team specs; no live spawning. |
| Sessions | `runtime/sessions/session-store.mjs` | Simple session goal/summary records. |

## CLI contracts

```bash
npm run runtime:task -- create --title "Example"
npm run runtime:task -- next
npm run runtime:memory -- ingest --content "Decision: runtime optional" --scope project
npm run runtime:checkpoint -- create --type readiness --result pass --subject runtime-mvp
npm run runtime:team -- import templates/team-spec-template.json
npm run runtime:session -- create --goal "runtime smoke"
```

## Adapter policy

SQLite, vector search, GitHub sync, and tmux/team execution are future adapters. Each adapter must preserve markdown-first operation, explicit opt-in config, privacy filtering, and validation evidence.

## Ghi chú tiếng Việt

Kiến trúc runtime này chỉ là companion local: giúp đọc/ghi trạng thái máy-đọc, nhưng không bắt buộc và không thay docs/markdown làm nền tảng.
