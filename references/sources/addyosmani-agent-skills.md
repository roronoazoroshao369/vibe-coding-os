# Reference: addyosmani/agent-skills

## Metadata

- Repo: https://github.com/addyosmani/agent-skills
- Owner: addyosmani
- Name: agent-skills
- Category: engineering-workflow
- Status: tracked
- Import mode: inspiration/adaptation
- License: MIT
- Last checked: 2026-06-20
- **DASHBOARD generated**: 2026-06-20T01:00:00Z
- **5 NEW skills shipped** + 7 NEW commands + 6 NEW templates + 2 NEW architectural artifacts + 1 NEW registry
- **3 existing skills enhanced** + 1 doc enhanced + 1 validator enhanced
- **Source quality**: 63.4k stars, MIT license, single-author (Addy Osmani), active maintenance

## Why this repo matters

`addyosmani/agent-skills` is a high-signal **plugin manifest** (`.claude-plugin/plugin.json` + `marketplace.json`) that bundles 24 production-grade skill categories for AI coding agents. The repo is structurally similar to Vibe Coding OS — a pure spec/prompt framework with no runtime engine, no installer, and no shell daemon. All deliverables are markdown + lightweight shell hooks. The two systems share a strong philosophical alignment (spec-first, TDD, anti-rationalization, multi-stage review) but emphasize different strengths.

**What Addy does better than Vibe:** tight `skill-anatomy` contract, in-flight review posture (doubt-driven), STRIDE threat-model workflow, observability "questions before signals" doctrine, orchestration anti-pattern catalog, plugin marketplace manifest format.

**What Vibe does better than Addy:** multi-source synthesis (20 inspiration sources vs Addy's single-author), domain-bundle composition, memory/agent-pack, CLI adapter matrix (Claude/Codex/Cursor/Gemini/Aider/Cline/Continue/Windsurf).

## Key concepts to learn

- **In-flight doubt posture** — `code-review-and-quality` reviews finished artifacts, `doubt-driven-development` challenges in-progress decisions. Anti-rationalization table dày hơn.
- **Loading Constraints** — explicit rule: "Do NOT add this skill to a persona's `skills:` frontmatter — personas do not invoke other personas." Anti-pattern catalog with concrete names.
- **STRIDE threat model** — Trust boundaries first, then 6-letter lens, then abuse cases alongside use cases.
- **Telemetry without a question is noise** — design process: 2-4 questions on-call will ask → each signal must answer one.
- **Vertical slice doctrine** — build 1 complete path DB→API→UI, test, commit, next. 5-step increment cycle: Implement→Test→Verify→Commit→Next.
- **95% confidence stop condition** — for clarification loops, single-question cadence with best-guess attached.
- **Plugin manifest format** — `.claude-plugin/plugin.json` + `marketplace.json` per schemastore spec enables installable bundle distribution.

## Features to study

| Feature | Why it matters | Local equivalent | Status | Target local files |
| --- | --- | --- | --- | --- |
| doubt-driven-development | In-flight posture challenge with Loading Constraints + anti-rationalization table | `skills/core/critique-pass-protocol/` (single-shot) | gap | skills/core/doubt-driven-development/SKILL.md; commands/vibe-doubt.md; references/features/doubt-driven-development.md |
| observability-and-instrumentation | "Questions before signals" framework + metric/log/trace trade-off table | `skills/core/quality-telemetry/` (metrics only) | gap | skills/core/observability-design/SKILL.md; commands/vibe-observability.md; templates/observability-plan-template.md |
| deprecation-and-migration | Compulsory vs Advisory classification, 5 pre-deprecation questions, sunset lifecycle | (none) | gap | skills/core/deprecation-migration/SKILL.md; commands/vibe-deprecate.md; commands/vibe-migrate.md; templates/deprecation-notice-template.md |
| security-and-hardening | Threat model first (trust boundaries → STRIDE → abuse cases) | `skills/checklists/auth-quality/` (review-only) | gap | skills/core/threat-model-driven-security/SKILL.md; commands/vibe-threat-model.md; templates/threat-model-template.md |
| source-driven-development | DETECT→FETCH→IMPLEMENT→CITE for framework code | `skills/core/grill-with-docs/` (challenges with docs) | gap | NOT ADOPTED in v2.11.0 (out of scope; tracked for future) |
| performance-optimization (CWV) | Core Web Vitals target table + MEASURE→IDENTIFY→FIX→VERIFY→GUARD 5-step loop | `skills/core/quality-engine/` | enhance | skills/core/quality-engine/SKILL.md; templates/performance-budget-template.md; commands/vibe-perf-budget.md |
| interview-me (95% loop) | Stop condition (≥95% confidence) + single-question cadence | `skills/core/grill-user-before-building/` | enhance | skills/core/grill-user-before-building/SKILL.md; references/features/clarification-loop.md |
| incremental-implementation (vertical slices) | Build 1 complete path DB→API→UI, test, commit, next | `skills/core/task-breakdown-from-plan/` (decomposes by file) | gap | skills/core/vertical-slicing/SKILL.md; commands/vibe-slice.md; templates/slice-spec-template.md |
| plugin manifest format | Installable bundle via schemastore-compliant manifest + marketplace.json | `registry/bundles.json` (in-repo only) | gap | plugins/manifest.json; plugins/marketplace.json |
| orchestration anti-patterns | Catalog of 5 anti-patterns (persona-calls-persona, deep trees, single-agent, etc.) | `docs/orchestration-guide.md` | enhance | docs/orchestration-guide.md (add ## Anti-patterns section) |
| skill-anatomy required sections | Enforce `## Rationalizations` + `## Red Flags` + `## Verification` as required | `schemas/skill.schema.json` (only name/purpose/workflow) | enhance | schemas/skill.schema.json (add required_sections) |

## Local mapping

The detailed local mapping lives in `references/mappings/source-to-local-skills.md`, `references/mappings/feature-to-local-files.md`, and `references/mappings/update-impact-map.md`. The new local artifacts land under `skills/core/`, `commands/`, `templates/`, `registry/`, `plugins/`, `schemas/`, and `docs/`.

## Upstream structure notes

The 2026-06-20 audit observed a single-author plugin manifest with: 24 skill categories, each containing a single `SKILL.md` (except `idea-refine` with 3 supporting files), 4 subagent persona files in `agents/`, 8 slash command files (TOML format) in `commands/`, 2 runtime hooks + 1 hook manifest in `hooks/`, 6 reference checklists, 1 skill-anatomy spec, 2 Node.js validators, and a marketplace manifest. The repo has no runtime engine, no installer, no compiled code, and no shell daemon — every artifact is a markdown spec or a thin shell hook. This makes it cleanly auditable and directly adaptable to Vibe's spec-first philosophy.

## Integration strategy

Adapt ideas into original local artifacts with bilingual maintainability notes (Vietnamese for guidance where appropriate). All new content is original wording. Cross-link with existing 20 sources in `references/index.json` to avoid duplication. When a similar local skill exists, enhance rather than duplicate. For multi-source synthesized skills, list all contributing sources in the skill's `## Source alignment` section.

## Update watchlist

Watch upstream for:
- New skill categories added to `skills/`
- New agents in `agents/`
- New commands in `commands/`
- Hook changes in `hooks/`
- Schema updates to `plugin.json` and `marketplace.json`
- New validators in `scripts/`
- New anti-patterns in `references/orchestration-patterns.md`

## Maintenance playbook

1. Run or perform a safe audit of the upstream repository without staging clones under `references/upstreams/`.
2. Verify license and latest commit.
3. Update this source doc metadata and `references/changelogs/addyosmani-agent-skills.md`.
4. Update feature docs and mappings only for concepts being adapted.
5. Keep new local content original and run `npm run validate:references` + `npm run validate` + `npm run validate:traceability`.

## Do not copy

Do not vendor upstream code, prompts, skill files, examples, plugin manifests, hooks, or scripts. Do not paste large upstream text. Do not replace Vibe Coding OS philosophy with upstream language. Any closer adaptation requires explicit license and attribution review (this source is MIT, so attribution + original wording is sufficient).
