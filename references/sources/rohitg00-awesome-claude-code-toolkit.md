# Reference: rohitg00/awesome-claude-code-toolkit

## Metadata

- Repo: https://github.com/RohitG00/awesome-claude-code-toolkit
- Owner: RohitG00
- Name: awesome-claude-code-toolkit
- Category: claude-code-toolkit
- Status: tracked
- Import mode: inspiration/adaptation
- License: Apache-2.0
- Last checked: 2026-06-20
- **DASHBOARD generated**: 2026-06-20T02:00:00Z
- **3 NEW skills shipped** + 3 NEW commands + 3 NEW templates (1:1:1 mapping)

## Why this repo matters

`RohitG00/awesome-claude-code-toolkit` (Apache-2.0, 2.1k★) is a high-signal **operational Claude Code toolkit** that fills three gaps in our existing 136-skill catalog:

1. **Hooks pack** — A pattern for declaring event-driven `PreToolUse`/`PostToolUse`/`Stop` hooks in `settings.json` with explicit guard rails. We currently have no skill dedicated to authoring hooks.
2. **Secure-coding checklist** — OWASP-style checklist for Claude Code outputs (secrets, SSRF, SQLi, command injection, path traversal) that complements our `red-team-bypass`/`defensive-detection` work without overlap.
3. **Prompt architecture** — A structural recipe for multi-section prompts (Persona, Context, Constraints, Toolset, Output Schema, Examples, Anti-patterns) that generalizes the prompt lessons scattered across our `prompts/` skill layer.

The toolkit is structurally similar to Vibe Coding OS — a pure spec/prompt/hook framework — but emphasizes **operational hardening** where we emphasize **planning discipline**. The two systems share Apache-2.0/MIT permissive licensing and document every adapted concept with attribution.

## Key concepts to learn

- **Hooks pack** — Declarative JSON config under `.claude/settings.json`. Events: `PreToolUse`, `PostToolUse`, `UserPromptSubmit`, `Stop`. Matchers: tool name regex. Hooks run shell commands and short-circuit on non-zero exit.
- **Secure-coding rubric** — Three-layer checklist: (1) input validation at trust boundary, (2) output encoding at sink boundary, (3) identity + capability check at every privileged operation. Mapped to OWASP Top 10.
- **Prompt architecture** — 7-section prompt template: Persona → Context → Constraints → Toolset → Output Schema → Examples → Anti-patterns. Anti-patterns section is the load-bearing constraint — it blocks the most common failure modes.

## Local adoption plan

Adopt in **inspiration mode** (original wording, no copy):

- `skills/core/claude-code-hooks-pack/SKILL.md` — pattern for declaring `PreToolUse`/`PostToolUse` hooks with declarative guard rails. Original wording. Apache-2.0 attribution retained.
- `skills/core/secure-coding-checklist/SKILL.md` — OWASP-mapped three-layer checklist. Original wording. Apache-2.0 attribution retained.
- `skills/core/prompt-architecture/SKILL.md` — 7-section prompt template (Persona → Context → Constraints → Toolset → Output Schema → Examples → Anti-patterns). Original wording. Apache-2.0 attribution retained.

Each adopted skill ships a 1:1 command (`vibe-hooks-pack`, `vibe-secure-coding`, `vibe-prompt-architect`) and template (`hooks-pack-template`, `secure-coding-checklist-template`, `prompt-template-7-section`).

## DASHBOARD

<!-- DASHBOARD:START -->
| Metric | Value |
| --- | --- |
| New skills | 3 |
| New commands | 3 |
| New templates | 3 |
| Modified skills | 0 |
| Modified validators | 0 |
| License | Apache-2.0 |
| Source repo | https://github.com/RohitG00/awesome-claude-code-toolkit |
<!-- DASHBOARD:END -->
