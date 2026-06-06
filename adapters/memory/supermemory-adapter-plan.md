# Supermemory Adapter Plan

## Purpose

Record how a future optional Supermemory adapter could be designed without implementing a real API client now.

## Optional external memory provider interface

A future adapter may map local operations (`ingest`, `retrieve`, `search`, `update`, `forget`, `evaluate`, `healthcheck`) to Supermemory APIs after a fresh audit and explicit user approval.

## Local-first fallback

Every provider call must have a local fallback using `templates/memory-entry-template.md`, `templates/memory-retrieval-report-template.md`, and `docs/memory-conventions.md`.

## Expected adapter contract

- Inputs: sanitized content, query, scope, source, confidence, sensitivity, and expiry.
- Outputs: normalized memory entries or retrieval reports with provider metadata.
- Safety: no secrets, no unauthorized provider calls, no silent upload.
- Failure: return actionable local fallback instructions.

## Deliberately not implemented yet

No SDK, HTTP client, auth, MCP config, dashboard, connector, database, worker, sync job, or benchmark integration is added.

## Future safe implementation steps

Write a spec, audit upstream, define schemas, add tests with mocked provider responses, keep dependencies optional, document environment variables, and update attribution/mappings/validation.

## Ghi chú tiếng Việt

Kế hoạch này chỉ mô tả hướng adapter trong tương lai. Không có mã gọi API Supermemory trong PR này; mọi tích hợp cloud phải được người dùng yêu cầu rõ ràng và có fallback cục bộ.
