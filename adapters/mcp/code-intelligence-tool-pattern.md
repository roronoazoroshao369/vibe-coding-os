# MCP Code Intelligence Tool Pattern

## Purpose

Define an optional Model Context Protocol (MCP) adapter contract for accelerating code intelligence review tasks. When an agent harness supports MCP, the dependency enumeration and call graph construction steps in `skills/core/code-intelligence-review/SKILL.md` can be delegated to an MCP-enabled tool, reducing manual scanning effort.

## Contract

### Tool: `code-intelligence:build-map`

Build a lightweight code intelligence map for a set of changed files.

**Input:**

```json
{
  "changed_files": ["path/to/file1.ts", "path/to/file2.ts"],
  "base_path": "/absolute/path/to/repo",
  "scope": "auto" | ["module1", "module2"]
}
```

**Output:**

```json
{
  "scope": {
    "changed_files": ["..."],
    "modules_touched": ["..."],
    "map_boundary": ["..."]
  },
  "dependencies": {
    "direct_imports": { "path/to/file.ts": ["module1", "module2"] },
    "transitive_risk": ["dependency with high risk"],
    "callers": { "functionName": ["caller1", "caller2"] },
    "callees": { "functionName": ["callee1", "callee2"] },
    "data_flow": {
      "types_crossing_boundary": ["type1", "type2"],
      "construction": "...",
      "consumption": "..."
    }
  },
  "call_graph": {
    "edges": [{"from": "func1", "to": "func2"}],
    "recursive_paths": false,
    "async_chains": false,
    "dynamic_dispatch": ["method1"]
  },
  "test_coverage": {
    "coverage": [
      {"function": "func1", "unit_test": "path/to/test", "covers_change": true, "integration_test": null, "gap": null}
    ],
    "priority_gaps": ["gap1", "gap2"]
  }
}
```

### Tool: `code-intelligence:incremental-diff`

Compute the structural difference between two revisions for incremental review.

**Input:**

```json
{
  "base_revision": "commit-hash-or-branch",
  "current_path": "/absolute/path/to/repo",
  "previous_map": {} // optional, from previous build-map call
}
```

**Output:**

```json
{
  "added_files": ["..."],
  "removed_files": ["..."],
  "modified_files": {
    "path/to/file.ts": {
      "changed_functions": ["func1", "func2"],
      "changed_lines": [10, 15, 20]
    }
  },
  "unchanged_files": ["..."]
}
```

## When to use the MCP path

Use the MCP adapter when:

1. The agent harness supports MCP natively (Claude Code, Codex, etc.).
2. The review involves more than 5 files or cross-module changes where manual scanning would consume significant token budget.
3. An MCP code intelligence server is available or can be started locally.

## When to use the markdown-first path (default)

Use the portable markdown-first skill (`skills/core/code-intelligence-review/SKILL.md`) when:

1. The agent harness does not support MCP.
2. The change is small (fewer than 5 files, single module).
3. Setting up an MCP server would be overhead disproportionate to the review.
4. The user prefers zero-dependency operation.

## Implementation notes

- The MCP server is an optional companion, not a core dependency of Vibe Coding OS. Users who want it may implement the contract above or use an existing MCP code intelligence tool.
- The contract is designed to map directly to the sections in `templates/code-intelligence-review-template.md`, so the MCP output can be slotted into the template without transformation.
- The `incremental-diff` tool is only useful when `incremental-review` has been run at least once and a baseline exists.
- No vendored MCP server implementation is included. This document defines the contract; implementation is left to the user or the upstream tool ecosystem.

## Inspiration

The MCP-native design pattern is adapted from the dual-interface approach in `tirth8205/code-review-graph` (CLI + MCP server), re-expressed here as an optional adapter contract for Vibe Coding OS's core-first philosophy.
