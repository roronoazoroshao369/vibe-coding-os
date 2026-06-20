---
title: Runbook
type: template
name: runbook
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: template
tags:

status: stable
---

# Runbook

> A runbook is a step-by-step operational procedure for a specific task that on-call must execute without the author present. Use for any recurring operational task: restarts, failovers, scaling, data corrections, certificate rotations, dependency migrations.

## Header

- **Runbook ID:** `<RB-XXX>`
- **Title:** `<verb + object, e.g., "Failover primary database to standby">`
- **Service:** `<service name>`
- **On-call team:** `<team or rotation>`
- **Author:** `<name>`
- **Last tested:** `<date>`
- **Estimated time to execute:** `<minutes>`

## 1. When to use this runbook

Symptoms or signals that indicate this runbook applies.

- **Alert:** `<alert name>`
- **Dashboard signal:** `<dashboard | metric>`
- **User report:** `<typical user-facing symptom>`
- **Triggering condition:** `<e.g., "primary DB latency p99 > 500ms for 5 minutes">`

Do NOT use this runbook for:

- `<adjacent but different issue — point to the correct runbook>`
- `<issue requiring engineering decision — escalate>`

## 2. Pre-flight checklist

Before executing, confirm:

- [ ] You are on-call or have been paged.
- [ ] Incident channel created (`#inc-<id>`).
- [ ] Stakeholders notified per escalation policy.
- [ ] You have credentials for `<system>` (test with `<command>`).
- [ ] You know the rollback command for each step below.

If any pre-flight fails, escalate per `<escalation link>`.

## 3. Procedure

Numbered steps. Each step is one command or one verification. Each step must be reversible.

### Step 1. `<name>`

- **Goal:** `<what this step accomplishes>`
- **Command(s):**
  ```bash
  <command with placeholders>
  ```
- **Expected output:** `<exact output that means success>`
- **Verification:** `<how to confirm success>`
- **Rollback:** `<how to undo this step>`

### Step 2. `<name>`

- **Goal:** `<what this step accomplishes>`
- **Command(s):**
  ```bash
  <command with placeholders>
  ```
- **Expected output:** `<exact output that means success>`
- **Verification:** `<how to confirm success>`
- **Rollback:** `<how to undo this step>`

### Step N. `<name>`

- **Goal:** `<what this step accomplishes>`
- **Command(s):**
  ```bash
  <command with placeholders>
  ```
- **Expected output:** `<exact output that means success>`
- **Verification:** `<how to confirm success>`
- **Rollback:** `<how to undo this step>`

## 4. Verification (post-procedure)

After all steps complete:

- [ ] `<service>` health check returns `<expected>`: `<command>`
- [ ] `<dashboard metric>` returns to baseline: `<link>`
- [ ] No new alerts fired in `<window>`.
- [ ] Logs show `<expected pattern>`: `<query>`
- [ ] Customer-facing symptoms resolved: `<how to verify>`

## 5. Escalation

If the procedure does not resolve the issue:

1. **Escalate to:** `<team or person>`
2. **Channel:** `<slack | phone>`
3. **Hand-off includes:** `<link to incident channel>`, `<logs>`, `<metrics>`, `<what was tried>`.
4. **Stop and wait** for the next responder — do not improvise beyond this runbook.

## 6. Post-incident

- [ ] File postmortem using `templates/incident-postmortem.md` if this was a SEV-2 or higher.
- [ ] Update this runbook with anything learned.
- [ ] Note any missing tooling or runbook gaps.
- [ ] If runbook was wrong, prioritize a fix and link the issue.

## 7. Verification checklist

- [ ] Runbook tested in staging within the last 90 days.
- [ ] All commands are copy-pasteable with no placeholder ambiguity.
- [ ] Rollback is possible at every step.
- [ ] Escalation path is current (links resolve, on-call rotation is correct).
- [ ] Author and last-tested date are not stale.
