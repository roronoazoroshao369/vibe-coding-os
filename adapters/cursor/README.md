# Cursor Adapter

Use the README workflow and copy relevant command prompts into Cursor chat. Keep specs and plans in normal project files when the task is non-trivial. Use the memory templates for durable decisions and avoid storing secrets in prompts or notes.

See the [adapter compatibility matrix](../compatibility-matrix.md) for cross-tool setup details and limitations.
## Quick setup

- Keep the project README and any local Cursor rules aligned with the Vibe Coding OS workflow, but do not rely on Cursor to automatically read every framework file.
- Copy or link `AGENTS.md` for cross-agent repository instructions and `CLAUDE.md` only when the same project also uses Claude Code.
- Paste the relevant command prompt from `commands/` into Cursor chat for the current phase: `vibe-spec`, `vibe-plan`, `vibe-implement`, `vibe-review`, `vibe-memory`, or `vibe-merge`.
- Add only the needed `skills/*/*/SKILL.md` content to the chat context or file references.
- Use `templates/` to create durable specs, plans, reviews, task notes, memory notes, and upstream audit records inside the project.

### Install snippet

```bash
git clone https://github.com/roronoazoroshao369/vibe-coding-os ~/vibe-coding-os
cd ~/your-project
cp ~/vibe-coding-os/AGENTS.md ./.cursorrules
```

If your Cursor version and workspace use project rules, keep rules under `.cursor/rules/` instead:

```bash
cd ~/your-project
mkdir -p .cursor/rules
cp ~/vibe-coding-os/AGENTS.md .cursor/rules/vibe-coding-os.md
```

If `.cursorrules` or project rules already exist, merge the Vibe workflow guidance rather than overwriting project-specific conventions. Cursor context is manual: paste or reference one command, such as `commands/vibe-spec.md`, and one matching skill only when needed.

Validate the framework checkout when framework files change:

```bash
cd ~/vibe-coding-os
node scripts/vibe-cli.mjs doctor
npm run validate
```

## Daily workflow

1. Start a new chat or thread with `vibe-spec` and the smallest useful file context.
2. Move to `vibe-plan` after the spec is accepted, asking Cursor to name the files, risks, and checks it expects to touch.
3. Use `vibe-implement` with selected files in context rather than the whole repository when possible.
4. Use `vibe-review` in a separate pass so Cursor evaluates the diff instead of continuing to add scope.
5. Use `vibe-memory` to write concise durable notes from the session, with secrets and personal data removed.
6. Use `vibe-merge` to verify acceptance criteria, validation status, attribution, and follow-ups.

## Skill usage

- Pick from `skills/core` for the current workflow phase: clarify, specify, plan, implement, test, review, verify, bootstrap, or audit upstream intelligence.
- Pick from `skills/memory` when you need project context, a durable summary, or a privacy filter before saving notes.
- Pick from `skills/agents` when a task benefits from named perspectives such as architect, implementer, reviewer, or tester; paste the selected role into Cursor instead of all roles.
- Pick from `skills/prompts` for compact constraints like avoiding overengineering or asking clarifying questions before code.
- Keep Cursor context lean. The right command plus one matching skill is usually better than loading every command and skill at once.

## Validation

- Run `npm run validate` after framework-level changes to adapters, commands, skills, templates, registries, scripts, or repository structure.
- Run `npm run validate:references` for reference-only edits or when checking source notes, mappings, changelogs, and indexes.
- Run `npm run references:clone` when preparing an upstream audit that needs local clones; leave `references/upstreams/` uncommitted except for its placeholder documentation.
- Also run the target project checks that prove the actual application or package change works.

## Gotchas

- Cursor prompt and file context are explicit. If a command, skill, spec, or template is not attached or referenced, do not assume Cursor has used it.
- Very broad context can dilute the task. Prefer selected files, a short spec, and one workflow prompt.
- Cursor may continue implementing when you wanted review. Use separate messages for `vibe-review` and ask for blockers before edits.
- Store long-lived decisions in files, not only chat history, so later agents and teammates can inspect them.

## Example session

For a non-trivial refactor in Cursor:

1. Attach the current module files and run `vibe-spec` with `skills/core/spec-first-development/SKILL.md` to define behavior that must not change.
2. Create a plan from `templates/plan-template.md` using `vibe-plan`, including migration steps and tests.
3. Run `vibe-implement` with only the planned files in context, then refresh context after each meaningful diff.
4. Open a new review pass with `vibe-review` and optionally `skills/agents/reviewer-agent/SKILL.md`.
5. Run project tests and `npm run validate` if Vibe Coding OS files changed.
6. Use `vibe-memory` and `vibe-merge` to save durable lessons and confirm the refactor is ready to merge.
