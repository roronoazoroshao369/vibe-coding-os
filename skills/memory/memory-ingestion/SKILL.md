# Skill: Memory Ingestion

## Purpose

Turn durable observations into safe, scoped memory entries with citations and privacy filtering.

## When to use

Use after a session, decision, validation result, troubleshooting discovery, or user constraint should persist for future work.

## Inputs

- Candidate fact, decision, command, file path, validation result, risk, or follow-up.
- Source artifact: file path, command output summary, conversation turn, issue, PR, or handoff.
- Scope, confidence, sensitivity, and retention expectation.

## Workflow

1. Keep only durable facts that could change future behavior.
2. Run `privacy-filter` before storing anything.
3. Attach source/citation: file path, command, observation ID, or handoff reference.
4. Set scope: session, worktree, project, or user-level.
5. Add confidence and stale-risk labels.
6. Record contradictions or supersession links when replacing older memory.
7. Store concise original wording; never store raw secrets or full transcripts.

## Outputs

- Safe memory entry with source, scope, confidence, and retention note.
- Rejected-content note for excluded sensitive or low-value material.

## Failure modes

- Saving transcript noise instead of durable facts.
- Omitting source/citation.
- Storing sensitive data because it was useful.
- Writing global memory for branch-specific facts.

## Verification checklist

- [ ] Entry is durable, concise, and actionable.
- [ ] Privacy filter ran before storage.
- [ ] Source/citation and scope are present.
- [ ] Confidence, staleness, and follow-up labels are present when relevant.

## Ghi chú tiếng Việt

Chỉ nạp những quan sát bền vững, có nguồn, có phạm vi và đã lọc riêng tư. Không lưu transcript thô hoặc bí mật.
