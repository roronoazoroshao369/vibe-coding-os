---
name: async-job-quality
description: Checklist-driven quality review for queue jobs, scheduled tasks, background workers, webhook handlers, and batch processing.
version: 1.0.0
author: Hermes Agent
license: MIT
platforms:
  - portable
tags:
  - quality
  - async
  - background-jobs
  - reliability
  - observability
---

# Async-Job-Quality Checklist

## Purpose

Enforce a minimum quality bar before implementing or reviewing async/background jobs. Covers idempotency, retry strategy, error handling, observability, timeout, concurrency, ordering, manual intervention triggers, and test coverage.

## When to use

Use for: queue-based jobs (SQS, RabbitMQ, Redis queues), cron or scheduled tasks, background worker processes, webhook handlers, batch processing pipelines, event-driven handlers, and any deferred or non-request-synchronous work.

Use especially when:
- A job can be triggered more than once.
- A job interacts with external systems.
- A job runs on a schedule or in response to events.
- A job has ordering or dependency guarantees.
- A job failure could silently lose data or corrupt state.

## Inputs

- Job definition: trigger source, payload shape, processing steps.
- Expected volume and frequency (peak load).
- Existing error handling and retry infrastructure.
- Observability stack (logging, metrics, alerting).
- Deployment target (container, serverless, VM, cron).

## Workflow

1. **Classify delivery guarantee**
   - At-most-once: acceptable data loss on failure.
   - At-least-once: must tolerate duplicate processing.
   - Exactly-once: requires idempotent or transactional design.
   - Record which guarantee applies and why.

2. **Idempotency**
   - Can this job safely run twice with the same payload?
   - Is there a stable job ID or deduplication key?
   - Are writes idempotent (upsert, conditional update, compare-and-swap)?
   - If not idempotent, how is duplicate detection enforced?

3. **Retry strategy**
   - What is the retry backoff policy (fixed, exponential, jitter)?
   - What is the maximum retry count before dead-letter or alert?
   - Are transient errors (network, timeout) retried differently from permanent errors (validation, auth)?
   - Is the retry queue separate from the main queue?

4. **Error handling and observability**
   - Are failures logged with structured context (job ID, payload hash, attempt count)?
   - Are error rates surfaced as metrics (per-job, per-error-type)?
   - Are dead-letter or exhausted-retry conditions alerted on?
   - Is there a dashboard or runbook for job failure triage?

5. **Timeout handling**
   - Does the job have a defined execution timeout?
   - What happens when the timeout fires (retry, abort, partial-commit)?
   - Is the timeout proportional to expected duration with headroom?

6. **Concurrency limits**
   - Can multiple instances of the same job run simultaneously?
   - Are there concurrency caps (per-worker, per-queue, global)?
   - Does the job use locking, semaphores, or queue-level concurrency control?

7. **Job ordering and dependencies**
   - Must jobs execute in a specific order?
   - If yes, how is ordering enforced (partition key, dependency graph, sequential queue)?
   - Are dependent jobs retried or skipped when a predecessor fails?

8. **Manual intervention triggers**
   - Under what conditions does a failed job require human review?
   - Is there a mechanism to surface jobs needing intervention (dashboard, alert, ticket)?
   - Can an operator replay, skip, or force-complete a stuck job?

9. **Test coverage**
   - Is there a test for the happy path?
   - Is there a test for the retry/failure path?
   - Is there a test for idempotency (replay same payload)?
   - Is there a test for timeout behavior?
   - Is there a test for concurrency or ordering guarantees?
   - Are integration tests isolated from external side effects (mocks, fakes, test queues)?

10. **Output review**
    - Document the delivery guarantee chosen.
    - List all retry, timeout, and dead-letter settings.
    - Confirm observability coverage (logs, metrics, alerts).
    - Confirm test cases cover each checklist item or state why not applicable.

## Outputs

A completed async-job quality checklist identifying the delivery guarantee, retry policy, observability coverage, test coverage gaps, and any manual intervention triggers.

## Failure modes

- Assuming at-most-once delivery when the queue or trigger can redeliver.
- Using retry backoff without jitter, causing thundering herd on recovery.
- Logging failures without enough context to diagnose (missing job ID or attempt number).
- No timeout on long-running jobs, causing worker starvation.
- Missing concurrency controls leading to race conditions.
- No tests for retry or idempotency paths.
- Silent dead-letter accumulation without alerting.
- Treating external idempotency tokens as local-only without persistence.

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
