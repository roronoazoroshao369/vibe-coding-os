---
name: Safety / Eval Report
about: Report a safety check failure, eval regression, or security concern
title: '[SAFETY] '
labels: safety, evaluation
assignees: ''
---

## Category

- [ ] Safety check failure (secrets, injection, memory redaction)
- [ ] Eval regression (behavioral or scenario regression)
- [ ] Security concern (prompt injection, data exfil, permission escalation)
- [ ] Licensing / attribution issue

## What failed

Describe the failure or concern clearly. Include which check or eval scenario was affected.

## To Reproduce

1. Run command '...'
2. With input or scenario '...'
3. See failure: '...'

## Validation output

<!-- Paste relevant output from npm run eval:report, npm run validate:secrets, npm run validate:injection, or other safety checks. -->

```
(paste output here)
```

## Expected vs actual

- **Expected:** What should happen.
- **Actual:** What happens instead.

## Severity

- [ ] Blocker — prevents release
- [ ] High — must fix before next RC
- [ ] Medium — should fix, not release-blocking
- [ ] Low — tracked for future fix

## Environment

- OS: [e.g. macOS, Linux, Windows]
- Agent tool: [e.g. Claude Code, Codex CLI]
- Vibe Coding OS version: [e.g. v1.0.0-rc.1]

## Suggested fix

<!-- Optional: proposed resolution or mitigation. -->
