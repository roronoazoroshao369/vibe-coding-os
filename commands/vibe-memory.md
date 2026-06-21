---
description: "Create a privacy-filtered durable session summary with decisions, changed files, verification, questions, and next actions."
---

# vibe-memory

## Purpose

Summarize durable session knowledge for future work while filtering out secrets, private credentials, unnecessary personal data, and transient noise.

## When to use

Use this command at the end of a session, before handing off to another agent, after major decisions, after validation results matter for future context, or when project memory should be refreshed.

## Required inputs

- Session goal and final status.
- Decisions made and assumptions accepted.
- Files changed or intentionally left untouched.
- Commands run, validation results, failures, and limitations.
- Unresolved questions and recommended next actions.

## Step-by-step workflow

1. Collect only durable facts that would help a future agent continue safely.
2. Include decisions, changed files, important commands, verification results, unresolved questions, and next actions.
3. Filter out secrets, credentials, personal data, private tokens, and irrelevant chat details.
4. Distinguish verified facts from assumptions and open questions.
5. Keep the summary concise enough to scan quickly.
6. If writing to a memory file, follow the repository's memory template and applicable instructions.

## Output format

Return or write a memory summary with:

- **Context**
- **Decisions**
- **Changed files**
- **Verification**
- **Open questions**
- **Next actions**
- **Privacy filter result**

## Verification expectation

Verify that sensitive data has been removed and that command results are accurately represented. If memory changes are committed to repository files, include them in normal validation such as `npm run validate` when relevant.

## Stop/ask-clarifying-question condition

Stop and ask when the user requests storing sensitive data, when it is unclear whether information is private, when durable memory location is unspecified and multiple storage targets exist, or when a requested memory entry would misrepresent unverified work as complete.

## Related skills/templates

- `skills/memory/session-capture/SKILL.md`
- `skills/memory/project-memory/SKILL.md`
- `skills/memory/project-memory/SKILL.md`
- `skills/memory/memory-search/SKILL.md`
- `templates/memory-template.md`
Summarize durable session knowledge according to `docs/memory-conventions.md`. Include only durable decisions, architecture constraints, commands that worked, gotchas, and actionable follow-ups. Add date, confidence, source, and staleness status so future sessions can judge whether the memory is current.

Before saving or committing memory, use `templates/memory-redaction-checklist.md` and remove secrets, tokens, private keys, unnecessary personal data, and long raw transcripts. Keep the summary concise enough to be useful later.
