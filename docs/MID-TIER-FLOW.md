# MID-TIER-FLOW.md — Simple Path for Mid-Tier AI Models

**Use this if you are a mid-tier model (≤32k context, < 100k total tokens): Qwen3-30B, Llama 3.3 70B, GPT-OSS 20B, or local models.**

This document is for **mid-tier model users** — when full `CLAUDE.md` is too rich, the Adaptive Flow tier-classification is too branchy, or you want a straight-ahead track with no decision points.

## Why this exists

The default Vibe Coding OS flow uses 5-tier classification (tiny/small/medium/large/risky) and adaptive routing. Mid-tier models frequently:

1. **Misclassify task risk** — mark risky auth work as "tiny"
2. **Branch incorrectly** — follow first match, skip negative conditions
3. **Cross-reference explosion** — chase 6+ skill links, context jumps from 1k to 6k+ tokens
4. **Self-auditing paradox** — fail to detect own bugs and pass self-review

This document removes all four traps. It hardcodes a linear path with no decisions.

## The simple path

```
1. Read goal
2. Read ONE skill (listed below)
3. Read ONE template (listed below)
4. Write the change
5. Run npm run validate:all
6. Done
```

No tier classification. No orchestrator. No Adaptive Flow. No Smart Adapt.

## Choose your ONE skill

| Task type | Skill |
|-----------|-------|
| Add a feature | `skills/core/spec-first-development/SKILL.md` |
| Fix a bug | `skills/core/bug-fix-lifecycle/SKILL.md` |
| Refactor | `skills/core/safe-refactor/SKILL.md` |
| Debug (don't know why broken) | `skills/core/disciplined-diagnosis/SKILL.md` |
| Write tests | `skills/core/test-driven-development/SKILL.md` |
| Code review | `skills/core/verification-before-done/SKILL.md` |

**Skip** the following skills (they require ≥64k context or strong multi-step branching):

- `core/adaptive-flow` (route by risk tier — mid-tier can't do this)
- `core/crash-proof-planning` (160+ lines, multi-branch)
- `core/guard-bypass-protocol` (424 lines — split in v2.18)
- `core/subagent-driven-development` (orchestrator — needs full orchestrator)
- `core/superagent-orchestration` (orchestrator)
- `agents/advanced-orchestration` (orchestrator)
- `core/team-agent-orchestration` (orchestrator)
- `core/orchestration-workflows` (orchestrator)

If your task requires any of these, **stop and tell the user**: "This task needs a top-tier model. Switching to `CLAUDE.md` recommended."

## Choose your ONE template

| Task type | Template |
|-----------|----------|
| Add a feature | `templates/spec-template.md` |
| Plan a feature | `templates/plan-template.md` |
| Break down work | `templates/tasks-template.md` |
| Code review | `templates/review-template.md` |

## After implementing

Run these two commands and stop:

```bash
npm run validate:all
npm run lint
```

Both must exit 0. If not, fix and re-run. Don't run any other validators (we get noise from them, and they waste context).

## Anti-patterns (mid-tier specific)

1. **Loading 3+ skills** — Pick ONE.
2. **Using `vibe-flow`, `vibe-flow-parallel`, `vibe-orchestrate`, `vibe-align`** — These route through Adaptive Flow which requires strong meta-reasoning.
3. **Self-auditing after every change** — Run `npm run validate:all` instead. Trust external gates.
4. **Generating extensive Vietnamese sections** — One-line summary max if bilingual required.
5. **Cross-referencing 5+ skills** — Read ONE skill at a time. If it references another, fetch it on demand.

## When to escalate

Escalate to `CLAUDE.md` (full flow) when:

- Task is production-critical (auth, security, payments)
- Task touches ≥5 files
- Task involves parallel coordination of multiple models
- Task requires deep meta-reasoning about risk

For everything else, this flow gets you 80%+ of the quality with 30% of the context.