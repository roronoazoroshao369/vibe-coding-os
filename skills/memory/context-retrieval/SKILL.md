---
name: context-retrieval
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: memory
tags:
  - memory
status: stable
---

# Skill: Context Retrieval

## Purpose

Find relevant repository context before making decisions.

## When to use

Use before planning, debugging, reviewing, or changing unfamiliar areas.

## Inputs

Task, repository files, registries, prior memory, commands available.

## Workflow

1. Read governing instructions first.
2. Search for related files and patterns.
3. Inspect registries and templates when relevant.
4. Summarize only context that affects the task.
5. Flag missing or stale context.

## Outputs

A focused context brief with cited files, patterns, and risks.

## Failure modes

- Reading too broadly.
- Ignoring local conventions.
- Treating guesses as facts.

## Verification checklist

- [ ] Relevant instructions were checked.
- [ ] Important files and patterns are identified.
- [ ] Uncertainty is labeled.
- [ ] Context directly informs next steps.

## Applied / Not Applied

Applied from Supermemory-inspired design: durable memory should be scoped, searchable, source-aware, privacy-filtered, and useful for later retrieval. Not applied: hosted Supermemory service requirement, SDK client, cloud auth, dashboard, connector stack, database infrastructure, or storing full transcripts by default.

## Ghi chú tiếng Việt

Dùng kỹ năng này để lưu hoặc truy xuất ngữ cảnh bền vững một cách an toàn. Không lưu bí mật, token, khóa riêng tư hoặc dữ liệu cá nhân không cần thiết.
