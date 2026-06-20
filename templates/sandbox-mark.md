---
title: Sandbox Marker Reference
type: template
name: sandbox-mark
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: engineering
tags:
  - database
status: stable
---

# Sandbox Marker Reference

> Use this template when adding sandbox markers to new skills.
> See `skills/core/sandbox-marker/SKILL.md` for the full convention.

## Quick Reference

### Frontmatter Form

```yaml
---
name: <skill-name>
sandbox:
  level: <trusted|read-only|isolated>
  external_content: true|false
  content_sources:
    - "<source pattern>"
  isolation: <comma-separated policies>
---
```

### Inline Form (Body)

```
[SANDBOX:level=<level>]
[SANDBOX:external_content=<true|false>]
[SANDBOX:sources=<url or pattern>]
```

## Decision Tree

```
Does the skill load content from outside the repo?
├── No → No marker needed
└── Yes
    ├── Does it fetch from a fixed allowlist of domains?
    │   └── Yes → level=read-only
    └── Does it install arbitrary marketplace content?
        └── Yes → level=isolated
    └── Only reads files in this repo?
        └── Yes → level=trusted
```

## Validation Rules

| Rule | Failure |
|------|---------|
| Skill with `external_content: true` MUST have `sandbox:` block | Gate FAIL |
| `level` must be one of: `trusted`, `read-only`, `isolated` | Gate FAIL |
| `content_sources` must be a list | Gate FAIL |
| If `level=isolated`, must declare `isolation:` policy | Gate FAIL |

## Maintenance

- Review existing markers quarterly
- Update isolation policies when new threat model emerges
- Coordinate with `validate-injection.mjs` for prompt-sourced content
