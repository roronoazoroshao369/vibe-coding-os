# Quality Scorecard Session

> Use this template to record per-file quality review outcomes for one coding session. Historical summaries can be aggregated with `npm run quality:scorecard:report`.

## Per-file scorecard

| File | Changed | Tests | Quality Checks | Warnings | Score |
|---|---:|---:|---|---:|---:|
| <path/to/file> | yes/no | <tests added or run> | <checks run> | <count or notes> | <0-100> |

## Aggregated summary

- Total files changed: <count>
- Tests added or updated: <count>
- Quality checks run: <commands or checklist names>
- Warnings found: <count>
- Average score per file: <0-100>
- Lowest-scoring file: <path and score>
- Trend notes: <improving, stable, declining, or unknown; include why>

## Follow-ups

- [ ] <warning or improvement to address>
- [ ] <test gap to close>
- [ ] <lesson learned to record if this exposed a repeatable mistake>
