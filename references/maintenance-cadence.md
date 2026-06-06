# Reference Maintenance Cadence

This cadence defines how often tracked upstream references should be checked, what events should trigger an out-of-cycle audit, and which outputs are required before an audit is considered complete.

## Audit frequency

- **High-priority sources:** audit monthly.
- **Medium-priority sources:** audit quarterly.
- **Low-priority sources:** audit on-demand.

## Trigger conditions

Run an out-of-cycle audit when any tracked source has one or more of these changes:

- new upstream release;
- major README or workflow changes;
- license changes;
- security or memory-related changes.

## Priority tiers

| Priority | Source | Rationale |
| --- | --- | --- |
| High | `github-spec-kit` | Core spec-driven workflow reference with direct impact on planning, implementation gates, and local command patterns. |
| High | `supermemoryai-supermemory` | Memory-system reference; security, privacy, and persistence changes can affect safety-sensitive local memory skills. |
| High | `thedotmack-claude-mem` | Memory behavior and opt-out patterns can affect local persistent-memory boundaries and user-safety expectations. |
| Medium | `affaan-m-ecc` | Coding workflow reference for spec, TDD, and review loops; useful to check regularly but less safety-sensitive than memory sources. |
| Medium | `mattpocock-skills` | Engineering-skills reference with broad local overlap across skill orchestration, testing, and review ergonomics. |
| Medium | `obra-superpowers` | Skill-system reference for orchestration and disciplined execution patterns that may influence core workflow skills. |
| Medium | `yeachan-heo-oh-my-claudecode` | Claude Code workflow and multi-agent reference; adapter and agent-boundary changes should be reviewed quarterly. |
| Low | `multica-ai-andrej-karpathy-skills` | Prompt guardrail reference used as inspiration for simplicity and anti-overengineering patterns; audit when notable changes appear. |

## Required audit outputs

Every completed audit must produce or update:

- changelog entry in `references/changelogs/<source-id>.md`;
- updated `last_checked` in `references/index.json`;
- updated `last_known_commit` in `references/index.json`;
- scorecard covering relevance, originality risk, license/attribution status, local impact, and adoption decision;
- impacted local files list, including explicit `none` when no local files need changes.

## Validation

After changing reference metadata, source notes, mappings, changelogs, or cadence documentation, run:

```bash
npm run validate:references
npm run validate
```
