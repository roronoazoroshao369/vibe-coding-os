# CLI Workflow Examples

Practical examples for using the Vibe Coding OS CLI and tooling.
Each example shows the command, expected output, and when to use it.

> **Prerequisites:** Run `npm link` in the project root to make `vibe` available globally,
> or use `node scripts/vibe-cli.mjs <command>` directly.

---

## 1. `vibe doctor` — Health Check Before Starting

**Command:**

```bash
vibe doctor
# or: node scripts/vibe-cli.mjs doctor
```

**Expected output:**

```
🩺 Vibe Coding OS — Doctor

Checking repository structure...
  ✅ package.json found
  ✅ AGENTS.md found
  ✅ CHANGELOG.md found
  ✅ docs/ directory found
  ✅ skills/ directory found
  ✅ commands/ directory found
  ✅ templates/ directory found
  ✅ scripts/ directory found
  ✅ registry/ directory found
  ✅ references/ directory found

Checking validation scripts...
  ✅ scripts/validate-repo.mjs
  ✅ scripts/validate-references.mjs
  ✅ scripts/validate-traceability.mjs
  ✅ scripts/validate-injection.mjs

All checks passed! ✅
```

**When/why to use:**

- Run at the **start of every session** to confirm the repo is intact
- Use after pulling changes or switching branches to catch missing files
- Run before committing to ensure your working tree is healthy

---

## 2. `vibe spec <name> --copy` — Create a Spec

**Command:**

```bash
vibe spec my-feature --copy
```

**Expected output:**

```
📝 Created spec template for: my-feature

  → docs/specs/my-feature.md

The spec template is ready for you to fill in:
  - Goals and non-goals
  - Acceptance criteria
  - Edge cases
  - Out of scope

Next: Open docs/specs/my-feature.md and complete the spec.
```

**When/why to use:**

- **Before starting any non-trivial work** — spec-first is the core discipline
- Use for medium, large, or risky tasks (see task tiers in `docs/core-workflow-contract.md`)
- Capture intent, constraints, and acceptance criteria before planning

---

## 3. `vibe plan <name> --copy` — Create a Plan

**Command:**

```bash
vibe plan my-feature --copy
```

**Expected output:**

```
📋 Created plan template for: my-feature

  → docs/plans/my-feature.md

The plan template includes:
  - Files to touch (with purpose)
  - Implementation steps (ordered)
  - Verification commands
  - Risks and mitigations

Next: Open docs/plans/my-feature.md and fill in the plan.
      Ensure the spec (docs/specs/my-feature.md) is approved first.
```

**When/why to use:**

- **After the spec is approved** — plan defines how to implement
- Break work into ordered, reviewable steps
- List files, risks, and verification commands upfront
- Required before implementation for Medium/Large/Risky tasks

---

## 4. `vibe task <name> --copy` — Create a Task Breakdown

**Command:**

```bash
vibe task my-feature --copy
```

**Expected output:**

```
✅ Created task template for: my-feature

  → docs/tasks/my-feature.md

The task template includes:
  - Ordered task list with dependencies
  - Parallel markers (where tasks can run concurrently)
  - Test-first sequencing
  - Acceptance criteria per task

Next: Open docs/tasks/my-feature.md and break down the plan into tasks.
      Dependencies and parallel markers help with team orchestration.
```

**When/why to use:**

- **After the plan is written** — tasks decompose the plan into executable units
- Define dependencies, parallelism, and test-first ordering
- Required for multi-agent team orchestration (`runtime:team-run`)
- Useful for Medium/Large tasks where a single plan isn't granular enough

---

## 5. `vibe memory session-notes --copy` — Capture Session Notes

**Command:**

```bash
vibe memory session-notes --copy
```

**Expected output:**

```
🧠 Created session notes template

  → docs/memory/session-$(date +%Y-%m-%d).md

Session notes help you:
  - Summarize decisions made this session
  - Record gotchas and surprises
  - Note follow-ups for next time
  - Preserve context for agent handoffs

Next: Fill in the template before ending your session.
```

**When/why to use:**

- **At the end of every working session** — capture durable observations
- Use before switching agents or ending a session
- Helps with `skills/memory/agent-handoff` when context must survive
- Summarize, don't dump — filter secrets, keep it actionable

---

## 6. `vibe templates` — Browse Available Templates

**Command:**

```bash
vibe templates
```

**Expected output:**

```
📁 Available Templates

  Specs:
    templates/spec-template.md              — Full specification template
    templates/brownfield-spec-template.md   — Brownfield enhancement spec
    templates/prd-template.md               — Product requirements document

  Plans:
    templates/plan-template.md              — Implementation plan

  Tasks:
    templates/tasks-template.md             — Task breakdown with dependencies
    templates/task-template.md              — Single task definition

  Reviews:
    templates/review-template.md            — Code/design review template
    templates/architecture-review-template.md — Architecture decision review

  ADRs:
    templates/adr-template.md               — Architecture Decision Record

  Memory:
    templates/memory-entry-template.md      — Single memory observation
    templates/session-summary-template.md   — End-of-session summary
    templates/handoff-template.md           — Agent-to-agent handoff
    templates/memory-template.md            — General memory record

  References:
    templates/upstream-audit-template.md    — Upstream source audit
    templates/reference-scorecard-template.md — Upstream evaluation scorecard

  Teams:
    templates/team-architecture-template.md — Multi-agent team setup

  Diagnostics:
    templates/diagnosis-template.md         — Issue diagnosis template
    templates/triage-template.md            — Triage and priority assessment

  Use: vibe <template-name> to create from a template
```

**When/why to use:**

- **Browse templates** when starting a new type of work
- Quick reference for what templates are available
- Use with `--copy` to create a ready-to-fill document

---

## 7. `npm run eval:report` — Full Evaluation Report

**Command:**

```bash
npm run eval:report
# or: node scripts/evaluation-report.mjs
```

**Expected output:**

```
════════════════════════════════════════════════════════
  Vibe Coding OS — Evaluation Report
════════════════════════════════════════════════════════

  1. Repo Validation .............. PASS ✅
  2. Secret Scanning .............. PASS ✅
  3. Memory Redaction (30/30) ..... PASS ✅
  4. Adapter Smoke Tests .......... PASS ✅

  Result: 4/4 checks passed ✅

  Report saved to: docs/reports/evaluation-report.md
════════════════════════════════════════════════════════
```

**When/why to use:**

- **Before every release** — mandatory pre-release check (see `docs/release-checklist.md`)
- Run after making structural or reference changes
- Catches secrets, broken references, adapter issues, and memory redaction failures
- Use `npm run validate` for structural checks only; `eval:report` is comprehensive

---

## Quick Reference

| Command | Purpose | When to Run |
|---------|---------|-------------|
| `vibe doctor` | Health check | Start of session |
| `vibe spec <name> --copy` | Create spec | Before non-trivial work |
| `vibe plan <name> --copy` | Create plan | After spec approval |
| `vibe task <name> --copy` | Create tasks | After plan written |
| `vibe memory session-notes --copy` | Capture notes | End of session |
| `vibe templates` | Browse templates | Start of any task type |
| `npm run eval:report` | Full evaluation | Before release |
| `npm run validate` | Structural validation | After structural changes |

---

## Combining CLI with the Core Workflow

The core workflow is: **Intent → Spec → Plan → Implement → Test → Review → Memory → Merge**

Here's how the CLI maps to each phase:

```
Intent   →  (no tool — just state your goal clearly)
Spec     →  vibe spec <name> --copy
Plan     →  vibe plan <name> --copy
Tasks    →  vibe task <name> --copy
Implement → (edit files manually)
Test     →  npm run validate && npm run eval:report
Review   →  (manual review, or use review templates)
Memory   →  vibe memory session-notes --copy
Merge    →  (git commit, PR, merge)
```

**Health checks throughout:**

- Start: `vibe doctor`
- Before commit: `npm run validate`
- Before release: `npm run eval:report`
