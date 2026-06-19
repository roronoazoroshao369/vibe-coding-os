# Acceptance Criteria Quality Pack

> Use this quality pack to classify, verify, and gate acceptance criteria through four maturity levels. Designed for reuse across any feature, bugfix, migration, or refactor task.

## Purpose

Provide structured quality levels for acceptance criteria so teams can match the rigor of their AC to the risk and complexity of the work. Each level builds on the previous one, ensuring criteria are observable, testable, edge-case-covered, and checkpoint-gated before implementation proceeds.

## When to use

- When writing or reviewing acceptance criteria for any spec, task, or feature.
- At checkpoint boundaries to verify that criteria meet the required quality level.
- When composing quality packs for task types (feature, bugfix, migration, security, refactor).
- During self-review or peer review of spec documents.

## Quality Levels

### Level 1 — Basic

> Minimal observable criteria. Acceptable for low-risk bugfixes and trivial changes.

**Requirements:**
- Each criterion is an observable outcome (not implementation detail).
- Each criterion has a named verification method (manual, command, or test).
- At least one criterion covers the happy path.
- No subjective language ("works well", "properly", "as expected").

**Gate-pass check:**
- [ ] Every criterion describes an observable behavior.
- [ ] Every criterion names a verification method.
- [ ] No criterion restates implementation detail.

**Scorecard dimensions:** Observable, Verifiable, Complete (happy-path only).

---

### Level 2 — Verified

> Edge-case and error-path coverage. Acceptable for standard features and medium-risk bugfixes.

**Level 1 requirements PLUS:**

**Additional requirements:**
- Edge cases are explicitly enumerated (empty input, boundary values, concurrent access).
- Error-handling criteria cover at least: invalid input, missing required data, and timeout/unavailable dependency.
- Each criterion maps to at least one test or validation command.
- Anti-patterns removed: no vague terms ("should handle errors"), no implied assumptions.

**Gate-pass check:**
- [ ] Edge cases are identified and have corresponding criteria.
- [ ] Error paths have explicit criteria (invalid input, missing data, dependency failure).
- [ ] Each criterion is backed by a test or command.

**Scorecard dimensions:** Observable, Verifiable, Edge-Covered, Error-Covered, Test-Mapped.

---

### Level 3 — Gated

> Checkpoint-ready criteria with traceability. Required for features, migrations, and security work.

**Level 2 requirements PLUS:**

**Additional requirements:**
- Each criterion has a traceability marker linking to a spec section, user story, or requirement ID.
- Performance criteria are included where applicable (response time, memory, throughput thresholds).
- Backward-compatibility criteria exist for any public API or contract change.
- Security-relevant criteria are tagged and reviewed.
- The full criteria set passes the checkpoint validation gate (see `commands/vibe-checkpoints.md`).

**Gate-pass check:**
- [ ] Every criterion has a traceability marker.
- [ ] Performance thresholds are specified where relevant.
- [ ] Backward-compatibility is addressed for public contracts.
- [ ] Security-relevant criteria are tagged.
- [ ] Checkpoint gate records evidence for each criterion.

**Scorecard dimensions:** Observable, Verifiable, Edge-Covered, Error-Covered, Test-Mapped, Traceable, Performance-Aware, Checkpoint-Ready.

---

### Level 4 — Audited

> Full audit trail with formal evidence. Required for high-risk, compliance, or public-release work.

**Level 3 requirements PLUS:**

**Additional requirements:**
- A complete evidence bundle exists for every criterion (test output, screenshot, log excerpt, or formal verification).
- Audit trail links each criterion to its verification artifact.
- Acceptance criteria are independently reviewed (not self-authored).
- Residual risks are documented with mitigation or acceptance rationale.
- The scorecard is attached to the handoff or release record.

**Gate-pass check:**
- [ ] Every criterion has a linked evidence artifact.
- [ ] Evidence bundle is complete and reproducible.
- [ ] Independent review is recorded.
- [ ] Residual risks are documented.
- [ ] Scorecard is attached to handoff.

**Scorecard dimensions:** Observable, Verifiable, Edge-Covered, Error-Covered, Test-Mapped, Traceable, Performance-Aware, Audited, Independent-Reviewed, Risk-Documented.

---

## Reuse Patterns for Common Criteria Types

### Functional Criteria Pattern

```
**Given** <precondition>
**When** <action>
**Then** <observable outcome>
**Verified by:** <test name, command, or manual observation>
```

**Examples:**
- Given a user with valid credentials, when they submit the login form, then they are redirected to the dashboard. Verified by: `test_auth_login_success`
- Given an empty cart, when the user applies a valid coupon, then the coupon is rejected with message "Cart is empty". Verified by: `test_coupon_empty_cart`

---

### Edge-Case Criteria Pattern

```
**Edge case:** <boundary condition>
**Expected behavior:** <observable outcome>
**Risk if missed:** <impact description>
**Verified by:** <test name or command>
```

**Examples:**
- Edge case: User submits form with maximum-length input (10,000 chars). Expected: Accepted or truncated with clear error. Risk if missed: Data corruption or truncation. Verified by: `test_input_boundary_max_length`
- Edge case: Two concurrent requests to the same resource. Expected: One succeeds, other returns 409 Conflict. Risk if missed: Race condition, data inconsistency. Verified by: `test_concurrent_request_conflict`

---

### Error-Handling Criteria Pattern

```
**Failure scenario:** <what goes wrong>
**Observable behavior:** <what the user or system sees>
**Recovery path:** <how to recover or retry>
**Verified by:** <test name or command>
```

**Examples:**
- Failure scenario: External payment API is unreachable. Observable behavior: User sees "Payment temporarily unavailable, please try again." Recovery path: Automatic retry with exponential backoff (3 attempts). Verified by: `test_payment_api_unavailable`
- Failure scenario: Database connection drops mid-transaction. Observable behavior: Transaction is rolled back; user sees "Operation could not be completed." Recovery path: Idempotent retry. Verified by: `test_db_connection_drop`

---

### Performance Criteria Pattern

```
**Metric:** <what is measured>
**Threshold:** <acceptable value>
**Condition:** <under what load or scenario>
**Verified by:** <benchmark, load test, or profiling command>
```

**Examples:**
- Metric: API response time. Threshold: p95 < 200ms. Condition: 100 concurrent users. Verified by: `test_api_response_time_p95`
- Metric: Memory usage. Threshold: < 512MB peak. Condition: Processing a 10MB file. Verified by: `test_memory_usage_large_file`

---

## Gate-Pass Criteria for Checkpoints

These criteria must be satisfied before a checkpoint gate passes for acceptance criteria quality.

### Spec → Implementation Gate

- [ ] All acceptance criteria are at Level 2 (Verified) or higher.
- [ ] At least 80% of criteria are test-mapped.
- [ ] No criterion uses subjective language.
- [ ] Edge cases and error paths are covered.

### Implementation → Review Gate

- [ ] All acceptance criteria are at Level 3 (Gated) or higher.
- [ ] Traceability markers link criteria to spec sections.
- [ ] Performance criteria exist where applicable.
- [ ] Backward-compatibility criteria exist for public contracts.
- [ ] Checkpoint evidence is recorded for each criterion.

### Review → Release Gate

- [ ] All acceptance criteria are at Level 4 (Audited).
- [ ] Evidence artifacts are linked for every criterion.
- [ ] Independent review is recorded.
- [ ] Residual risks are documented.
- [ ] Scorecard is attached to the handoff.

---

## Level Selection Guide

| Task Risk | Minimum AC Level | When to use |
|---|---|---|
| Low (trivial bugfix, config change) | Basic (1) | Quick fixes, no public surface |
| Medium (standard feature, bugfix) | Verified (2) | Normal development, internal APIs |
| High (feature, migration, security) | Gated (3) | Public APIs, data migrations, auth changes |
| Critical (release, compliance, public) | Audited (4) | Releases, compliance audits, public-facing changes |

---

## Scorecard Template

Use the fillable scorecard at `templates/quality-pack-scorecard.md` after running this quality pack. Fill in:
- **Quality pack:** Acceptance Criteria Quality Pack
- **Quality level:** Basic / Verified / Gated / Audited
- **Checklist source:** `templates/quality-packs/acceptance-criteria-pack.md`
- **Evidence table:** One row per quality dimension from the achieved level.

---

## Related files

- `skills/core/acceptance-criteria/SKILL.md` — Core AC skill
- `docs/workflows/acceptance-criteria-quality-pack.md` — Selection, application, and interpretation workflow
- `templates/quality-pack-scorecard.md` — Scorecard template for recording results
- `commands/vibe-checkpoints.md` — Checkpoint validation command
- `skills/core/checkpoint-validation/SKILL.md` — Checkpoint validation skill
