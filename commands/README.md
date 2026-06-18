# Commands

Commands are copy-paste friendly prompt entrypoints for common Vibe Coding OS workflows. In tools that support slash commands, they usually appear as `/vibe-*`; otherwise, open the matching `commands/*.md` file and paste or reference it in your assistant session.

## What this layer is

- Reusable workflow prompts for actions such as spec writing, planning, debugging, review, reference audits, memory capture, and quality gates.
- A thin onboarding surface over deeper skills and templates.
- Markdown-first: no runtime is required to use a command.

## When to use it

Use a command when you want the assistant to perform a named workflow from start to finish, for example:

- `vibe-spec` for turning intent into a spec.
- `vibe-plan` for turning a spec into an implementation plan.
- `vibe-debug` or `vibe-diagnose` for systematic bug work.
- `vibe-review` or `vibe-self-review` before handoff.
- `vibe-reference-*` when auditing or adding upstream inspiration.

If you only need background guidance, load a skill instead. If you need a fill-in artifact shape, use a template.

## How to pick a good command

1. Match the command name to your current phase: `spec`, `plan`, `tasks`, `implement`, `review`, `merge`.
2. Prefer the narrowest command that fits the job.
3. Read the first section of the command before using it; confirm required inputs and outputs.
4. If several commands apply, start with the one that reduces uncertainty first, such as `vibe-grill-me`, `vibe-brainstorm`, or `vibe-code-context`.
5. For contributor work, check related skills/templates linked inside the command.

## Common anti-patterns

- Running an implementation command before the spec or plan is clear.
- Pasting several commands at once and asking the assistant to do everything in one pass.
- Treating a command as a guarantee instead of checking its output.
- Using a broad command when a checklist or template would be enough.
- Adding a new command that duplicates an existing workflow with only wording changes.

## Validation commands

Run from the Vibe Coding OS repo:

```bash
npm run validate:repo
npm run validate:traceability
npm run validate
```

Use `npm run validate:all` before release or broad command catalog changes.

## How to add a new command

1. Confirm no existing `commands/vibe-*.md` already covers the workflow.
2. Create `commands/vibe-<short-action>.md`.
3. Include: purpose, when to use, required inputs, step-by-step workflow, outputs, validation/checklist.
4. Link any related skills in `skills/` and templates in `templates/`.
5. Add or update the registry entry in `registry/prompts.json` if the command should be discoverable.
6. Run validation:

```bash
npm run validate:traceability
npm run validate
```
