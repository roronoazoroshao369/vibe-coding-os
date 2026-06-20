---
name: skill-content-search
version: 1.0.0
introduced_in: v2.14.0
last_reviewed: 2026-06-20
category: core
tags: [search, discover, content, grep, navigation]
description: Search across all skills, commands, templates, and docs with regex support and case-insensitive matching. Returns file paths, line numbers, and snippets.
---

# Skill: Skill Content Search

## Purpose

Quickly locate the right skill, command, template, or doc when the repo has grown past the point where you can remember everything. Returns matching files with line numbers and snippets so you can jump straight to the relevant context.

This complements `vibe-memory-search` (semantic search across runtime memory) by operating on **disk artifacts** — the source of truth that gets shipped.

## When to use

- Looking for a skill that handles a specific concern (e.g. "which skill covers OAuth?")
- Finding every place that references a deprecated API
- Auditing which files mention a security-relevant term (e.g. "bypass", "secret", "injection")
- Reverse-engineering a feature ("how does X work?")
- Building a cross-reference report for a docs update

Do NOT use when you already know the exact file path — open it directly with `Read`.

## Inputs

- A search pattern (literal string or regex)
- Optional flags: `--regex`, `--case-sensitive`
- Optional env: `MAX_RESULTS=N` to cap results (default 50)

## Workflow

1. Run `node scripts/skill-content-search.mjs "<pattern>"` for literal search.
2. Add `--regex` if your pattern uses regex syntax (e.g. `(bypass|inject|leak)`).
3. Add `--case-sensitive` if you need exact casing.
4. Review the matching file paths, line numbers, and snippets.
5. Open the most relevant files directly with `Read`.

### Example: Find every skill mentioning "sandbox"

```bash
node scripts/skill-content-search.mjs sandbox
```

### Example: Regex search for bypass patterns

```bash
node scripts/skill-content-search.mjs "(bypass|injection|exfiltrat)" --regex
```

### Example: Cap results to first 10

```bash
MAX_RESULTS=10 node scripts/skill-content-search.mjs "secret"
```

## Outputs

- List of `{file}:{line}` matches with snippet preview (200 chars max)
- Total scan count and match count
- Non-zero exit if no matches found (useful for CI guards)

## Failure modes

1. **No matches** — pattern too narrow; try a substring or regex
2. **Too many matches** — narrow with `MAX_RESULTS=20` or more specific pattern
3. **Binary file errors** — script reads as UTF-8; binary files will be skipped silently
4. **Permission denied** — script runs with user permissions; protected dirs will error
5. **Pattern injection via regex** — `--regex` flag passes user input to RegExp; malicious patterns could cause DoS (ReDoS); the script does NOT validate pattern safety

## Verification checklist

- [ ] Pattern returns expected matches
- [ ] `--regex` flag works on a known regex (e.g. `^## `)
- [ ] `--case-sensitive` changes result count appropriately
- [ ] `MAX_RESULTS=N` caps output
- [ ] Exit code is 0 when matches found, 1 when empty (for CI use)
- [ ] No false positives from case sensitivity (unless intentional)
- [ ] Search across all 4 dirs: skills/, commands/, templates/, docs/

## Cross-references

- See `skills/core/quality-shield/SKILL.md` for the workflow that often follows discovery
- See `skills/core/quality-shield/SKILL.md` for a higher-level repo overview
- See `commands/vibe-memory-search.md` for semantic memory search (different scope)
- See `scripts/build-reference-index.mjs` for the full reference index builder

## Review cadence

- Quarterly: verify scan dirs match repo layout
- On new artifact type (e.g. `agents/`): update SCAN_DIRS
- On new extension: update ext mapping per dir
