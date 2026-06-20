---
description: "Full step-by-step migration guide for converting a skill from no-examples to with-examples."
---

# Skill Example Walkthrough

## Goal

Migrate a skill from no-examples to having 3 concrete worked examples attached.

## Steps

1. **Audit**: Pick a skill without examples. Open its `SKILL.md`. Identify the 3 most common use cases.
2. **Draft examples**: For each, write scenario + invocation + expected output + failure modes.
3. **Add frontmatter**: Extend the skill's frontmatter with an `examples:` list.
4. **Add Examples section**: Append `## Examples` to the skill's `SKILL.md`.
5. **Test**: Run `npm run validate:skill-examples` to ensure compliance.

## Anti-patterns

- **Don't put examples in a separate file with no link from SKILL.md.** Discoverability suffers.
- **Don't show only success cases.** Include at least one failure mode per example.
