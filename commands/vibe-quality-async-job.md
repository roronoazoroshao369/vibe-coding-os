---
description: "Review or implement an async/background job using the async-job quality checklist."
---

# vibe-quality-async-job

## Purpose

Guide a quality-focused review or implementation of async/background jobs by walking through idempotency, retry strategy, error handling, observability, timeout, concurrency, ordering, manual intervention triggers, and test coverage.

## When to use

Use before implementing or reviewing any async/background work: queue jobs, cron or scheduled tasks, background workers, webhook handlers, batch processing pipelines, or event-driven handlers.

## Required inputs

- Job description: trigger source, payload shape, processing steps.
- Existing retry, queue, or observability infrastructure (if any).
- Expected volume and peak load.
- Deployment target.

## Step-by-step behaviour

1. Classify the delivery guarantee: at-most-once, at-least-once, or exactly-once. State why.
2. Define the idempotency strategy: stable job ID, deduplication key, or idempotent writes. State how duplicate processing is safe.
3. Define the retry policy: backoff strategy, maximum attempts, dead-letter routing, and which errors are retriable.
4. Assess error handling and observability: structured logging (job ID, attempt count, error class), metrics (per-job error rate), and alerting on dead-letter or exhausted retries.
5. Configure timeout: execution timeout, behavior on timeout (retry, abort, partial-commit), and headroom over expected duration.
6. Define concurrency limits: per-worker, per-queue, or global caps. Identify locking or concurrency control mechanisms.
7. Address job ordering or dependencies: partition keys, dependency graphs, sequential queues, or confirm ordering is not required.
8. Identify manual intervention triggers: conditions requiring human review, surfacing mechanism (dashboard, alert, ticket), and operator actions (replay, skip, force-complete).
9. Review test coverage: success path, retry/failure path, idempotency replay, timeout behavior, concurrency/ordering, and isolation from external side effects.
10. Produce a completed checklist with delivery guarantee, retry policy, observability coverage, test coverage gaps, and manual intervention plan.

## Outputs

A completed async-job quality checklist and, where applicable, the implementation changes needed to meet the checklist.

## Stopping conditions

Stop before proceeding if the delivery guarantee is ambiguous, the retry strategy is undefined, or test coverage for retry and idempotency cannot be determined. Resolve these gaps before claiming the job is production-ready.

## Verification checklist

- [ ] Delivery guarantee is stated and matches the queue/trigger semantics.
- [ ] Idempotency strategy is defined and tested.
- [ ] Retry policy has backoff, max attempts, and dead-letter routing.
- [ ] Errors are logged with job ID, attempt count, and error class.
- [ ] Key failure rates are exposed as metrics.
- [ ] Dead-letter or exhausted-retry conditions produce alerts.
- [ ] Timeout is configured and tested for the failure path.
- [ ] Concurrency limits are defined and enforced.
- [ ] Job ordering or dependency requirements are addressed.
- [ ] Manual intervention triggers and runbook exist where needed.
- [ ] Test coverage exists for success, failure, retry, and idempotency paths.

## Related skills/commands

- `skills/checklists/async-job-quality/SKILL.md`
- `skills/core/acceptance-criteria/SKILL.md`
- `skills/core/test-driven-development/SKILL.md`
- `commands/vibe-plan.md`

## Handoffs / next-step suggestion

- Failures in delivery semantics, retry/idempotency, observability, or tests → update the job design or implementation, then re-run.
- All items pass → proceed with `commands/vibe-request-review.md` or merge preparation.
