# Vibe Coding OS — Runtime Boundary

Vibe Coding OS treats runtime primitives as **optional local guardrails**, not a competing agent runtime.

## What the runtime is

The runtime is a lightweight optional layer for users who want:

- task tracking
- approval gates
- claim/lease management
- event log
- local diagnostics

It is designed for **discipline, auditability, and portability**, not full multi-agent orchestration.

## What the runtime is not

Vibe Coding OS is **not** trying to replace:

- CrewAI
- LangGraph
- OpenHands
- dedicated runtime engines

The core product value is still:

- portable workflow contracts
- reusable skills
- tool export for Cursor / Claude / Codex / Gemini
- first-workflow guidance
- repository-level discipline

## Runtime philosophy

Use runtime features only when they add value without increasing vendor-style coupling:

- keep configuration simple and local
- keep schema rules lightweight
- prefer optional diagnostics over mandatory runtime machinery
- prefer portable instructions over heavy runtime orchestration

## Key runtime concepts

### Config

Config lives in `.omc/config.json` and is optional.
It provides:

- policy defaults
- risk limits
- runtime behavior hints

Example:

```json
{
  "version": "1.0.0",
  "runtime": {
    "maxTaskLease": 1200,
    "heartbeatInterval": 30,
    "eventRetentionDays": 14
  }
}
```

### Task state machine

Task lifecycle is based on explicit states:

- `pending`
- `in_progress`
- `blocked`
- `completed`
- `cancelled`

Transitions are intentional and guarded, not free-form mutations.

### Event store

The canonical event store is:

- `runtime/core/event-store.mjs`

It supports:

- sequence numbers
- correlation IDs
- causation IDs
- idempotency keys
- metadata consistency checking

Legacy compatibility:

- `runtime/core/events.mjs` still exists
- `appendEvent()` wraps the canonical event store

### Doctor

`vibe doctor` and `vibe doctor --json` provide local runtime diagnostics.
`vibe doctor --project <path>` checks project readiness and runtime health together.

## Boundaries

The runtime should remain:

- optional
- local-first
- lightweight
- understandable without a SaaS platform

If a feature starts to feel like a full workflow runtime, reconsider whether it belongs in this project.

## Recommended usage

Use the framework for:

1. Spec
2. Plan
3. Implement
4. Review
5. Verify

Use the runtime only for optional local tracking and guardrails.

## Summary

Vibe Coding OS is a portable discipline layer.
Runtime features exist to support safe local AI-assisted workflows, not to build a general-purpose agent platform.
