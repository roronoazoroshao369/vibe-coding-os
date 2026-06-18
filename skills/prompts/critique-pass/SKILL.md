---
name: critique-pass
description: Writer and critic phases for challenging a draft or implementation before final response.
version: 1.0.0
author: Hermes Agent
license: MIT
platforms:
  - portable
tags:
  - quality
  - review
  - prompting
  - verification
---

# Critique Pass Protocol

## Purpose

Force a writer phase and a critic phase, even when the same model performs both, so proposed work is challenged before the final answer or handoff.

## When to use

Use for non-trivial code, plans, specs, reviews, public-facing docs, architecture choices, or any task where a confident first draft could hide assumptions, gaps, or weak verification.

## Inputs

Original task, constraints, draft response or implementation summary, diff or artifact when available, acceptance criteria, verification results, and known limitations.

## Workflow

1. **Writer phase**: produce the draft, plan, patch, or recommendation and summarize the intended solution.
2. **Critic reset**: switch posture from helpful author to skeptical reviewer; do not defend the draft by default.
3. Challenge assumptions, scope, edge cases, test coverage, compatibility, security/safety, and whether the answer actually satisfies the original task.
4. Record concrete findings, including missing evidence and questions that materially change the answer.
5. Build a fix plan that addresses critical and important findings with the smallest necessary change.
6. Apply the fix plan or explicitly defer items with rationale.
7. Re-review the revised output and state the final verdict.

## Outputs

A completed critique pass using `templates/critique-pass-template.md` with: Original task, Writer summary, Critic findings, Fix plan, Re-review result, and Final verdict.

## Failure modes

- Letting the critic merely praise the writer.
- Critiquing tone while ignoring correctness, safety, tests, or acceptance criteria.
- Fixing every minor preference and expanding scope.
- Skipping re-review after changes.
- Hiding unresolved findings in the final response.

## Verification checklist

- [ ] Writer and critic phases are visibly separate.
- [ ] Critic findings challenge assumptions and evidence, not just wording.
- [ ] Fix plan addresses critical and important findings first.
- [ ] Re-review confirms whether the final output satisfies the original task.
