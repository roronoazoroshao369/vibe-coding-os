---
title: Incident Postmortem
type: template
name: incident-postmortem
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: template
tags:

status: stable
---

# Incident Postmortem

> A blameless, action-oriented postmortem template. Use after any user-impacting incident or any near-miss that could have caused one. The goal is to learn, not to assign fault. Each finding produces a tracked action item with a deadline and an owner.

## Header

- **Incident ID:** `<INC-YYYY-NNN>`
- **Title:** `<short descriptive title>`
- **Date / time detected:** `<ISO timestamp>`
- **Date / time resolved:** `<ISO timestamp>`
- **Duration:** `<HH:MM>`
- **Severity:** `<SEV-1 | SEV-2 | SEV-3 | SEV-4>`
- **Author:** `<name>`
- **Reviewers:** `<names>`
- **Status:** `<draft | in-review | published>`

## 1. Summary

One paragraph. What happened, who was affected, and how it was resolved. Written for a reader who will not read the rest.

> On `<date>`, `<service>` experienced `<symptom>` for `<duration>`, impacting `<users/calls/regions>`. The root cause was `<cause>`. The immediate mitigation was `<fix>`. A permanent fix is tracked in `<issue link>`.

## 2. Impact

- **Users affected:** `<count or percentage>`
- **Requests failed:** `<count and percentage>`
- **Error budget consumed:** `<X% of monthly budget>`
- **Regions:** `<list>`
- **Customer-facing surface:** `<endpoints / features affected>`
- **SLO impact:** `<latency p99 | availability | error rate>` — before / during / after
- **Estimated revenue impact:** `<USD>` (if applicable)
- **Reputation impact:** `<notes>` (e.g., social media mentions, support tickets)

## 3. Timeline

Use ISO timestamps. One row per material event.

| Time (UTC) | Event | Actor |
| ---------- | ----- | ----- |
| `<ts>` | First sign of trouble (alert / user report / dashboard anomaly) | `<system | person>` |
| `<ts>` | On-call paged | `<name>` |
| `<ts>` | Mitigation applied | `<name>` |
| `<ts>` | Service restored | `<system>` |
| `<ts>` | Postmortem scheduled | `<name>` |

## 4. Root cause

What broke, and why.

- **Direct cause:** `<the proximate failure>`
- **Contributing factors:** `<list>`
- **Why we did not catch it earlier:**
  - `<missing test | missing alert | missing review | unmonitored metric>`
- **Why the mitigation worked:**
  - `<the mechanism that restored service>`

Use 5-Whys if needed:

1. Why did `<symptom>` happen? Because `<cause-1>`.
2. Why did `<cause-1>` happen? Because `<cause-2>`.
3. Why did `<cause-2>` happen? Because `<cause-3>`.
4. Why did `<cause-3>` happen? Because `<cause-4>`.
5. Why did `<cause-4>` happen? Because `<root cause>`.

## 5. Detection

- **How was it detected?** `<alert | user report | internal notice | third-party>`
- **Time to detect (TTD):** `<minutes from incident start>`
- **Could detection be faster?** `<yes / no — explain>`

## 6. Response

- **Time to mitigation (TTM):** `<minutes from detection>`
- **Who responded?** `<on-call rotation or named responders>`
- **What went well in the response:**
  - `<runbook was followed | alert was actionable | comms were clear>`
- **What did not go well in the response:**
  - `<runbook was stale | alert lacked context | on-call had no access>`

## 7. Action items

Each action item is tracked in the issue tracker. This table is the canonical list.

| # | Action | Owner | Priority | Due | Issue |
| - | ------ | ----- | -------- | --- | ----- |
| 1 | `<preventive action>` | `<name>` | P0 / P1 / P2 | `<date>` | `<link>` |
| 2 | `<detection improvement>` | `<name>` | P0 / P1 / P2 | `<date>` | `<link>` |
| 3 | `<response improvement>` | `<name>` | P0 / P1 / P2 | `<date>` | `<link>` |
| 4 | `<test or doc gap>` | `<name>` | P0 / P1 / P2 | `<date>` | `<link>` |

Priority legend:
- **P0** — must be done before the next release.
- **P1** — must be done within 30 days.
- **P2** — nice-to-have, track in backlog.

## 8. Lessons learned

What we learned that applies beyond this incident.

- `<process-level lesson>`
- `<architecture-level lesson>`
- `<culture-level lesson>`

## 9. Glossary

Define any acronyms or internal terms used above so a reader outside the team can follow.

- **`<term>`:** `<definition>`

## 10. Verification checklist

- [ ] Timeline is reviewed by all responders.
- [ ] Root cause is supported by evidence (logs, traces, metrics).
- [ ] Action items have owners and deadlines.
- [ ] Action items are linked to tracker issues.
- [ ] Lessons learned are written for the whole org to read.
- [ ] Postmortem is published within 7 days of incident resolution.
