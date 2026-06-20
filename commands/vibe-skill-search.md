# Command: search-skills

> Quick reference for searching across skills, commands, templates, and docs.

## Usage

```bash
node scripts/skill-content-search.mjs "<pattern>" [--regex] [--case-sensitive]
```

## Examples

Find skills covering a topic:

```bash
node scripts/skill-content-search.mjs "OAuth"
```

Regex search across bypass patterns:

```bash
node scripts/skill-content-search.mjs "(bypass|injection|exfiltrat)" --regex
```

Cap results:

```bash
MAX_RESULTS=10 node scripts/skill-content-search.mjs "secret"
```

## See also

- `skills/core/skill-content-search/SKILL.md` — full skill
- `scripts/skill-content-search.mjs` — script source
