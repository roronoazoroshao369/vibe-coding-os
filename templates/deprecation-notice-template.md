# Deprecation Notice

Use this template to communicate an artifact deprecation. Severity classification is mandatory.

## Target

- **Artifact:** `<path or identifier>`
- **Type:** skill | command | template | registry | schema | other
- **Version deprecated in:** `<x.y.z>`

## Reason

`<One paragraph: why is this artifact being deprecated?>`

## Replacement

- **Replacement artifact:** `<path or identifier>` (or "none — sunset only")
- **Feature equivalence:** full | partial (gaps documented below)
- **Gaps in replacement:** `<list any features the replacement does not cover>`

## Migration path

`<Step-by-step instructions for consumers to migrate. Include commands, scripts, or one-liners.>`

```bash
# Example migration command
vibe migrate --from <deprecated> --to <replacement>
```

## Severity

- [ ] **Compulsory** — security vulnerability, irrecoverable error, license violation, irreplaceable dependency failure. Notice: 2 minor versions OR 30 days.
- [ ] **Advisory** — replacement available, redundancy cleanup, end-of-life. Notice: 1 minor version OR 14 days.

**Justification:** `<Why this severity?>`

## Timeline

- **Deprecation announced:** `<YYYY-MM-DD>`
- **Notice period starts:** `<YYYY-MM-DD>`
- **Sunset date:** `<YYYY-MM-DD>`
- **Grace period after sunset (compulsory only):** `<X days>` (for compulsory migrations only)

## Affected consumers

`<List known consumers, or note "telemetry unavailable; run usage scan before deprecation">`

## Contact

- **Owner:** `<name or team>`
- **Issue tracker:** `<URL>`
- **Slack/Discord:** `<channel>`

## Verification

- [ ] All 5 pre-deprecation questions answered
- [ ] Severity justified
- [ ] Replacement documented
- [ ] Migration path tested
- [ ] Tracker entry added
- [ ] `CHANGELOG.md` updated
