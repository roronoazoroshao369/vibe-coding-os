# Instinct Store

This directory stores engineering instincts extracted from sessions using the continuous-learning workflow. Each instinct is a standalone markdown file following the template at `templates/instinct-template.md`.

## Structure

```
references/instincts/
  README.md          ← this file
  <slug-name>.md     ← individual instinct records
  archived/          ← expired or superseded instincts (audit trail)
```

## Usage

- **Extract**: Run `vibe-instinct --extract` after a session to create new instincts.
- **Review**: Run `vibe-instinct --review` to check for stale, expired, or duplicate entries.
- **Apply**: Run `vibe-instinct --apply <task-description>` to load matching instincts before starting work.
- **List**: Run `vibe-instinct --list` to see all instincts.

## Conventions

- Each instinct file uses the slug as its filename: `<kebab-case-name>.md`.
- Confidence scores follow the 1-10 rubric defined in `skills/meta/instinct-extraction/SKILL.md`.
- Expiry is set at creation time; re-verify before expiry.
- Archived instincts are moved to `archived/` — never deleted.
- No secrets, personal data, or raw transcripts are stored.
