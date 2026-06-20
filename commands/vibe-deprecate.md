# Command: deprecate-skill

> Properly deprecate a skill (mark, log, redirect — don't delete).

## Usage

```bash
# Mark a skill as deprecated
node scripts/deprecate-skill.mjs mark <skill-name> "<reason>" <replacement>

# Generate deprecation notice file
node scripts/deprecate-skill.mjs notice <skill-name>

# List all deprecations
node scripts/deprecate-skill.mjs list

# Check if a skill is deprecated
node scripts/deprecate-skill.mjs check <skill-name>
```

## Workflow

1. `mark` — adds entry to `registry/deprecation-tracker.json`, updates frontmatter
2. `notice` — generates `docs/deprecations/DEP-XXX.md`
3. Commit both, announce in release notes
4. After sunset date (default 30 days), physically remove the skill

## See also

- `skills/core/deprecate-skill/SKILL.md` — full skill
- `templates/deprecation-notice-template.md` — canonical template
- `scripts/deprecate-skill.mjs` — source
