# Smart Adapt Scored Session

> A complete v1.9 example of a coding task that runs through Smart Adapt: task classification, model weakness memory, adaptive prompt selection, quality pack execution, and scorecard reporting.

## Scenario

You are asked to add a new API endpoint `POST /api/v1/integrations/webhook` that receives an external event payload, validates a token, and queues a background job for processing.

- Model in use: `claude-sonnet`
- Task type: `feature` with `api` + `async` + `security-adjacent` domain amplifiers
- Existing code: Python/FastAPI project with Celery for background tasks

## Step 1: Model weakness memory check

Command: [`vibe-model-weakness`](../../commands/vibe-model-weakness.md)

Template: [`templates/model-weakness-log.md`](../../templates/model-weakness-log.md)

### Known weaknesses for `claude-sonnet` relevant to this task

| Pattern Category | Example | Prevention | Priority |
| --- | --- | --- | --- |
| Missing null-checks | Assumes DB query always returns a row | Verify every query result is null-checked before property access | High |
| API version mismatch | Uses deprecated v1 endpoint when v2 is documented | Check API version in imports and base URLs against current documentation | High |
| Incorrect error handling | Wraps entire function in bare `except` and silently passes | Ensure each `except` catches a specific exception and logs or re-raises | Medium |

### Injected checks

1. **HIGH** — Every DB query result in the new handler must be null-checked before property access.
2. **HIGH** — All endpoint imports and base URLs must match the current `v1` API contract (no stale v0 or v2 paths).
3. **MEDIUM** — All exception handlers must catch specific exceptions; bare `except` or silent `pass` is prohibited.

## Step 2: Adaptive prompt selection

Command: [`vibe-adaptive-prompt`](../../commands/vibe-adaptive-prompt.md)

Template: [`templates/adaptive-prompt-matrix.md`](../../templates/adaptive-prompt-matrix.md)

### Task classification

- Primary type: `feature`
- Domain amplifiers: `API endpoint`, `Async / background job`, `Authentication / permissions` (token validation)
- Tier: `medium` (new endpoint + external contract + async worker)

### Recommended prompt stack

1. **Quality rubric** — baseline for all code changes ([`skills/prompts/quality-rubric/SKILL.md`](../../skills/prompts/quality-rubric/SKILL.md))
2. **Self-review before response** — every non-tiny task ([`skills/core/self-review-before-response/SKILL.md`](../../skills/core/self-review-before-response/SKILL.md))
3. **API endpoint quality pack** — endpoint correctness and contracts ([`skills/checklists/api-endpoint-quality/SKILL.md`](../../skills/checklists/api-endpoint-quality/SKILL.md))
4. **Auth quality pack** — token validation and permission boundaries ([`skills/checklists/auth-quality/SKILL.md`](../../skills/checklists/auth-quality/SKILL.md))
5. **Async job quality pack** — background job behavior ([`skills/checklists/async-job-quality/SKILL.md`](../../skills/checklists/async-job-quality/SKILL.md))
6. **Adversarial review** — security-adjacent external contract ([`skills/core/adversarial-code-review/SKILL.md`](../../skills/core/adversarial-code-review/SKILL.md))

### Why not a smaller stack?

The task involves an external-facing endpoint that accepts untrusted input, validates a token, and enqueues a background job. Skipping auth or async review would leave known failure modes unexamined. The stack is proportional, not excessive.

## Step 3: Lessons learned search

Command: [`vibe-lessons-learned`](../../commands/vibe-lessons-learned.md)

Template: [`templates/lesson-entry-template.md`](../../templates/lesson-entry-template.md)

### Query terms

- `webhook`, `api endpoint`, `async job`, `token validation`, `celery`, `fastapi`

### Relevant lesson found (example)

> **Lesson: webhook handler did not validate content-type**
> - Error: Clients sent `application/x-www-form-urlencoded` but handler parsed as JSON, causing 500 errors.
> - Root cause: Handler assumed JSON without checking the `Content-Type` header.
> - Fix: Added explicit `Content-Type` check and returned `415 Unsupported Media Type` for non-JSON.
> - Prevention rule: For all webhook endpoints, validate `Content-Type` matches the expected media type before parsing the body.

### Prevention rule injected

- Add `Content-Type` validation to the new webhook endpoint; reject unsupported media types with `415`.

## Step 4: Quality pack execution

### Implementation brief

1. Add `POST /api/v1/integrations/webhook` in `app/api/v1/integrations.py`.
2. Validate `Authorization: Bearer SERVICE_TOKEN_PLACEHOLDER` against a configured token (placeholder, no real secrets).
3. Validate `Content-Type: application/json`.
4. Parse and validate body with Pydantic model `WebhookPayload`.
5. Enqueue `process_webhook_event.delay(payload)` via Celery.
6. Return `202 Accepted` with an event id.

### Quality pack checks applied

| Pack | Key checks | Result |
| --- | --- | --- |
| API endpoint quality | Input validation, response shape, error codes, route version | Pass |
| Auth quality | Token scheme, missing-token handling, constant-time comparison | Pass |
| Async job quality | Enqueue success, idempotency key, failure retry strategy | Pass |
| Adversarial review | Injection via payload, token timing, content-type bypass, race on enqueue | 1 low-risk finding: retry count should be documented |
| Self-review | Diff audit, no unrelated cleanup, tests present | Pass |

### Model weakness check results

| Injected check | Result | Notes |
| --- | --- | --- |
| Null-check DB query results | N/A | No DB query in this handler; explicitly N/A |
| API version consistency | Pass | Route and imports use `v1` |
| Specific exception handling | Pass | Uses `HTTPException` and `ValidationError`; no bare `except` |

## Step 5: Scorecard session

Template: [`templates/quality-scorecard-session.md`](../../templates/quality-scorecard-session.md)

Script: `npm run quality:scorecard`

### Per-file scorecard

| File | Changed | Tests | Quality Checks | Warnings | Score |
|---|---:|---:|---|---:|---:|
| `app/api/v1/integrations.py` | yes | 3 new tests | API, Auth, Async, Adversarial, Self-review | 1 | 92 |
| `app/schemas/webhook.py` | yes | 3 new tests | Quality rubric | 0 | 95 |
| `app/tasks/webhook.py` | yes | 2 new tests | Async, Self-review | 0 | 94 |
| `tests/api/test_webhook.py` | yes | N/A | Test review | 0 | 90 |
| `docs/api/webhook.md` | yes | N/A | Doc review | 0 | 88 |

### Aggregated summary

- Total files changed: 5
- Tests added or updated: 8
- Quality checks run: API endpoint quality, Auth quality, Async job quality, Adversarial review, Self-review, Quality rubric
- Warnings found: 1 (retry count should be documented in async job quality review)
- Average score per file: 91.8
- Lowest-scoring file: `docs/api/webhook.md` (88 — missing retry policy section)
- Trend notes: improving — new endpoint has explicit validation, token handling, and tests; doc gap is minor

### Follow-ups

- [ ] Document retry policy in `docs/api/webhook.md`.
- [ ] Update `templates/model-weakness-log.md` if any new `claude-sonnet` failure is observed during the task.
- [ ] Add a lesson entry if the token or content-type validation reveals a reusable pattern worth remembering.

## Step 6: Final response

Example final response the agent should give:

> **What changed:** Added `POST /api/v1/integrations/webhook`, payload schema, Celery task, and tests. No runtime changes.
>
> **Checks run:** Model weakness check (3 injected, 2 pass, 1 N/A); adaptive prompt stack (API, Auth, Async, Adversarial, Self-review); lessons search found 1 relevant content-type lesson; Quality Shield self-review passed. `npm run quality:scorecard` generated a session scorecard with average score 91.8.
>
> **Checks not run:** `npm run validate` (no project CI script executed in this environment). Project tests run via `pytest tests/api/test_webhook.py` locally passed.
>
> **Residual risk:** Retry policy is not yet documented. Adversarial review found this low-risk and deferred to follow-up.
>
> **Files changed:** `app/api/v1/integrations.py`, `app/schemas/webhook.py`, `app/tasks/webhook.py`, `tests/api/test_webhook.py`, `docs/api/webhook.md`.

## Key takeaways

1. **Model weakness memory** prevented generic failure modes from being forgotten.
2. **Adaptive prompt selection** avoided under- or over-applying quality packs for a security-adjacent feature.
3. **Lessons learned search** injected a specific prevention rule (`Content-Type` validation) that might otherwise have been missed.
4. **Scorecard** made quality visible and surfaced the lowest-scoring file for a follow-up.
5. **Honest reporting** documented what was verified, what was deferred, and why — no rubber-stamped completion claim.

## See also

- [`docs/smart-adapt.md`](../../docs/smart-adapt.md) — canonical Smart Adapt guide
- [`templates/model-weakness-log.md`](../../templates/model-weakness-log.md) — weakness log template
- [`templates/adaptive-prompt-matrix.md`](../../templates/adaptive-prompt-matrix.md) — task-type pack matrix
- [`templates/quality-scorecard-session.md`](../../templates/quality-scorecard-session.md) — scorecard template
- [`templates/lesson-entry-template.md`](../../templates/lesson-entry-template.md) — lesson entry template
