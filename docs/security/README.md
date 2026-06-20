# Security

This directory holds security-related runtime artifacts for Vibe Coding OS.

- `bypass-load-attempts.log` — auto-populated by `scripts/load-bypass-techniques.mjs` whenever the gated bypass loader is invoked. NOT committed to git (local audit trail). Format: ISO timestamp + actor + authorization ref + technique list requested.
- `session-audit/` — auto-populated by `.claude/hooks/session-end-audit-flush.mjs` at end of each session. Per-session audit log. NOT committed.
- `<date>-<feature>.md` — security review worksheets produced from `templates/secure-coding-checklist-template.md`. COMMITTED (these are the review artifacts).

See `skills/core/secure-coding-checklist/SKILL.md` for the review workflow.
