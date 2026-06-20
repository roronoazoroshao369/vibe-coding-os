---
name: install-skill
version: 1.0.0
introduced_in: v2.14.0
last_reviewed: 2026-06-20
category: core
tags: [install, registry, packaging, deployment, npm]
description: Install skills, commands, or templates from the registry into a target directory. Supports dry-run, force, and list modes.
---

# Skill: Install Skill

## Purpose

Pick a skill from the curated registry and copy it into your project (or any target directory) so you can use it without manually copying from the source repo. This is the lightweight alternative to npm-packaging — install individual artifacts without taking on the whole framework.

The script is **npm-installed but artifact-agnostic**: it reads `registry/skills.json` and copies the file. No transitive dependencies, no runtime, just file copy.

## When to use

- Trying a single skill without installing the whole framework
- Copying specific skills into a private project
- Auditing what would be installed (dry-run)
- Building a custom Vibe Coding OS variant with hand-picked skills

Do NOT use when:
- You want all skills (just clone the repo)
- You need programmatic invocation at runtime (skills are markdown, you read them as files)

## Inputs

- Skill name from `registry/skills.json`
- Target directory (default: current directory)
- Flags: `--dry-run`, `--force`, `--list`

## Workflow

1. **List available skills**: `node scripts/install-skill.mjs --list`
2. **Dry-run to preview**: `node scripts/install-skill.mjs <skill-name> --dry-run`
3. **Install for real**: `node scripts/install-skill.mjs <skill-name>` (installs to cwd)
4. **Or install to a target**: `node scripts/install-skill.mjs <skill-name> --target=/path/to/project`
5. **Verify**: open the installed file and check it matches your expectations
6. **Use**: invoke the skill via your AI tool's slash command or paste the content

### Example: List skills in core category

```bash
node scripts/install-skill.mjs --list | grep "core"
```

### Example: Preview installation

```bash
node scripts/install-skill.mjs docs-author --dry-run
```

### Example: Install into a private project

```bash
cd ~/myproject
node /path/to/vibe-coding-os/scripts/install-skill.mjs docs-author --target=.
ls skills/core/docs-author/SKILL.md
```

### Example: Force overwrite

```bash
node scripts/install-skill.mjs docs-author --force
```

## Outputs

- The skill file copied to `<target>/<skill-path>`
- Stdout summary: name, description, source path, installed path
- Exit code 0 on success, 1 on failure

## Failure modes

1. **Skill not found** — name doesn't match `registry/skills.json`; use `--list` to see all
2. **Source file missing** — registry entry exists but file is gone (stale registry); report bug
3. **Already exists** — destination file is there; use `--force` to overwrite
4. **Permission denied** — write target directory; chmod or change target
5. **Bad target path** — `--target=/nonexistent` will create dirs but fail if parent dir is unwritable
6. **Category mismatch** — registry category field may be stale; the script uses `path`, not `category`

## Verification checklist

- [ ] `--list` shows the expected number of skills (currently 149)
- [ ] `--dry-run` doesn't modify filesystem
- [ ] Real install creates file at expected path
- [ ] Installed file content matches source byte-for-byte
- [ ] `--force` overwrites existing file
- [ ] `--target=<dir>` writes to correct location
- [ ] Non-existent skill name returns clear error
- [ ] Exit code 0 on success, 1 on failure

## Cross-references

- See `registry/skills.json` — the source of truth for available skills
- See `skills/core/skill-content-search/SKILL.md` — find skills before installing
- See `docs/SKILL-PACKS.md` — how skills are organized into packs
- See `scripts/install-skill.mjs` — source code

## Review cadence

- Quarterly: ensure all registry entries have existing source files
- On registry change: update script if schema changes
