# Registry

The registry layer is the machine-readable index for discoverable Vibe Coding OS artifacts. It helps tools, docs, and future agents find commands, skills, agents, sources, and policy metadata without scanning every file manually.

## What this layer is

- `skills.json` indexes reusable skills.
- `prompts.json` indexes command prompts in `commands/`.
- `agents.json` indexes role-oriented agent skills.
- `sources.json` records tracked upstream inspiration and attribution policy.
- `runtime-freeze-allowlist.json` documents the frozen optional-runtime surface allowed by ADR 0002.

Quality Shield is discoverable through existing registries rather than a separate registry: `registry/skills.json` covers its skills (`quality-rubric`, `quality-execution-contract`, `code-context-pack`, `self-review-before-response`, `quality-evaluation-scenarios`, `agents-md-compact`), and `registry/prompts.json` covers its commands (`vibe-quality-rubric`, `vibe-quality-gate`, `vibe-code-context`, `vibe-self-review`, `vibe-agents-md`). Template files are linked from [`docs/quality-shield.md`](../docs/quality-shield.md).

Registries describe artifacts; they should not replace the artifact files themselves.

## When to use it

Use registry files when you need to:

- Make a new skill, command, or agent discoverable.
- Check whether an artifact already exists before adding one.
- Validate that paths, names, and descriptions stay consistent.
- Track source attribution and import mode for upstream inspiration.
- Review runtime-freeze policy metadata without modifying runtime code.

## How to pick a good registry entry

1. Pick the registry that matches the artifact type.
2. Use stable, lowercase, hyphenated names that match file paths when possible.
3. Keep descriptions short: one sentence explaining what the artifact helps users do.
4. Ensure `path` points to an existing file.
5. For sources, record license, status, import mode, and notes honestly.
6. For runtime policy, do not expand the allowlist without an explicit ADR exception.

## Common anti-patterns

- Adding registry entries for files that do not exist.
- Renaming files without updating registry paths.
- Using marketing descriptions instead of practical descriptions.
- Marking external material as safe to adapt before license review.
- Treating `sources.json` as a substitute for `ATTRIBUTIONS.md` or `NOTICE.md` when close adaptation occurs.
- Expanding runtime registry/policy entries as a workaround around the runtime freeze.

## Validation commands

Run from the Vibe Coding OS repo:

```bash
npm run validate:repo
npm run validate:references
npm run validate:traceability
npm run validate:runtime-freeze
npm run validate
```

For broad registry or release work, run:

```bash
npm run validate:all
```

## How to add a new registry entry

1. Create or update the actual artifact first, such as a command, skill, agent skill, or source note.
2. Add the matching JSON object to the correct registry file.
3. Keep keys consistent with nearby entries.
4. Confirm the referenced path exists and the description is concise.
5. For upstream inspiration, also check `references/index.json`, `references/sources/`, `ATTRIBUTIONS.md`, and `NOTICE.md` requirements.
6. Run validation:

```bash
npm run validate:references
npm run validate:traceability
npm run validate
```

Do not modify `runtime/` for registry-only onboarding work.
