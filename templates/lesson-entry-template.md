---
date: YYYY-MM-DD
severity: low | medium | high | critical
model: <model-or-agent-name>
area: <subsystem-or-feature-area>
---

# Lesson: <short descriptive title>

## Error

<What failed, where it appeared, and how it was detected. Keep this sanitized; do not include secrets, credentials, tokens, private keys, private URLs, internal hostnames, or unnecessary raw logs.>

## Root cause

<The mistaken assumption, missing check, workflow gap, or implementation defect that caused the error. State it as a pattern, not a one-off blame statement.>

## Fix

<The concrete change that resolved the issue, including tests or validation that proved it. Use synthetic examples if needed to avoid exposing private code.>

## Prevention rule

<The reusable rule, checklist item, test pattern, or prompt instruction to apply before similar future tasks.>

## Privacy check

- [ ] No secrets, credentials, or tokens are present.
- [ ] No private user data, internal hostnames, or private URLs are present.
- [ ] Raw logs, if referenced, have been summarized and stripped of sensitive values.
