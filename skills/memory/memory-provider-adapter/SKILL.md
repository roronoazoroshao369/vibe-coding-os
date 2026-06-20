---
name: memory-provider-adapter
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: memory
tags:
  - memory
status: stable
---

# Skill: Memory Provider Adapter

## Purpose

Plan optional memory provider integrations without making the provider mandatory or copying upstream runtime code. Define a concrete interface contract with required and optional operations, error semantics, and stability expectations.

## When to use

Use when a user asks about external memory backends, vector stores, hosted search, MCP memory tools, or provider-specific configuration. Use when implementing or evaluating a provider adapter against the interface contract.

## Inputs

- Provider goal, constraints, and data categories.
- Local-first fallback requirements.
- Privacy policy, auth needs, retention, export/delete support, and failure behavior.
- Provider interface contract requirements (required vs optional operations).

## Provider Interface Contract

A compliant memory provider adapter must implement the following contract. Operations are divided into required (must implement) and optional (may implement).

### Required Operations

| Operation | Signature | Description | Error Semantics |
|---|---|---|---|
| `store(entry)` | Takes a structured memory entry, returns entry ID or error | Persist a privacy-filtered, source-aware entry. Must accept source_type, lifecycle_stage, confidence, staleness. | Return explicit error if schema validation fails. Never silently drop fields. |
| `retrieve(query)` | Takes a retrieval question + scope filter, returns matching entries or empty set | Fetch entries relevant to a structured query. Must support scope filtering. | Return empty set (not error) when no matches found. Return error only on connection/auth failure. |
| `search(terms, filters)` | Takes search terms + optional filters (scope, date, confidence), returns ranked entries | Search by keyword, entity, or path. Should return ranking metadata. | Return empty set on no matches. Timeout after configurable duration. |
| `delete(entry_id)` | Takes entry ID, returns success or error | Remove a specific entry. Must support soft-delete or hard-delete. | Return error if entry does not exist. Idempotent: deleting already-deleted entry succeeds. |

### Optional Operations

| Operation | Signature | Description | When to Implement |
|---|---|---|---|
| `batch(operations)` | Takes array of store/delete operations, returns results | Process multiple operations atomically or sequentially. | When provider supports bulk operations and latency matters. |
| `stream(query)` | Takes query, returns async iterator of entries | Stream results as they become available instead of waiting for all. | When provider supports real-time or incremental retrieval. |
| `rank(entries, query)` | Takes candidate entries + query, returns re-ranked list | Re-rank results by provider-specific relevance signals. | When provider has proprietary ranking unavailable locally. |

### Error Semantics

All operations must follow these error conventions:

- **Connection errors**: return a structured error with `provider_unavailable` code and a retry hint. Never crash the calling agent.
- **Auth errors**: return `auth_required` or `auth_expired` error. Never store credentials in error messages.
- **Rate limits**: return `rate_limited` with retry-after hint. Never silently drop requests.
- **Schema validation**: return `validation_error` with field-level details for store operations. Never accept malformed entries.
- **Timeout**: return `timeout` after provider-specific duration. The adapter must have a configurable timeout default.
- **Unimplemented operation**: return `not_implemented` error for optional operations not yet built. The calling agent must fall back to local behavior.

### Stability Expectations

- Required operations must not change signature without a major version marker in the adapter plan.
- Optional operations may be added at any time but must return `not_implemented` until built.
- Provider adapters must document their current compliance level: `full` (all required ops), `partial` (subset of required ops), or `planned` (not yet implemented).
- Breaking changes to the interface contract require updating this SKILL.md and all adapter plans.

## Workflow

1. Define the provider capability needed: store, search, summarize, sync, or citations.
2. Check required vs optional operations against the interface contract.
3. List data that would leave local storage and whether it includes sensitive content.
4. Require explicit opt-in for external storage/search.
5. Define local fallback and provider-down behavior.
6. Document auth handling without recording secrets.
7. Map provider outputs back to local citation, confidence, freshness, and scope labels.
8. Treat upstream SDKs/daemons as inspiration only unless the project explicitly becomes a runtime.

## Outputs

- Provider adapter plan with compliance level (full, partial, planned).
- Privacy/data-flow note.
- Local fallback and troubleshooting checklist.

## Failure modes

- Making hosted memory a hidden dependency.
- Storing tokens or provider secrets in memory.
- Losing citation/confidence metadata at provider boundaries.
- Copying upstream implementation code into this docs framework.
- Claiming full compliance without testing required operations.
- Returning `not_implemented` for required operations.

## Verification checklist

- [ ] External provider use is explicit and optional.
- [ ] Required operations (store, retrieve, search, delete) are documented with signatures.
- [ ] Optional operations (batch, stream, rank) are documented as not-yet-implemented if absent.
- [ ] Error semantics documented for each operation class.
- [ ] Compliance level stated: full, partial, or planned.
- [ ] Local fallback is documented.
- [ ] Data leaving local storage is listed.
- [ ] Secret handling avoids memory/log storage.
- [ ] Provider output preserves citation, confidence, and freshness labels.
- [ ] Stability expectations are documented.

## Ghi chú tiếng Việt

Khi lập kế hoạch nhà cung cấp bộ nhớ, hãy đối chiếu với interface contract: required ops (store, retrieve, search, delete) phải có, optional ops (batch, stream, rank) có thể thêm sau. Ghi rõ compliance level, error semantics, và dữ liệu nào rời khỏi máy. Không copy runtime upstream.
