---
description: "Full step-by-step migration guide for converting a skill from no-examples to with-examples."
---

# Skill Example Walkthrough

## Goal

Migrate a skill from no-examples to having 3 concrete worked examples attached.

## Steps

1. **Audit**: Pick a skill without examples. Open its `SKILL.md`. Identify the 3 most common use cases (trivial, standard, advanced).
2. **Draft examples**: For each, write:
   - 1-sentence scenario
   - CLI invocation or code block
   - Expected output (pass/fail, artifact path)
   - Failure modes
3. **Add frontmatter**: Extend the skill's frontmatter with an `examples:` list.
4. **Add Examples section**: Append `## Examples` to the skill's `SKILL.md`.
5. **Optional externalize**: If examples are >30 lines each, move to `examples/<skill-name>/<id>.md`.
6. **Test**: Run `npm run validate:skill-examples` to ensure the skill is in compliance.
7. **Commit**: Use a conventional commit like `docs(skill): add 3 worked examples to <skill-name>`.

## Anti-patterns

- **Don't put examples in a separate file with no link from SKILL.md.** Discoverability suffers.
- **Don't show only success cases.** Include at least one failure mode per example.
- **Don't write trivial-only examples.** The 3-tier (trivial/standard/advanced) is the canonical structure.

## See also

- `templates/skill-example-template.md` — the canonical structure
- `templates/skill-example-before.md` — anti-pattern
- `templates/skill-example-after.md` — target pattern
