---
description: "Example skill WITH the per-skill examples convention applied."
---

# Skill Example (AFTER)

This is an example of a skill that DOES follow the per-skill examples convention. It has rich documentation AND 3 concrete worked examples.

```yaml
---
skill: my-skill
examples:
  - id: trivial-usage
    difficulty: trivial
  - id: standard-usage
    difficulty: standard
  - id: advanced-usage
    difficulty: advanced
---

# Skill: My Skill

## Purpose

Does X, Y, Z.

## When to use

When you need X.

## Examples

### Trivial

[worked example 1]

### Standard

[worked example 2]

### Advanced

[worked example 3]
```

**Benefit**: Maintainers and adopters can copy-paste exact invocations. CI can run the examples as smoke tests. Documentation and code stay in sync.
