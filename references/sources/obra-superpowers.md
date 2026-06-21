# Reference: obra/superpowers

## Metadata

- Repo: https://github.com/obra/superpowers
- Owner: obra
- Name: superpowers
- Category: agentic-skills-framework
- Status: tracked
- Import mode: inspiration/adaptation
- License: MIT, verified from upstream `LICENSE` during the 2026-06-06 local clone audit
- Last checked: 2026-06-06
- Last known commit: 6fd4507659784c351abbd2bc264c7162cfd386dc

## Why this repo matters

`obra/superpowers` is a mature example of treating coding-agent behavior as a set of composable skills plus mandatory workflow habits. It is useful to Vibe Coding OS because it makes agent discipline explicit: brainstorm first, isolate risky work, write plans, use tests, request and receive review, verify before completion, and finish branches deliberately. It also shows how one methodology can be packaged for several agent harnesses without making the core ideas depend on one tool.

## Key concepts

- **Composable skills:** Small operating procedures can be combined into a larger development loop.
- **Mandatory workflow discipline:** Certain phases should not be skipped for non-trivial work, especially clarification, planning, verification, and review.
- **Branch isolation:** Worktrees or isolated branches reduce risk when tasks are parallel, experimental, or conflict-prone.
- **Evidence-driven development:** Tests, debugging experiments, review feedback, and final verification are part of the workflow, not afterthoughts.
- **Skill authoring as methodology:** Skills need a consistent format, triggering guidance, failure modes, and verification criteria.
- **Multi-harness packaging:** The same behavior can be surfaced through Claude Code, Codex, Cursor, Gemini CLI, OpenCode, and related tools.

## Features to study

| Upstream feature | Local Vibe Coding OS equivalent |
| --- | --- |
| brainstorming | `skills/core/brainstorming/SKILL.md`, aligned with `skills/core/clarify-before-code/SKILL.md`, surfaced by `commands/vibe-brainstorm.md` |
| using-git-worktrees | `skills/core/using-git-worktrees/SKILL.md`, `commands/vibe-worktree.md` |
| writing-plans | `skills/core/writing-plans/SKILL.md`, aligned with `skills/core/plan-driven-execution/SKILL.md`, surfaced by `commands/vibe-write-plan.md` |
| executing-plans | `skills/core/executing-plans/SKILL.md`, aligned with `skills/core/plan-driven-execution/SKILL.md`, surfaced by `commands/vibe-execute-plan.md` |
| subagent-driven-development | `skills/core/subagent-driven-development/SKILL.md`, agent role skills under `skills/agents/`, `commands/vibe-subagents.md` |
| test-driven-development | Existing `skills/core/test-driven-development/SKILL.md`, `commands/vibe-implement.md` |
| requesting-code-review | `skills/core/requesting-code-review/SKILL.md`, `commands/vibe-request-review.md` |
| receiving-code-review | `skills/core/receiving-code-review/SKILL.md`, `commands/vibe-receive-review.md` |
| finishing-a-development-branch | `skills/core/finishing-a-development-branch/SKILL.md`, `commands/vibe-finish-branch.md`, related to `commands/vibe-merge.md` |
| systematic-debugging | `skills/core/systematic-debugging/SKILL.md`, `commands/vibe-debug.md` |
| verification-before-done | `skills/core/verification-before-done/SKILL.md`, surfaced by `commands/vibe-verify.md` |
| writing-skills | `skills/meta/write-reusable-skill/SKILL.md`, `commands/vibe-write-skill.md` |
| using-superpowers | `skills/meta/using-vibe-coding-os/SKILL.md`, `docs/workflows/superpowers-inspired-workflow.md`, `commands/vibe-init.md` |

## Local mapping

This reference primarily affects local workflow documentation, core skills, meta skills, command prompts, registries, and AI-agent instructions. It should not directly change application code. Existing Vibe Coding OS skills remain canonical where they already cover the same behavior; newly created skills make the Superpowers-style phases addressable by name while preserving local wording and repository conventions.

## Upstream structure notes

The upstream repository includes a root README, MIT license, multiple agent-harness plugin directories, scripts, tests, docs, and a skill library. The audited skill names include brainstorming, worktree usage, plan writing/execution, subagent development, TDD, review request/receipt, branch finishing, debugging, verification before completion, skill writing, and using the system. Vibe Coding OS tracks those as methodology features rather than importing their files.

## Integration strategy

- Track upstream metadata and audit results in the Reference Intelligence Layer.
- Adapt concepts into original Vibe Coding OS skills and concise command prompts.
- Preserve local aliases so existing users can keep using `clarify-before-code`, `plan-driven-execution`, `review-before-merge`, and `verification-before-done`.
- Index new artifacts in registries and mapping docs for AI-friendly discovery.
- Keep multi-harness guidance generic and portable.
- Validate structure with `npm run validate:references` and `npm run validate`.

## Update watchlist

- New or renamed upstream skills.
- Changes to mandatory workflow ordering.
- Plugin metadata changes for Claude Code, Codex, Cursor, Gemini CLI, OpenCode, or other harnesses.
- Any upstream license, notice, or attribution change.
- New testing, debugging, review, or branch-finishing practices worth adapting.

## Do not copy

Do not vendor the upstream repository, copy upstream skill text, paste large README sections, or import scripts/tests/assets without a separate license and attribution decision. Use short factual metadata and original summaries only.

## Last audit notes

On 2026-06-06, a shallow local clone was created under ignored `references/upstreams/obra-superpowers` using `npm run references:clone -- --source obra-superpowers`. The audit verified the MIT license, confirmed last known commit `6fd4507659784c351abbd2bc264c7162cfd386dc`, reviewed the README headings, inspected plugin directories, and listed the upstream skill files. Local integration created original skills, commands, workflow docs, mappings, registry entries, and attribution/notice updates without vendoring upstream content.
