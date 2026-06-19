# Skills

Skills are reusable operating procedures for disciplined AI-assisted software work. Each skill teaches the assistant how to handle a recurring workflow, safeguard, role, or quality check.

## What this layer is

- Skill files live at `skills/<category>/<skill-name>/SKILL.md`.
- Categories include `core`, `memory`, `meta`, `agents`, `prompts`, `checklists`, and other focused groups.
- Skills are guidance, not automation: they shape how the assistant thinks and acts.
- Markdown-first: no runtime is required to use a skill.

## When to use it

Use a skill when the task needs a repeatable method, for example:

- Clarifying ambiguous intent before building.
- Writing specs, plans, tasks, or acceptance criteria.
- Debugging with disciplined diagnosis.
- Fixing bugs with TDD-anchored bug-fix-lifecycle.
- Running TDD, review, verification, or branch-finishing rituals.
- Applying Quality Shield skills such as `quality-rubric`, `quality-execution-contract`, `code-context-pack`, `self-review-before-response`, and `quality-evaluation-scenarios`.
- Capturing memory or preparing an agent handoff.
- Applying a domain checklist such as API, auth, frontend state, async job, or DB migration quality.

Use a command when you want a direct prompt entrypoint. Use a template when you need a concrete artifact format.

Quality Shield's canonical guide and deliverable audit map lives at [`docs/quality-shield.md`](../docs/quality-shield.md).

## How to pick a good skill

1. Start with the task type: planning, implementation, debugging, review, memory, orchestration, or quality checklist.
2. Prefer `skills/core/` for general engineering workflow.
3. Use `skills/checklists/` when the change touches a specific risk area.
4. Use `skills/agents/` when delegating a role such as architect, implementer, tester, or reviewer.
5. Read the skill's Purpose and When to use sections before loading it.
6. If unsure, pick the smallest skill that addresses the current decision or failure mode.

## Common anti-patterns

- Loading too many skills and overwhelming the context window.
- Using a specialized checklist for unrelated work.
- Treating a skill as a script that replaces human judgment.
- Creating a skill for a one-off example or personal preference.
- Duplicating an existing skill instead of improving or linking it.
- Omitting inputs, outputs, or failure modes from a new skill.

## Validation commands

Run from the Vibe Coding OS repo:

```bash
npm run validate:repo
npm run validate:traceability
npm run validate
```

For release-level confidence, run:

```bash
npm run validate:all
```

## How to add a new skill

1. Confirm the workflow is repeated, valuable, and not already covered.
2. Choose one primary category.
3. Create `skills/<category>/<new-skill>/SKILL.md`.
4. Include: purpose, when to use, inputs, workflow, outputs, failure modes, verification checklist.
5. Link related commands or templates when useful.
6. Add or update the entry in `registry/skills.json` if the skill should be discoverable.
7. Run validation:

```bash
npm run validate:traceability
npm run validate
```

See `docs/CONTRIBUTING-SKILLS.md` for the fuller contribution checklist.
