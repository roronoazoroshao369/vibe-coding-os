# Plugin Bundle System — Design Rationale

## Context

Upstream reference: `sickn33/antigravity-awesome-skills` (41k★, 1,595+ SKILL.md playbooks). The upstream organizes its massive skill library into plugin bundles — domain-organized collections that simplify discovery and activation. This document captures the design rationale for Vibe Coding OS's adaptation.

## Status

Inspiration only. No upstream bundle format, taxonomy, or activation mechanism is copied. The design below is an original adaptation for Vibe Coding OS's runtime-frozen, docs/prompts/skills architecture (see ADR 0002).

## Why bundles instead of just categories?

Categories are filesystem-level groupings. They answer "what kind of thing is this?" (core, memory, prompt). Bundles answer "when would I use this?" (web-dev, security-review). A skill lives in exactly one category but can belong to multiple bundles. The two axes are orthogonal and serve different discovery needs.

## Design decisions

### Decision 1: Bundles are discovery documents, not runtime loaders

Vibe Coding OS is runtime-frozen (ADR 0002). No skill activates itself, no daemon watches file changes, no engine resolves dependencies. A bundle is a JSON manifest that an agent reads to decide which skills to suggest or load. This keeps the system simple, auditable, and dependency-free.

**Alternatives considered:**
- **NPM-style package bundles**: Requires a package manager and runtime. Rejected as violating ADR 0002.
- **Directory-based bundles**: Symlinks or directory groupings. Rejected because cross-category bundles would require symlinks that become stale.
- **Inline bundle tags only**: No separate manifest. Rejected because bundles need their own description and member list that aggregate information not available in individual skill entries.

### Decision 2: Bundles cross category boundaries

A "web-dev" bundle includes skills from checklists (api-endpoint-quality), core (acceptance-criteria), and agents (adversarial-code-review). This cross-category grouping is the primary value of bundles — they map to real workflows, not to filesystem layout.

### Decision 3: Skill membership in multiple bundles

A skill like `auth-quality` could belong to both `web-dev` and `security-review` bundles. This is intentional. A skill that serves multiple domains should be findable through all of them.

### Decision 4: Bundle size guidance (3-12 skills)

A bundle with fewer than 3 skills is not a useful grouping — it is just a single skill or pair. A bundle with more than 12 skills becomes a category substitute and loses its focused value. The 3-12 range keeps bundles focused enough to be actionable.

### Decision 5: No dependency resolution

Bundles have a `dependencies[]` field for advisory cross-references, but there is no dependency resolver. An agent composing bundles reads the dependencies field as documentation and decides whether to load the depended-on bundle. This avoids the complexity spiral of transitive dependency resolution.

## Relationship to other subsystems

| Subsystem | Relationship |
|---|---|
| Skill Catalog | Bundles are one axis of catalog organization; the catalog also uses categories, tags, and composability metadata. |
| Bundle manifest (`registry/bundles.json`) | The manifest is the single source of truth. Skills reference bundles by name. |
| `vibe-init --bundle` | The init command provides explicit bundle activation. This is a convenience, not a requirement — bundles can be activated manually. |
| Composability metadata | Works with / Conflicts with / Depends on sections in skill bodies complement bundle groupings with skill-level relationship data. |
| Multi-platform adapters | Bundle activation works the same across platforms — read JSON, load relevant skills. No platform-specific bundle logic. |

## Future considerations

- A `vibe-bundle` command that lists bundles, describes their contents, and optionally activates a selection.
- Bundle embedding in templates so common project scaffolds auto-suggest relevant bundles.
- A bundle health check that validates all member skills exist, have current metadata, and are not themselves deprecated.
- Community-contributed bundles stored alongside core bundles in the registry.

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| Bundle bloat (skills added without review) | PR review for bundle changes; periodic bundle audit. |
| Stale bundles (referencing renamed/deleted skills) | Registry validation checks bundle skill references. |
| Bundle overload (too many bundles to choose from) | Keep bundle count small (under 20); group rarely-used bundles as "community." |
| Category-bundle confusion | Clear documentation that categories are structural and bundles are behavioral. |
