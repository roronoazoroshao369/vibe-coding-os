# Skill: Memory Troubleshooting

## Purpose

Diagnose memory that is missing, stale, unsafe, contradictory, noisy, or failing to influence work.

## When to use

Use when retrieved memory seems wrong, expected context is absent, too much context is injected, citations are broken, or privacy risk appears.

## Inputs

- Symptom: missing, stale, noisy, unsafe, contradictory, or provider/config failure.
- Search terms, expected entry, actual retrieved entry, citations, and config.
- Validation evidence or user correction.

## Workflow

1. Classify the failure type.
2. Check scope first: wrong project, worktree, session, or user memory.
3. Check search terms and citation links.
4. Check freshness: superseded entries, contradictions, or missing `isLatest` label.
5. Check privacy filter and injection budget.
6. If provider-backed, test local fallback and auth/config assumptions without exposing secrets.
7. Fix by revising config, updating memory, adding a citation, or deleting stale/noisy entries.

## Outputs

- Diagnosis and root cause.
- Memory/config correction.
- Follow-up validation result.

## Failure modes

- Blaming search before checking scope.
- Keeping contradicted memory because it is frequently retrieved.
- Fixing provider config by exposing secrets.
- Increasing injection volume instead of improving relevance.

## Verification checklist

- [ ] Scope, search, citation, freshness, privacy, and provider/config were considered.
- [ ] Fix addresses the classified failure type.
- [ ] Secrets were not exposed during diagnosis.
- [ ] A validation query or retrieval check confirms improvement.

## Ghi chú tiếng Việt

Khi bộ nhớ sai hoặc nhiễu, kiểm tra phạm vi trước, rồi truy vấn, trích dẫn, độ mới, riêng tư và provider. Sửa bằng bằng chứng, không tăng ngữ cảnh bừa bãi.
