---
name: Compatibility Report
about: Report adapter compatibility issues or regressions across tools and tiers
title: '[COMPAT] '
labels: compatibility, adapter
assignees: ''
---

## Adapter affected

Which adapter is this about? (e.g. Claude Code, Codex CLI, Cursor, Gemini CLI)

## Support tier

- [ ] Tier 1 (Full — CI-tested)
- [ ] Tier 2 (Community — smoke-tested)
- [ ] Tier 3 (Experimental)

## What broke

Describe the compatibility issue or regression. Include what changed since the last known-working version.

## To Reproduce

1. Install or configure the adapter with '...'
2. Run command or workflow '...'
3. See failure: '...'

## Expected vs actual

- **Expected:** What should happen.
- **Actual:** What happens instead.

## Environment

- OS: [e.g. macOS, Linux, Windows]
- Agent tool version: [e.g. Claude Code 1.2.3, Codex CLI latest]
- Vibe Coding OS version: [e.g. v1.0.0-rc.1]

## Validation evidence

- [ ] `npm run smoke-test:cli` passes
- [ ] `node scripts/smoke-test-adapters.mjs` passes for this adapter
- [ ] `npm run validate` passes

## Suggested fix

<!-- Optional: proposed resolution, migration note, or workaround. -->
