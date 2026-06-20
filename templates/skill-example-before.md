---
description: "Example skill WITHOUT the per-skill examples convention (anti-pattern)."
---

# Skill Example (BEFORE)

This is an example of a skill that does NOT follow the per-skill examples convention. It has rich documentation but no concrete worked examples.

```yaml
---
skill: my-skill
---

# Skill: My Skill

## Purpose

Does X, Y, Z.

## When to use

When you need X.
```

**Problem**: Maintainers reading the skill have to mentally simulate usage. No concrete input/output. New adopters can copy-paste intent but not exact commands.
