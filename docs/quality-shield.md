# Quality Shield

Quality Shield is the portable, markdown-first quality discipline layer for Vibe Coding OS. It raises the floor for coding agents by making intent, context, verification, self-review, and final reporting explicit before agents claim work is done.

It is **not** the future Quality Engine. Quality Shield is the human-readable protocol and reusable content. The Quality Engine is the future/advanced orchestration layer that can select, run, aggregate, and report quality gates more automatically.

## Scope

Quality Shield covers:

- **Pre-edit intent:** clarify goal, acceptance criteria, non-goals, risk, and verification plan.
- **Context grounding:** inspect local files, tests, patterns, constraints, and repo map before changing code.
- **Minimal implementation discipline:** prefer the smallest correct diff; avoid unrelated cleanup and new dependencies.
- **Verification honesty:** report commands as passed, failed, or not run with reason.
- **Self-review:** audit the diff before final response.
- **Evaluation and scorecards:** compare baseline vs Quality Shield behavior using qualitative scenarios and simple scorecards.

Out of scope for Quality Shield:

- Runtime orchestration expansion.
- Central registries beyond the existing command/skill/template inventories.
- Automated model scoring services or remote telemetry.
- Replacing project test, lint, typecheck, or CI commands.

## Quality Shield vs Quality Engine

- **Quality Shield:** portable docs, skills, commands, templates, and lightweight validation scripts. Works in any adapter that can read markdown instructions.
- **Quality Engine:** structured runner/reporting layer for selecting and executing quality gates. Existing Quality Engine docs and scripts are useful prototypes/foundations, but Quality Shield should remain usable without them.
- **Boundary rule:** use Quality Shield first. Add engine automation only when the markdown protocol is stable and the runtime boundary remains optional.

## Deliverable audit map

### v1.7 Quality Shield deliverables

- **Universal Code Quality Rubric**
  - Skill: [`skills/prompts/quality-rubric/SKILL.md`](../skills/prompts/quality-rubric/SKILL.md)
  - Command: [`commands/vibe-quality-rubric.md`](../commands/vibe-quality-rubric.md)
  - Template: [`templates/quality-rubric.md`](../templates/quality-rubric.md)

- **Quality Execution Contract**
  - Skill: [`skills/core/quality-execution-contract/SKILL.md`](../skills/core/quality-execution-contract/SKILL.md)
  - Command: [`commands/vibe-quality-gate.md`](../commands/vibe-quality-gate.md)
  - Template: [`templates/quality-contract.md`](../templates/quality-contract.md)

- **Self-Review Before Response**
  - Skill: [`skills/core/self-review-before-response/SKILL.md`](../skills/core/self-review-before-response/SKILL.md)
  - Command: [`commands/vibe-self-review.md`](../commands/vibe-self-review.md)
  - Template: [`templates/self-review-checklist.md`](../templates/self-review-checklist.md)

- **Code Context Pack**
  - Skill: [`skills/core/code-context-pack/SKILL.md`](../skills/core/code-context-pack/SKILL.md)
  - Command: [`commands/vibe-code-context.md`](../commands/vibe-code-context.md)
  - Template: [`templates/code-context-pack-template.md`](../templates/code-context-pack-template.md)

- **Compact AGENTS.md Template**
  - Skill: [`skills/templates/agents-md-compact/SKILL.md`](../skills/templates/agents-md-compact/SKILL.md)
  - Command: [`commands/vibe-agents-md.md`](../commands/vibe-agents-md.md)
  - Template: [`templates/agents-md-compact.md`](../templates/agents-md-compact.md)

- **Pattern Library / Repo Map Starter**
  - Skill: [`skills/repo-map-concept/SKILL.md`](../skills/repo-map-concept/SKILL.md)
  - Status: concept skill exists; no separate template file is present in this audit.

- **Quality Diff Audit Script**
  - Script: [`scripts/validate-quality-diff.mjs`](../scripts/validate-quality-diff.mjs)
  - Package script: `npm run validate:quality-diff`

- **Quality Elevation evaluation scenarios**
  - Skill: [`skills/quality-evaluation-scenarios/SKILL.md`](../skills/quality-evaluation-scenarios/SKILL.md)
  - Doc: [`docs/quality-elevation-eval.md`](quality-elevation-eval.md)

- **Quality Scorecard**
  - Templates: [`templates/quality-scorecard.md`](../templates/quality-scorecard.md), [`templates/quality-scorecard-session.md`](../templates/quality-scorecard-session.md)
  - Scripts: [`scripts/quality-scorecard.mjs`](../scripts/quality-scorecard.mjs), [`scripts/quality-scorecard-report.mjs`](../scripts/quality-scorecard-report.mjs)

### Adjacent Expert Mode and Smart Adapt assets

These assets extend Quality Shield but are not the core shield itself:

- Expert review: [`skills/core/adversarial-code-review/SKILL.md`](../skills/core/adversarial-code-review/SKILL.md), [`skills/prompts/critique-pass/SKILL.md`](../skills/prompts/critique-pass/SKILL.md), [`skills/agents/writer-critic-pair/SKILL.md`](../skills/agents/writer-critic-pair/SKILL.md)
- Task-specific quality packs: `skills/checklists/*-quality/SKILL.md` and `commands/vibe-quality-*.md`
- **Expert Mode guide:** [`docs/expert-mode.md`](expert-mode.md) — escalation pathways, adversarial review, critique pass, quality packs, Writer-Critic Pair, and Quality Council
- **Smart Adapt guide:** [`docs/smart-adapt.md`](smart-adapt.md) — model weakness memory, adaptive prompt selection, scorecards, lessons learned, and quality-elevation examples
- Smart Adapt assets: [`skills/core/model-weakness-memory/SKILL.md`](../skills/core/model-weakness-memory/SKILL.md), [`skills/core/adaptive-prompt-selection/SKILL.md`](../skills/core/adaptive-prompt-selection/SKILL.md), [`skills/core/lessons-learned-db/SKILL.md`](../skills/core/lessons-learned-db/SKILL.md)

### Quality Engine foundation assets

These are related to future/advanced engine orchestration, not required for basic Quality Shield use:

- Guide: [`docs/quality-engine-guide.md`](quality-engine-guide.md)
- Skill: [`skills/core/quality-engine/SKILL.md`](../skills/core/quality-engine/SKILL.md)
- Command: [`commands/vibe-quality-engine.md`](../commands/vibe-quality-engine.md)
- Scripts: [`scripts/quality-engine.mjs`](../scripts/quality-engine.mjs), [`scripts/quality-engine-report.mjs`](../scripts/quality-engine-report.mjs)
- Schemas/templates: [`schemas/quality-engine-config.json`](../schemas/quality-engine-config.json), [`schemas/quality-gate-manifest.json`](../schemas/quality-gate-manifest.json), [`templates/quality-engine-config.json`](../templates/quality-engine-config.json), [`templates/quality-gate-manifest.json`](../templates/quality-gate-manifest.json)
- Telemetry: [`docs/quality-telemetry-guide.md`](quality-telemetry-guide.md), [`commands/vibe-quality-telemetry.md`](../commands/vibe-quality-telemetry.md), [`skills/core/quality-telemetry/SKILL.md`](../skills/core/quality-telemetry/SKILL.md)

## Recommended workflow

1. Start with the Quality Rubric.
2. Fill the Quality Execution Contract for non-trivial coding work.
3. Build a Code Context Pack when touching unfamiliar or multi-file areas.
4. Implement the smallest correct change.
5. Run project verification and, when useful, `npm run validate:quality-diff`.
6. Run Self-Review Before Response.
7. Final response must list what changed, evidence, and any unverified risks.

For a copy-paste version of this workflow, see [`docs/quality-shield-workflow.md`](quality-shield-workflow.md).

## CI/CD integration

For pull requests, use Quality Shield as the human-readable discipline layer and `npm run validate:all` as the blocking repository guard. CI can also generate Quality Engine summaries and optional redacted telemetry for reviewer evidence.

- Integration guide: [`docs/quality-guard-integration.md`](quality-guard-integration.md)
- CI/CD example: [`examples/cicd-integration/README.md`](../examples/cicd-integration/README.md)
- Filled 26/26 sample summary: [`examples/cicd-integration/ci-quality-summary-sample.md`](../examples/cicd-integration/ci-quality-summary-sample.md)

## Escalating to Expert Mode

When the standard Quality Shield workflow is not enough — security-sensitive changes, complex migrations, low confidence in tests, or a strong desire to avoid rubber-stamping — escalate to **Expert Mode** (v1.8.0):

- Run an **[Adversarial Code Review](expert-mode.md#1-adversarial-code-review)** before merge or release.
- Use the **[Critique Pass Protocol](expert-mode.md#2-critique-pass-protocol)** for a structured writer-then-critic review.
- Apply a **[task-specific quality pack](expert-mode.md#3-task-specific-quality-packs)** for API endpoints, database migrations, auth, frontend state, or async jobs.
- Activate the **[Writer-Critic Pair](expert-mode.md#4-writer-critic-pair)** or **Quality Council** multi-agent patterns for high-stakes work.

Expert Mode is markdown-first, uses the same portable skills and commands as Quality Shield, and does not require runtime expansion. See the full guide at [`docs/expert-mode.md`](expert-mode.md).

## Adapter usage

Quality Shield is adapter-agnostic. Claude Code, Codex, Cursor, Gemini, and similar tools can use it by reading the relevant `AGENTS.md`/`CLAUDE.md` instructions plus the linked skills and templates. No runtime setup is required.
