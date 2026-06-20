---
title: Secure Coding Checklist Template
type: template
name: secure-coding-checklist-template
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: template
tags:
  - template
status: stable
---

# Secure Coding Checklist Template

> Use this worksheet to review one PR or feature across every trust boundary
> it crosses. The three layers are independent — missing any one is a BLOCK.

## Per-boundary review

| # | Trust boundary | Input source | Sink destination | Layer 1: input validation | Layer 2: output encoding | Layer 3: identity & capability | OWASP A01–A10 | Status |
| - | -------------- | ------------ | ---------------- | ------------------------- | ------------------------ | ------------------------------ | ------------- | ------ |
| 1 | HTTP handler `POST /api/v1/users` | request body | DB INSERT | regex / type / length on `email`, `password`, `name` | parameterized SQL via `pgx` prepared statement | JWT authn → role check → scope `users:write` | A03 injection, A07 auth | ✅ PASS |
| 2 | Shell call `git log --oneline` | ref string | stdout | ref regex `^[a-zA-Z0-9_/.-]+$` reject otherwise | shell-escape via `shq` | none required (read-only, no PII) | A03 injection | ✅ PASS |
| 3 | File write `.claude/audit.jsonl` | edit payload | append-only file | schema validation against `audit-event.schema.json` | newline-escape (`\n` → `\\n`) | none required (write scoped to `.claude/`) | A09 logging | ✅ PASS |

## OWASP A01–A10 mapping

| Category | Description | Applicable? | Gate present? | Notes |
| -------- | ----------- | ----------- | ------------- | ----- |
| A01 | Broken Access Control | yes | yes | Layer 3 role check on every privileged op |
| A02 | Cryptographic Failures | no | n/a | No PII at rest in scope |
| A03 | Injection | yes | yes | Parameterized SQL + shell-escape |
| A04 | Insecure Design | no | n/a | Design reviewed under `quality-engine` |
| A05 | Security Misconfiguration | yes | yes | Hooks pack block `rm -rf` etc. |
| A06 | Vulnerable Components | yes | yes | `npm audit` exit 0 in CI |
| A07 | Identification & Auth Failures | yes | yes | JWT signed; bcrypt rounds = 12 |
| A08 | Software & Data Integrity | yes | yes | Commit provenance trailers required |
| A09 | Security Logging & Monitoring | yes | yes | `.claude/audit.jsonl` written on every edit |
| A10 | Server-Side Request Forgery | no | n/a | No outbound HTTP from app code |

## Merge decision

| Field | Value |
| ----- | ----- |
| Decision | ALLOW_WITH_FOLLOWUPS |
| Blockers | none |
| Followups | Add bcrypt rounds check to CI (today: manual) |
| Reviewer | `<name>` |
| Date | `2026-06-20` |

## Verification

- [ ] Every row in the per-boundary table has PASS / FAIL.
- [ ] Every applicable OWASP category has a gate present.
- [ ] `npm run validate:secrets` exit 0.
- [ ] `npm run validate:injection` exit 0.
- [ ] Worksheet committed to `docs/security/<date>-<feature>.md`.

## Related skills and templates

- `skills/core/secure-coding-checklist/SKILL.md` — full OWASP A01–A10 + LLM01–LLM10 checklist (use this template as the table-of-contents)
- `templates/bypass-audit-trail.md` — fill in after every guard-bypass attempt (positive or negative)
- `templates/bypass-request.md` — authorization form for red-team engagements
