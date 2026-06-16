# ADR-0002: Notification System Architecture

> This ADR was created as part of the multi-agent task example in `examples/multi-agent-task/README.md`.

## Status

Accepted

## Context

The application needs a notification system to send real-time alerts to users via multiple channels (email, SMS, push notifications, in-app). The system must be extensible for future notification providers and support retry logic with dead-letter queue handling.

## Decision

We will implement a pipeline-based notification system with:

1. **Provider abstraction**: A common `NotificationProvider` interface that each channel implements.
2. **Pipeline architecture**: Notifications flow through a pipeline: validate → route → deliver → confirm.
3. **Retry with backoff**: Failed deliveries retry with exponential backoff (max 3 attempts).
4. **Dead-letter queue**: Notifications that fail after all retries go to a DLQ for manual review.
5. **Type-safe contracts**: All notification types defined in `src/notifications/types.ts`.

### Data Model

```
Notification {
  id: UUID
  type: 'email' | 'sms' | 'push' | 'in-app'
  recipient: string
  payload: NotificationPayload
  status: 'pending' | 'sent' | 'failed' | 'dlq'
  retryCount: number
  createdAt: ISO timestamp
  updatedAt: ISO timestamp
}
```

### Interface Boundaries

- `src/notifications/types.ts` — shared type definitions
- `src/notifications/model/` — data access layer
- `src/notifications/pipeline/` — delivery pipeline
- `src/notifications/providers/` — provider implementations

## Consequences

### Positive
- Easy to add new providers by implementing `NotificationProvider`
- Pipeline is testable in isolation
- DLQ provides visibility into failed notifications

### Negative
- Adds complexity over simple email-only approach
- Requires monitoring for DLQ items
- Retry logic may increase latency during provider outages

## Alternatives Considered

1. **Simple email-only**: Rejected — doesn't support multi-channel requirements.
2. **Message queue (RabbitMQ/SQS)**: Deferred — adds infrastructure dependency; pipeline approach works for v1.
3. **Third-party service (SendGrid/Mailgun)**: Partially adopted — used as providers, not as the entire system.

---

*This ADR was generated as part of the Vibe Coding OS multi-agent task example.*
