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

## Reference Intelligence Layer

- Before using upstream inspiration, check `references/index.json`.
- Read the relevant source doc and feature mapping before changing local skills, commands, or templates.
- Update the source changelog when auditing upstream changes.
- Never copy large upstream content or vendor code without license review and an explicit decision.
- Keep attribution clean in `ATTRIBUTIONS.md`, `NOTICE.md`, registries, and reference docs when external material is imported or closely adapted.
- Run `npm run validate:references` after changing reference files, or `npm run validate` for broader repository validation.
- Use `npm run references:clone` for local upstream audit clones, but never stage or commit cloned upstream source trees under `references/upstreams/`.
- Before adopting any upstream, follow `docs/UPSTREAM_ADOPTION_POLICY.md`: classify the source (adapt-skill/command/template/doc/rule, adapter-only, runtime-local, reject-runtime, inspiration-only, blocked-license) and pass the 7-point engine adoption gate. Default to portable adaptation; never vendor engines.
- Respect the layer boundary in `docs/workflows/core-vs-optional-runtime.md`: Core (skills/commands/templates/docs/references, zero deps) is the identity; Runtime (`runtime/*.mjs`) is opt-in and frozen-scope. Do not move Core work into Runtime or expand Runtime without an explicit decision.
## Superpowers-inspired workflow discipline

For non-trivial software tasks, use the adapted workflow in `docs/workflows/superpowers-inspired-workflow.md`. Check the relevant local skills before coding, especially brainstorming/clarification, spec-first development, writing/executing plans, TDD, review, verification, and finishing-branch skills. Prefer design or spec approval before implementation when the work changes behavior, spans multiple files, or contains meaningful risk. Use TDD or a targeted regression check for behavior changes. Verify before claiming completion, and use review plus finish-branch rituals before merge or PR handoff.

## Real Engineering Skills Layer

- Use `skills/core/grill-user-before-building/SKILL.md` or `commands/vibe-grill-me.md` for ambiguous tasks before implementation.
- Use `CONTEXT.md` and `skills/core/shared-domain-language/SKILL.md` before large changes that affect project terminology or workflow meaning.
- Create ADRs with `templates/adr-template.md` for important design decisions; do not create fake ADRs for decisions not made.
- Use `skills/core/prd-from-context/SKILL.md` and `skills/core/issue-slicing/SKILL.md` for non-trivial product or multi-slice work.
- Use TDD for behavior changes and `skills/core/disciplined-diagnosis/SKILL.md` for bugs.
- Use `skills/memory/agent-handoff/SKILL.md` when context must survive an agent or session switch.
- Run validation before finishing, especially `npm run validate:references` for reference changes and `npm run validate` for broader repo changes.
- Never copy upstream content blindly; use `mattpocock/skills` as inspiration only and preserve attribution.

## Spec-Driven Development Layer

For non-trivial work, use the spec-driven layer adapted from `github/spec-kit`:

- Follow the lifecycle: constitution → specify → plan → tasks → implement.
- Consult `CONSTITUTION.md` (or create one with `commands/vibe-constitution.md`) so decisions respect project principles.
- Apply what-before-how: agree user-visible behavior and observable acceptance criteria before choosing technology. Keep technical decisions in the plan, not the spec.
- Do NOT begin implementation before the implementation-readiness gate clears: the spec, plan, and tasks must each pass their checkpoint (`skills/core/checkpoint-validation/SKILL.md`).
- Decompose plans into ordered tasks with explicit dependencies, parallel markers, and test-first sequencing (`skills/core/task-breakdown-from-plan/SKILL.md`, `skills/core/dependency-aware-task-ordering/SKILL.md`).
- Record assumptions explicitly in the spec rather than guessing; list open questions that would materially change the work.
- For existing systems, use brownfield enhancement (`skills/core/brownfield-spec-enhancement/SKILL.md`): characterize current behavior with tests before changing it.
- The Specify CLI is not required and upstream command names are not mandatory; use the local `vibe-*` commands.
- Canonical guidance: `docs/workflows/spec-driven-development.md`, `docs/specs/README.md`.

### Ghi chú tiếng Việt

Với việc không tầm thường, dùng lớp spec-driven: constitution → specify → plan → tasks → implement. Làm rõ "cái gì" trước "làm thế nào", ghi assumptions, và KHÔNG code trước khi qua cổng sẵn sàng (spec/plan/tasks đều đạt checkpoint). Không bắt buộc Specify CLI.

## Persistent Context Layer

- Summarize sessions when context should survive an agent/session switch; prefer concise observations and summaries over raw transcripts.
- Avoid storing secrets, credentials, private keys, tokens, unnecessary personal data, or sensitive raw logs in memory.
- Retrieve context progressively: search/index first, inspect summaries, then fetch or inject only task-relevant details.
- Cite memory entries when possible using observation IDs, source files, session summaries, or handoff notes.
- Run privacy exclusion before session capture, compression, retrieval, context injection, or handoff.
- Treat `thedotmack/claude-mem` as inspiration only: do not copy hook scripts, install it as a hard dependency, or clone its worker/database/viewer architecture.

## Ghi chú tiếng Việt

Khi dùng bộ nhớ, hãy tóm tắt ngắn gọn, lọc bí mật trước, tìm kiếm theo từng lớp, và trích dẫn observation/source khi dựa vào ký ức cũ.

