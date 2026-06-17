# Team Run Output Template

> Template for team runner output artifacts.

## Metadata
- **Team**: `{{team_name}}`
- **Run ID**: `{{run_id}}`
- **Started**: `{{started_at}}`
- **Finished**: `{{finished_at}}`
- **Status**: `{{status}}`

## Goal
{{goal}}

## Summary
{{summary}}

## Role Outputs
{{#each roles}}
### {{this.role}}
- **Owner**: `{{this.owner}}`
- **Status**: `{{this.status}}`
- **Output**: {{this.output}}

{{/each}}

## Artifacts
{{#each artifacts}}
- `{{this.path}}` — {{this.description}}
{{/each}}

## Issues / Blockers
{{#each issues}}
- [{{this.severity}}] {{this.message}}
{{/each}}

## Next Steps
{{next_steps}}
