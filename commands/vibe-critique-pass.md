---
description: "Run a writer-then-critic quality pass using the critique pass template before finalizing work."
---

# vibe-critique-pass

## Purpose

Separate creation from criticism so a draft, plan, patch, or final response is challenged before delivery, even if one model performs both roles.

## When to use

Use after drafting or implementing non-trivial work, before sending a high-stakes final answer, before merging a risky change, or whenever assumptions and verification need an explicit challenge.

## Required inputs

- Original task and constraints.
- Writer draft, implementation summary, diff, or artifact.
- Acceptance criteria or expected outcome.
- Verification results and known limitations.

## Step-by-step workflow

1. Open `templates/critique-pass-template.md` and fill in the original task.
2. Complete the **Writer summary** with the proposed or implemented solution and verification evidence.
3. Switch to critic posture: challenge assumptions, edge cases, tests, compatibility, security/safety, minimal scope, and evidence.
4. Record findings by severity in **Critic findings**.
5. Create a **Fix plan** for critical and important findings first.
6. Apply fixes when in scope, or explicitly defer with rationale.
7. Re-review the revised output and complete **Re-review result**.
8. End with a **Final verdict**: approve, approve with reservations, request changes, or needs clarification.

## Output format

Return a filled critique pass with these sections:

- Original task
- Writer summary
- Critic findings
- Fix plan
- Re-review result
- Final verdict

## Stop/ask-clarifying-question condition

Stop and ask when the original task is unavailable, critic findings reveal an ambiguity that materially changes the work, or a critical issue cannot be fixed within the current scope.

## Related skills/templates

- `skills/prompts/critique-pass/SKILL.md`
- `skills/agents/writer-critic-pair/SKILL.md`
- `templates/critique-pass-template.md`
