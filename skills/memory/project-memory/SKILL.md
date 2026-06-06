# Skill: Project Memory

## Purpose

Maintain durable project context that future sessions can trust.

## When to use

Use when decisions, conventions, commands, or architecture facts should persist.

## Inputs

Decision, context, source, date, confidence, sensitivity level.

## Workflow

1. Capture only durable information.
2. Separate facts from assumptions.
3. Record why the decision matters.
4. Redact sensitive details.
5. Mark stale items for later review.

## Outputs

A concise memory entry with source, confidence, and safety status.

## Failure modes

- Saving secrets.
- Saving noisy transcripts.
- Failing to update obsolete memory.

## Verification checklist

- [ ] Entry is durable.
- [ ] No sensitive data is included.
- [ ] Source and confidence are clear.
- [ ] Staleness risk is noted.

Related mattpocock-inspired skills: `skills/core/shared-domain-language/SKILL.md`, `skills/core/architecture-decision-records/SKILL.md`, and `skills/memory/agent-handoff/SKILL.md`.

## Applied / Not Applied

Applied from Supermemory-inspired design: durable memory should be scoped, searchable, source-aware, privacy-filtered, and useful for later retrieval. Not applied: hosted Supermemory service requirement, SDK client, cloud auth, dashboard, connector stack, database infrastructure, or storing full transcripts by default.

## Ghi chú tiếng Việt

Dùng kỹ năng này để lưu hoặc truy xuất ngữ cảnh bền vững một cách an toàn. Không lưu bí mật, token, khóa riêng tư hoặc dữ liệu cá nhân không cần thiết.
