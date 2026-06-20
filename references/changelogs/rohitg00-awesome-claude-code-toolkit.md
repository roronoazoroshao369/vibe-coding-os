# Changelog: rohitg00/awesome-claude-code-toolkit

## 2026-06-20 — Initial adoption (v2.12.0)

**Audit date:** 2026-06-20
**Audit method:** Public README + repo tree inspection via GitHub API (no local clone; license is verifiable from upstream LICENSE file).
**Decision:** ADOPTED in inspiration mode.

### What we adopted

- **Hooks pack pattern** — declarative `.claude/settings.json` config for `PreToolUse`/`PostToolUse`/`UserPromptSubmit`/`Stop` hooks with matchers and guard rails.
- **Secure-coding rubric** — three-layer checklist (input validation / output encoding / identity & capability) mapped to OWASP Top 10.
- **Prompt architecture** — 7-section prompt template (Persona → Context → Constraints → Toolset → Output Schema → Examples → Anti-patterns).

### What we explicitly did NOT adopt

- **Bash installation scripts** (`install.sh`, `setup.sh`) — runtime installers are out of scope per ADR 0002.
- **Vendor binaries or compiled hooks** — pure markdown/JSON specs only.
- **The full awesome-list of community hooks** — we ship our own curated pack, not a meta-list.

### License verification

- **Upstream license:** Apache-2.0 (verified from `LICENSE` file at repo root).
- **Compatibility:** Apache-2.0 is compatible with our MIT/CC-BY licenses and permits derivative works with attribution.
- **Attribution location:** `ATTRIBUTIONS.md` (Apache-2.0 section), `NOTICE.md` (per-attribution notice).

### Risks noted

- Operational hooks are an evolving Claude Code feature; our hooks-pack skill documents the JSON schema as of Claude Code 2.x and flags unknown matchers as "consult upstream docs".
- The OWASP rubric maps to OWASP Top 10 2021; an OWASP Top 10 2025 update would require re-mapping.
- Prompt architecture is a recipe, not a checklist — quality depends on the implementer's discipline.

### Audit cadence

Re-audit this source **quarterly** (next: 2026-09-20) or when Claude Code ships a hooks schema breaking change.
