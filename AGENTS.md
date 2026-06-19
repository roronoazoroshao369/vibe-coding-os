# Agent Instructions for Vibe Coding OS

- Inspect the repository before changing files. Understand existing structure, registries, and conventions.
- Prefer small, correct, reviewable changes over broad rewrites.
- Do not invent requirements. If the request is ambiguous, ask a clarifying question or record an explicit assumption.
- For non-trivial coding, create or update a spec before implementation.
- Keep plans concrete: files to touch, steps to take, and checks to run.
- Run validation when possible, especially `npm run validate` for repository structure changes.
- Never claim success without verification. If a check cannot run, state the limitation clearly.
- Keep external attribution clean. Do not vendor third-party code, prompts, or docs unless license and attribution requirements are recorded.
- Do not place secrets, private credentials, or unnecessary personal data in repository memory or examples.

## Reference intelligence & attribution

For detailed workflow guidance (workflow layers, skills, commands, templates, memory, verification, and merge readiness), see [`CLAUDE.md`](CLAUDE.md) — the canonical Vibe Coding OS instruction file for AI coding agents.

When using upstream inspiration:
- Check `references/index.json` and read the relevant source doc and feature mapping first.
- Update the source changelog when auditing upstream changes.
- Never copy large upstream content or vendor code without license review and an explicit decision.
- Keep attribution clean in `ATTRIBUTIONS.md`, `NOTICE.md`, and all registries.
- Run `npm run validate:references` after changing reference files.
- After adding/renaming/removing a command/skill/template, run `npm run validate:traceability`.
- Use `npm run references:clone` for local upstream audit clones, but never stage or commit cloned source trees under `references/upstreams/`.
- Before adopting any upstream, follow `docs/UPSTREAM_ADOPTION_POLICY.md`.
- Respect the layer boundary in `docs/workflows/core-vs-optional-runtime.md`: Core is the identity; Runtime is opt-in and frozen-scope.

## Codex-specific notes

- Codex reads `AGENTS.md` as repository guidance. Use `CLAUDE.md` for tool-specific details not yet covered here.
- For setup, see [`adapters/codex/README.md`](adapters/codex/README.md).
