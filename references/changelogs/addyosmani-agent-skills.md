# Changelog: addyosmani/agent-skills

Tracking upstream changes and local adaptation impact for `addyosmani/agent-skills`.

## 2026-06-20 — Initial audit + 5 NEW skills + 3 enhancements + 2 architectural patterns

**Audit scope:** 24 skill categories, 4 subagent personas, 8 slash commands, 2 hooks, 1 plugin manifest, 1 marketplace manifest, 1 skill-anatomy spec, 6 reference checklists, 2 validators.

**Local adaptations created:**

- `skills/core/doubt-driven-development/SKILL.md` — NEW skill (in-flight doubt posture + Loading Constraints + anti-rationalization table)
- `commands/vibe-doubt.md` — NEW command
- `skills/core/observability-design/SKILL.md` — NEW skill (questions-before-signals + metric/log/trace trade-off)
- `commands/vibe-observability.md` — NEW command
- `templates/observability-plan-template.md` — NEW template
- `skills/core/deprecation-migration/SKILL.md` — NEW skill (Compulsory vs Advisory + 5 pre-deprecation questions)
- `commands/vibe-deprecate.md` — NEW command
- `commands/vibe-migrate.md` — NEW command
- `templates/deprecation-notice-template.md` — NEW template
- `skills/core/threat-model-driven-security/SKILL.md` — NEW skill (trust boundaries → STRIDE → abuse cases)
- `commands/vibe-threat-model.md` — NEW command
- `templates/threat-model-template.md` — NEW template
- `skills/core/vertical-slicing/SKILL.md` — NEW skill (DB→API→UI vertical slices + 5-step increment cycle)
- `commands/vibe-slice.md` — NEW command
- `templates/slice-spec-template.md` — NEW template

**Local skills enhanced:**

- `skills/core/quality-engine/SKILL.md` — added Performance Budgets section (CWV targets + MEASURE→GUARD loop)
- `skills/core/grill-user-before-building/SKILL.md` — added 95% Confidence Stop Condition + Single-Question Cadence sections
- `skills/core/verification-before-done/SKILL.md` — added 5-axis runtime verification (DOM/console/network/perf/visual abstract pattern)
- `templates/performance-budget-template.md` — NEW template (CWV + perf budgets)
- `commands/vibe-perf-budget.md` — NEW command

**Architectural patterns adopted:**

- `plugins/manifest.json` — NEW (schemastore-compliant plugin manifest for Vibe Coding OS)
- `plugins/marketplace.json` — NEW (marketplace discovery for non-Claude CLIs)
- `docs/orchestration-guide.md` — added `## Anti-patterns to Avoid` section with 5 anti-patterns
- `schemas/skill.schema.json` — added `required_sections: ["rationalizations", "red_flags", "verification"]` (additive; existing skills still pass)

**Local source tracking:**

- `references/sources/addyosmani-agent-skills.md` — NEW audit doc
- `references/index.json` — appended source #21
- `registry/sources.json` — appended entry
- `ATTRIBUTIONS.md` — added Addy section
- `NOTICE.md` — added Addy reference notice

**Validation:**

- `npm run validate:all` — expected PASS
- `npm run validate:references` — expected PASS
- `npm run validate:traceability` — expected PASS
- All new skills cross-linked in `registry/skills.json` and `registry/bundles.json`

**Bumps:**

- `package.json` version 2.10.0 → 2.11.0

**Do not:**

- Vendor upstream code, prompts, or skill files
- Copy large text blocks verbatim
- Replace Vibe OS philosophy with upstream language
