# Expert Mode v2 — Cross-Tool Expert Mode Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Extend Expert Mode (v1.8.0) from Claude Code–only to all 8 adapters — Cline, Continue.dev, Aider, Windsurf, Claude Code, Codex, Cursor, Gemini. Each adapter gets integration files (rules, conventions, configs, flows) that wire up adversarial review, critique passes, quality packs, writer-critic pairs, and quality council.

**Architecture:** Expert Mode v2 adds adapter-specific instruction files (`.clinerules-*`, `.windsurfrules` sections, `CONVENTIONS.md` appendices, slash command configs, rule files) that reference the existing Expert Mode skills/commands. No new core skills or commands — just adapter wiring files + install snippets.

**Tech Stack:** Markdown, JSON (Continue config), Shell (install snippets), existing Expert Mode skills/commands from `skills/core/`, `skills/checklists/`, `skills/agents/`, `commands/`

---

## Task 1: Cline Expert Mode Rules

**Objective:** Create mode-specific `.clinerules-*` files wrapping Expert Mode patterns for Cline's architect/ask/code modes.

**Files:**
- Create: `adapters/cline/rules/.clinerules-architect`
- Create: `adapters/cline/rules/.clinerules-ask`
- Create: `adapters/cline/rules/.clinerules-code`
- Create: `adapters/cline/rules/vibe-expert-mode.md`
- Modify: `adapters/cline/README.md` — add Expert Mode section

**Step 1: Create `.clinerules-architect`**

Content: Architect mode rules for Expert Mode — spec-first, adversarial review triggering, quality council escalation when architecture decisions span multiple components.

Write to `adapters/cline/rules/.clinerules-architect`:

```markdown
# Vibe Coding OS — Expert Mode (Architect)
## When to escalate
- Architecture affects 2+ components → escalate to adversarial review.
- Security-sensitive or multi-team boundary → escalate to Quality Council.
- Migration plan with rollback needed → use db-migration-quality pack.

## Adversarial triggers (architect)
1. Challenge: "Is this the simplest architecture that solves the stated requirements?"
2. Challenge: "What happens when this design meets a constraint not in the spec?"
3. Before approving any architecture decision, check: `commands/vibe-red-team-review.md`
```

**Step 2: Create `.clinerules-ask`**

Content: Focused Q&A mode with Expert Mode escalation for ambiguous or high-risk questions.

**Step 3: Create `.clinerules-code`**

Content: Implementation mode with automatic quality pack selection and critique pass.

**Step 4: Create `vibe-expert-mode.md`**

Content: Comprehensive reference linking all Expert Mode components accessible from Cline.

**Step 5: Update `adapters/cline/README.md`**

Add "Expert Mode" section with install snippet and usage.

---

## Task 2: Continue.dev Expert Mode Slash Commands

**Objective:** Add Expert Mode slash commands to `config.example.json` and create `AGENTS.md` appendices.

**Files:**
- Modify: `adapters/continue/config.example.json` — add expert mode slash commands
- Create: `adapters/continue/rules/vibe-expert-mode.md` — Expert Mode reference
- Modify: `adapters/continue/README.md`

**Step 1: Update `config.example.json`**

Add slash commands:
- `/adversarial-review` — runs `vibe-red-team-review.md` workflow
- `/critique-pass` — runs `vibe-critique-pass.md` workflow
- `/quality-api` — runs API endpoint quality pack
- `/quality-migration` — runs DB migration quality pack
- `/quality-council` — triggers Quality Council pattern

**Step 2: Create Expert Mode reference**

**Step 3: Update README**

---

## Task 3: Aider Expert Mode Conventions

**Objective:** Add Expert Mode escalation to Aider's `CONVENTIONS.md` and create `.aider.conf.yml` quality profile.

**Files:**
- Create: `adapters/aider/CONVENTIONS.md` — Aider-specific Expert Mode conventions
- Create: `adapters/aider/.aider.conf.yml` — quality-enabled config profile
- Modify: `adapters/aider/README.md`

**Step 1: Create `CONVENTIONS.md`**

```markdown
# Expert Mode for Aider
## Architect mode review
Before `aider --architect`, run adversarial review checklist.
## Editor mode quality
After `aider --editor`, run critique pass on generated diff.
```

**Step 2: Create `.aider.conf.yml`**

```yaml
# Expert Mode quality profile
lint: true
test-cmd: npm run validate:all
```

**Step 3: Update README**

---

## Task 4: Windsurf Expert Mode Flows

**Objective:** Add Expert Mode flows and Cascade agent instructions to Windsurf adapter.

**Files:**
- Create: `adapters/windsurf/rules/vibe-expert-mode.md`
- Create: `adapters/windsurf/.windsurfrules` — with Expert Mode sections
- Modify: `adapters/windsurf/README.md`

**Step 1: Create `vibe-expert-mode.md`**

Cascade agent instructions for Expert Mode:

```markdown
# Expert Mode for Windsurf (Cascade)
## Flows
1. `Expert Review Flow` — adversarial code review via Cascade agent
2. `Quality Pack Flow` — domain-specific quality checklist execution
3. `Critique Pass Flow` — structured writer-then-critic review
```

**Step 2: Create `.windsurfrules`**

Rules file with `## Expert Mode` section.

**Step 3: Update README**

---

## Task 5: Update Core `docs/expert-mode.md`

**Objective:** Canonical Expert Mode guide gets cross-tool coverage.

**File:**
- Modify: `docs/expert-mode.md`

**Changes:**
- Add "Adapter Support" section after the intro
- For each adapter, add a subsection:
  - `### Cline` — link to `.clinerules-*` files, install snippet
  - `### Continue.dev` — link to slash commands, config
  - `### Aider` — link to `CONVENTIONS.md`, `.aider.conf.yml`
  - `### Windsurf` — link to `.windsurfrules`, Flows
  - `### Cursor` — existing rules files already work
  - `### Codex` — `AGENTS.md` Expert Mode section
  - `### Gemini` — `GEMINI.md` Expert Mode instructions
- Keep Claude Code as the primary reference

---

## Task 6: Documentation Hub + Discovery Sync

**Objective:** Wire the new Expert Mode v2 into docs hub, README, registry, and compatibility matrix.

**Files:**
- Modify: `docs/README.md` — add Expert Mode v2 section to docs hub
- Modify: `README.md` — update Expert Mode description for cross-tool
- Modify: `README.vi.md` — Vietnamese translation
- Modify: `adapters/compatibility-matrix.md` — add Expert Mode column
- Modify: `registry/skills.json` — register any new skills
- Modify: `registry/prompts.json` — register any new prompt commands

**Step by step per file.**

---

## Task 7: Validate + Release

**Objective:** Ensure everything passes validation and create release.

**Steps:**
1. Run `npm run validate:all` — expect 26/26 PASS
2. Squash commit with message: `feat: Expert Mode v2 — cross-tool adapter integration`
3. Push to main
4. Verify GitHub Actions summary includes Expert Mode v2
