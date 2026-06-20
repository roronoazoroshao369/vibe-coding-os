# Command: docs-author

> Create a new skill, command, or template following Vibe Coding OS conventions.

## Usage

```bash
# Copy the template
cp templates/doc-skeleton.md skills/core/<name>/SKILL.md

# Edit the placeholders (search for {{}} to find them)
# Then run validation
node scripts/validate-skill-quality.mjs
```

## Sections checklist

- [ ] Purpose (required)
- [ ] When to use (required, with do-NOT-use exclusions)
- [ ] Workflow (required, with at least one example)
- [ ] Outputs (required)
- [ ] Failure modes (required, ≥ 3 entries)
- [ ] Cross-references (recommended)
- [ ] Verification checklist (recommended)

## See also

- `skills/core/docs-author/SKILL.md` — full skill
- `templates/doc-skeleton.md` — fillable template
