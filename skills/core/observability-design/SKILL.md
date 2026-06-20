# Skill: Observability Design

## Purpose

Design instrumentation **before shipping a feature** by starting from the questions on-call will ask, then deriving the signals (metrics, logs, traces) that answer those questions. Counter the anti-pattern "telemetry without a question is noise" by forcing a question-first workflow that ties every collected signal to a specific operational decision.

## When to use

Use when designing a new feature, endpoint, async job, batch process, or any user-facing or system-facing capability that needs to be debugged in production. Also use when adding instrumentation to an existing feature that lacks sufficient signal, when planning an SLO/SLI definition, or when post-incident review identifies a "we had no idea X was happening" gap. Triggers include:

- "Ship it" moment for a non-trivial feature
- "What metrics should we add?" (without a question to answer)
- "We need observability" (vague)
- SLO/SLI review or new SLO proposal
- Post-mortem: "we had no signal for X"

## Inputs

- Feature spec or in-progress implementation
- Existing instrumentation inventory (metrics, logs, traces already emitted)
- Recent incident reports or "we wished we had signal" notes
- On-call question list (or generated question list — see step 1)

## Workflow

1. **Generate the on-call question list.** Before any code, write 2-4 questions an on-call engineer will ask at 3am when this feature misbehaves. Examples:
   - "Is the failure rate for X above baseline?"
   - "What percentage of users are affected?"
   - "Is this caused by a specific deployment, region, or tenant?"
   - "What is the current saturation of the dependency Y?"
2. **Map each question to required signals.** For each question, identify which signal type answers it:
   - **Metric** — aggregated numeric value (rate, ratio, count, histogram). Use for: rate questions, SLO breaches, capacity.
   - **Log** — discrete event with structured fields. Use for: cause attribution, per-request detail, error context.
   - **Trace** — request flow across components. Use for: latency breakdown, dependency attribution, retry storms.
3. **Trade-off check.** Apply the metric/log/trace trade-off table below to each signal choice. Reject signals that cannot be justified against the trade-off.
4. **Define the SLO envelope.** For the top 1-2 questions, propose a target (e.g. "99% of requests complete in <200ms", "error rate <0.1%") and a burn-rate alert threshold. If no SLO is justifiable, mark the signal as "diagnostic only" (no alert).
5. **Build the signal matrix.** For each signal, document: name, type, labels, cardinality bound, retention, owner, runbook link, and the question it answers.
6. **Wire instrumentation into the design.** Place instrumentation calls in the design (not after). For each call site, document: what event, what fields, what sampling rate, what cost (CPU/network/storage).
7. **Plan the verification.** Specify how to prove the signal works: synthetic test, shadow traffic, replay, or staged rollout. Include a "blind test" — can an on-call engineer answer each question with only the new signals?

## Outputs

- `templates/observability-plan-template.md` filled with the on-call question list + signal matrix
- Optional ADRs for non-obvious signal choices
- A pre-merge verification step in the feature's quality gate

## Failure modes

- Adding metrics without questions (decorative telemetry; ignored in incidents)
- High-cardinality labels (user_id, request_body) → metric backend blow-up
- Untyped logs (string-only) → unsearchable at incident time
- Trace sampling that drops the slow requests (exactly the ones you need)
- Alerting on raw signal instead of question-derived SLO
- Retrofitting observability after the feature is "done" (misses code paths)

## Trade-off table: metric vs log vs trace

| Question type | Best signal | Why | Cost |
| --- | --- | --- | --- |
| "What is the rate / count / ratio?" | Metric | Cheap, aggregable, alertable | Storage scales with cardinality |
| "What was the cause of this specific failure?" | Log | Per-event detail, full context | Storage scales with volume × retention |
| "Where in the request flow did latency come from?" | Trace | Spans show per-hop timing | Storage scales with trace volume |
| "Is this affecting all users or a slice?" | Metric (with low-cardinality labels) | Slice aggregations are cheap | High-cardinality labels explode cost |
| "What is the saturation of dependency X?" | Metric (gauge) | Single-value periodic | Negligible |
| "What was the request body that caused the error?" | Log (with redaction) | Only signal that can carry it | PII risk; redact aggressively |
| "What changed between deploy N and N+1?" | Log + metric | Both needed for correlation | Combined cost |

## Common rationalizations to reject

| Rationalization | Why it's wrong | Counter |
| --- | --- | --- |
| "We'll add metrics if it breaks" | Post-incident instrumentation misses the failure mode you didn't anticipate. | Design for the 3am question before shipping. |
| "Logs are enough" | Untyped logs are unsearchable; high volume drowns the signal. | Pair logs with at least one metric per question. |
| "We'll just sample traces" | If you sample randomly, you'll miss the slow ones (long-tail latency). | Sample by error/head-based + always sample slow. |
| "Cardinality is fine, it's only 1000 users" | Each user can be a tenant, region, plan — cardinality compounds. | Bound labels at design time, not in the dashboard. |
| "On-call will figure it out" | On-call is a context-switched engineer; they need answered questions, not raw data. | Generate the question list first, then the signals. |
| "SLOs are for big systems" | Even small systems have failure modes; SLOs are about declaring acceptable failure. | Start with one availability SLO per user-facing endpoint. |
| "PII is in the request, just log it" | PII in logs violates privacy commitments; once leaked, irrecoverable. | Redact at emission; never log raw request bodies. |

## Red flags (must produce remediation)

- Any signal without a question that justifies it
- Cardinality estimate missing from any metric definition
- SLO without burn-rate alert (SLO without alert is just a vanity number)
- PII fields in any log schema without a redaction step
- Trace sampling rule that drops the slowest decile
- Verification step missing from the feature's quality gate

## Verification checklist

- [ ] On-call question list exists (2-4 questions)
- [ ] Each question maps to at least one signal type
- [ ] Signal matrix documents name, type, labels, cardinality, retention, owner
- [ ] No signal without a justifying question
- [ ] Top 1-2 questions have SLO + burn-rate alert
- [ ] Instrumentation is in the design, not retrofitted
- [ ] Verification plan exists (synthetic/shadow/replay/staged)
- [ ] Blind test: on-call can answer each question from the new signals

## Source alignment

Inspired by `addyosmani/agent-skills` `observability-and-instrumentation` category (MIT, verified 2026-06-20). Adapted into Vibe Coding OS with original wording, "questions before signals" framing, and bilingual maintainability notes. Renamed from `observability-and-instrumentation` to `observability-design` to avoid collision with `quality-telemetry` (which measures quality gates, not production instrumentation).

## Ghi chú tiếng Việt

Kỹ năng này dạy workflow **questions → signals → SLOs** thay vì **metrics → dashboards → pray**. Trước khi ship feature, sinh 2-4 câu hỏi on-call sẽ hỏi lúc 3am; mỗi câu hỏi phải map sang ít nhất 1 signal (metric/log/trace). Mọi metric mà không có câu hỏi nào justify là noise. Cardinality phải bound lúc design, không phải lúc dashboard. SLO không có burn-rate alert chỉ là vanity number. PII phải redact tại emission, không bao giờ log raw body.
