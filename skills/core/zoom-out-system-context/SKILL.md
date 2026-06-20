---
name: zoom-out-system-context
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: core
tags:
  - core
status: stable
---

# Skill: Zoom Out System Context

## Purpose

Pause local edits and explain the broader system, seams, risks, and options before architecture-sensitive work.

## When to use

Use when code is unfamiliar, architecture is unclear, or a local change may affect system boundaries.

## Inputs

Target files, current behavior, related modules, constraints, and the proposed change.

## Workflow

1. Inspect neighboring code and docs.
2. Describe system purpose and boundaries.
3. Identify seams, coupling, invariants, and risk zones.
4. Recommend whether to proceed, prototype, create ADR, or narrow scope.
5. Keep the output concise enough to guide action.

## Outputs

System context brief, risks, decision points, and recommended next workflow.

## Failure modes

Zooming out so far no decision is possible, giving generic architecture advice, or skipping local evidence.

## Verification checklist

Brief references concrete files; risks are actionable; next step is chosen; assumptions are named.

## Ghi chú tiếng Việt

Dùng khi cần lùi lại nhìn hệ thống trước khi sửa kiến trúc. File liên quan: `commands/vibe-zoom-out.md` và workflow architecture.
