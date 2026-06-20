---
title: Adaptive Prompt Selection Matrix
type: template
name: adaptive-prompt-matrix
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: template
tags:

status: stable
---

# Adaptive Prompt Selection Matrix

Maps task types to recommended quality packs from the Vibe Coding OS skill registry. Use with `skills/core/adaptive-prompt-selection/SKILL.md` and `commands/vibe-adaptive-prompt.md`.

## Task Type → Quality Pack Matrix

| Task Type | Core Quality Packs | Domain Amplifiers (add when relevant) |
| --- | --- | --- |
| **feature** | Self-review · Adversarial review | API quality · DB migration · Auth quality · Frontend state · Async jobs |
| **bugfix** | Bug-fix lifecycle · Disciplined diagnosis · Self-review | Diff audit (if touching critical path) · Adversarial review (if security-adjacent) |
| **refactor** | Quality rubric · Self-review · Diff audit | Adversarial review (if architecture-sensitive) · Frontend state (if UI involved) |
| **security** | Auth quality · Adversarial review · Privacy filter | Diff audit · API quality (if endpoint changes) |
| **migration** | DB migration quality · Self-review · Adversarial review | API quality (if endpoints change) · Async jobs (if backfill/background tasks) |

## Domain Amplifiers Reference

| Domain | Quality Pack | Path |
| --- | --- | --- |
| API endpoints | API endpoint quality | `skills/checklists/api-endpoint-quality/SKILL.md` |
| Database schema | DB migration quality | `skills/checklists/db-migration-quality/SKILL.md` |
| Authentication / permissions | Auth quality | `skills/checklists/auth-quality/SKILL.md` |
| Frontend state | Frontend state quality | `skills/checklists/frontend-state-quality/SKILL.md` |
| Async / background jobs | Async job quality | `skills/checklists/async-job-quality/SKILL.md` |

## Common Quality Packs

| Pack | Path | When to include |
| --- | --- | --- |
| Self-review | `skills/core/self-review-before-response/SKILL.md` | Every non-tiny task |
| Adversarial review | `skills/core/adversarial-code-review/SKILL.md` | Risky, security, or architecture-sensitive tasks |
| Diff audit | `skills/core/review-before-merge/SKILL.md` | Any change touching critical path or shared state |
| Quality rubric | `skills/prompts/quality-rubric/SKILL.md` | Baseline for all coding tasks |
| Disciplined diagnosis | `skills/core/disciplined-diagnosis/SKILL.md` | Bugfix tasks requiring root-cause analysis |
| Bug-fix lifecycle | `skills/core/bug-fix-lifecycle/SKILL.md` | Any bugfix task |
| Privacy filter | `skills/memory/privacy-filter/SKILL.md` | Security tasks handling sensitive data |

## Usage notes

- Always start with the **Core Quality Packs** for the task type.
- Add **Domain Amplifiers** based on which systems the task touches.
- Apply `adaptive-flow` tier logic: tiny tasks may skip heavy packs; risky tasks always get the full set.
- Update this matrix when new quality packs are added to the registry.
