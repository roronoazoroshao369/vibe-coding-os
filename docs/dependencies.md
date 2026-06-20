---
title: "Dependency Policy"
version: "2.15.0"
---

# Dependency Policy

## Purpose

Vibe Coding OS is a docs/prompts/skills framework. Most functionality is pure markdown. Where Node.js scripts are needed, this policy governs external dependencies.

## Hard restrictions (runtime)

Per ADR 0002, the runtime is **frozen**. The framework itself does not install or require external dependencies for its core functions.

**Allowed in `runtime/`:**
- Node.js standard library only (`node:fs`, `node:path`, etc.)
- Zero external npm packages

**Disallowed in `runtime/`:**
- External packages (npm install forbidden)
- Network calls
- Filesystem access outside the repo

## Soft restrictions (dev/tools)

`scripts/` and `tests/` may use minimal dev dependencies:

- **Allowed**: `yaml` (YAML parsing if needed), `zod` (schema validation)
- **Disallowed**: heavy frameworks, anything requiring network, anything that doesn't work offline

## When to add a dependency

Add a dependency only when:

1. The functionality cannot be implemented in ≤ 50 lines of stdlib code.
2. The package is widely used (>1M weekly downloads).
3. The package has no transitive dependencies.

## When NOT to add a dependency

- **Convenience**: a 1-line function doesn't need a package.
- **Cosmetic**: prettier/formatting is already configured.
- **Bells and whistles**: logging, colors, etc. Use stdlib.

## Alternatives to packages

- JSON Schema validation: hand-write, or use `node:assert/strict`.
- YAML parsing: convert to JSON or hand-write.
- Markdown parsing: use regex (we already do this for skill quality).
- HTTP requests: use `fetch` (built-in to Node 18+).

## Enforcement

`runtime-freeze-guard` validation gate fails if a `package.json` is added to `runtime/`.
