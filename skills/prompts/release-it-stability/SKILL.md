---
name: release-it-stability
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: prompts
tags:
  - prompts
status: stable
---

# Release It! Stability Patterns

## Purpose

Apply production-hardening stability patterns from Michael Nygard's *Release It!* to AI-generated code. Ensure services handle dependency failures, overload, and unexpected conditions gracefully — rather than assuming everything always works.

## When to use

Apply this skill whenever generating, reviewing, or designing production service code:
- Service-to-service communication (REST, gRPC, message queues).
- External dependency interaction (databases, caches, APIs, third-party services).
- Systems that must survive load spikes or partial outages.
- Code intended for production deployment (not prototypes or one-shot scripts).
- Architecture design for distributed systems.

## Inputs

Service or function code, an architecture diagram, or a dependency graph. Knowledge of the runtime environment (latency budget, concurrency model, failure history).

## Principles

### 1. Circuit Breaker

Prevent cascading failures by detecting when a dependency is failing and stopping calls to it until it recovers. For AI: when generating service code, implement circuit breaker patterns for external dependencies — don't assume all dependencies are always available.

### 2. Bulkhead Isolation

Isolate system components so failure in one doesn't take down others (like compartments in a ship). For AI: design for isolation — separate concerns so failures are contained; use connection/thread pools per dependency.

### 3. Steady State

Systems should self-heal. Design for automatic recovery from transient failures. For AI: generate code with retry logic with backoff, health checks, and graceful degradation — not just happy path.

### 4. Handshaking

When load exceeds capacity, signal the client to back off (e.g., HTTP 503, backpressure). For AI: implement backpressure in production code; don't let unbounded queuing hide problems.

### 5. Failures Are Inevitable

Design for failure from the start. Chaos engineering: test your assumptions by injecting failures. For AI: include failure scenarios in design — what happens when the DB is down, the network is slow, the disk is full?

## Workflow

1. Identify external dependencies and failure boundaries in the component.
2. Apply patterns:
   - **Circuit Breaker** — wrap each remote dependency call with a circuit breaker (threshold, half-open recovery).
   - **Bulkhead** — separate connection pools, thread pools, or event queues per dependency.
   - **Steady State** — add retry-with-backoff and periodic health checks. Ensure the system converges to a known good state without manual intervention.
   - **Handshaking** — validate that the component signals overload (503, backpressure) rather than silently queuing or dropping.
   - **Failure Inevitable** — annotate or comment the expected failure modes and the recovery behavior.
3. Verify that each pattern has a clear recovery path — not just detection.

## Outputs

Code hardened with stability patterns: circuit breakers around dependencies, isolated failure domains, self-healing retry logic, explicit backpressure, and documented failure modes.

## Failure modes

- Implementing circuit breakers without monitoring (you won't know they tripped).
- Over-retrying (no backoff, retry storms making things worse).
- Bulkhead without enough pool headroom (false positives under normal load).
- Handshaking without client cooperation (server sends 503 but clients ignore it).
- Treating resilience patterns as boilerplate (copy-pasted without tuning thresholds).
- Adding complexity to services that don't need it (internal tools, low-availability requirements).

## Verification checklist

- [ ] Every external dependency call is wrapped in a circuit breaker (or has a documented reason not to be).
- [ ] Retry logic includes exponential backoff and jitter — not fixed intervals.
- [ ] Connection/thread pools are isolated per dependency (bulkhead).
- [ ] The system can recover from a transient dependency outage without manual restart.
- [ ] Load-shedding or backpressure is implemented before unbounded queuing.
- [ ] All failure modes are documented alongside the deployment — not just the happy path.
- [ ] Tests exist that verify behavior when dependencies are down, slow, or returning errors.

## Related skills

- `skills/core/goal-driven-execution/SKILL.md` — translate resilience requirements into verifiable goals with per-step checks.
- `skills/prompts/anti-overengineering/SKILL.md` — ensure you apply the right pattern, not every pattern, to each dependency.
- `skills/prompts/karpathy-engineering-discipline/SKILL.md` — think before coding: name failure assumptions before implementing.

## Constitution alignment

Designing for failure from the start supports the project's verification-forward ethos — resilience should be testable and observable, not assumed. Circuit breaker and bulkhead patterns align with the principle of clean boundaries and explicit contracts between components.

## Attribution

*Release It!* (Michael Nygard, Pragmatic Bookshelf) — ideas adapted, original wording.

## Ghi chú tiếng Việt

Năm mẫu hình ổn định từ *Release It!* (Michael Nygard): (1) Circuit Breaker — ngăn lỗi dây chuyền, (2) Bulkhead — cách ly thất bại không cho lan ra, (3) Steady State — hệ thống tự hồi phục, (4) Handshaking — báo quá tải rõ ràng (503, backpressure), (5) Failures Are Inevitable — thiết kế cho thất bại ngay từ đầu. Áp dụng khi sinh code production, đặc biệt là giao tiếp dịch vụ và phụ thuộc bên ngoài. Không áp dụng cho prototype hay internal tool không yêu cầu độ tin cậy cao.
