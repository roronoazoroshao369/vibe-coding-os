# Skill Decision Guide

> Không biết dùng skill nào? Tìm nhanh trong bảng này.

## Quick Reference

| Vấn Đề | Skill | Command | Pack |
|---------|-------|---------|------|
| Request mơ hồ, thiếu thông tin | `clarify-before-code` | `vibe-grill-me` | Solo |
| Không biết bắt đầu từ đâu | `brainstorming` | `vibe-brainstorm` | Solo |
| Cần spec trước khi code | `spec-first-development` | `vibe-specify` | Solo |
| Chỉ định nghĩa "cái gì" trước | `what-before-how` | — | Solo |
| Chia task nhỏ từ plan | `writing-plans` | `vibe-plan-from-spec` | Solo |
| Viết test trước code | `test-driven-development` | `vibe-tdd` | Solo |
| Bug khó, không rõ nguyên nhân | `systematic-debugging` | `vibe-debug` | Solo |
| Bug cần diagnosis có cấu trúc | `disciplined-diagnosis` | `vibe-diagnose` | Solo |
| Review code trước merge | `requesting-code-review` | `vibe-request-review` | Solo |
| Nhận review từ người khác | `receiving-code-review` | `vibe-receive-review` | Solo |
| Chuẩn bị merge | `finishing-a-development-branch` | `vibe-finish-branch` | Solo |
| Kiểm tra trước khi claim done | `verification-before-completion` | `vibe-verify` | Solo |
| Tránh overengineering | `anti-overengineering` | — | Solo |
| Cần zoom out kiến trúc | `zoom-out-system-context` | `vibe-zoom-out` | Solo |
| Cải thiện kiến trúc codebase | `improve-codebase-architecture` | `vibe-improve-architecture` | Solo |
| Ghi quyết định kỹ thuật | `architecture-decision-records` | — | Solo |
| Tạo PRD từ context | `prd-from-context` | `vibe-to-prd` | Solo |
| Slice issue nhỏ | `issue-slicing` | `vibe-to-issues` | Solo |
| Phân loại task | `triage-workflow` | `vibe-triage` | Solo |
| Enhance legacy code | `brownfield-spec-enhancement` | `vibe-brownfield-spec` | Solo |
| Viết skill mới | `write-reusable-skill` | `vibe-write-skill` | Meta |
| Kiểm tra context budget | `context-budget` | — | Meta |
| Extract instinct từ session | `instinct-extraction` | — | Meta |
| **Capturing session state** | `session-capture` | `vibe-session-capture` | Memory |
| Tóm tắt session | `session-summarizer` | `vibe-session-summary` | Memory |
| Lọc secrets khỏi memory | `privacy-filter` | `vibe-memory-privacy-check` | Memory |
| Tìm memory relevant | `memory-search` | `vibe-memory-search` | Memory |
| Handoff context | `agent-handoff` | `vibe-handoff` | Memory |
| Retrieve context progressive | `context-retrieval` | `vibe-memory-retrieve` | Memory |
| Lưu quyết định project | `project-memory` | — | Memory |
| Thiết kế team | `team-agent-orchestration` | `vibe-team` | Multi-Agent |
| Spawn subagents | `subagent-driven-development` | `vibe-subagents` | Multi-Agent |
| Scaffold team briefs | — | `vibe-team-generate` | Multi-Agent |
| Kiểm tra reference mới | `upstream-intelligence-loop` | `vibe-reference-audit` | Meta |

## Theo Phase Workflow

### Phase 1: Intent & Clarify
```
模糊 → brainstorming → clarify-before-code → grill-user-before-building
```

### Phase 2: Specification
```
spec-first-development → what-before-how → acceptance-criteria → requirements-quality-checklist
```

### Phase 3: Planning
```
writing-plans → plan-from-spec → task-breakdown-from-plan → dependency-aware-task-ordering
```

### Phase 4: Implementation
```
executing-plans → test-driven-development → subagent-driven-development
```

### Phase 5: Verification
```
verification-before-completion → requesting-code-review → receiving-code-review
```

### Phase 6: Merge
```
finishing-a-development-branch → git-guardrails
```

### Phase 7: Memory
```
session-capture → session-summarizer → privacy-filter → agent-handoff
```

## Theo Problem Type

| Bạn Cần... | Bắt Đầu Từ |
|------------|-------------|
| Hiểu yêu cầu | `brainstorming` → `grill-user-before-building` |
| Thiết kế giải pháp | `zoom-out-system-context` → `spec-first-development` |
| Implement feature | `writing-plans` → `executing-plans` → `test-driven-development` |
| Fix bug | `disciplined-diagnosis` → `test-driven-development` |
| Refactor | `zoom-out-system-context` → `improve-codebase-architecture` |
| Review code | `requesting-code-review` → `verification-before-completion` |
| Quản lý context | `session-capture` → `memory-search` → `agent-handoff` |
| Multi-agent work | `team-agent-orchestration` → `subagent-driven-development` |
