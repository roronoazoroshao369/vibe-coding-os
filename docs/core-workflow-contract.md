# Core Workflow Contract — v1.0

This document defines the stable, versioned workflow contract for Vibe Coding OS.
It governs how intent is turned into verified, merge-ready changes.

> **Contract version:** 1.0
> **Stability:** Stable — breaking changes to this contract require a major version bump.

## 1. Workflow Pipeline

Every non-trivial change follows this pipeline:

```
Intent → Spec → Plan → Implement → Test → Review → Memory → Merge
```

| Phase | Purpose | Minimum Artifact |
|-------|---------|------------------|
| **Intent** | Capture what the human wants and why | Short intent statement or issue reference |
| **Spec** | Define desired behavior, constraints, non-goals, acceptance criteria | Spec document (per tier, see below) |
| **Plan** | Break the change into reviewable steps, files, and verification checks | Plan document or checklist |
| **Implement** | Make focused edits matching the plan | Code/files + inline evidence of completion |
| **Test** | Run the smallest meaningful checks first, then broader validation | Test output or validation results |
| **Review** | Inspect diff for correctness, simplicity, security, maintainability | Review findings (self or peer) |
| **Memory** | Record durable decisions, gotchas, follow-ups | Memory entry or session summary |
| **Merge** | Confirm readiness to ship; no unresolved blockers | Merge readiness report |

### Pipeline Rules

1. **No skipping.** Every task goes through all 8 phases. Tiny tasks may collapse phases (see Task Tiers), but the evidence per phase must still exist.
2. **No phase reordering.** Spec must precede Plan; Plan must precede Implement; Test must precede Review.
3. **Any phase can loop back.** If review finds a problem, the pipeline rewinds to the appropriate phase (Spec, Plan, or Implement).
4. **Intent gates the pipeline.** If intent is ambiguous, apply `clarify-before-code` or `vibe-grill-me` before proceeding.

## 2. Task Tiers

| Tier | Use When | Minimum Artifacts | Evidence Required |
|------|----------|-------------------|-------------------|
| **Tiny** | Typo, small docs edit, obvious rename | Short intent statement + quick check | Verification output (test pass, lint clean) |
| **Small** | Low-risk focused change, single file | Mini-spec or checklist + validation | Spec/checklist exists + validation passes |
| **Medium** | Feature or bugfix with behavior change | Spec → Plan → Tasks → Implement → Verify | Complete artifact chain per pipeline |
| **Large** | Multiple modules, agents, migration | PRD/spec, ADR if needed, detailed plan, handoff memo | All Medium evidence + ADR + handoff |
| **Risky** | Auth, security, data loss, production stability | Strict spec, TDD/checkpoint gate, independent reviewer, rollback plan | All Large evidence + independent reviewer sign-off + rollback verified |

### Tier Selection

- Default to **Small** or **Medium**. Escalate to **Large** or **Risky** when:
  - Multiple files or modules are affected
  - The change touches authentication, authorization, encryption, data persistence
  - Data loss or rollback is non-trivial
  - External API contracts change
  - The change has compliance, licensing, or legal implications

## 3. Required Artifacts Per Tier

### Tiny
- **Intent:** 1–2 sentence description in commit message or task note
- **Verification:** Screenshot, test output, or validation command result
- **Review:** Self-review (glance at diff)

### Small
- **Intent:** Issue reference or brief statement
- **Spec:** Mini-spec (goals + acceptance criteria, 3–10 lines) or checklist
- **Verification:** `npm run validate` or equivalent test
- **Review:** Self-review or quick peer review

### Medium
- **Intent:** Issue reference or clear description
- **Spec:** Full spec per `templates/spec-template.md` (goals, non-goals, scenarios, acceptance criteria)
- **Plan:** Per `templates/plan-template.md` (steps, files, risks, verification commands)
- **Tasks:** Per `templates/tasks-template.md` (ordered, dependency-aware)
- **Implement:** Edits matching plan, with inline verification notes
- **Test:** Test output log or validation script results
- **Review:** Per `templates/review-template.md` (findings, fix/defer decisions)
- **Memory:** Per `templates/memory-entry-template.md` or session summary
- **Merge:** Readiness report (tests pass, review clear, attribution clean)

### Large
All Medium artifacts, plus:
- **ADR** if architecture is affected (per `templates/adr-template.md`)
- **Handoff memo** if multi-session or multi-agent (per `templates/handoff-template.md`)
- **Updated skill/command/template** if framework changes

### Risky
All Large artifacts, plus:
- **Independent reviewer findings** (second person or agent, per `templates/review-template.md`)
- **Rollback plan** documented and verified
- **Security review** if auth/data/encryption is affected
- **License/attribution check** for new dependencies

## 4. Evidence Requirements

Every phase must produce **verifiable evidence**. Evidence is what makes the pipeline auditable and the claim of "done" meaningful.

| Evidence Type | Examples | Validation |
|---------------|----------|------------|
| **Structural** | File exists in correct location, registry entry present | `npm run validate` (repo structure) |
| **Referential** | Cross-doc links resolve, no broken refs | `npm run validate:traceability` |
| **Security** | No secrets in diffs, no injection signatures | `npm run validate:secrets`, `npm run validate:injection` |
| **Behavioral** | Tests pass, output matches expected | Test runner output, manual verification |
| **Procedural** | Phase artifacts exist, review findings documented | Human or agent inspection |
| **Attribution** | Upstream sources cited, no unlicensed copying | `npm run validate:references` |

### Minimum Evidence Gate

Before a task can exit the pipeline:

- ✅ All tier-required artifacts exist
- ✅ Validation passes (`npm run validate`)
- ✅ No broken internal references
- ✅ No secrets detected in new or changed files
- ✅ Review findings resolved (fix or explicit deferral)
- ✅ Memory recorded (if any durable decisions were made)
- ✅ Attribution clean (no unlicensed upstream content)

## 5. Definition of Done

A task is **done** when:

1. **Intent is satisfied** — the original ask is met (scope may be adjusted by agreement)
2. **Spec is met** — all acceptance criteria pass
3. **Plan is executed** — all plan steps are complete
4. **Tests pass** — all required checks pass (or limitations are documented)
5. **Review is complete** — findings are addressed or explicitly deferred
6. **Memory is captured** — durable decisions, gotchas, and follow-ups are recorded
7. **Merge is ready** — readiness report confirms no blockers
8. **Validation passes** — `npm run validate` exits 0
9. **Attribution is clean** — no unlicensed content, all sources cited

### Done ≠ Shipped

"Done" means merge-ready. Shipping (deployment, publishing) is a separate gate governed by the release checklist.

## 6. Contract Versioning

| Change | Version Bump |
|--------|-------------|
| Adding a new optional tier | Minor |
| Adding a new required artifact for an existing tier | Minor |
| Removing or renaming a pipeline phase | Major |
| Changing evidence requirements significantly | Major |
| Relaxing an evidence requirement (e.g., making optional what was required) | Minor |

Any consumer of this contract (agent, CI pipeline, reviewer) may assert `core-workflow-contract.md v1.0` as the governing process.

## 7. Relationship to Other Docs

- **Release checklist** (`release-checklist.md`): Pre-ship validation; assumes the pipeline produced merge-ready changes.
- **Compatibility support policy** (`compatibility-support-policy.md`): Adapter expectations; contract applies regardless of adapter.
- **CONTRIBUTING.md**: Human-oriented contribution steps; this contract defines the workflow that contributions must follow.
- **README.md**: Overview; this contract is the authoritative source for the pipeline definition.
