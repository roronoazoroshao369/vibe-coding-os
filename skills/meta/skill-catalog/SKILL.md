---
name: skill-catalog
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: meta
tags:
  - meta
status: stable
---

# Skill: Skill Catalog — Organizing Skills for Discoverability

## Purpose

Structure a growing skill collection so agents and humans can find the right skill by domain, trigger, or capability without reading every file. Treat the catalog as a living index: it is only useful when it stays current, consistent, and keyword-rich.

## When to use

Use when adding a new skill near others of the same domain, reorganizing an existing skill collection that has grown past casual browsing, writing discovery queries against the registry, or auditing the skill catalog for gaps, overlaps, or dead entries.

## Inputs

Current skill inventory, registry structure, domain categories relevant to the project, existing tag conventions, bundle groupings, and the composability metadata of each skill.

## Core principle: catalog is a retrieval layer, not a taxonomy project

A catalog that requires a PhD in classification to update will fall out of date in a week. Design for quick additions, shallow hierarchies, and forgiving discovery:

1. **Tags over taxonomy.** A flat tag set is cheaper to maintain than a strict tree. Let the same skill wear multiple tags. Prefer tags that match actual search terms — "flaky", "migration", "security", "frontend", "api" — rather than abstract category codes.
2. **Categories as top-level buckets.** Use a small number of coarse categories (core, memory, prompts, checklists, agents, meta, templates, quality) that map to the filesystem layout. Do not let categories proliferate.
3. **Bundles as curated playlists.** A bundle gathers skills from any category that are commonly activated together for a domain scenario (web-dev, data-science, security-review). Bundles cross categories freely.
4. **Composability metadata is the glue.** Each skill entry should declare what it works with, conflicts with, and depends on. This lets an agent assemble a coherent skill stack without loading contradictory instructions.
5. **Search is textual before it is structural.** The description field — "when to use" — is a search anchor. Fill it with concrete symptom words, tool names, and error strings, not abstract labels.

## Workflow

1. Assign every skill to exactly one category. Use the existing `category` field in `registry/skills.json`. If a skill spans categories, pick the dominant one and add cross-reference tags.
2. Add tags to each skill entry. Use lower-kebab-case. Prefer tags that solve actual discovery problems: "database", "auth", "async", "tdd", "review", "bug", "security", "cli", "migration", "frontend", "api", "architecture", "quality", "memory", "orchestration", "prompt", "meta".
3. Group skills into bundles when three or more skills are commonly used together for a recognizable domain scenario. Add the bundle name to each skill's `bundle` field.
4. Record platform compatibility. If a skill works only on certain agent harnesses (Claude Code, Codex, Cursor, Gemini, Copilot, OpenCode), list them in the `platforms` field. If the skill is harness-agnostic, omit or set `platforms: ["*"]`.
5. Record composability in the SKILL.md body: a "Works with" section listing sibling skills, a "Conflicts with" section listing skills whose guidance may contradict, and a "Depends on" section for prerequisite skills.
6. Run registry validation after every catalog change. An inconsistent catalog is worse than no catalog.

## Tag conventions

| Domain | Recommended tags |
|---|---|
| Core workflow | `workflow`, `spec`, `plan`, `implement`, `review`, `verify`, `merge`, `bootstrap` |
| Quality | `quality`, `checklist`, `review`, `scan`, `security`, `lint`, `test` |
| Memory | `memory`, `context`, `handoff`, `session`, `privacy`, `retrieval` |
| Agent roles | `agent`, `architect`, `implementer`, `reviewer`, `tester`, `orchestrator` |
| Engineering discipline | `tdd`, `debug`, `refactor`, `architecture`, `guardrails`, `discipline` |
| Prompts | `prompt`, `behavior`, `nudge`, `guardrail`, `discipline` |
| Meta | `meta`, `template`, `workflow`, `catalog`, `bundle`, `skill-design` |

## Bundle conventions

A bundle entry in `registry/bundles.json` follows this shape:

```
{
  "name": "web-dev",
  "description": "Skills for full-stack web development: API, frontend state, DB migrations, auth, and review.",
  "skills": ["api-endpoint-quality", "frontend-state-quality", "db-migration-quality", "auth-quality", "adversarial-code-review"],
  "dependencies": [],
  "category": "domain"
}
```

Bundles are not runtime loaders. They are discovery groupings. An agent reading `registry/bundles.json` can suggest a bundle when it detects the task domain.

## Composability metadata in SKILL.md

Each skill body should contain these sections when relevant:

### Works with

List sibling skills that this skill complements. Example: "Works with `adversarial-code-review` — run after this checklist to catch security issues."

### Conflicts with

List skills whose guidance may contradict. Example: "Conflicts with `prototype-before-commitment` — this skill assumes production rigor, not exploration."

### Depends on

List prerequisite skills. Example: "Depends on `spec-first-development` — this skill assumes a spec exists."

## Outputs

A maintainable catalog with consistent tags, bundles, and composability metadata in every skill entry. Updated registry files, mapping docs, and validation passes.

## Failure modes

- Creating deep category hierarchies that make assignment a long debate.
- Adding tags nobody searches for.
- Letting bundles grow into grab-bags that lose thematic coherence.
- Forgetting to update the catalog when a skill is added, renamed, or removed.
- Storing composability metadata only in the registry and not in the skill body, so an agent reading a single skill misses the cross-references.
- Adding platform constraints that become stale as harness capabilities change.

## Verification checklist

- [ ] Each skill has exactly one category.
- [ ] Each skill has at least two tags (unless the skill is trivial).
- [ ] Bundles are documented if they exist.
- [ ] Composability sections exist in skill bodies where cross-references matter.
- [ ] Registry validation passes after catalog changes.
- [ ] Mapping docs are updated when new skills enter the catalog.

## Ghi chú tiếng Việt

Catalog là lớp tra cứu, không phải dự án phân loại học thuật. Dùng tag phẳng thay vì cây phân cấp sâu. Category là bucket thô (core, memory, prompts...). Bundle là danh sách kỹ năng theo tình huống (web-dev, security-review). Mỗi skill cần khai báo works-with, conflicts-with, depends-on trong phần thân. Tag theo từ khóa tìm kiếm thực tế, không theo mã phân loại trừu tượng.
