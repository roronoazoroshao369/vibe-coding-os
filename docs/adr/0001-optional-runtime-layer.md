# ADR 0001: Optional runtime layer

**Status:** Accepted
**Date:** 2025-12-15
**Deciders:** @roronoazoroshao369

## Status

Accepted.

## Context

Vibe Coding OS is markdown-first. Recent task, memory, team, and checkpoint workflows benefit from a small machine-readable companion state, but a mandatory daemon or database would violate portability and lightweight defaults.

## Decision

Add an optional JSON-first runtime under `.omc/runtime/`. Markdown artifacts remain the durable baseline. Runtime commands materialize inspectable task, memory, checkpoint, team, and session state for local use.

The MVP uses one-shot Node CLI scripts, atomic JSON writes, a simple lock file, schema versions, and an append-only `events.jsonl`. No daemon, external service, SQLite, vector store, GitHub sync, or tmux runner is enabled by default.

## Consequences

- Users can keep using the repo without runtime setup.
- Runtime state is local, reviewable, and disposable.
- Runtime scope is frozen by [ADR 0002: Runtime Scope Freeze](0002-runtime-scope-freeze.md). Later runtime expansion (SQLite, vector services, GitHub sync, live execution, daemons, or new MCP write tools) requires a new ADR exception and must pass the Engine Adoption Gate.
- Runtime memory must redact likely secrets before write.

## Verification

- `npm run runtime:init -- --force`
- `npm run runtime:validate`
- `npm run validate`

## Ghi chú tiếng Việt

Runtime là lớp tùy chọn, không thay thế markdown. MVP chỉ ghi JSON local trong `.omc/runtime/`, không chạy daemon hay dịch vụ ngoài.
