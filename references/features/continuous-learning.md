# Feature: Continuous Learning and Instinct Extraction

## Goal

Define how Vibe Coding OS supports continuous learning across sessions: the deliberate extraction, storage, and re-application of engineering instincts so the agent's behavior improves over time without a runtime memory system.

## Reference sources

- `affaan-m/ECC` (primary) — continuous-learning workflow and instinct extraction patterns.
- `obra/superpowers` — skill-writing discipline and behavior-shaping documentation.
- `skills/meta/instinct-extraction/SKILL.md` — the extraction workflow.
- `skills/meta/context-budget/SKILL.md` — instinct store entries should be budget-conscious.

## Local implementation

- `skills/meta/instinct-extraction/SKILL.md` — two-phase continuous-learning loop (pre-session loading + post-session extraction).
- `commands/vibe-instinct.md` — CLI to extract, review, apply, list, archive, or promote instincts.
- `templates/instinct-template.md` — structured instinct record format.
- `references/instincts/` — the instinct store directory (created on first use).

## Applied upstream ideas

- **Post-session instinct extraction**: scan session patterns, formulate trigger-action rules, score confidence (1-10), set scope and expiry, store structured records.
- **Pre-session instinct loading**: check the instinct store before starting work, load matching instincts with confidence-weighted prominence.
- **Confidence scoring rubric**: five tiers (Certain/High/Medium/Low/Speculative) with explicit criteria for each.
- **Instinct lifecycle**: Created → Loaded → Re-verified → Archived → Removed. Expiry dates tied to confidence level.
- **Instinct store**: filesystem-based (`references/instincts/<slug>.md`) with archiving (`archived/` subdirectory) for audit trail.
- **Promotion path**: high-confidence instincts can graduate to formal skills.

## Not applied upstream ideas

- No runtime memory daemon or automatic enforcement mechanism.
- No embedding/vector search for instinct matching (manual keyword matching only).
- No cross-session aggregate statistics or telemetry.
- No upstream scripts, prompts, or text copied.

## Must-have behavior

- The continuous-learning loop operates across sessions: instincts created in one session are available for loading in the next.
- Each instinct has a trigger, action, scope, confidence (1-10), evidence, and expiry date.
- Confidence scoring follows the rubric; score inflation is prevented by requiring evidence for each tier.
- The instinct store is a plain markdown directory — no special tooling required to read or write entries.
- Stale instincts are flagged on review; expired instincts are explicitly labeled.
- High-confidence instincts can be promoted to skills without manual reformatting.
- Privacy filtering is applied before any instinct is written to the store.

## Failure modes

- Treating a single lucky observation as a high-confidence instinct (confidence inflation).
- Storing raw session transcripts or secrets in the instinct store.
- Creating hundreds of low-value instincts that overwhelm the store.
- Skipping expiry dates, causing stale guidance to persist indefinitely.
- Forgetting to run pre-session loading, so instincts are never applied.
- Promoting a medium-confidence instinct to a skill prematurely.

## Update signals

- Upstream changes the confidence rubric, extraction workflow, or instinct lifecycle model.
- Local users report that extracted instincts are too vague, too narrow, or never applied.
- The instinct store grows beyond ~50 entries without an indexing or search strategy.
- A new session repeatedly encounters the same failure pattern that no existing instinct covers.
- The promotion path to skills reveals format gaps or metadata mismatches.

## Evaluation ideas

- After 5 sessions using instinct extraction, are new sessions shorter or more accurate?
- Does pre-session loading reduce the number of repeated mistakes?
- Do extracted instincts survive review with stable or increasing confidence?
- Is the instinct store discoverable and navigable without special tooling?

## Ghi chú tiếng Việt

Continuous learning: rút instinct từ phiên làm việc, lưu vào kho markdown, nạp lại trước phiên sau. Mỗi instinct có trigger, action, phạm vi, điểm 1-10, bằng chứng, hạn dùng. Vòng đời: tạo → nạp → kiểm chứng lại → lưu trữ → xóa. Không có runtime hay vector search — hoàn toàn là markdown thủ công với CLI hỗ trợ (`vibe-instinct`). Học từ `affaan-m/ECC`, không copy code hay text.
