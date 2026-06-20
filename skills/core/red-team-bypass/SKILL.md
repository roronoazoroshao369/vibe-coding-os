---
name: red-team-bypass
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: core
tags:
  - core
status: stable
---

# Skill: Red Team Bypass

## Purpose

Document the patterns and counter-measures for adversarial prompt injection, jailbreak attempts, and model evasion techniques. This is a **defensive** skill — it catalogs how attacks work so that detection and guard rails can be designed against them.

## When to use

Use during security review of any system that accepts user-provided text, when designing input validation for a Claude Code hooks pack, or when auditing a feature for prompt injection risk.

## Inputs

- The attack class under review (prompt injection, jailbreak, role-play escape, context overflow, indirect injection).
- The surface being attacked (HTTP handler, file upload, MCP tool, slash command, AGENTS.md).
- The detection guard rails in scope (input regex, output schema, model-self-check, hooks pack).

## Workflow

1. Classify the attack: injection / jailbreak / role-play / context / indirect.
2. Map the attack to the trust boundary it crosses (network ingress, file write, MCP tool, AGENTS.md read).
3. Design the counter-measure at the matching boundary.
4. Add the counter-measure to the secure-coding checklist review.
5. Add a unit test that fires the attack pattern and verifies the counter-measure.

## Outputs

- A red-team attack catalog with counter-measures.
- A test case in `tests/security/` for each attack pattern.
- An entry in `docs/security/<date>-redteam.md` documenting findings.

## Failure modes

- Treating red-team work as offensive-only (it is defensive documentation).
- Cataloging attacks without counter-measures.
- Running the attacks against production.

## Verification checklist

- [ ] Every attack class mapped to a trust boundary.
- [ ] Every counter-measure test exists and exits 0.
- [ ] Every counter-measure added to secure-coding checklist.
- [ ] Findings recorded in `docs/security/`.

## Related skills

- `skills/core/secure-coding-checklist/SKILL.md` — preventive layer
- `skills/core/claude-code-hooks-pack/SKILL.md` — operational guard rails
- `skills/core/threat-model-driven-security/SKILL.md` — STRIDE lens
