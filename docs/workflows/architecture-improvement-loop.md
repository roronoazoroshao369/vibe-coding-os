# Workflow: Architecture Improvement Loop

## Purpose

Architecture Improvement Loop.

## When to use

Use for architecture-sensitive work and deliberate refactoring.

## Step-by-step workflow

1. Zoom out on system context.
2. Review domain language and ADRs.
3. Identify seams and pain points.
4. Prototype if uncertainty is high.
5. Plan small verified refactor slices.
6. Capture ADRs for important choices.
7. Validate and handoff.

## Required inputs

Codebase area, pain points, tests, constraints, context docs.

## Outputs

Architecture review, prototype report if used, refactor plan, ADR candidates, validation.

## Related skills

brainstorming (formerly zoom-out-system-context merged), improve-codebase-architecture, prototype-before-commitment, architecture-decision-records.

## Related commands

`vibe-zoom-out`, `vibe-improve-architecture`, `vibe-prototype`, `vibe-to-issues`.

## Maintenance notes

Audit upstream architecture/prototype changes for evaluation ideas.

## Ghi chú tiếng Việt

Dùng khi thay đổi kiến trúc. Ưu tiên lát nhỏ, test, ADR và tránh rewrite lớn.
