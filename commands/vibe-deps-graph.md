# Command: skill-deps-graph

> Visualize the skill dependency graph.

## Usage

```bash
# Show stats (node count, edges, top references, orphans)
node scripts/skill-deps-graph.mjs stats

# Output Mermaid diagram (paste into any markdown)
node scripts/skill-deps-graph.mjs mermaid

# Output JSON graph (for further processing)
node scripts/skill-deps-graph.mjs json > deps.json
```

## Common queries

```bash
# Find orphan skills (no incoming refs)
node scripts/skill-deps-graph.mjs stats | grep -A 20 "Orphan"

# Most-referenced skills (foundational)
node scripts/skill-deps-graph.mjs stats | grep -A 10 "Most referenced"
```

## See also

- `skills/core/skill-deps-graph/SKILL.md` — full skill
- `scripts/skill-deps-graph.mjs` — source
