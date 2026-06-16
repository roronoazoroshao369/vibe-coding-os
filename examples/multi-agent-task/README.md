# Example: Multi-Agent Task Workflow

This example shows how to use Team-Agent Orchestration to break a large, multi-domain task into roles with clear ownership, disjoint write scopes, and independent verification. It follows the intent → vibe-team → vibe-subagents → handoff → independent review → verify path.

## 1. Initial user intent

> We need to build a complete notification system: design the data model, implement the delivery pipeline (email, SMS, push), write integration tests, and review for security and reliability. This is a large, cross-cutting feature that touches multiple domains.

Assumptions to confirm before implementation:

- The project uses a task queue for async delivery (e.g., Bull, Celery, or similar).
- Notification preferences are stored per-user in the existing `src/accounts/` module.
- The team has access to at least four subagent sessions (or can simulate them sequentially with handoffs).
- External provider APIs (email, SMS, push) can be mocked for testing.

## 2. Command/skill order

1. `vibe-init` to inspect repo instructions, project structure, and existing notification-related code.
2. `vibe-team` with `team-agent-orchestration` to design the team architecture, assign roles, and define write scopes.
3. `vibe-subagents` to spawn independent workers for each role with progressive context.
4. Workers execute their tasks independently, producing artifacts within their write scope.
5. `vibe-review` with `review-before-merge` for independent review of each worker's output.
6. `vibe-verify` with `verification-before-done` to confirm integrated result passes all checks.
7. `vibe-memory` with `project-memory` to record team architecture decisions and outcomes.

## 3. Team architecture

Based on [`templates/team-architecture-template.md`](../../templates/team-architecture-template.md).

```markdown
# Team Architecture: Notification System

## Domain analysis

The notification system spans four domains:

1. **Data Model** — notification entity, delivery status tracking, user preferences.
2. **Delivery Pipeline** — message routing, provider integration, retry logic.
3. **Testing** — integration tests for each provider, end-to-end delivery tests.
4. **Security Review** — API key handling, rate limiting, input sanitization, PII exposure.

These domains have clear boundaries and can be worked on in parallel after the data model is established.

## Role assignments

| Role | Responsibility | Write scope | Read scope | Handoff artifact |
| --- | --- | --- | --- | --- |
| Architect | Design data model, define interfaces between components, create ADR. | `src/notifications/types.ts`, `src/notifications/model/`, `docs/adr/0002-notification-system.md` | Entire `src/` | Data model spec + interface definitions |
| Implementer | Build delivery pipeline, provider integrations, retry logic. | `src/notifications/pipeline/`, `src/notifications/providers/` | `src/notifications/types.ts`, `src/notifications/model/`, task queue docs | Pipeline implementation + provider adapters |
| Tester | Write integration tests for all providers and end-to-end delivery. | `src/notifications/__tests__/` | Entire `src/notifications/`, mock utilities | Test suite + test fixtures |
| Reviewer | Security and reliability review of the full notification system. | `docs/reviews/notification-system-review.md` | Entire `src/notifications/`, `docs/adr/0002-notification-system.md` | Review report with blockers and suggestions |

## Execution order

```
Architect (data model + interfaces)
  → Implementer (pipeline + providers)     ┐
  → Tester (integration tests)             ├→ Reviewer (security + reliability review)
  → Independent verification               ┘
```

The Architect must finish first because the Implementer and Tester depend on the data model and interfaces. The Implementer and Tester can work in parallel once the Architect delivers. The Reviewer works last, reviewing the integrated output.

## Handoff contracts

### Architect → Implementer

- Deliver: `types.ts`, `model/*.ts`, interface definitions for providers.
- Implementer receives: file paths, type definitions, interface contracts, provider API documentation.
- Implementer does NOT modify: types, model files, or ADR.

### Architect → Tester

- Deliver: `types.ts`, model schema, acceptance criteria from spec.
- Tester receives: type definitions, expected behavior from spec, mock data patterns.
- Tester does NOT modify: implementation files or types.

### Implementer + Tester → Reviewer

- Deliver: complete implementation and test suite.
- Reviewer receives: all `src/notifications/` files, ADR, test results.
- Reviewer does NOT modify: implementation or test files — only produces a review document.

## Failure modes to watch

- Implementer and Tester editing each other's files (both writing to `__tests__/`).
- Reviewer approving their own code changes (Reviewer must not have write scope on implementation).
- Architect changing interfaces after Implementer has started (requires explicit re-handoff).
```

## 4. Sample role briefs

### Architect brief

```markdown
# Role Brief: Architect — Notification System

## Objective

Design the notification data model and define clear interfaces between the notification system components.

## Deliverables

1. `src/notifications/types.ts` — shared type definitions (Notification, NotificationStatus, NotificationChannel, UserPreferences).
2. `src/notifications/model/notification.ts` — notification entity creation and status tracking.
3. `src/notifications/model/preferences.ts` — user notification preference management.
4. `docs/adr/0002-notification-system.md` — ADR for notification system architecture.

## Constraints

- Do not implement delivery logic — only define interfaces.
- Use the existing `src/lib/db.ts` for persistence patterns.
- Types must be compatible with the existing `src/accounts/` user model.
- ADR must document the choice of provider abstraction layer.

## Acceptance criteria

- [ ] Types cover all notification channels (email, SMS, push).
- [ ] Model supports creation, status tracking, and retry state.
- [ ] Provider interface is abstract enough to add new channels without changing the pipeline.
- [ ] ADR records the architectural decision with alternatives considered.

## Write scope

`src/notifications/types.ts`, `src/notifications/model/`, `docs/adr/0002-notification-system.md`

## Forbidden scope

Do not modify `src/notifications/pipeline/`, `src/notifications/providers/`, or `src/notifications/__tests__/`.
```

### Implementer brief

```markdown
# Role Brief: Implementer — Notification System

## Objective

Build the delivery pipeline, provider integrations, and retry logic for the notification system.

## Deliverables

1. `src/notifications/pipeline/router.ts` — message routing based on notification channel.
2. `src/notifications/pipeline/delivery.ts` — delivery orchestration with retry logic.
3. `src/notifications/providers/email.ts` — email provider adapter.
4. `src/notifications/providers/sms.ts` — SMS provider adapter.
5. `src/notifications/providers/push.ts` — push notification provider adapter.

## Constraints

- Import types from `src/notifications/types.ts` — do not redefine them.
- Follow the provider interface defined by the Architect.
- Use the existing task queue pattern from `src/lib/queue.ts`.
- Do not hardcode API keys — use environment variables via `src/config/`.

## Acceptance criteria

- [ ] Router correctly dispatches to the appropriate provider based on channel.
- [ ] Delivery function handles retry with exponential backoff.
- [ ] Each provider adapter implements the provider interface.
- [ ] No hardcoded secrets or credentials in any file.

## Write scope

`src/notifications/pipeline/`, `src/notifications/providers/`

## Forbidden scope

Do not modify `src/notifications/types.ts`, `src/notifications/model/`, or `src/notifications/__tests__/`.
```

### Tester brief

```markdown
# Role Brief: Tester — Notification System

## Objective

Write integration tests for all notification providers and end-to-end delivery tests.

## Deliverables

1. `src/notifications/__tests__/email.test.ts` — email provider integration tests.
2. `src/notifications/__tests__/sms.test.ts` — SMS provider integration tests.
3. `src/notifications/__tests__/push.test.ts` — push notification provider integration tests.
4. `src/notifications/__tests__/delivery.test.ts` — end-to-end delivery pipeline tests.
5. `src/notifications/__tests__/fixtures/` — test data fixtures.

## Constraints

- Use mock providers for all external API calls — do not call real provider APIs.
- Import types from `src/notifications/types.ts`.
- Follow the existing test patterns in `src/__tests__/`.
- Tests must be deterministic and not depend on external state.

## Acceptance criteria

- [ ] Each provider has at least 3 test cases (success, failure, timeout).
- [ ] Delivery pipeline tests cover routing, retry, and status tracking.
- [ ] All tests are isolated and can run independently.
- [ ] Tests use mocked providers, not real API endpoints.

## Write scope

`src/notifications/__tests__/`

## Forbidden scope

Do not modify `src/notifications/types.ts`, `src/notifications/model/`, `src/notifications/pipeline/`, or `src/notifications/providers/`.
```

### Reviewer brief

```markdown
# Role Brief: Reviewer — Notification System

## Objective

Perform security and reliability review of the complete notification system implementation.

## Deliverables

1. `docs/reviews/notification-system-review.md` — review report with findings.

## Review checklist

- [ ] No hardcoded API keys, tokens, or credentials anywhere in the notification code.
- [ ] All external inputs are sanitized before use.
- [ ] Rate limiting is applied to provider API calls.
- [ ] PII is not logged in plaintext.
- [ ] Retry logic does not create infinite loops.
- [ ] Error handling covers provider failures gracefully.
- [ ] Test coverage is sufficient for critical paths.

## Constraints

- Do NOT modify implementation or test files — only produce a review document.
- Report findings as blockers (must fix) or suggestions (nice to have).
- Reference specific file paths and line numbers for each finding.

## Write scope

`docs/reviews/notification-system-review.md`

## Forbidden scope

Do not modify any files in `src/notifications/`.
```

## 5. Sample handoff artifact (Architect → Implementer)

```markdown
# Handoff: Architect → Implementer

## Date: 2026-06-16

## Artifacts delivered

### `src/notifications/types.ts`

```typescript
export type NotificationChannel = 'email' | 'sms' | 'push';

export type NotificationStatus = 'pending' | 'queued' | 'sending' | 'sent' | 'failed' | 'retrying';

export interface Notification {
  id: string;
  userId: string;
  channel: NotificationChannel;
  subject: string;
  body: string;
  status: NotificationStatus;
  retryCount: number;
  maxRetries: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProviderAdapter {
  send(notification: Notification): Promise<{ success: boolean; error?: string }>;
}

export interface NotificationPreferences {
  userId: string;
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
}
```

### Provider interface contract

- `ProviderAdapter.send()` must return `{ success: boolean; error?: string }`.
- Provider must handle its own authentication via environment variables.
- Provider must not throw on delivery failure — return `{ success: false, error: message }`.
- Provider must respect a 30-second timeout per delivery attempt.

### Task queue integration

- Use `src/lib/queue.ts` with queue name `notifications`.
- Job payload: `{ notificationId: string }`.
- Retry policy: exponential backoff, max 3 retries, delay 60s/300s/900s.

## What the Implementer must NOT change

- `src/notifications/types.ts` — types are finalized.
- `src/notifications/model/` — model layer is finalized.
```

## 6. Sample review note

Based on [`templates/review-template.md`](../../templates/review-template.md).

```markdown
# Review: Notification System

## Summary

The notification system implements a complete delivery pipeline with email, SMS, and push providers. The data model supports status tracking and retry logic. Integration tests cover all providers and the end-to-end delivery flow. Security review identified no critical issues.

## Blockers

- None identified.

## Suggestions

- Add structured logging for provider failures to improve debugging.
- Consider adding a dead-letter queue for notifications that exhaust all retries.
- The email provider adapter should support HTML templates in a future iteration.

## Verification reviewed

- `npm test -- notifications` passed.
- `npm run validate` passed.

## Security findings

- [x] No hardcoded API keys or credentials.
- [x] External inputs are sanitized.
- [x] Rate limiting is applied to provider calls.
- [x] PII is not logged in plaintext.

## Scope and attribution

- [x] Diff matches team architecture plan.
- [x] Attribution and license obligations are clean.

## Decision

Approve
```

## 7. Sample memory note

Based on [`templates/memory-template.md`](../../templates/memory-template.md).

```markdown
# Memory: 2026-06-16 notification system team delivery

## Durable facts

- Notification system uses a team of four roles: Architect, Implementer, Tester, Reviewer.
- Data model supports email, SMS, and push channels with status tracking and retry logic.
- Provider interface is abstract enough to add new channels without changing the pipeline.
- Security review found no critical issues.

## Decisions

- Used team-agent orchestration because the task spans multiple domains and benefits from parallel work.
- Architect delivered first, then Implementer and Tester worked in parallel, then Reviewer assessed.
- Each role had a clear write scope and forbidden scope to prevent conflicts.

## Commands and results

- `npm test -- notifications`: passed.
- `npm run validate`: passed.

## Gotchas

- The Architect changed an interface after the Implementer started — required an explicit re-handoff.
- Test fixtures needed to be shared between Tester and Implementer — resolved by having Tester own all fixtures.

## Follow-ups

- Add structured logging for provider failures.
- Consider dead-letter queue for exhausted retries.
- Add HTML email template support.

## Sensitivity check

- [x] Contains no secrets, credentials, or unnecessary personal data.

## Confidence

High
```

## 8. Verification report

| Check | Command | Expected result | Status |
| --- | --- | --- | --- |
| Notification tests | `npm test -- notifications` | All provider and delivery tests pass. | Pass |
| Consuming module tests | `npm test -- accounts scheduler` | No regressions in account preferences or scheduling. | Pass |
| Static checks | `npm run lint && npm run typecheck` | Static checks pass, or unavailable scripts are documented. | Pass or documented limitation |
| Repository validation | `npm run validate` | Framework or host repo validation passes. | Pass |

## 9. Merge readiness checklist

- [ ] Team architecture is recorded and reviewed.
- [ ] All role briefs and handoff contracts are satisfied.
- [ ] Data model types and provider interfaces are consistent across all roles.
- [ ] Implementation covers all three channels (email, SMS, push).
- [ ] Integration tests cover all providers and end-to-end delivery.
- [ ] Security review found no blockers.
- [ ] No secrets, personal data, vendored third-party code, or unattributed external content were added.
- [ ] Review decision is `Approve` or remaining changes are explicitly accepted by the human.
