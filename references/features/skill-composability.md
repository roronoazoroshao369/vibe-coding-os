# Skill Composability — Design Principles

## Context

Upstream reference: `sickn33/antigravity-awesome-skills` (41k★, 1,595+ SKILL.md playbooks). The upstream demonstrates how a massive skill library can remain usable through composability conventions, categorized catalogs, and bundle groupings. This document captures the design principles adapted into Vibe Coding OS.

## Status

Inspiration only. No upstream text, taxonomy, or metadata format is copied. The principles below are original adaptations that fit Vibe Coding OS's runtime-frozen, docs/prompts/skills architecture.

## Core principle: skills compose like functions, not like config files

A composable skill has:
- **A clear trigger** (when to activate)
- **Explicit inputs** (what context it needs)
- **Guaranteed outputs** (what state or artifact it produces)
- **Declared relationships** (works with, conflicts with, depends on)

This functional contract lets agents assemble skill stacks dynamically. A skill that reads well in isolation but hides its assumptions about sibling skills is not composable.

## Design principles

### 1. Flat catalog, rich metadata

Deep category hierarchies create a classification tax. A flat set of coarse categories (core, memory, prompts, checklists, agents, meta, quality) combined with free-form tags provides both browsability and searchability. Tags are cheaper to maintain than tree nodes.

### 2. Bundles cross categories

A bundle is a curated collection of skills from any category that solves a recognizable domain scenario. Bundles are not a third category axis — they are a convenience grouping. A skill can belong to zero, one, or multiple bundles.

### 3. Composability sections in skill bodies

The SKILL.md body should contain:
- **Works with** — complementary skills to activate alongside this one
- **Conflicts with** — skills whose guidance may contradict this one
- **Depends on** — prerequisite skills that must be loaded first

These sections are advisory, not enforced. An agent uses them to build coherent stacks, not to satisfy a dependency resolver.

### 4. Platform portability

Skills should be written harness-agnostic where possible. When a skill uses tool-specific capabilities (Claude Code subagents, Codex workers, Cursor chat), the platform constraint is declared in the skill entry's `platforms` field and the skill body notes the variant behavior.

### 5. Token budget awareness

Frequently-loaded skills cost context on every conversation. Composability metadata should be compact — a few lines, not a paragraph. Cross-references use short skill names that match the registry entry. Full explanation lives in the referenced skill, not duplicated inline.

### 6. Registry as the discovery contract

`registry/skills.json` is the source of truth for discovery. Each entry carries:
- `tags[]` — searchable keywords
- `bundle` — bundle membership (optional)
- `platforms[]` — supported agent harnesses (optional, omit if universal)

The registry is validated by `npm run validate` to catch broken references, missing fields, and stale entries.

### 7. Bundles are not runtime loaders

A bundle manifest (`registry/bundles.json`) is a documentation artifact, not an activation script. The agent reads it to suggest relevant skills when it detects the task domain. Vibe Coding OS is runtime-frozen (ADR 0002): no bundle loader, no daemon, no engine.

## Relationship to other features

| Feature | Relationship |
|---|---|
| Plugin Bundle System | Bundles are the unit of domain grouping; composability metadata makes bundles coherent. |
| Multi-Platform Skill Adapters | Platform portability is a composability dimension; adapters document how each harness loads skills. |
| Skill Catalog | The catalog is the user-facing discovery surface; composability metadata feeds the catalog index. |
| Skill Format Standards | Composability sections (Works with, Conflicts with, Depends on) are part of the SKILL.md format. |

## Future considerations

- A composability validation script that checks cross-references in Works with / Conflicts with sections against registry entries.
- Bundle-level tags that inherit to member skills for simplified discovery queries.
- A lightweight skill graph that agents can query for "what skills activate before/after this one."
