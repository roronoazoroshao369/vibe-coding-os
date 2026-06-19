# Gemini CLI Adapter

Use `GEMINI.md` as the main instruction file, or copy `AGENTS.md` if no project-specific Gemini file exists. Reference command prompts from `commands/` and attach relevant `skills/*/*/SKILL.md` files when needed.

## Quick setup

- Copy or symlink the repository-level `AGENTS.md` into the project root as `GEMINI.md`, or paste `CLAUDE.md` content into your Gemini context file.
- Reference workflow commands from `commands/`, especially `vibe-spec`, `vibe-plan`, `vibe-implement`, `vibe-review`, `vibe-memory`, and `vibe-merge`.
- Attach skill files from `skills/core`, `skills/memory`, and `skills/prompts` when the task needs a focused procedure.
- Copy templates from `templates/` into normal project files when you need persistent specs, plans, reviews, tasks, or memory notes.

### Install snippet

```bash
git clone https://github.com/roronoazoroshao369/vibe-coding-os ~/vibe-coding-os
cd ~/your-project
cp ~/vibe-coding-os/AGENTS.md ./GEMINI.md   # or paste CLAUDE.md content into your Gemini context file
```

Gemini CLI loads instruction context at session start; point it at the copied file and reference `commands/` and `skills/` by path as needed.

Validate the framework checkout and inspect the helper CLI:

```bash
cd ~/vibe-coding-os
node scripts/vibe-cli.mjs help
node scripts/vibe-cli.mjs doctor
npm run validate
```

## Multi-agent workflow guardrails

### Agent ownership

When using Gemini for multi-turn workflows, give each task explicit file/module responsibility. State editable files, read-only context, and shared files reserved for the main session.

### Handoff format

Ask Gemini sessions to finish with `Context`, `Files touched`, `Decisions`, `Risks`, and `Verification`.

### Parallelization rules

Use Gemini in parallel only when write scopes are separated. Do not delegate a blocking critical-path task if the main session cannot make progress until that result returns.

### Review gates

Reviewer sessions must check correctness, scope, attribution, and tests before recommending approval.

### Conflict handling

If Gemini outputs conflict, the main session remains responsible for comparing handoffs, resolving incompatible assumptions, integrating edits, and running final verification.

## Tool-specific notes

- Gemini CLI: pass role, ownership, handoff format, and verification expectations directly in the prompt.
- Codex delegated agents/workers: use disjoint worker ownership and review worker changes before integration.
- Cursor manual chat workflows: use separate chats manually and paste the structured handoff back into the main chat.

## Daily workflow

1. Start with `vibe-spec` for any task where requirements, acceptance criteria, or edge cases matter.
2. Use `vibe-plan` to convert the accepted spec into a small file-oriented plan.
3. Run `vibe-implement` while keeping edits narrow and checking the plan against the actual codebase.
4. Use `vibe-review` before considering the task complete, with blockers listed before suggestions.
5. Capture durable decisions with `vibe-memory` when the session teaches something future agents should reuse.
6. Finish with `vibe-merge` to confirm scope, validation, attribution, and follow-ups are ready.

## Skill usage

- Choose `skills/core` for the operating mode: clarify first, spec-first development, plan-driven execution, TDD, review-before-merge, verification, bootstrap, or upstream intelligence.
- Choose `skills/memory` when retrieving context, writing project memory, summarizing a session, or filtering private data out of notes.
- Choose `skills/prompts` for lightweight behavior nudges such as avoiding overengineering, asking when confused, or applying concise coding guardrails.
- Do not load every skill by default. Pick the smallest set that matches the current phase so the Gemini context stays focused.

## Validation

- Run `npm run validate` after changing repository structure, registries, adapters, commands, templates, skills, or references.
- Run `npm run validate:references` when the only changes are under `references/` or reference registries and you want the narrower reference check.
- If validation cannot run, record the exact command and limitation in the session summary and final response.

## Gotchas

- Gemini CLI loads instruction context at session start; if you change `GEMINI.md` or `AGENTS.md`, restart the session.
- Large prompt bundles can crowd out code context. Prefer one workflow command plus one or two relevant skills over a full framework dump.
- Keep generated specs, plans, and memory notes in project files when they must survive beyond the chat.
- Do not paste upstream docs or third-party prompt packs into Gemini unless attribution and license decisions are already recorded.

## Skill format convention

Skills used with Gemini CLI follow the Vibe Coding OS SKILL.md format with these Gemini-specific conventions:

- **Session-start loading**: Gemini CLI loads instruction context at session start. Reference skill paths in `GEMINI.md` or paste skill content into the initial context. Skill content loaded mid-session must be explicitly provided.
- **Multi-turn sessions**: Gemini supports multi-turn conversational workflows. Skills designed for Gemini should work across multiple turns, with each turn referencing the skill's guidance rather than reloading it.
- **Action verbs**: Use Gemini-compatible verbs: "read", "write", "update", "verify", "run", "check", "analyze". Avoid verbs tied to specific tool APIs.
- **Context budget**: Gemini context is shared between instructions, skills, and conversation history. Skills should be compact and linked rather than fully embedded when possible.
- **GEMINI.md integration**: Add "Load `skills/...` for task X" directives in `GEMINI.md` so Gemini discovers relevant skills at session initialization.

Skills that are Gemini-specific should list `platforms: ["gemini"]` in their registry entry. Universal skills omit platforms or use `["*"]`.

## Example session

For a non-trivial bug fix, ask Gemini to run this flow:

1. Apply `vibe-spec` with `skills/core/clarify-before-code/SKILL.md` to define the failing behavior, expected behavior, and acceptance criteria.
2. Apply `vibe-plan` with `skills/core/plan-driven-execution/SKILL.md` to identify the likely files, tests, and rollback point.
3. Run `vibe-implement` with the smallest relevant implementation skill.
4. Apply `vibe-review` with `skills/core/review-before-merge/SKILL.md`.
5. Run the project checks plus `npm run validate` if framework files changed.
6. Apply `vibe-memory` and `vibe-merge` to record decisions and confirm readiness.
