---
title: "Stale Skill Policy"
version: "2.15.0"
introduced_in: "v2.15.0"
---

# Stale Skill Policy

## Purpose

Define how skills are identified as stale, what actions are taken, and how maintainers keep the skill inventory healthy.

## When to use

- During quarterly reviews of the skill inventory
- When a skill's `last_reviewed` date exceeds 180 days
- Before a major release (e.g., v2.15.0, v3.0.0)

## Staleness criteria

A skill is considered **stale** if ANY of the following are true:

1. `last_reviewed` is older than **180 days**
2. The skill's category or directory has been reorganized without updating the skill
3. The skill references deprecated commands, templates, or patterns
4. The skill's `status` is `draft` for more than **90 days**

## Staleness levels

| Level | Age | Action |
|-------|-----|--------|
| **Fresh** | ≤ 90 days | No action needed |
| **Aging** | 91–180 days | Add to review queue |
| **Stale** | > 180 days | Flag in dashboard, require review before use |
| **Abandoned** | > 365 days or no linked commands | Candidate for deprecation |

## Workflow

1. Run `npm run validate:stale-skills` to generate staleness report
2. Review flagged skills and update `last_reviewed` date
3. For skills with no linked commands for > 1 year: mark as `abandoned`
4. For abandoned skills: deprecate via `vibe-deprecate-skill` command
5. Update registry metadata after changes

## Commands

- `vibe-deprecate-skill` — mark a skill as deprecated with migration path
- `validate:stale-skills` — report all skills with `last_reviewed` > 180 days

## Verification checklist

- [ ] `last_reviewed` dates are current for all stable skills
- [ ] No skills in `draft` status older than 90 days
- [ ] No `abandoned` skills remain in `stable` status
- [ ] Dashboard reflects staleness metrics
