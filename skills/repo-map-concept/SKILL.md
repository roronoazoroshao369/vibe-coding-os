---
name: repo-map-concept
version: 1.0.0
author: Hermes Agent
license: MIT
tags:
  - context
  - repo-map
  - symbol-map
  - coding
  - model-support
---

# Skill: Repo Map Concept

## Purpose

Build or consult a lightweight repo map (symbol map / directory map) that gives coding agents — especially mid-tier models with limited context windows — a structured overview of where things live, what exports what, and how the major pieces connect. The map is a markdown-first, human-readable index that supplements but does not replace actual code inspection.

## When to use

- **Before coding in an unfamiliar area**: when the agent needs to understand the lay of the land before touching files.
- **Mid-tier model support**: when the model has limited context or is likely to lose track of repo structure during long tasks.
- **Onboarding**: when starting a new project or joining a large codebase.
- **Pre-implementation**: during `vibe-code-context` or spec-to-plan to identify neighbors and boundaries.
- **Recovery**: when previous session context was lost and the agent needs to re-orient fast.

## Inputs

- Repository root path.
- Existing repo map (if any) for incremental updates.
- The area of the repo relevant to the current task (optional scope filter).

## Workflow

1. **Scan the top-level layout.** List directories, key config files, and entry points.
2. **Identify major modules or packages.** For each, note: purpose, primary exports, public API surface.
3. **Map key relationships.** Note which modules import from which, and where shared utilities live.
4. **Record architectural decisions.** Link to ADRs or decision notes that explain non-obvious structure.
5. **Mark hot zones.** Flag areas that change frequently, have complex logic, or require careful editing.
6. **Note protected areas.** Generated files, vendored code, lock files, and other do-not-edit paths.
7. **Output as markdown.** Use a structured format: directories → modules → relationships → constraints.
8. **Scope to task.** When building the map for a specific task, focus on the relevant area and skip unrelated branches.
9. **Update incrementally.** Revisit and patch the map when the project structure changes, not from scratch each time.

## Outputs

A markdown repo map containing:

- **Directory tree** (top 2–3 levels, annotated with purpose).
- **Module index** (name, path, purpose, key exports).
- **Relationship map** (imports, dependencies between modules).
- **Constraints** (protected paths, architectural rules).
- **Hot zones** (frequently changed, complex, or risky areas).

## Failure modes

- Building a map so large it exceeds the context budget it was meant to save.
- Making the map the sole source of truth instead of a pointer to actual code.
- Skipping incremental updates so the map drifts from reality.
- Including secrets, tokens, or credentials in the map.
- Making the map so abstract it provides no actionable orientation.
- Treating the map as a one-time artifact instead of a living reference.

## Verification checklist

- [ ] The map covers the relevant area and fits within a reasonable token budget.
- [ ] Directory purposes and module descriptions are concrete, not generic.
- [ ] Key relationships (imports, shared utilities) are noted.
- [ ] Protected paths and architectural constraints are listed.
- [ ] The map links to actual files rather than describing everything inline.
- [ ] No secrets or credentials appear in the map.
- [ ] The map has a "last updated" note and an update cadence.
