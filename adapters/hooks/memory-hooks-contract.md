# Memory Hooks Contract

## Purpose

Define a portable, optional memory-hook vocabulary for Vibe Coding OS agents. The contract is inspired by lifecycle patterns from `thedotmack/claude-mem` but is not an implementation and does not copy upstream hooks.

This contract extends the general hook pattern taxonomy defined in `docs/workflows/hook-patterns.md`. The taxonomy defines four hook categories — command hooks, session hooks, workflow hooks, and verification hooks — plus a lifecycle event table and contract format. This document narrows that general taxonomy to memory-specific lifecycle events.

## Lifecycle event taxonomy

The general hook taxonomy (`docs/workflows/hook-patterns.md`) defines a portable matrix of hooks by category (command, session, workflow, verification) and timing (pre, post, entry, exit, fail). Memory-specific hooks are a subset of session and command hooks:

| Category | General hook | Memory specialization |
|---|---|---|
| Session | `session-start` | Retrieve scoped memory context |
| Session | `session-end` | Compress and store session memory |
| Command | `post-command` | Capture tool output as memory observations |
| Command | `post-tool` | Capture material tool evidence |
| Workflow | `phase-exit` | Compress noisy observations into summaries |
| Verification | `pre-verification` | Search memory for relevant prior context |
| Verification | `pre-context-injection` | Filter and rank memory candidates |
| Verification | `verification-fail` | Log privacy exclusion failures |

## Optional hook-based memory adapter

Adapters may observe lifecycle events and produce local memory artifacts. Hooks must be safe by default, disableable, auditable, and privacy-filtered before persistence or context injection.

## Lifecycle events Vibe Coding OS cares about

| Event | Purpose | Expected output |
| --- | --- | --- |
| `session_start` | Retrieve scoped context for the task. | Small context injection bundle with citations. |
| `user_prompt` | Capture intent and constraints. | Redacted session observation. |
| `post_tool` | Capture material evidence after a command or tool. | Observation with command, result, files, and validation status. |
| `memory_compress` | Reduce noisy observations into durable summaries. | Compressed summary with citations and uncertainty labels. |
| `memory_search` | Retrieve candidates progressively. | Search report and candidate IDs. |
| `pre_context_injection` | Filter/rank candidates before injecting. | Safe, minimal context bundle. |
| `session_end` | Prepare handoff and follow-ups. | Session summary and next steps. |
| `privacy_exclusion` | Remove blocked data. | Exclusion report and redaction notes. |

## Local-first storage expectations

Hooks must work with plain local artifacts first. Database, vector search, web viewers, background services, or cloud providers are optional future implementations and must not be assumed by the contract.

## No upstream code copied

This contract uses original Vibe Coding OS terminology. It does not include upstream hook scripts, source code, schemas, or large documentation text.

## Not implemented yet

This is a design contract only. Future implementation needs a spec, privacy review, tests, configuration defaults, and failure-mode documentation.

## Ghi chú tiếng Việt

Contract này giúp nhiều harness dùng chung vòng đời bộ nhớ nhưng chưa triển khai code. Mọi hook phải lọc bí mật trước, ghi log/audit rõ ràng, và hoạt động được với lưu trữ cục bộ đơn giản.
