# AGENTS.md

> Compact agent instructions for [PROJECT NAME].
> Last updated: [DATE]. Update this file when validation commands, project layout, or constraints change.

## Project overview

[2–3 sentences: what the project does, what language/framework, and the primary quality standard.]

## Validation commands

Run these before claiming completion:

- `npm run validate` — full repository validation.
- `npm run validate:references` — reference integrity only.
- `npm run validate:traceability` — broken links and orphan inventory.
- [Add or remove commands as applicable to this project.]

## Project layout

- `src/` — [purpose].
- `tests/` — [purpose].
- `docs/` — [purpose].
- `templates/` — [purpose].
- `skills/` — [purpose].
- `commands/` — [purpose].
- `registry/` — [purpose].
- [Adjust to actual top-level directories.]

## Architecture constraints

- [e.g., "Core layer (skills/, commands/, templates/, docs/) must have zero runtime dependencies."]
- [e.g., "Runtime layer (runtime/*.mjs) is opt-in and frozen-scope."]
- [e.g., "All new commands must register in registry/prompts.json."]
- [List only constraints that actually apply.]

## Do not edit

- `package-lock.json` — generated, do not hand-edit.
- `registry/` files — modify only through designated commands.
- [e.g., "vendor/ — third-party vendored code."]
- [e.g., "Generated config files listed in .gitignore."]
- [List only paths that genuinely should not be touched.]

## Approved dependencies

Before adding a new dependency:

- [e.g., "Only MIT or BSD-licensed packages."]
- [e.g., "No runtime dependencies in core layer."]
- [e.g., "Record the dependency decision in an ADR."]
- [State the actual policy.]

## Quality gate checklist

Before marking work complete:

- [ ] Validation passes (`npm run validate`).
- [ ] No secrets, tokens, or credentials in code or memory.
- [ ] Attribution is clean for any upstream or third-party material.
- [ ] Protected paths were not modified.
- [ ] New files are registered in the appropriate index or registry.
- [ ] [Add project-specific gates.]

## Response format

- Prefer concise bullet lists over prose.
- Run validation and report results before claiming done.
- If a check cannot run, state the limitation clearly.
- Do not invent requirements or assume unstated constraints.

## Notes

- [Any other project-specific guidance the agent should know.]
- [Cross-references to CONTEXT.md, CONSTITUTION.md, or other project docs.]
