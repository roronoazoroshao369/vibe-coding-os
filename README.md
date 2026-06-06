# Vibe Coding OS

**Vibe Coding OS** is a Claude/Codex-friendly skill framework for one person who wants to move fast with AI coding assistants without giving up engineering discipline.

It is not a wrapper, product, or agent runtime. It is a normalized operating system for AI-assisted software work: reusable skills, command prompts, templates, and registries that help a human and an AI assistant repeatedly turn intent into reliable code. Its specific aim is to raise the quality of vibe coding with Claude Code and similar agents by selectively studying, merging, and re-normalizing the best reusable workflow ideas from leading public skill and agent-workflow repositories without blindly copying or vendoring them.

## Why this exists

Modern coding agents are powerful, but they are easiest to misuse when the task is vague, the context is stale, or success is declared before verification. Vibe Coding OS makes the desired behavior explicit:

- clarify uncertainty before coding;
- specify non-trivial work before implementation;
- plan in small reversible steps;
- write tests or checks that prove the change;
- review the result before merge;
- preserve useful project memory without leaking private data;
- keep attribution clean when learning from the wider AI coding ecosystem.

## Philosophy

1. **Human intent stays sovereign.** The assistant may propose, but it must not invent requirements or silently expand scope.
2. **Small correct changes beat grand rewrites.** Prefer the smallest useful step that can be reviewed and verified.
3. **Specs are thinking tools, not bureaucracy.** Use just enough structure to remove ambiguity.
4. **Verification is part of done.** Never claim success without tests, validation, or an explicit limitation.
5. **Memory should be useful, current, and safe.** Store durable decisions and context, not secrets or irrelevant transcripts.
6. **Attribution is a first-class artifact.** Ideas may be inspired by public work, but imported content must be tracked before it is used.

## Default workflow

Use this loop for substantial work:

```text
Intent → Spec → Plan → Implement → Test → Review → Memory → Merge
```

- **Intent:** capture what the human wants and why.
- **Spec:** define desired behavior, constraints, non-goals, and acceptance criteria.
- **Plan:** break the change into reviewable tasks and verification steps.
- **Implement:** make focused edits that match the plan.
- **Test:** run the smallest meaningful checks first, then broader validation.
- **Review:** inspect the diff for correctness, simplicity, security, and maintainability.
- **Memory:** record durable decisions, gotchas, and follow-ups.
- **Merge:** ship only after verification status is clear.

## Installation and manual usage

This repository is intentionally dependency-light. To validate the framework structure:

```bash
npm run validate
```

Manual usage options:

1. Copy the relevant `CLAUDE.md` or `AGENTS.md` instructions into your agent environment.
2. Invoke a command prompt from `commands/` such as `vibe-spec.md` or `vibe-review.md`.
3. Attach one or more skills from `skills/` when you want a specific behavior.
4. Use templates from `templates/` to create specs, plans, tasks, reviews, and memory notes.

## Skill system

A skill is a portable operating procedure stored as `SKILL.md`. Every skill uses the same sections:

- Title
- Purpose
- When to use
- Inputs
- Workflow
- Outputs
- Failure modes
- Verification checklist

The registry at `registry/skills.json` lists the local skills, paths, categories, and descriptions. Skills are designed to be composable. For example, a difficult feature might combine:

- `clarify-before-code`
- `spec-first-development`
- `plan-driven-execution`
- `test-driven-development`
- `verification-before-done`
- `session-summarizer`

## Command system

Commands in `commands/` are short reusable prompts. They are meant to be pasted into Claude Code, Codex, Cursor, or another assistant to trigger a disciplined workflow phase.

The initial command set covers:

- initialization
- specification
- planning
- implementation
- review
- memory updates
- merge readiness
- repository diagnostics

The registry at `registry/prompts.json` tracks these command prompts.

## Adapters

Adapters document how to use the framework in specific environments:

- `adapters/claude-code/`
- `adapters/codex/`
- `adapters/cursor/`

They are intentionally lightweight in v0.1 and will become more concrete as usage patterns stabilize.

## Reference Intelligence Layer

Vibe Coding OS tracks upstream inspirations through a markdown-first Reference Intelligence Layer in `references/`. The layer combines source docs, feature maps, local file mappings, audit changelogs, and `references/index.json` so future agents can understand what to study without copying or vendoring external content.

Use it before adapting upstream ideas: read the source entry, inspect the linked feature and mapping docs, update the local changelog when auditing upstream, and keep attribution decisions explicit. Reference validation is available with `npm run validate:references`, and the main validation script includes it.

For hands-on audits, `npm run references:clone` creates or updates shallow ignored working copies under `references/upstreams/<owner>-<repo>`. With no flags, the command processes every source; `npm run references:clone -- --all` makes that explicit. To refresh one source, pass either its source id or owner/repo name, for example `npm run references:clone -- --source obra-superpowers` or `npm run references:clone -- --source github/spec-kit`. The clone command retries transient network failures, continues processing remaining sources after a failure, prints a final `cloned` / `updated` / `failed` / `skipped` summary with local paths, and exits non-zero if any source failed. Treat those clones as disposable research material only; durable local knowledge belongs in `references/changelogs/`, source docs, feature mappings, skills, commands, templates, and attribution files. The detailed loop lives in `references/upstream-audit-workflow.md`.

## Roadmap

### v0.1 kernel

- Establish the normalized repository structure.
- Provide core, memory, prompt, and agent skills.
- Provide reusable command prompts and templates.
- Add structural validation.
- Add source and attribution registries without vendoring external code.

### Near-term

- Add examples of complete workflows.
- Add a repeatable reference intake scorecard for deciding which upstream ideas are worth adapting.
- Add stronger schema validation for registries.
- Add import review process for external ideas.
- Add project memory conventions and redaction tests.
- Add adapter-specific install snippets.

### Later

- Add optional CLI helpers.
- Add compatibility tests for major agent tools.
- Add curated skill packs for common stacks.
- Add governance rules for external contributions and source intake.

## Attribution and license policy

Vibe Coding OS is original content. It is inspired by patterns in the wider AI coding workflow community, including repositories listed in `registry/sources.json`, but it does not vendor their code or documentation.

Before importing external material:

1. verify the source license;
2. record the source in `registry/sources.json`;
3. document the imported idea or artifact in `ATTRIBUTIONS.md`;
4. preserve notices required by the upstream license;
5. prefer adaptation and normalization over copying.

See `NOTICE.md` and `ATTRIBUTIONS.md` for the current policy and placeholders.
