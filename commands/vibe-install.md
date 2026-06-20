# Command: install-skill

> Install a skill from the Vibe Coding OS registry into your project.

## Usage

```bash
# List available skills
node scripts/install-skill.mjs --list

# Install to current directory
node scripts/install-skill.mjs <skill-name>

# Preview without installing
node scripts/install-skill.mjs <skill-name> --dry-run

# Install to specific target
node scripts/install-skill.mjs <skill-name> --target=/path/to/project

# Overwrite existing
node scripts/install-skill.mjs <skill-name> --force
```

## Example

```bash
$ node scripts/install-skill.mjs docs-author
✓ Installed:
  Name:        docs-author
  Description: Five-section structure convention for authoring skills...
  Source:      skills/core/docs-author/SKILL.md
  Installed to: skills/core/docs-author/SKILL.md
```

## See also

- `skills/core/install-skill/SKILL.md` — full skill
- `scripts/install-skill.mjs` — source
