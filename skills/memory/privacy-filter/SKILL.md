---
name: privacy-filter
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: memory
tags:
  - memory
status: stable
---

# Skill: Privacy Filter

## Purpose

Prevent sensitive data from entering prompts, memory, examples, or commits.

## When to use

Use before saving memory, publishing examples, sharing logs, or committing generated artifacts.

## Inputs

Candidate content, sensitivity rules, repository policy.

## Workflow

1. Scan for secrets, tokens, keys, credentials, private URLs, and personal data.
2. Before spawning a subprocess, hook, or sub-agent, strip secrets from the environment passed to it: allowlist only the variables the child needs and drop the rest, so tokens never leak into a child's context or captured memory.
3. Remove or replace sensitive values with placeholders.
4. Keep enough context for usefulness.
5. Record redaction decisions when helpful.
6. Block the action if sensitive data cannot be safely removed.

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

## Integration with context-policy

This skill works downstream of `skills/core/context-policy/SKILL.md` in a defense-in-depth
pipeline. The context-policy skill determines *what* files are loaded into the agent's working
context using allow/block/flag rules. This privacy filter then sanitizes the loaded content
before it enters memory or is transmitted. The two stages work together:

1. **Context policy** (ingress gate): blocks sensitive files entirely (secrets/, .env, .key),
   allows task-relevant files, and flags files for audit review.
2. **Privacy filter** (content sanitizer): scans the allowed/flagged content for secrets,
   tokens, credentials, and personal data; redacts or blocks as needed.

This two-stage pipeline ensures that sensitive files never even reach the content-scanning
stage, reducing false positives in the privacy filter and providing defense-in-depth against
data leakage. When creating or updating a context policy, reference this skill as the
downstream sanitization layer. When updating this skill, check whether the context-policy
ingress gate covers the file patterns that would otherwise trigger redaction.

## Applied / Not Applied

Applied from Supermemory-inspired design: durable memory should be scoped, searchable, source-aware, privacy-filtered, and useful for later retrieval. Applied from claude-mem-inspired privacy design: strip secrets from child process or sub-agent environments before spawn. Applied from yvgude/lean-ctx-inspired ingress filtering: context-policy gates what files enter before privacy filter sanitizes content. Not applied: hosted Supermemory service requirement, claude-mem hook runtime, SDK client, cloud auth, dashboard, connector stack, database infrastructure, or storing full transcripts by default.

## Ghi chú tiếng Việt

Dùng kỹ năng này để lưu hoặc truy xuất ngữ cảnh bền vững một cách an toàn. Không lưu bí mật, token, khóa riêng tư hoặc dữ liệu cá nhân không cần thiết.
