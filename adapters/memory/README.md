# Memory Adapters

## Purpose

Define an optional external memory provider interface for Vibe Coding OS while keeping local-first memory as the default.

## Expected adapter contract

A future adapter should document operations for `ingest`, `retrieve`, `search`, `update`, `forget`, `evaluate`, and `healthcheck`. Each operation must declare input schema, output schema, privacy behavior, failure behavior, rate/cost expectations, and local fallback.

The concrete interface contract is defined in `skills/memory/memory-ingestion/SKILL.md`. All adapters must comply with that contract, which divides operations into required (store, retrieve, search, delete) and optional (batch, stream, rank), defines error semantics for each operation class, and sets stability expectations. Adapters must document their compliance level as `full`, `partial`, or `planned`.

## Local-first fallback

If a provider is unavailable, unauthorized, too costly, or unsafe for the content, the agent must use local memory docs/templates and report the limitation instead of failing silently.

## Optional external provider interface

External providers may be planned only when the user requests them. Provider-specific SDKs, API clients, auth flows, dashboards, connector stacks, and databases are not required by this repository.

## Deliberately not implemented yet

No Supermemory client, MCP setup, hosted service requirement, database schema, dashboard, connector integration, background sync, or benchmark runner is implemented.

## How future AI should safely add a Supermemory adapter

1. Re-audit `supermemoryai/supermemory` and update reference changelog metadata.
2. Create or update a spec and adapter plan before coding.
3. Keep SDK dependencies optional and isolated.
4. Add privacy filtering before provider calls.
5. Implement local fallback and tests for provider failure.
6. Update registries, mappings, attribution, and validation.

## Ghi chú tiếng Việt

Adapter bộ nhớ phải là tùy chọn. Nếu không có khóa API, mạng, quyền truy cập, hoặc nội dung không an toàn, agent phải dùng bộ nhớ cục bộ và ghi rõ giới hạn thay vì gửi dữ liệu ra ngoài.
