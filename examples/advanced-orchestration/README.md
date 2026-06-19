# Advanced Orchestration Example

This example shows an end-to-end release sprint that uses advanced orchestration to coordinate a council decision, parallel team execution, validation, PR review, and release handoff.

Use this when a change is too risky or broad for a single-agent workflow and needs explicit stage ownership, quality gates, and release evidence.

## Scenario

A maintainer wants to ship `v2.5.0` advanced orchestration. The sprint includes workflow contracts, runner hardening, documentation, validation, and release preparation.

**Goal:** move from council approval to release-ready evidence without losing traceability between decisions, team outputs, validation, and PR review.

## Stage 1 — Council kickoff

**Owner:** orchestrator / council chair

**Inputs:** roadmap item, acceptance criteria, prior release status, known risks.

**Council prompt:**

```text
Convene a release council for v2.5.0 advanced orchestration.
Decide scope, non-goals, team slices, required gates, escalation triggers,
and release evidence. Record assumptions and unresolved conflicts.
```

**Expected output:** `docs/reports/orchestration/v2.5-council-kickoff.md`

Include:

- Scope: workflow schema, runner, templates, docs, CI/release hardening.
- Non-goals: no runtime daemon, no external service dependency, no unreviewed auto-merge.
- Team split:
  - Team 1: workflow contracts and templates.
  - Team 2: examples and release-hardening docs.
  - Team 3: command/docs/governance cascade.
- Required gates: schema validation, orchestration workflow validation, traceability, markdown links, `validate:all` before release.
- Escalation triggers: conflicting expert findings, failed required gates, privacy/security concern, release evidence gap.

## Stage 2 — Team execution

Each team receives a constrained work packet and must return a handoff summary.

### Team packet template

```text
You are Team <n> for v2.5.0 advanced orchestration.
Work only on the files listed below. Do not commit.
Return: changed files, evidence, risks, and next steps.
Run targeted validation where possible.
```

### Example team outputs

- Team 1 produces:
  - `schemas/orchestration-workflow.json`
  - `templates/workflow-simple-feature.json`
  - `templates/workflow-bugfix.json`
  - `templates/workflow-security-audit.json`
- Team 2 produces:
  - `examples/advanced-orchestration/README.md`
  - `examples/advanced-orchestration/council-escalation-sample.md`
  - `docs/release-hardening-playbook.md`
- Team 3 produces:
  - `commands/vibe-orchestrate.md`
  - `docs/orchestration-guide.md`
  - release notes and dashboard/README cascade.

## Stage 3 — Integration and validation

**Owner:** integrator

Run checks from narrow to broad:

```bash
npm run validate:orchestration-workflows
npm run validate:traceability
npm run validate:links
npm run validate:all
```

If `validate:links` is not available in an older checkout, run the repository's markdown/link validation command documented in `package.json` and record the substitute command in the PR summary.

**Evidence to capture:**

- Command run.
- Exit code.
- Key failures or warnings.
- Files fixed after validation.
- Any residual risk accepted by maintainers.

## Stage 4 — PR preparation

**Owner:** orchestrator / PR author

PR body checklist:

- Summary of council decision and sprint scope.
- Team handoff links or summaries.
- Validation results with command names and timestamps.
- Generated reports reviewed and either committed intentionally or removed.
- Known limitations and post-release follow-up.

Suggested PR sections:

```markdown
## Summary
- Added advanced orchestration schema, workflow templates, runner docs, examples, and release playbook.

## Validation
- npm run validate:orchestration-workflows
- npm run validate:traceability
- npm run validate:links
- npm run validate:all

## Release evidence
- Dashboard updated.
- Release notes prepared.
- Generated reports reviewed/cleaned.

## Risks
- <risk and disposition>
```

## Stage 5 — Release handoff

**Owner:** release manager

Before tagging:

1. Confirm PR merged to `main` after required checks pass.
2. Re-run final validation on a clean checkout.
3. Sync `docs/DASHBOARD.md`, `docs/ROADMAP-STATUS.md`, and release notes.
4. Remove temporary generated reports unless intentionally archived.
5. Create the tag and release notes.
6. Convene a post-release council to capture lessons and follow-up tasks.

See `../../docs/release-hardening-playbook.md` for the full release-hardening checklist.

## Related

- `../../docs/orchestration-guide.md`
- `../../skills/core/orchestration-workflows/SKILL.md`
- `../../skills/agents/advanced-orchestration/SKILL.md` — orchestration agent skill with role contracts and handoff conventions
- `../../schemas/orchestration-workflow.json`
- `../../templates/workflow-simple-feature.json`
- `../../templates/workflow-bugfix.json`
- `../../templates/workflow-security-audit.json`
- `council-escalation-sample.md`
