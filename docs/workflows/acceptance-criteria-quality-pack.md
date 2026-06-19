# Acceptance Criteria Quality Pack Workflow

> How to select, apply, and interpret the Acceptance Criteria Quality Pack, with integration into checkpoints and scorecards.

## Purpose

This workflow guides users through selecting the appropriate AC quality level, applying it to spec or task criteria, validating at checkpoint gates, and recording results in a scorecard. It bridges the `skills/core/acceptance-criteria/SKILL.md` skill with the structured quality pack system.

---

## Step 1: Select the Quality Level

Use the risk/complexity of the task to decide which level is appropriate.

| Task Profile | Recommended Level | Rationale |
|---|---|---|
| Trivial bugfix, config change, typo fix | **Basic (1)** | Minimal verification needed; one observable criterion covers the fix. |
| Standard feature, medium bugfix, internal tool | **Verified (2)** | Edge-case and error-path coverage prevent regressions. |
| Public API, data migration, auth/permissions, security fix | **Gated (3)** | Traceability, performance, and backward-compatibility criteria protect consumers. |
| Compliance audit, release branch, public-facing change | **Audited (4)** | Full evidence trail and independent review required for regulatory or contractual obligations. |

See the level descriptions in `templates/quality-packs/acceptance-criteria-pack.md` for full requirements.

**Decision prompt:** "Is the risk of missing an edge case or error path higher than the effort to write and verify those criteria?" If yes, choose a higher level.

---

## Step 2: Apply the Quality Pack

For each acceptance criterion being written or reviewed:

1. **Load the AC quality pack template** — read `templates/quality-packs/acceptance-criteria-pack.md`.
2. **Select criteria patterns** — use the reuse patterns (functional, edge-case, error-handling, performance) to structure each criterion.
3. **Write criteria at the chosen level** — ensure all requirements of that level are met before proceeding.
4. **Tag each criterion** with:
   - Its type: `[functional]`, `[edge-case]`, `[error-handling]`, `[performance]`, `[security]`, `[backward-compatibility]`
   - Its verification method: `[test:test_name]`, `[command:cli_check]`, `[manual:qa_step]`
   - Its traceability marker (Level 3+): `[spec:section]` or `[req:REQ-001]`

**Example tagged criterion:**
```
[functional][test:test_auth_login_success]
Given a registered user with valid credentials, when they submit the login form
with the correct password, then they receive a session token and are redirected
to the dashboard.
Verified by: test_auth_login_success.py::test_login_valid_credentials
```

---

## Step 3: Validate at Checkpoint Gates

Integration with `commands/vibe-checkpoints.md`:

### Spec → Implementation Gate

```
Required AC Level: Verified (2) minimum
```

**Pre-check:**
- Read the acceptance criteria from the spec or task document.
- For each criterion, check:
  - It is observable (describes behavior, not implementation).
  - It has a verification method.
  - Edge cases and error paths have explicit criteria.
- If any criterion fails at Level 2 requirements, block advancement.

**Recording:**
- Use `templates/checkpoint-template.md` to record evidence.
- For each criterion: criterion text, verification method, result (PASS/FAIL), notes.
- If all criteria pass, record "AC quality pack: Level 2 (Verified) — PASS".

### Implementation → Review Gate

```
Required AC Level: Gated (3) minimum
```

**Pre-check:**
- Verify traceability markers exist for every criterion.
- Check performance criteria exist if the feature has performance constraints.
- Check backward-compatibility criteria exist for public contracts.
- Run any automated tests or commands named in the criteria.
- For any failing criterion, record evidence and block advancement.

**Recording:**
- Use `templates/checkpoint-template.md` with additional traceability columns.
- Include the AC quality level in the checkpoint record header.

### Review → Release Gate

```
Required AC Level: Audited (4)
```

**Pre-check:**
- Verify every criterion has a linked evidence artifact (test output, screenshot, log).
- Confirm independent review of criteria has been performed.
- Document any residual risks with mitigation or acceptance rationale.
- Attach the completed scorecard.

**Recording:**
- Use `templates/quality-pack-scorecard.md` for the final scorecard.
- Include the scorecard in the release or handoff document.

---

## Step 4: Record in Scorecard

After completing validation at any gate, fill in the scorecard at `templates/quality-pack-scorecard.md`.

**Scorecard field mapping for AC quality pack:**

| Field | Value |
|---|---|
| Quality pack | Acceptance Criteria Quality Pack |
| Reviewed change | Spec ID, PR number, or task reference |
| Checklist source | `templates/quality-packs/acceptance-criteria-pack.md` |
| Commands run | `vibe-checkpoints`, test suite command, manual QA steps |

**Evidence table dimensions (by level):**

| Level | Dimensions to fill |
|---|---|
| Basic (1) | Observable, Verifiable |
| Verified (2) | + Edge-Covered, Error-Covered, Test-Mapped |
| Gated (3) | + Traceable, Performance-Aware, Checkpoint-Ready |
| Audited (4) | + Audited, Independent-Reviewed, Risk-Documented |

**Verdict options:**
- **PASS** — all criteria at the required level are satisfied.
- **PASS WITH RISKS** — some criteria are met but residual risks are documented and accepted.
- **BLOCKED** — one or more criteria fail; fix and re-run the checkpoint.

---

## Example Usage

### Example 1: Standard Feature — User Profile API

**Task:** Create a new `GET /users/:id` endpoint returning user profile data.

**Selected level:** Verified (2) — standard endpoint, internal consumers.

**Criteria written:**
```
[functional][test:test_get_user_profile]
Given a valid user ID, when GET /users/:id is called, then the response body
contains id, name, email, and createdAt fields.
Verified by: test_api_user_profile::test_get_user_profile

[edge-case][test:test_get_user_not_found]
Edge case: User ID does not exist. Expected: 404 with descriptive error message.
Risk if missed: Caller cannot distinguish missing vs. server error.
Verified by: test_api_user_profile::test_get_user_not_found

[error-handling][test:test_get_user_invalid_id]
Failure scenario: User ID is not a valid UUID. Observable behavior: 400 with
"Invalid user ID format". Verified by: test_api_user_profile::test_get_user_invalid_id
```

**Checkpoint result:** PASS — all three criteria observable, test-mapped, edge-case and error-path covered.

### Example 2: Security Fix — Session Hardening

**Task:** Strengthen session token generation and validation.

**Selected level:** Gated (3) — security change with public API impact.

**Criteria written:**
```
[functional][test:test_session_create]
Given a valid login, when a session is created, then the session identifier is returned
and expires in 24 hours.
Verified by: test_session::test_session_create
Traceability: [spec:auth-03-session-tokens]

[edge-case][test:test_session_expiry]
Edge case: Session is checked 1ms after expiry. Expected: 401 Unauthorized.
Risk if missed: Stale sessions accepted.
Verified by: test_session::test_session_expiry
Traceability: [spec:auth-03-session-expiry]

[security][test:test_session_invalid_signature]
Security: Token with invalid signature is rejected with 401.
Verified by: test_session::test_session_invalid_signature
Traceability: [spec:auth-03-signature-validation]

[performance][command:bench_session]
Performance: Session creation completes under 50ms under 100 concurrent requests.
Threshold: p95 < 50ms.
Verified by: bench_session --concurrency=100
Traceability: [spec:auth-03-performance]
```

**Checkpoint result:** PASS — traceable, performance-threshold included, security-tagged, test-mapped.

---

## Related files

- `templates/quality-packs/acceptance-criteria-pack.md` — The quality pack template with level definitions and patterns
- `templates/quality-pack-scorecard.md` — Fillable scorecard for recording results
- `commands/vibe-checkpoints.md` — Checkpoint validation command
- `skills/core/acceptance-criteria/SKILL.md` — Core AC skill
- `skills/core/checkpoint-validation/SKILL.md` — Checkpoint validation skill
