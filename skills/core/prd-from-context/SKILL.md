# Skill: PRD From Context

## Purpose

Turn existing conversation and repository context into a concise PRD without inventing new requirements.

## When to use

Use when enough product context exists but the work needs a durable product-shaped specification before planning.

## Inputs

Conversation summary, user goals, constraints, non-goals, target users, acceptance criteria, and open questions.

## Workflow

1. Extract only stated or clearly implied requirements.
2. Mark assumptions and open questions.
3. Use `templates/prd-template.md`.
4. Define user problem, outcomes, scope, non-goals, acceptance criteria, and verification.
5. Ask for approval before slicing or implementation when scope is meaningful.

## Outputs

A PRD draft, assumptions list, acceptance criteria, and links to relevant context or ADRs.

## Failure modes

Inventing product requirements, over-specifying UI or architecture too early, or skipping user approval for high-impact scope.

## Verification checklist

PRD separates facts from assumptions; acceptance criteria are testable; non-goals are explicit; approval path is clear.

## Ghi chú tiếng Việt

Dùng để biến ngữ cảnh đã trao đổi thành PRD gọn. Không phỏng vấn lại nếu đủ thông tin; không bịa requirement. File liên quan: `templates/prd-template.md`, `commands/vibe-to-prd.md`.
