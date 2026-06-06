# Skill: Privacy Filter

## Purpose

Prevent sensitive data from entering prompts, memory, examples, or commits.

## When to use

Use before saving memory, publishing examples, sharing logs, or committing generated artifacts.

## Inputs

Candidate content, sensitivity rules, repository policy.

## Workflow

1. Scan for secrets, tokens, keys, credentials, private URLs, and personal data.
2. Remove or replace sensitive values with placeholders.
3. Keep enough context for usefulness.
4. Record redaction decisions when helpful.
5. Block the action if sensitive data cannot be safely removed.

## Outputs

Sanitized content or a clear block reason.

## Failure modes

- Over-redacting useful technical context.
- Missing credentials embedded in logs.
- Assuming test-looking secrets are safe.

## Verification checklist

- [ ] No secrets remain.
- [ ] Placeholders are obvious.
- [ ] Useful context is preserved.
- [ ] Blocked content is not committed.

## Applied / Not Applied

Applied from Supermemory-inspired design: durable memory should be scoped, searchable, source-aware, privacy-filtered, and useful for later retrieval. Not applied: hosted Supermemory service requirement, SDK client, cloud auth, dashboard, connector stack, database infrastructure, or storing full transcripts by default.

## Ghi chú tiếng Việt

Dùng kỹ năng này để lưu hoặc truy xuất ngữ cảnh bền vững một cách an toàn. Không lưu bí mật, token, khóa riêng tư hoặc dữ liệu cá nhân không cần thiết.
