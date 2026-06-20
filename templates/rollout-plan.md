# Rollout Plan

> A template for shipping a change to production safely. Use for any change that could cause user-visible impact: feature flags, schema migrations, dependency upgrades, configuration changes, new services. The plan defines the rollout stages, the rollback criteria, and the monitoring signals that gate each stage.

## Header

- **Change ID:** `<CHG-YYYY-NNN>`
- **Title:** `<short descriptive title>`
- **Author:** `<name>`
- **Reviewers:** `<names>`
- **Target release date:** `<date>`
- **Risk level:** `<low | medium | high>`
- **Related:** `<PR link>`, `<design doc>`, `<runbook link>`

## 1. What is changing

One paragraph. What ships, who sees it, when.

> This change ships `<feature/fix>` to `<percentage of users or specific cohort>` starting `<date>`. The change is gated by `<feature flag / cohort config / config rollout>`. Rollback is `<automatic | manual>`.

## 2. Rollout stages

Each stage has explicit gates. Do NOT advance to the next stage until all gates pass.

| Stage | Audience | Duration | Success gate | Rollback trigger |
| ----- | -------- | -------- | ------------ | ---------------- |
| 1. Internal | Employees + dogfooders | `<1-7 days>` | `<error rate < X%, latency p99 < Yms>` | `<any SEV-2 or higher incident>` |
| 2. Canary | `<1-5%>` | `<1-3 days>` | `<error rate, latency, conversion unchanged ±X%>` | `<delta > Y% on any SLO>` |
| 3. Beta | `<10-25%>` | `<3-7 days>` | `<same gates>` | `<same triggers>` |
| 4. GA | `<100%>` | `<ramp or instant>` | `<final SLOs met>` | `<incident response>` |

## 3. Feature flag configuration

If the change is gated by a feature flag:

- **Flag name:** `<flag-name>`
- **Default:** `<off | on for internal>`
- **Kill switch:** `<how to disable instantly>`
- **Per-cohort overrides:** `<list of cohorts with override values>`
- **Removal plan:** `<date to remove the flag entirely once 100%>`

## 4. Monitoring

What dashboards and alerts are watched during the rollout.

- **Primary dashboard:** `<link>`
- **Secondary dashboards:** `<links>`
- **Alerts armed for this rollout:**
  - `<alert name>` — fires if `<condition>` — page `<team>`
- **Comparisons:**
  - `<metric>` for `<cohort>` vs. `<control cohort>` over `<window>`

## 5. Rollback procedure

Step-by-step. Must be executable by on-call without author present.

1. **Detect rollback condition:** `<which alert or signal>`
2. **Page:** `<team>`
3. **Disable flag:** `<command>` (e.g., `vibe flag set <flag> --off`)
4. **Verify rollback:** `<check that error rate returns to baseline>`
5. **Communicate:** `<status page | incident channel | customer comms>`
6. **File incident:** `<link to incident template>`

## 6. Migration plan

If the change includes a data migration:

- **Migration script:** `<path>`
- **Backwards compatible:** `<yes | no — explain>`
- **Estimated duration:** `<HH:MM>`
- **Locking:** `<read | write | none>`
- **Rollback SQL:** `<path to rollback script>`
- **Dry-run output:** `<link to staging run>`

## 7. Risk register

| Risk | Likelihood | Impact | Mitigation |
| ---- | ---------- | ------ | ---------- |
| `<risk>` | L / M / H | L / M / H | `<mitigation>` |

## 8. Comms plan

- **Internal:** `<#announce channel>` at `<time>`
- **Customer-facing:** `<blog post | email | in-app>` at `<time>`
- **Status page:** `<when to update>`
- **Support team briefing:** `<date>`

## 9. Post-rollout review

After full rollout (Stage 4 complete):

- [ ] All Stage 1-4 success gates met.
- [ ] No SEV-1 or SEV-2 incidents attributable to this change.
- [ ] Feature flag removed (if applicable).
- [ ] Cost: `<infra cost delta>` — within budget.
- [ ] Customer feedback: `<summary>`
- [ ] Lessons learned filed in `docs/postmortems/<date>-<change-id>.md`.

## 10. Verification checklist

- [ ] All rollout stages defined with explicit success gates.
- [ ] All rollback triggers defined with threshold values.
- [ ] Monitoring dashboards reviewed by SRE on-call.
- [ ] Rollback procedure dry-run completed in staging.
- [ ] Comms plan reviewed by support lead.
- [ ] Feature flag removal date set (if applicable).
