# Skill: Grill User Before Building

## Purpose

Interview the user until goals, constraints, risks, and acceptance criteria are explicit before implementation.

## When to use

Use for ambiguous requests, broad features, design choices, or any task where building immediately would invent requirements.

## Inputs

User goal, current context, known constraints, unknowns, success criteria, and any relevant files or docs.

## Workflow

1. Restate the goal in your own words.
2. Ask the smallest set of high-leverage questions that remove implementation ambiguity.
3. Probe edge cases, non-goals, rollout, user impact, and verification.
4. Stop when the next artifact can be a spec, PRD, or small plan.
5. Record assumptions that remain instead of hiding them.

## Outputs

A concise alignment summary, answered questions, open assumptions, non-goals, and recommended next workflow.

## Failure modes

Asking generic questions, interrogating after the user asked for a tiny edit, treating guesses as facts, or turning the interview into implementation.

## Verification checklist

The user intent is restated; blockers are resolved or named; non-goals are listed; acceptance criteria are testable; next step is explicit.

## Ghi chú tiếng Việt

Kỹ năng này dùng để “grill” trước khi code: hỏi kỹ nhưng có mục tiêu, tránh agent tự bịa yêu cầu. Dùng khi task mơ hồ hoặc rủi ro. File liên quan: `commands/vibe-grill-me.md`, `templates/prd-template.md`, và `docs/workflows/grill-to-prd-to-issues.md`. Khi upstream thay đổi, chỉ học cách đặt câu hỏi tốt hơn, không chép prompt.
