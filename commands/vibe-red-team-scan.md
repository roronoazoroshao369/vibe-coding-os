---
description: "Run a red-team scan on a skill, command, or marketplace content for bypass techniques, prompt injection, and secret leakage."
---

# Command: Vibe Red Team Scan

## When to use

Use this command to scan a third-party skill, a community contribution, or a marketplace item for known bypass techniques, prompt-injection payloads, and embedded secrets. The scan uses `security/redact/redactor.mjs` and `security/defense/injection-counters.mjs` to produce a risk score and a structured report.

## Required inputs

- Target (file path or content)
- Scan depth (quick | standard | deep; default: standard)
- Output mode (text | json | sarif; default: text)

## Outputs

- Scan report at `docs/security/red-team-scans/<date>-<target>.md`
- Risk score and findings list
- Recommendation: accept | review | reject

See `templates/red-team-scan-report.md` for the report format.
