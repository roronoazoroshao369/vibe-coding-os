# Council Escalation — Conflicting Expert Findings

This sample documents a realistic escalation case where experts produced conflicting findings. It shows the escalation path, the council resolution process, and how to record the outcome in the orchestration workflow.

## Scenario

During v2.5.0 advanced orchestration sprint, two experts review the orchestration workflow schema (`schemas/orchestration-workflow.json`).

- **Expert A (Security)** finds that the schema allows arbitrary gate names, which could let an unsafe workflow bypass runtime checks.
- **Expert B (Workflow Engineer)** argues that arbitrary gate names are required for extensibility and that blocking them would prevent teams from adding custom gates.

**Conflict:** Security wants to restrict gate names to a fixed allowlist. Workflow Engineering wants to keep the field open for extensibility. Both positions are valid but incompatible without compromise.

## Escalation trigger

The council escalation trigger is pulled when:

1. A required gate fails and the owner cannot unblock within the sprint.
2. Two experts produce contradictory findings that materially affect scope, safety, or schedule.
3. A maintainer disagrees with a team's scope decision and requests council mediation.
4. A post-release finding invalidates a key assumption recorded during the sprint.

In this case, **scenario 2** applies: two experts with overlapping domain authority reach incompatible recommendations.

## Escalation process

### Step 1 — Record the conflict

**When:** During the integration stage after expert reviews are submitted.

**By:** Orchestrator or integrator who collects the review outputs.

**Record:**

```markdown
## Escalation: gate name flexibility vs security

| Field | Value |
|---|---|
| **Type** | Conflicting expert findings |
| **Raised by** | Integrator |
| **Affected artifact** | `schemas/orchestration-workflow.json` |
| **Field in dispute** | `stages[].gates[].gateId` — should values be restricted? |
| **Expert A** | Security Engineer — restrict to allowlist |
| **Expert B** | Workflow Engineer — keep open for extensibility |
| **Urgency** | Blocking — workflow validation gate requires a decision |
```

### Step 2 — Convene council

**When:** Within one working cycle of the escalation being recorded.

**Attendees:** Council chair, subject experts (Security, Workflow Engineering), a neutral reviewer, and the orchestrator.

**Council prompt:**

```text
Escalation: gate name flexibility vs security.

Expert A (Security) recommends restricting gateId to an allowlist
to prevent unsafe custom gates from being invoked.

Expert B (Workflow Engineering) recommends leaving gateId open
so teams can add custom gates without schema changes.

Council must decide:

1. Accept Expert A's recommendation (restrictive).
2. Accept Expert B's recommendation (permissive).
3. Choose a middle path and document the compromise.
4. Defer and record the open question.
```

### Step 3 — Council resolution

The council evaluates:

- **Risk vs benefit:** blocked unsafe gates reduce attack surface; blocking extensibility creates frustration and may cause teams to work around the system.
- **Precedent:** previous versions allowed open-ended fields; changing now creates migration burden.
- **Feasibility:** an allowlist on `gateId` is easy to implement but hard to maintain. A middle path is more practical.

**Council decision:** middle path.

```markdown
## Council resolution — v2.5.0 escalation #1

| Field | Value |
|---|---|
| **Decision** | Middle path |
| **Rationale** | gateId remains a free string, but a new `gateAllowlist` field is added at workflow metadata level. When present, the runner validates that every stage gateId appears in the allowlist. When absent, no allowlist enforcement occurs (backward compatible). |
| **Action** | Add `gateAllowlist` (optional, array of strings) to `schemas/orchestration-workflow.json`. Update `scripts/orchestrate-workflow.mjs` to check the allowlist when present and emit a warning per disallowed gate on dry-run and a fatal error on real execution. |
| **Owner** | Team 1 (workflow contracts) |
| **Deadline** | Before next integration validation |
| **Re-opens if** | A team reports that the allowlist field is confusing or rarely used, which should trigger a post-release survey. |
```

### Step 4 — Implementation

The council decision maps to concrete changes:

1. Update `schemas/orchestration-workflow.json`: add `gateAllowlist` to the workflow metadata schema (optional, array of strings).
2. Update `scripts/orchestrate-workflow.mjs`: when `gateAllowlist` exists, gate every stage gateId against the allowlist; warn during dry-run, fail during real execution for missing entries.
3. Update `templates/workflow-simple-feature.json`, `templates/workflow-bugfix.json`, `templates/workflow-security-audit.json` to include the correct allowlist entries if the templates adopt the feature.
4. Regenerate validation evidence.

### Step 5 — Record the outcome

After implementation:

```markdown
## Escalation #1 — outcome

- Schema updated with `gateAllowlist` field.
- Runner updated with allowlist validation.
- Templates reviewed — no change needed (templates use standard gate aliases that always pass allowlist).
- Validation passed.
- Council decision recorded and linked from the orchestration report.
```

## Escalation types reference

| Type | Trigger | Resolution path |
|---|---|---|
| Conflicting expert findings | Two or more domain experts produce incompatible recommendations | Council evaluates risk, precedent, feasibility; chooses or defers |
| Failed required gate | A blocking quality gate cannot be fixed within sprint | Council decides: extend sprint, relax gate, or accept risk |
| Scope creep | A team expands scope beyond the council-approved plan | Council reviews delta; approve, defer, or reject |
| Privacy/security finding | An audit reveals a privacy gap or security vulnerability | Council decides: fix immediately, add gate, or defer with accepted risk |
| Release evidence gap | Missing validation, report, or documentation for a release criterion | Council decides: close gap, accept limited state, or postpone release |

## See also

- [Advanced orchestration sprint example](README.md) — full end-to-end sprint walkthrough
- [Orchestration guide](../../docs/orchestration-guide.md)
- [Workflow schema](../../schemas/orchestration-workflow.json)
- [Release hardening playbook](../../docs/release-hardening-playbook.md)
