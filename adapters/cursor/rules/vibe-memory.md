# Vibe Memory Rules for Cursor

Use this file after review and before finishing a session or task.

## What to remember
Only persist memory for durable information that helps future sessions. Good candidates:
- Architecture decisions, design constraints, naming conventions, workflow choices, or repository rules.
- Commands that worked for setup, generation, validation, testing, debugging, or migration.
- Gotchas: repeatable pitfalls, confusing patterns, known failure modes, non-obvious dependencies.
- Follow-ups: specific actionable items, unresolved questions, deferred cleanups.

## What to forget
Do not persist:
- Secrets, passwords, tokens, private keys, credentials, API keys, internal URLs, or security-sensitive values.
- Personal data: email, phone, address, user IDs, or private business context beyond what is needed.
- Long raw transcripts: full chat logs, verbose stack traces, command output dumps. Summarize the lesson.
- Incorrect or superseded decisions without a historical note.

## Format requirements
Use structured notes per task or session:
- **Summary:** 1–3 sentences of what was achieved.
- **Decisions made:** why the choice matters and what alternatives were considered.
- **Commands used:** exact commands that worked (redacted where sensitive).
- **Gotchas:** repeatable problems and how to avoid them.
- **Follow-ups:** actionable items, owners if known, priority hints.
- **Metadata:** date, source, confidence (High / Medium / Low), staleness hint.

## Sensitivity levels
- **Public:** safe to share in full; no review needed.
- **Internal:** contains repository-specific context; review for accidental exposure.
- **Restricted:** includes design rationale or unreleased plans; keep concise and review before commit.
- **Never store:** secrets, credentials, tokens, keys, personal data, raw transcripts.

## Redaction
- Replace sensitive values with `<REDACTED_<TYPE>>` placeholders.
- If unsure, err toward not storing. The information can be rediscovered.
- Run `templates/memory-redaction-checklist.md` before committing memory artifacts.
