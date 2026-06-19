---
description: "Run a structured context-budget audit against ECC-inspired heuristics: token estimation, duplicate detection, and frontmatter bloat."
---

# vibe-context-audit

## When to use

Use to audit the Vibe Coding OS framework's own context consumption before adding new artifacts, after significant growth, or during routine maintenance (every 2-4 weeks). Also use when the same guidance appears in several files or when descriptions feel verbose.

## Required inputs

The artifact directories under audit (`skills/**, commands/**, templates/**`), line counts, frontmatter/description text, and any suspected duplicate pairs.

## Heuristics checklist

Run each check in order and aggregate results:

- [ ] **File-length scan**: Find all SKILL.md, command, and template files longer than 400 lines. Flag each as split-or-trim candidate. Report line count and estimated token cost.
- [ ] **Meta-skill scan**: Find meta-category files longer than 200 lines. These load every session and should be lean.
- [ ] **Frontmatter bloat**: Find descriptions longer than 30 words. Report the word count and estimated tokens saved by trimming to 30.
- [ ] **Duplicate body detection**: Compare files that share title or section structure. Flag pairs where the body text is >70% identical, differing only by title line.
- [ ] **Cross-file overlap scan**: Scan for the same instruction repeated in 3+ files. Flag one as canonical, recommend links from the rest.
- [ ] **Token-cost estimation**: For each flagged file, compute estimated token cost (body ~30 tok/line, code blocks ~40 tok/line, frontmatter ~5 tok/word). Categorize as critical (>15K), high (8-15K), moderate (3-8K), or low (<3K).
- [ ] **Total framework footprint**: Sum estimated tokens across all skills, commands, templates, and root docs. Flag if total exceeds ~28,000 tokens.

## Step-by-step behavior

1. Walk the skills, commands, and templates directories.
2. For each file, record line count, word count, and estimated token cost.
3. Apply each heuristic from the checklist above.
4. Cross-reference flagged duplicates with manual content comparison.
5. Classify each flagged item as keep, trim, merge, or link-to-canonical.
6. Produce a prioritized report with concrete savings estimates.

## Outputs

A context-budget report listing each flagged file with its current metrics, the heuristic that flagged it, a classification (keep/trim/merge/link), and a concrete recommended change with token-savings estimate. Ordered by savings potential.

## Stopping conditions

Stop if the repository structure is too different from expected (e.g., missing skills/ or commands/ directories). Stop if a file cannot be read.

## Verification checklist

- [ ] All relevant directories were scanned.
- [ ] Each flagged file has a reason and a decision.
- [ ] Duplicate pairs were confirmed by content comparison.
- [ ] Token estimates are labeled as approximate.
- [ ] Report is ordered by savings (largest first).

## Works with

- `skills/meta/context-budget/SKILL.md` — the audit heuristics this command automates.
- `skills/meta/writing-skills/SKILL.md` — token-budget and composability guidance.
- `commands/vibe-instinct.md` — instinct store entries should also respect context budgets.
