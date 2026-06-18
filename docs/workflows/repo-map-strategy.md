# Repo Map Strategy

> Strategy document for building and maintaining a repo-map (symbol-map) approach
> in a markdown-first Vibe Coding OS project.

## Why repo maps help

Coding agents — especially mid-tier models with limited context windows — lose track
of repository structure during long tasks. A repo map provides a structured overview
that keeps the agent oriented without consuming context on raw file dumps. It acts as
a compact directory that tells the agent *where* things live before it needs to read
*how* they work.

Benefits:

- **Reduced hallucination** — the agent knows what exists instead of guessing.
- **Better neighbor detection** — when modifying a file, the agent can quickly find related modules, tests, and utilities.
- **Faster onboarding** — new sessions start with orientation instead of blind exploration.
- **Context budget preservation** — a 200-line map replaces scanning hundreds of files for layout.
- **Architectural guardrails** — the map encodes constraints and protected paths explicitly.

## What to collect

### Directory layout (top 2–3 levels)

```
├── src/           # Application source code
│   ├── api/       # HTTP route handlers
│   ├── core/      # Business logic, no framework deps
│   └── utils/     # Shared helpers
├── tests/         # Test files, mirrors src/ structure
├── docs/          # Documentation and workflow guides
├── templates/     # Reusable markdown/JSON templates
├── skills/        # Agent skill definitions
│   ├── core/      # Always-available skills
│   ├── memory/    # Memory-layer skills
│   └── meta/      # Skills about skills
├── commands/      # Agent command entry points
├── registry/      # JSON indexes for skills, commands, prompts
├── package.json   # Project config and validation scripts
└── AGENTS.md      # Agent instructions
```

### Module index

For each significant module or directory:

| Field | Purpose |
|-------|---------|
| Name | Directory or file name |
| Path | Relative path from repo root |
| Purpose | What it does (1 line) |
| Key exports | Public API surface or important files |
| Tests | Where tests live, how to run them |

### Relationship map

- Which modules import from which.
- Where shared utilities or types live.
- Entry points and their downstream consumers.

### Constraints

- Protected paths (generated, vendored, do-not-edit).
- Architectural rules (layer boundaries, dependency restrictions).
- Naming conventions and file organization patterns.

### Hot zones

- Files or directories that change frequently.
- Areas with complex logic that needs extra care.
- Places where past bugs have clustered.

## Output shape

The repo map should be a single markdown file (or a section of `AGENTS.md`).

Recommended structure:

```markdown
# Repo Map

Last updated: [DATE]
Scope: [full repo | specific area]

## Directory layout
[annotated tree]

## Module index
[bulleted list of modules with purpose and key files]

## Key relationships
[import graph or cross-references]

## Constraints
[protected paths, architectural rules]

## Hot zones
[areas needing extra care]
```

Token budget: aim for under 200 lines for a full-repo map, under 80 lines for a scoped
map targeting a specific task area.

## Update cadence

| Trigger | Action |
|---------|--------|
| New top-level directory or major module | Add to layout and module index |
| Module purpose changes or splits | Update description, add new entry |
| Architectural decision recorded (ADR) | Add constraint or link to ADR |
| Protected path changes | Update constraints section |
| After a large refactor | Full rebuild of affected area |
| New project onboarding | Generate initial map from scratch |
| Quarterly review | Verify map still reflects reality |

## Integration with Vibe Coding OS

- The repo map complements `vibe-code-context` — the context pack captures local patterns, the repo map captures global structure.
- Use the map in `vibe-init` to orient a new session.
- Reference the map during planning (`vibe-plan`, `vibe-write-plan`) to identify blast radius.
- Update the map when finishing a branch (`vibe-finish-branch`) if the structure changed.

## Pitfalls

1. **Map too large.** A 500-line map costs more context than it saves. Keep it tight and push detail into actual files.
2. **Stale map worse than no map.** A map that says "tests/ has 5 files" when there are 50 actively misleads the agent. Set a cadence and stick to it.
3. **Map as sole truth.** The map points to code; it does not replace reading code. Always verify with actual file inspection before editing.
4. **Secrets leakage.** Never include API keys, tokens, passwords, or credentials in the map — even in examples.
5. **Over-abstraction.** "Business logic module" tells the agent nothing useful. "Order processing: handles checkout flow, payment validation, and receipt generation" tells it everything.
6. **Ignoring hot zones.** A perfectly structured map that does not flag the risky areas fails at the most important part — keeping the agent safe.
7. **No incremental updates.** Rebuilding from scratch every session wastes effort. Patch the map when structure changes, rebuild only on major refactors.

## Notes

This is a strategy document, not a runtime tool. The repo map is maintained as markdown
by the agent and human together. No build step or automation is required — the value is
in the human-readable, agent-consumable structure itself.
