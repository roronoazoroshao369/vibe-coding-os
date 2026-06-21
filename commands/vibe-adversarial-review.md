---
description: "Run an adversarial code review on a PR, skill, or feature using STRIDE + red-team patterns."
---

# Command: Vibe Adversarial Review

## When to use

Use this command when you want an attacker-perspective review of a code change, a published skill, or a feature spec. The command wires the `threat-model-driven-security` skill to OWASP LLM01/LLM04 patterns and produces a structured report.

## Required inputs

- Target (file path, PR URL, or feature spec)
- Adversary model (default: authenticated low-privilege user)
- Trust boundary list (auto-derived from data flow if not provided)

## Outputs

- Adversarial review report at `docs/security/adversarial-reviews/<date>-<target>.md`
- Risk score (clean/low/medium/high/critical)
- Recommended mitigations

See `templates/adversarial-review-invocation.md` for a complete walkthrough.
