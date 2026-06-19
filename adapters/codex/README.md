# Codex Adapter

Use `AGENTS.md` as the primary coding-agent instruction file. Keep changes small, cite files in final responses when required by the environment, and run `npm run validate` after editing framework structure. Use skills as task-specific procedures rather than permanent hidden context.

## Multi-agent workflow guardrails

### Agent ownership

When spawning Codex delegated agents or workers, assign ownership by file/module and responsibility. Tell workers they are not alone in the codebase, must not revert edits made by others, and must accommodate concurrent changes.

### Handoff format

Require each delegated agent/worker to return `Context`, `Files touched`, `Decisions`, `Risks`, and `Verification`.

### Parallelization rules

Delegate in parallel only for sidecar work or implementation slices with disjoint write scopes. Do not delegate the immediate blocking critical-path task if the main rollout must wait for that exact result before doing anything useful.

### Review gates

Reviewer agents must check correctness, scope, attribution, and tests before approval. Verification agents should report exact commands and limitations.

### Conflict handling

If delegated outputs conflict, the main Codex agent owns integration. Review returned changes, preserve other agents' edits, decide the resolution, and rerun validation before committing.

### Tool-specific notes

- Claude Code subagents: map this workflow to bounded subagent prompts with explicit ownership and structured handoff requirements.
- Codex delegated agents/workers: workers should edit only owned files and list changed paths in the final answer.
- Cursor manual chat workflows: emulate delegation with one manual chat per write scope and paste each handoff into the main chat for integration.
## Quick setup

- Copy or symlink the repository-level `AGENTS.md` into the target project root so Codex can discover scoped instructions.
- Add more specific `AGENTS.md` files in subdirectories only when those areas need different conventions; the nearest scoped file should describe the local rules.
- Keep `CLAUDE.md` only if the same project also supports Claude Code. Codex should rely on `AGENTS.md` for agent instructions.
- Copy or reference command prompts from `commands/` for `vibe-spec`, `vibe-plan`, `vibe-implement`, `vibe-review`, `vibe-memory`, and `vibe-merge`.
- Reuse `templates/` for persistent project artifacts, and attach skill files from `skills/` only for the current task phase.

### Install snippet

```bash
git clone https://github.com/roronoazoroshao369/vibe-coding-os ~/vibe-coding-os
cd ~/your-project
cp ~/vibe-coding-os/AGENTS.md ./AGENTS.md
# or: ln -s ~/vibe-coding-os/AGENTS.md ./AGENTS.md
```

Start Codex from the target project and paste a focused workflow prompt:

```bash
cd ~/your-project
codex
```

```text
Follow ~/vibe-coding-os/commands/vibe-spec.md. Define goals, non-goals, constraints, edge cases, and acceptance criteria. Do not implement yet.
```

For planning, reference both the command and the relevant skill:

```text
Follow ~/vibe-coding-os/commands/vibe-plan.md and skills/core/plan-driven-execution/SKILL.md. Produce a file-oriented implementation plan with validation commands.
```

Validate the framework checkout when framework files change:

```bash
cd ~/vibe-coding-os
node scripts/vibe-cli.mjs doctor
npm run validate
```

## Daily workflow

1. Use `vibe-spec` to capture goals, non-goals, constraints, edge cases, and verification before editing.
2. Use `vibe-plan` to list concrete files or directories, ordered steps, risks, and checks.
3. Use `vibe-implement` to make minimal changes that match the plan and repository conventions.
4. Use `vibe-review` to inspect the diff for correctness, tests, security, maintainability, scope, and attribution.
5. Use `vibe-memory` to summarize decisions, commands run, changed files, unresolved questions, and next actions without secrets.
6. Use `vibe-merge` to confirm validation, merge readiness, and explicit limitations.

## Skill usage

- Use `skills/core` as the main process library for clarification, specs, plans, implementation discipline, review, verification, and upstream-aware work.
- Use `skills/memory` when context needs to be retrieved, durable memory needs to be written, or sensitive data needs to be removed from notes.
- Use `skills/agents` to separate architect, implementer, reviewer, and tester perspectives; in Codex, map these to explicit instructions or delegated sub-agent roles when the environment supports it.
- Use `skills/prompts` for short behavioral constraints that keep the work practical and scope-controlled.
- Treat skills as opt-in procedures. Do not bury all skill text in permanent hidden context because Codex performs better with task-relevant instructions.

## Validation

- Run `npm run validate` after modifying adapters, commands, skills, templates, registries, scripts, or broad repository structure.
- Run `npm run validate:references` after reference-only edits, especially source notes, feature mappings, changelogs, or reference indexes.
- Run `npm run references:clone` before an upstream audit when local source snapshots are needed; keep cloned source out of commits.
- Pair repository validation with any project-specific tests required by the actual code change.

## Gotchas

- Codex applies `AGENTS.md` by directory scope. A nested `AGENTS.md` can override root guidance for files beneath it, so inspect scoped instructions before editing.
- Final responses may need file citations, exact commands, and validation status depending on the surrounding Codex environment.
- Codex should not ask for interactive permissions in non-interactive runs; plan commands so they can run unattended.
- Keep skill usage explicit in the prompt or plan instead of assuming Codex has loaded every framework file.

## Skill format convention

Skills developed or adapted for Codex CLI follow the Vibe Coding OS SKILL.md format with these Codex-specific conventions:

- **File references**: Reference skill paths in `AGENTS.md` or paste skill content directly into the session prompt. Codex CLI does not auto-load skill files by default.
- **Worker delegation**: Skills may reference Codex delegated agents/workers for parallel work. When a skill references workers, include a `## Platform notes` section noting the worker ownership and handoff requirements.
- **Action verbs**: Prefer Codex-compatible verbs: "read", "write", "update", "run", "check". Avoid verbs that assume automatic subagent spawning.
- **Context loading**: Codex performs better with task-relevant instructions rather than every skill loaded into hidden context. Skills should include a clear trigger description so the agent knows when to activate them.
- **AGENTS.md integration**: Add skill references to `AGENTS.md` as "When X happens, read `skills/...`" directives so Codex discovers them by scope.

Skills that are Codex-specific should list `platforms: ["codex"]` in their registry entry. Universal skills omit platforms or use `["*"]`.

## Example session

For a non-trivial feature in a Codex run:

1. Read the applicable `AGENTS.md` files and inspect the relevant project structure.
2. Run `vibe-spec` with `skills/core/spec-first-development/SKILL.md` to create or update the feature spec.
3. Run `vibe-plan` with `skills/core/plan-driven-execution/SKILL.md`, listing files, tests, risks, and validation commands.
4. Run `vibe-implement`, optionally assigning `skills/agents/tester-agent/SKILL.md` or reviewer responsibilities if the environment supports agent delegation.
5. Run project tests, then `npm run validate` if Vibe Coding OS framework files changed.
6. Run `vibe-review`, `vibe-memory`, and `vibe-merge` before committing or opening a pull request.
