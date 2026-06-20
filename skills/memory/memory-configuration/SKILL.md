---
name: memory-configuration
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: memory
tags:
  - memory
status: stable
---

# Skill: Memory Configuration

## Purpose

Set memory defaults for scope, privacy, retention, injection limits, and provider options.

## When to use

Use when starting a project memory layer, changing what gets loaded, setting retention rules, or documenting provider/local fallback settings.

## Inputs

- Project memory goals and non-goals.
- Scope defaults, retention expectations, privacy exclusions, and context budget.
- Optional provider settings and local fallback.

## Workflow

1. Define default scope: project, worktree, session, or user-level.
2. Define what may be stored, never stored, and requires explicit approval.
3. Set retention and stale-review cadence.
4. Set injection budget: maximum entries, token budget, and required labels.
5. Document provider settings only as config placeholders; never store secrets.
6. Add troubleshooting and rollback notes.

## Outputs

- Memory configuration note.
- Injection and retention policy.
- Provider/local fallback settings.

## Failure modes

- Loading too much memory by default.
- Storing secrets in config or examples.
- Missing retention or stale-review rules.
- Configuring provider behavior without local fallback.

## Verification checklist

- [ ] Scope and retention defaults are explicit.
- [ ] Privacy exclusions are listed.
- [ ] Injection limits prevent context overload.
- [ ] Provider settings omit secrets and include fallback.

## Ghi chú tiếng Việt

Cấu hình bộ nhớ phải nêu rõ phạm vi, giới hạn nạp ngữ cảnh, thời hạn giữ, loại dữ liệu cấm lưu, và fallback cục bộ.
