# Skill: Context Budget Audit

## Purpose

Keep the Vibe Coding OS framework lean by auditing how much context its own docs, skills, commands, and templates consume, and flag bloat before it spreads.

## When to use

Use when the skill/command/template set has grown, when the same guidance appears in several files, when frontmatter or descriptions feel verbose, or before adding new artifacts so you know there is room.

## Inputs

The artifact directories under audit (`skills/**`, `commands/**`, `templates/**`, root docs), per-file line counts, frontmatter/description text, and any suspected duplicate pairs.

## Workflow

1. Inventory each artifact: record its line count and the length of its frontmatter or one-line description.
2. Flag heavy files: any `SKILL.md`, command, or template longer than 400 lines is a split-or-trim candidate.
3. Flag bloated frontmatter: any `description`/frontmatter summary longer than ~30 words — it loads everywhere the artifact is referenced.
4. Detect duplicate copies: compare files that share a title or section structure; near-identical bodies (only the title line differs) should collapse to one source plus links.
5. Classify each flagged item as keep, trim, merge, or link-to-canonical.
6. Produce a prioritized savings report: biggest reductions first, with the concrete edit for each.

## Heuristics (thresholds)

- File length: `> 400 lines` → flag for split or trim.
- Frontmatter/description: `> 30 words` → flag as bloated.
- Duplicate copy: two files with matching headings and bodies differing only by a title/name line → flag for merge.
- Cross-file overlap: the same instruction repeated in 3+ files → flag one as canonical, link the rest.

## Outputs

A context-budget report listing flagged files with reason, the keep/trim/merge/link decision, and an ordered list of edits ranked by token savings.

## Failure modes

Counting duplicate copies twice and overstating overhead; deleting content that was the canonical source; trimming detail that carried real signal; treating every long file as bad when length is justified.

## Verification checklist

Every flagged file has a reason and a decision; duplicate pairs are confirmed before merge; the report is ordered by savings; no canonical source was removed without a replacement link.

## Ghi chú tiếng Việt

Kỹ năng này giữ framework gọn nhẹ: kiểm tra mức tiêu thụ context của skills/commands/templates. Ngưỡng cờ: file `> 400 dòng`, frontmatter/description `> 30 từ`, và các bản sao gần như trùng (chỉ khác dòng tiêu đề). Xuất báo cáo tiết kiệm token theo thứ tự ưu tiên. File liên quan: `skills/meta/write-reusable-skill/SKILL.md`.

## Nguồn cảm hứng / Inspiration

Heuristics adapted as original wording from `affaan-m/ECC` (MIT, Affaan Mustafa) context-budget skill. Inspiration only — no upstream text or scripts copied; this is a docs/workflow heuristic, not a runtime scanner.
