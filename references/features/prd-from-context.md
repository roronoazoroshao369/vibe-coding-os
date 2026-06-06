# Feature: PRD From Context

## Goal

Synthesize existing conversation into a PRD without inventing requirements.

## Reference sources

Upstream to-prd concept; local spec-first development.

## Local implementation

Implemented by `skills/core/prd-from-context/SKILL.md`, `commands/vibe-to-prd.md`, `templates/prd-template.md`, and `docs/workflows/grill-to-prd-to-issues.md`.

## Must-have behavior

Extract stated requirements, mark assumptions, include acceptance criteria, request approval for meaningful scope.

## Failure modes

Invented requirements, over-detailed architecture, missing non-goals.

## Update signals

Upstream changes PRD workflow or issue tracker integration.

## Evaluation ideas

Given a conversation summary, verify PRD separates facts from assumptions.

## Ghi chú tiếng Việt

PRD từ context giúp chuyển hội thoại thành tài liệu hành động. File ảnh hưởng: PRD skill/command/template/workflow.
