# vibe-upstream-sync

## Purpose

Synchronize and audit tracked upstream references without vendoring their source. Distill useful upstream ideas in original language, update reference metadata, and adapt only high-fit improvements into local Vibe Coding OS files.

## When to use

Use this command when checking tracked upstream repositories for changes, updating local reference intelligence, refreshing source changelogs, or adapting audited upstream ideas into commands, skills, templates, or docs.

## Required inputs

- Target upstream source IDs, feature areas, or local files to audit.
- `references/index.json` as the source of truth for tracked references.
- Local clone availability or permission to run `npm run references:clone`.
- Clear adaptation goal, such as updating a skill, command, template, or changelog.

## Step-by-step workflow

1. Read `references/index.json` and identify relevant source docs, changelogs, feature mappings, and local targets.
2. Run `npm run references:clone` when local upstream clones are needed.
3. Inspect only relevant upstream files and record commit, date, and scope of the audit.
4. Summarize reusable ideas in original language; do not copy large upstream content or vendor code.
5. Update the matching `references/changelogs/<id>.md`, source doc metadata, mapping docs, or local target files as needed.
6. Update `ATTRIBUTIONS.md`, `NOTICE.md`, or registries only if material is imported or closely adapted and attribution requirements apply.
7. Run `npm run validate:references` for reference-only changes or `npm run validate` for broader repository changes.
8. Before committing, confirm `references/upstreams/` clone contents are ignored and not staged.

## Output format

Return an upstream sync report with:

- **Sources audited**: IDs, commits, and dates.
- **Relevant changes found**.
- **Local adaptations made**.
- **Attribution/licensing notes**.
- **Validation results**.
- **Follow-ups or skipped areas**.

## Verification expectation

Run `npm run validate:references` after reference metadata changes. Run `npm run validate` when commands, skills, templates, or registries also change. Always verify that cloned upstream source trees under `references/upstreams/` are not staged.

## Stop/ask-clarifying-question condition

Stop and ask when upstream licensing is unclear for a desired adaptation, the user asks to copy or vendor large upstream content, the target source or feature area is missing from `references/index.json`, or the adaptation scope is too broad to audit safely.

## Related skills/templates

- `skills/core/upstream-intelligence-loop/SKILL.md`
- `skills/core/verification-before-done/SKILL.md`
- `templates/upstream-audit-template.md`
- `references/index.json`
