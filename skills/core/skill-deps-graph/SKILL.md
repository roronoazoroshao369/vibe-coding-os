---
name: skill-deps-graph
version: 1.0.0
introduced_in: v2.14.0
last_reviewed: 2026-06-20
category: core
tags: [dependencies, graph, visualization, mermaid, analysis]
description: Build a dependency graph of skills based on cross-reference extraction. Outputs JSON, Mermaid diagram, or stats. Identifies orphan skills and most-referenced skills.
---

# Skill: Skill Deps Graph

## Purpose

Map how skills reference each other so you can identify orphan skills (no incoming refs), find foundational skills (most referenced), and visualize the dependency structure for docs, audits, and refactor planning.

The graph is derived from cross-reference links in skill content (e.g. `See skills/core/quality-execution-contract/SKILL.md`), not from a separate manifest. This keeps the graph in sync with what skills actually say about their dependencies.

## When to use

- Auditing which skills are foundational vs. leaf
- Identifying orphan skills for retirement or promotion
- Planning refactors (what breaks if X is renamed?)
- Writing docs that show the skill ecosystem
- Detecting circular dependencies

Do NOT use for:
- Runtime dependency resolution (skills are markdown, not code)
- Build graph (no build step in this repo)
- Test execution order (tests run independently)

## Inputs

- All SKILL.md files under `skills/`
- Optional: format specifier (json | mermaid | stats)

## Workflow

1. **Run stats**: `node scripts/skill-deps-graph.mjs stats` — see node count, edge count, top references, orphans
2. **Inspect orphans**: list of skills with 0 incoming refs — candidates for retirement or promotion
3. **Inspect foundations**: top in-degree skills — usually safe to refactor carefully (lots of dependents)
4. **Generate Mermaid**: `node scripts/skill-deps-graph.mjs mermaid` — paste into docs/README for ecosystem map
5. **Generate JSON**: `node scripts/skill-deps-graph.mjs json > deps.json` — feed to other tools
6. **Compare over time**: run before/after refactor; diff JSON to see what changed

### Example: Find orphans before refactor

```bash
node scripts/skill-deps-graph.mjs stats | grep -A 20 "Orphan"
```

### Example: Embed Mermaid in docs

```bash
node scripts/skill-deps-graph.mjs mermaid > /tmp/deps.md
echo "## Skill Dependency Graph" >> docs/architecture.md
cat /tmp/deps.md >> docs/architecture.md
```

## Outputs

- `json` format: full `{nodes: [], edges: []}` graph
- `mermaid` format: Mermaid `graph TD` syntax, paste into any markdown viewer
- `stats` format: summary with most-referenced skills + orphan list
- Exit code 0 on success (this skill never fails — just reports)

## Failure modes

1. **Many orphans** — normal for a young ecosystem; review each before retiring (some may be intentional "leaf" skills)
2. **No edges** — if regex fails to match cross-references, edges will be empty; check format with `node scripts/skill-deps-graph.mjs json`
3. **Circular references** — possible but not harmful; the graph handles cycles (Mermaid renders them)
4. **Path normalization mismatches** — refs like `skills/core/foo/` may not match `skills/core/goal-driven-execution/SKILL.md`; script normalizes both
5. **Large graphs** — 100+ skills may produce unreadable Mermaid; use stats first

## Verification checklist

- [ ] Stats output shows non-zero nodes (or zero if no skills)
- [ ] At least one edge detected (if skills reference each other)
- [ ] Orphan list matches manual spot-check of 3-5 skills
- [ ] Mermaid output renders in a Markdown viewer (paste into GitHub README preview)
- [ ] JSON output is valid (`jq . deps.json`)
- [ ] No false edges from regex over-matching (review edges by hand for 5)

## Cross-references

- See `skills/core/skill-content-search/SKILL.md` — for finding related skills before checking deps
- See `skills/core/docs-author/SKILL.md` — for documenting the dependency graph
- See `scripts/build-reference-index.mjs` — for the broader reference index
- See `scripts/skill-deps-graph.mjs` — source code

## Review cadence

- Quarterly: run stats, review orphan count and top references
- On skill retirement: rerun graph to confirm no broken edges remain
- On major refactor: archive the previous graph JSON for diff comparison
