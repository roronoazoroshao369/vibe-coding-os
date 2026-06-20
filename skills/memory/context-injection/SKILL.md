---
name: context-injection
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: memory
tags:
  - memory
status: stable
---

# Skill: Context Injection

## Purpose
Build a scoped, citation-backed, privacy-filtered context injection bundle that delivers only relevant, safe memory to the active task using progressive disclosure and explicit confidence/staleness labeling.

## When to use
Use before or during a task when memory may help but raw memory stores are too large, too stale, or too sensitive to inject directly. This skill orchestrates the end-to-end pipeline from search to safe injection.

## Inputs
- Task question, scope, and context budget.
- Candidate memory entries (from retrieval, search, or session capture).
- Privacy rules and exclusion list.
- Source, confidence, sensitivity, staleness risk, and expected output format.
- Relevant local memory skills, workflows, and templates.

## Workflow

1. **Scope the task** — Identify what the active task needs: which files, decisions, constraints, or past observations are relevant. Define a context budget (max entries or tokens).

2. **Search and index** — Use progressive disclosure: search summaries and indexes first. Only drill into detailed entries for direct hits. See `progressive-memory-disclosure` skill for layered loading guidance.

3. **Filter for privacy** — Run `privacy-filter` before any injection. Block secrets, credentials, tokens, private keys, unnecessary personal data, and raw sensitive transcripts. Apply sensitivity classification (public, internal, sensitive, secret-redacted). Reject content that cannot be safely redacted.

4. **Score and label** — For each candidate entry, attach:
   - **Confidence**: high / medium / low / uncertain — based on source quality and validation status.
   - **Staleness**: fresh / aging / stale / expired — based on time since last verification or source modification.
   - **Scope**: session / worktree / project / user — indicating where this memory applies.
   - **Source type**: session / decision / review / debug — for routing and retention.

5. **Compress and cite** — Merge or summarize noisy entries into concise observations. Preserve citations (file paths, command outputs, observation IDs). Drop entries that would not change the task outcome.

6. **Assemble the bundle** — Produce a compact injection bundle using the context-injection-template structure: summary, durable facts, citations, decisions, validation status, privacy exclusions, and follow-ups.

7. **Verify and inject** — Run the verification checklist. Confirm privacy exclusions, stale labels, and confidence scores are present. Inject the bundle into the active context.

## Outputs
- Safe context injection bundle: summary, facts, citations, decisions, validation status, privacy exclusions, follow-ups.
- Privacy exclusions log: what was blocked or redacted and why.
- Deferred entries: memory that was not injected and the reason (out of scope, stale, low confidence, budget exceeded).
- Missing-context note if search was insufficient to build a complete bundle.

## Failure modes
- Injecting entire memory stores instead of scoped bundles.
- Omitting citations to save tokens.
- Ignoring context budget and privacy constraints.
- Storing or injecting secrets, credentials, or unnecessary personal data.
- Assuming absent memory means no prior decision exists.
- Failing to label stale or uncertain entries.
- Skipping the privacy filter because the entry seems harmless.
- Using upstream runtime dependencies instead of local memory.

## Verification checklist
- [ ] Privacy filter ran before injection; secrets, credentials, and sensitive data excluded or redacted.
- [ ] Memory loaded in progressive layers: indexes first, details only for hits.
- [ ] Bundle includes citations, confidence, and staleness labels for each entry.
- [ ] Context budget and privacy constraints were respected.
- [ ] Stale or uncertain information is explicitly labeled.
- [ ] Existing memory skills and templates were reused where applicable.
- [ ] No upstream code, scripts, or runtime dependencies were introduced.
- [ ] Bundle is concise, source-aware, and directly relevant to the active task.

## Cross-references
- `vibe-context-inject` command — the step-by-step command that invokes this skill.
- `context-injection-template` — template for the output bundle format.
- `privacy-filter` skill — mandatory privacy gate before injection.
- `progressive-memory-disclosure` skill — layered loading strategy.
- `memory-ingestion` skill — lifecycle for creating entries that this skill later injects.
- `observation-citations` skill — citation format and observation ID conventions.
- `memory-evaluation` skill — relevance, freshness, and cost scoring.

## Ghi chú tiếng Việt
Kỹ năng này xây dựng gói ngữ cảnh an toàn: tìm kiếm theo lớp, lọc riêng tư trước, ghi rõ nguồn và độ tin cậy, đánh dấu cũ/mới, và chỉ đưa vào ngữ cảnh phần liên quan trực tiếp đến tác vụ hiện tại.
