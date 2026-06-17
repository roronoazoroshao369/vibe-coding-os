# Vibe Attribution Rules for Cursor

Use this file whenever a change uses upstream projects, examples, prompts, documentation, code, generated content, or research sources.

## Upstream references
- Check `references/index.json` and relevant reference docs before adopting upstream ideas.
- Prefer original wording and local adaptation over copying.
- Cite upstream sources when ideas, structure, examples, or terminology materially influence the work.
- Do not vendor code, prompts, or docs unless license compatibility and attribution duties are explicit.

## Source tracking
Record source details when relevant:
- Project or author
- URL or repository path
- Version, commit, release, or access date
- What was used: inspiration, concept, snippet, API behavior, template shape, or documentation fact
- Local files affected
- Attribution or license obligations

## License compliance
- Verify license before copying or closely adapting upstream content.
- Treat unclear, missing, restrictive, or incompatible licenses as blocked until reviewed.
- Update `ATTRIBUTIONS.md`, `NOTICE.md`, reference mappings, or changelog notes when required.
- Do not remove existing notices, headers, or attribution metadata.
- Keep examples generic; do not import private, proprietary, or credential-bearing content.

## Review checklist
Before finishing:
- [ ] No unlicensed copying or vendored upstream material.
- [ ] All material sources are cited where needed.
- [ ] License obligations are documented or not applicable.
- [ ] Reference docs and attribution files were updated if adoption is substantive.
- [ ] `npm run validate` or relevant reference validation was run, or limitation is stated.
