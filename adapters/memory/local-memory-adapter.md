# Local Memory Adapter

## Purpose

Define the default fallback memory adapter for Vibe Coding OS.

## Optional external memory provider interface

The local adapter is the baseline contract that external providers must match: ingest durable entries, retrieve by task, search by query, update stale/contradictory facts, forget unsafe or obsolete content, evaluate usefulness, and report health.

## Local-first fallback

Local memory uses repository docs, templates, handoff notes, and memory conventions. It must work without network access, API keys, external accounts, or provider dependencies.

## Expected adapter contract

- Store concise, source-aware, privacy-filtered entries.
- Search and retrieve with exact file citations when possible.
- Label confidence, scope, sensitivity, and stale/expiry risk.
- Block secrets and unnecessary personal data.

## Deliberately not implemented yet

No vector database, cloud sync, hosted dashboard, background indexer, or external provider client is implemented.

## How future AI should extend it

Add only small documented behavior first, update templates and validation, and ensure provider adapters remain optional layers over this local fallback.

## Ghi chú tiếng Việt

Bộ nhớ cục bộ là mặc định. Nó phải đủ dùng khi không có internet hoặc khóa API, và không được lưu bí mật hay dữ liệu cá nhân không cần thiết.
