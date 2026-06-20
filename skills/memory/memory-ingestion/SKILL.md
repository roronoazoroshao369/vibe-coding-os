---
name: memory-ingestion
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: memory
tags:
  - memory
status: stable
---

# Skill: Memory Ingestion

## Purpose

Turn durable observations into safe, scoped memory entries with citations and privacy filtering using a phased ingestion lifecycle.

## When to use

Use after a session, decision, validation result, troubleshooting discovery, or user constraint should persist for future work.

## Inputs

- Candidate fact, decision, command, file path, validation result, risk, or follow-up.
- Source artifact: file path, command output summary, conversation turn, issue, PR, or handoff.
- Scope, confidence, sensitivity, and retention expectation.
- Source type classification (session, decision, review, debug).

## Ingestion Lifecycle

The ingestion process follows five explicit phases:

1. **Capture** — Identify the durable signal from raw output. Distinguish between transient coordination and persistent facts. Accept only observations that could change future agent behavior. Tag with source_type before proceeding.

2. **Filter** — Run `privacy-filter` to block secrets, credentials, regulated personal data, and unnecessary transcripts. Apply sensitivity classification (public, internal, sensitive, secret-redacted). Reject content that cannot be safely redacted. Record a rejected-content note for excluded material.

3. **Extract** — Isolate the structured elements: the core fact or decision, its source artifact, affected files or scope, confidence indicators, and any contradictions or supersession links. Discard conversational framing, justification prose, and metadata noise.

4. **Format** — Map extracted elements into the canonical memory entry schema: source_type, lifecycle_stage, quality_checks_passed, source, summary, confidence, staleness, scope, sensitivity, evidence_or_citations, contradictions_or_risks, local_fallback, optional_provider_notes, follow_ups.

5. **Store** — Persist the formatted entry at the correct scope (session, worktree, project, user). Record the lifecycle_stage as `stored` and mark quality_checks_passed. Never store raw secrets, full transcripts, or material that failed the privacy filter.

## Source-Type Routing Table

| Source Type | Typical Trigger | Default Scope | Privacy Risk | Retention Hint |
|---|---|---|---|---|
| `session` | After a conversation or agent interaction | session or worktree | moderate — may contain personal context | expire-after-next-session |
| `decision` | Architecture choice, ADR, or design verdict | project | low — facts are technical | indefinite (under project) |
| `review` | Code review, PR feedback, or audit result | worktree or project | low — code-focused | keep-until-branch-cleanup |
| `debug` | Bug diagnosis, root cause, or workaround | worktree or session | low — reproduction details | expire-after-fix-verified |

Route the candidate fact to the appropriate source type. Each type has a different default scope, privacy profile, and retention rule. Override these defaults only with explicit justification.

## Privacy-Filter Integration

Privacy filtering is not a single step — it is an ongoing gate throughout the lifecycle:

- **Before capture**: inspect the raw material for obvious secrets (tokens, keys, passwords, private URLs). Flag material that cannot be ingested at all.
- **During filter phase**: run the full `privacy-filter` workflow. Check against the project's privacy exclusion list. Redact detected patterns with useful placeholders (e.g., `<REDACTED_TOKEN>`) only when the technical context remains meaningful.
- **Before format**: verify that no sensitive data survived the filter. If any field still contains private material, reject the entry and log the reason.
- **Before store**: final integrity check — the entry must pass the privacy verification checklist. Entries that fail are not stored and a rejected-content note is recorded instead.

## Workflow

1. Classify the source type (session, decision, review, debug).
2. Follow the ingestion lifecycle: capture → filter → extract → format → store.
3. Run privacy filter at each phase gate; reject unsafe content explicitly.
4. Attach source/citation: file path, command, observation ID, or handoff reference.
5. Set scope: session, worktree, project, or user-level.
6. Add confidence, staleness, quality_checks_passed, and lifecycle_stage labels.
7. Record contradictions or supersession links when replacing older memory.
8. Store concise original wording; never store raw secrets or full transcripts.

## Outputs

- Safe memory entry with source, scope, confidence, retention note, source_type, lifecycle_stage, and quality_checks_passed.
- Rejected-content note for excluded sensitive or low-value material.

## Failure modes

- Saving transcript noise instead of durable facts.
- Omitting source/citation.
- Storing sensitive data because it was useful.
- Writing global memory for branch-specific facts.
- Skipping the filter phase before extraction.
- Misclassifying source type, leading to wrong scope or retention.

## Verification checklist

- [ ] Ingestion lifecycle phases followed: capture → filter → extract → format → store.
- [ ] Source type classified (session, decision, review, debug) and routed to correct scope.
- [ ] Privacy filter ran before storage and at each phase gate.
- [ ] Entry is durable, concise, and actionable.
- [ ] Source/citation and scope are present.
- [ ] Confidence, staleness, quality_checks_passed, and lifecycle_stage labels present.
- [ ] Rejected-content note recorded for excluded material.

## Ghi chú tiếng Việt

Chỉ nạp những quan sát bền vững, có nguồn, có phạm vi và đã lọc riêng tư. Luôn phân loại nguồn (session/decision/review/debug), chạy bộ lọc quyền riêng tư ở mọi giai đoạn, và ghi lại lifecycle_stage cùng quality_checks_passed. Không lưu transcript thô hoặc bí mật.
