---
title: Issue Slicing Template
type: template
name: issue-slicing-template
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: template
tags:
  - template
status: stable
---

# Issue Slicing Template

> Vietnamese usage note: Mỗi issue nên là một lát dọc có thể review/test độc lập. Không đưa secrets vào issue.

## Source artifact

[PRD/spec/plan link.]

## Slice list

### Issue: [Title]

- Outcome: [User-visible or durable outcome]
- Scope: [Included work]
- Out of scope: [Excluded work]
- Dependencies: [None or list]
- Acceptance criteria: [Criteria]
- Verification: [Commands/checks]
- Handoff notes: [Context an agent needs]

## Ghi chú tiếng Việt

Ghi chú sử dụng tiếng Việt nằm ở đầu template. Maintainer nên cập nhật phần này khi workflow liên quan thay đổi và luôn tránh lưu secrets hoặc dữ liệu nhạy cảm.
