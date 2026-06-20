---
name: context-budget
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: meta
tags:
  - meta
status: stable
---

# Skill: Context Budget Audit

## Purpose

Keep the Vibe Coding OS framework lean by auditing how much context its own docs, skills, commands, and templates consume, and flag bloat before it spreads. Apply ECC-inspired token-estimation and duplicate-detection heuristics to maintain a predictable context footprint.

## When to use

Use when the skill/command/template set has grown, when the same guidance appears in several files, when frontmatter or descriptions feel verbose, or before adding new artifacts so you know there is room. Also use during routine maintenance (every 2-4 weeks) to catch context creep early.

## Inputs

The artifact directories under audit (`skills/**`, `commands/**`, `templates/**`, root docs), per-file line counts, frontmatter/description text, any suspected duplicate pairs, and the current context budget report if one exists.

## Workflow

1. **Inventory each artifact**: record its line count and the length of its frontmatter or one-line description.
2. **Flag heavy files**: any `SKILL.md`, command, or template longer than **400 lines** is a split-or-trim candidate.
3. **Flag bloated frontmatter**: any `description`/frontmatter summary longer than **~30 words** — it loads everywhere the artifact is referenced.
4. **Detect duplicate copies**: compare files that share a title or section structure; near-identical bodies (only the title line differs) should collapse to one source plus links.
5. **Detect cross-file overlap**: scan for the same instruction or advisory note repeated in 3+ files. Flag one as canonical, link the rest.
6. **Estimate token cost** using the heuristics below.
7. **Classify each flagged item** as keep, trim, merge, or link-to-canonical.
8. **Produce a prioritized savings report**: biggest reductions first, with the concrete edit for each.

## ECC-inspired heuristics

### File-length thresholds

- **> 400 lines** → flag for split or trim. At ~30 tokens per line (markdown average), a 400-line file costs ~12,000 tokens to load. Splitting reference-heavy content into separate files can recover 40-60% of that cost.
- **> 200 lines and meta-category** → flag for review. Meta skills (those loaded every session) should stay under 200 lines to avoid burning context on scaffolding.
- **< 50 lines with unique purpose** → flag for merge if it duplicates coverage in another file. Very short files that could be a section in a sibling file increase discovery overhead without proportional value.

### Frontmatter limits

- **Description > 30 words** → flag as bloated. The description is loaded every time the artifact is referenced in indexes or registries. A 50-word description that says "Use when..." plus a behavior summary is costing the agent 20 extra words of context per reference with zero added signal.
- **Frontmatter total > 10 lines** → flag for compression. Combine redundant metadata; push extended notes into the body.

### Duplicate detection patterns

- **Title-level match**: two files whose title (H1) differs only by a word or pluralization, and whose section headings and body text overlap > 70%.
- **Section-level match**: files with different titles but identical workflow steps, failure modes, or verification checklists. This indicates a shared procedure that should be a single canonical source.
- **Paragraph-level match**: a sentence or instruction repeated verbatim in 3+ files (e.g., "Remove secrets, personal data, and raw transcripts"). Flag the canonical definition and link from other files.

### Token-estimation formulas

Use these approximations to build a cost model for each artifact:

```
Token cost per line (markdown):
  - Body text:        ~30 tokens/line average (5-8 words/line × 4-5 tokens/word)
  - Code blocks:      ~40 tokens/line (more dense tokens)
  - Tables:           ~35 tokens/line (cell overhead)
  - Frontmatter:      ~5 tokens/word (YAML/JSON metadata)
  - Lists:            ~25 tokens/line (short entries, bullet overhead)

Total estimate:  sum(line_type_count × tokens_per_line)
Critical load:   > 15,000 estimated tokens → mandatory split
High load:       8,000–15,000 tokens → review for trim
Moderate load:   3,000–8,000 tokens → acceptable for core skills
Low load:        < 3,000 tokens → fine for frequently-loaded files
```

When reporting token savings, compute:
```
Savings = current_cost - proposed_cost
Savings_share = savings / current_cost × 100
```

### Cross-file overlap detection

- **Same instruction in 3+ files** → flag. Example: "Run verification before claiming completion" appearing in `verification-before-completion`, `quality-rubric`, `implementer-agent`, and `review-before-merge` means 3 of those should link to the canonical statement in the first file.
- **Same failure mode in 2+ meta files** → flag. Meta skills that share failure modes should define them once in a shared reference or in the canonical meta skill, then cross-reference.

### Heuristic cost model for context budgeting

For a comprehensive audit, sum these costs across all tracked artifacts:

| Component | Estimated token cost | Notes |
|-----------|---------------------|-------|
| Skills catalog (50 files × 300 tokens avg) | ~15,000 | Frontmatter + description only, not full bodies |
| Always-loaded meta files (5 files × 600 tokens avg) | ~3,000 | These load every session |
| Commands catalog (50 files × 15 tokens description) | ~750 | Brief descriptions only |
| Templates (20 files × 200 tokens avg) | ~4,000 | Template bodies if loaded |
| Root docs (README, CONSTITUTION, etc.) | ~5,000 | Varies by project |

A healthy total for a fresh session is **< 28,000 estimated tokens** for the framework's own footprint. If the audit exceeds this, flag each component above its budget for reduction.

## Outputs

A context-budget report listing flagged files with reason, token-cost estimates, the keep/trim/merge/link decision, and an ordered list of edits ranked by token savings.

## Failure modes

- Counting duplicate copies twice and overstating overhead.
- Deleting content that was the canonical source (always confirm before delete).
- Trimming detail that carried real signal (context removal that cripples guidance).
- Treating every long file as bad when length is justified by dense procedural content.
- Using unrealistic token estimates (always label as "approximate"; true cost depends on the LLM tokenizer).
- Running an audit without updating the report, so savings drift unnoticed.
- Over-optimizing for token count at the expense of readability or discoverability.

## Verification checklist

- [ ] Every flagged file has a reason and a keep/trim/merge/link decision.
- [ ] Duplicate pairs are confirmed by content comparison before merge.
- [ ] Token-cost estimates are labeled as approximate and logged in the report.
- [ ] The report is ordered by savings (largest first).
- [ ] No canonical source was removed without a replacement link.
- [ ] The audit covers skills, commands, templates, and root docs.
- [ ] Results are actionable: each flagged item has a concrete next step.

## Works with

- `skills/meta/writing-skills/SKILL.md` — token-budget and composability guidance complements this audit.
- `skills/meta/instinct-extraction/SKILL.md` — instinct store entries should respect context budgets too.
- `commands/vibe-context-audit.md` — CLI to run a structured context-budget audit against these heuristics.
- `references/features/continuous-learning.md` — continuous learning includes periodic context budget reviews.

## Ghi chú tiếng Việt

Kỹ năng này giữ framework gọn nhẹ: kiểm tra mức tiêu thụ context của skills/commands/templates. Ngưỡng cờ: file `> 400 dòng`, frontmatter/description `> 30 từ`, và các bản sao gần như trùng. Thêm ước lượng token (30-40 tokens/dòng tùy loại), phát hiện trùng lặp chéo file, và mô hình chi phí heuristic (~28K token cho framework). Xuất báo cáo tiết kiệm token theo thứ tự ưu tiên. File liên quan: `skills/meta/write-reusable-skill/SKILL.md`, `skills/meta/instinct-extraction/SKILL.md`.

## Nguồn cảm hứng / Inspiration

Heuristics adapted as original wording from `affaan-m/ECC` (MIT, Affaan Mustafa) context-budget skill. Inspiration only — no upstream text or scripts copied; this is a docs/workflow heuristic, not a runtime scanner.
