# Quality Shield Workflow

A copy-paste workflow for using Quality Shield on one coding task. It is markdown-first and does not require the optional Quality Engine runtime.

Use this when you want a small, safe loop:

1. Contract
2. Context pack
3. Implement smallest safe diff
4. Self-review
5. Scorecard

## Copy-paste prompt

Paste this into your coding agent at the start of a task:

```md
Use the Quality Shield workflow for this task.

Task:
<describe the bug, feature, refactor, or docs change>

Constraints:
- Keep the diff minimal and directly tied to the task.
- Do not add dependencies unless explicitly justified and approved.
- Do not change unrelated files or formatting.
- Report verification honestly: passed, failed, or not run with reason.

Follow these steps:
1. Contract: fill the Quality Execution Contract from templates/quality-contract.md before editing.
2. Context pack: fill the Code Context Pack from templates/code-context-pack-template.md with concrete files, tests, patterns, and gotchas inspected.
3. Implement: make the smallest safe diff that satisfies the acceptance criteria.
4. Self-review: run templates/self-review-checklist.md against the diff before final response.
5. Scorecard: complete the Quality Scorecard summary from templates/quality-scorecard.md, or a compact equivalent, with verification evidence and risks.

Before editing, show me the completed contract and context pack if I am present. If I am not present, proceed only when both are specific and no material ambiguity remains.
```

## Step 1 — Contract

Use:

- Command: [`commands/vibe-quality-gate.md`](../commands/vibe-quality-gate.md)
- Skill: [`skills/core/quality-execution-contract/SKILL.md`](../skills/core/quality-execution-contract/SKILL.md)
- Template: [`templates/quality-contract.md`](../templates/quality-contract.md)

Copy this short contract block when you do not need the full template:

```md
## Quality Execution Contract

- Goal:
- Acceptance criteria:
  - [ ]
- Non-goals:
- Risk tier: tiny / small / medium / large / risky
- Files to inspect:
- Files likely to change:
- Files not to touch:
- New dependencies: none / proposed with justification
- Public API changes: no / proposed with justification
- Test commands:
- Manual fallback if tests cannot run:

Commitments:
- [ ] Smallest correct change
- [ ] Verification before claiming done
- [ ] No unrelated refactor
- [ ] Honest verification report
```

Stop here and ask if acceptance criteria, scope, or risk cannot be stated honestly.

## Step 2 — Context pack

Use:

- Command: [`commands/vibe-code-context.md`](../commands/vibe-code-context.md)
- Skill: [`skills/core/code-context-pack/SKILL.md`](../skills/core/code-context-pack/SKILL.md)
- Template: [`templates/code-context-pack-template.md`](../templates/code-context-pack-template.md)

Copy this compact context pack:

```md
## Code Context Pack

- Task area:
- Similar implementation inspected:
- Related tests inspected:
- Error handling pattern:
- Naming/style pattern:
- Type/API/data shape:
- Known gotchas:
- Build/test commands for this area:
- Notes that constrain the implementation:
```

Keep this factual. Do not write what you hope is true; write what you inspected.

## Step 3 — Implement smallest safe diff

Implementation rules:

- Change only files named in the contract unless discovery proves another file is required.
- Prefer one small, direct fix over a broad cleanup.
- Preserve public APIs unless the contract explicitly allows a change.
- Add or update tests when behavior changes.
- Avoid new dependencies by default.
- If new risk appears, pause and update the contract before continuing.

Useful check before editing:

```md
Smallest safe diff statement:
I will change <file(s)> by <specific change> because it satisfies <acceptance criterion>. I will not touch <non-goal files/areas>.
```

## Step 4 — Self-review

Use:

- Command: [`commands/vibe-self-review.md`](../commands/vibe-self-review.md)
- Skill: [`skills/core/self-review-before-response/SKILL.md`](../skills/core/self-review-before-response/SKILL.md)
- Template: [`templates/self-review-checklist.md`](../templates/self-review-checklist.md)

Copy this compact checklist:

```md
## Self-Review

- [ ] Changed lines trace to the original request
- [ ] No unrelated files, formatting churn, or drive-by refactors
- [ ] No invented behavior or unapproved assumptions
- [ ] Error paths and edge cases are handled or explicitly deferred
- [ ] Tests/docs updated only where needed
- [ ] No secrets, credentials, or unnecessary personal data
- [ ] Verification commands run and results recorded honestly

Fix or document every failed item before final response.
```

## Step 5 — Scorecard

Use:

- Templates: [`templates/quality-scorecard.md`](../templates/quality-scorecard.md), [`templates/quality-scorecard-session.md`](../templates/quality-scorecard-session.md)
- Optional scripts: `node scripts/quality-scorecard.mjs`, `node scripts/quality-scorecard-report.mjs`
- Optional diff guard: `npm run validate:quality-diff`

Copy this compact scorecard into the final handoff:

```md
## Quality Scorecard

- Scope discipline: pass / warn / fail — <reason>
- Minimal diff: pass / warn / fail — <reason>
- Tests or checks: pass / warn / fail — <commands and outcomes>
- Verification honesty: pass / warn / fail — <what was not run and why>
- Residual risk: none / low / medium / high — <risk or follow-up>
- Recommendation: proceed / block / informational
```

## Final response shape

```md
Summary:
- <what changed>

Verification:
- <command>: passed / failed / not run (<reason>)

Quality Shield:
- Contract: completed
- Context pack: completed
- Self-review: completed
- Scorecard: proceed / block / informational

Risks or follow-up:
- <none or specific items>
```

## Short example

See [`examples/quality-shield/`](../examples/quality-shield/) for a concrete bug-fix scenario using this workflow without runtime changes.
