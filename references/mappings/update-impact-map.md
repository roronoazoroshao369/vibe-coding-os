# Update Impact Map

Use this document to decide which local files to inspect when a tracked reference changes.

## Decision process

1. Identify the source id in `references/index.json`.
2. Read the source doc and changelog.
3. Review the source's `features` and `local_targets` arrays.
4. Read the matching feature docs under `references/features/`.
5. Inspect local targets before editing.
6. Update only files that benefit from the upstream change.
7. Record audit findings in the source changelog.
8. Run `npm run validate:references` and then `npm run validate` when broader repo structure changed.

## Common update paths

- Spec or planning ideas usually affect `templates/spec-template.md`, `templates/plan-template.md`, `skills/core/spec-first-development/SKILL.md`, and `commands/vibe-spec.md`.
- Memory ideas usually affect `skills/memory/*`, `templates/memory-template.md`, and `commands/vibe-memory.md`.
- Skill orchestration ideas usually affect `registry/skills.json`, `skills/core/vibe-bootstrap/SKILL.md`, `CLAUDE.md`, and `AGENTS.md`.
- Multi-agent ideas usually affect `skills/agents/*` and adapter docs.
- Testing ideas usually affect `skills/core/test-driven-development/SKILL.md`, command prompts, and task templates.
- Review ideas usually affect `skills/core/review-before-merge/SKILL.md`, `skills/core/verification-before-done/SKILL.md`, and `templates/review-template.md`.

## Safety rules

- If the upstream change is mostly implementation-specific, do not import it unless Vibe Coding OS has a matching local need.
- If the license is not verified, treat the source as inspiration only.
- If a local target no longer exists, update `references/index.json` before validation can pass.
- If an upstream idea creates scope creep, record it as a possible future investigation instead of changing the kernel.
