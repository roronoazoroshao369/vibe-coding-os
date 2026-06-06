# Claude-Mem-Inspired Memory Adapter Plan

## Purpose

Describe an optional future hook-based memory adapter inspired by `thedotmack/claude-mem` without copying upstream code or requiring its runtime architecture.

## Optional hook-based memory adapter

A future adapter may translate Vibe Coding OS memory lifecycle events into local observations, summaries, retrieval bundles, and privacy reviews. It must be opt-in, local-first, and replaceable by other providers or plain files.

## Lifecycle events Vibe Coding OS cares about

- `session_start`: load only relevant, safe context.
- `user_prompt`: capture user intent and constraints after privacy filtering.
- `post_tool`: record material command/tool outcomes, evidence, and file paths.
- `pre_injection`: filter and rank retrieved memory before adding it to context.
- `session_summary`: compress work into a continuation-ready summary.
- `handoff`: create a safe next-agent artifact with citations and validation status.
- `memory_delete_or_exclude`: respect human-requested removal, opt-out, or sensitive content exclusion.

## Local-first storage expectations

Default storage should be repository-local or user-approved local storage. External providers, daemons, databases, vector stores, viewers, or sync services require explicit future approval, privacy review, and fallback behavior.

## No upstream code copied

This plan does not copy hook scripts, service code, schemas, installer logic, UI assets, prompts, docs, or examples from `claude-mem`. It adapts high-level ideas in original Vibe Coding OS language.

## Not implemented yet

No adapter is implemented in this PR. Implementation requires a separate spec, threat model, tests, and user approval.

## Ghi chú tiếng Việt

Tài liệu này chỉ là kế hoạch adapter tương lai. Không có daemon, database, viewer, installer, hoặc hook script nào được thêm vào; mọi triển khai thật cần một nhiệm vụ riêng và kiểm tra bảo mật/quyền riêng tư.
