---
description: "Compress noisy session observations into durable memory entries with confidence scoring."
---

# vibe-memory-compress

## When to use

Use when you have raw observations, session notes, or multiple related memory entries that need to be compressed into concise durable facts. Use the smallest relevant memory skill and avoid duplicating existing `vibe-memory-ingest`, `vibe-memory-retrieve`, `vibe-session-summary`, or `vibe-session-capture` behavior.

## Required inputs

- Raw observations, session notes, or multiple memory entries.
- Input source identifiers (paths, observation IDs, session IDs).
- Optional `--strategy` flag: semantic-summarization | noise-reduction | citation-preservation | auto.
- Optional `--source` flag: session | decision | review | debug (default: session).
- Optional `--min-confidence` flag: low | medium | high (default: low).

## Compression strategies (`--strategy` flag)

| Strategy | When to use | Effect |
|---|---|---|
| `semantic-summarization` | Verbose but factual input | Condense to essential meaning |
| `noise-reduction` | High noise, speculative content | Remove transient material |
| `citation-preservation` | Multiple related entries | Merge with provenance |
| `auto` (default) | Uncertain | Analyze input and select best strategy |

When `--strategy` is omitted, default to `auto` and document the chosen strategy in the output.

## Behavior

1. **Analyze** — Read input observations. Classify each as durable, transient, or speculative. Determine signal density and duplication level. If `--strategy` is `auto`, select the best strategy based on input characteristics:
   - Signal density > 50% → semantic summarization.
   - Duplication > 30% → noise reduction first, then semantic summarization.
   - Multiple entries from different sources → citation preservation.
2. **Compress** — Apply the selected compression strategy(ies) through the memory-compression skill.
3. **Score** — Assign confidence, staleness_risk, and privacy_status to each compressed entry.
4. **Output** — Produce the structured compressed entries using the memory-compression template.
5. **Report** — Include a compression report: input count, output count, strategy used, privacy actions taken, and any entries rejected during compression.

## Behavior (`--source` flag)

- `--source session`: default scope is session or worktree; moderate privacy risk; expire-after-next-session.
- `--source decision`: default scope is project; low privacy risk; indefinite retention under project.
- `--source review`: default scope is worktree or project; low privacy risk; keep-until-branch-cleanup.
- `--source debug`: default scope is worktree or session; low privacy risk; expire-after-fix-verified.

## Outputs

- List of compressed memory entries with summary, source_ids, confidence, staleness_risk, privacy_status, compression strategy, and supersession links.
- Compression report with input/output counts, strategy used, and any entries rejected.
- Supersession map when compression replaces or merges existing entries.

## Stopping conditions

Stop if input contains secrets that cannot be safely redacted, if input is already minimal (less than 3 observations or fewer than 100 tokens total), if source identifiers are missing making tracing impossible, or if compression would lose essential context required for the next task.

## Verification checklist

- [ ] Input observations classified (durable/transient/speculative).
- [ ] Compression strategy selected (or `auto` with documented choice).
- [ ] Compression lifecycle followed: analyze → compress → score → output.
- [ ] Privacy re-check performed before output.
- [ ] Confidence, staleness_risk, and privacy_status assigned per entry.
- [ ] Supersession links recorded where applicable.
- [ ] Output entries are concise and traceable to source IDs.
- [ ] Compression report generated.
- [ ] No secrets or sensitive data in output.

## Ghi chú tiếng Việt

Lệnh này nén các quan sát phiên thành sự kiện bền vững. Luôn chọn chiến lược nén phù hợp, gán điểm tin cậy và kiểm tra quyền riêng tư trước khi xuất. Không nén khi đầu vào quá ngắn hoặc chứa bí mật.
