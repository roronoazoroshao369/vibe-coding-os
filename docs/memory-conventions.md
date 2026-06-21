# Memory Conventions

These conventions define what Vibe Coding OS may persist as project memory, what must be excluded, how stale memory is handled, and which local skills/templates own each step.

## Allowed memory

Persist memory only when it is durable enough to help a future session make better project decisions. Good candidates include:

- **Durable decisions**: accepted product, architecture, workflow, naming, or repository decisions, including why the decision matters.
- **Architecture constraints**: boundaries, compatibility requirements, invariants, integration contracts, or constraints that future changes must preserve.
- **Commands that worked**: commands that were successfully used for setup, validation, generation, migration, or debugging, including important flags and environment assumptions.
- **Gotchas**: repeatable pitfalls, confusing conventions, broken workflows, non-obvious dependencies, or known failure modes.
- **Follow-ups**: unresolved questions, needed cleanups, future verification, or deferred tasks that are specific and actionable.

## Disallowed memory

Do not persist content that creates avoidable privacy, security, licensing, or noise risk. Memory must not contain:

- **Secrets**: passwords, credentials, seed phrases, customer secrets, internal-only URLs, or other confidential values.
- **Tokens**: API keys, OAuth tokens, session cookies, bearer tokens, refresh tokens, CI tokens, or package registry tokens.
- **Private keys**: SSH keys, signing keys, certificate private keys, wallet keys, or key material in logs.
- **Unnecessary personal data**: personal email addresses, phone numbers, addresses, IDs, private user/customer data, or identifying context not needed for the engineering task.
- **Long raw transcripts**: full chats, verbose logs, stack traces, or command output dumps. Summarize the durable lesson and cite the source location instead.

When in doubt, use placeholders such as `<REDACTED_TOKEN>` and keep only the minimum technical context required for future work.

## Required metadata and staleness policy

Each memory entry should include metadata that lets future agents judge trustworthiness:

- **Date**: when the memory was created or last reviewed, preferably in `YYYY-MM-DD` format.
- **Confidence**: `High`, `Medium`, or `Low`, with a short reason when confidence is not high.
- **Source**: the file, command, issue, PR, discussion, or session summary that supports the memory.
- **Staleness status**: `Fresh`, `Review by <date/event>`, or `Stale`.

Use this policy for stale memory:

1. Mark memory as `Review by <date/event>` when it depends on unstable dependencies, external services, tooling versions, active design work, or temporary workarounds.
2. Review memory before reusing it if the review date/event has passed, the related files changed significantly, or validation contradicts the entry.
3. Update the entry with a new date/source/confidence when it remains true.
4. Mark it `Stale` instead of deleting it when historical context is useful, but clearly prevent future agents from treating it as current guidance.
5. Delete stale memory only when it is no longer useful and contains no audit value.

## Redaction checklist before commit

Before committing a memory entry, convention update, example, or transcript-derived summary:

- [ ] Confirm the entry fits an allowed category: durable decision, architecture constraint, worked command, gotcha, or follow-up.
- [ ] Remove secrets, tokens, private keys, credentials, private URLs, and sensitive configuration values.
- [ ] Remove unnecessary personal data and replace needed identifiers with generic placeholders.
- [ ] Replace long raw transcripts, logs, and stack traces with concise summaries.
- [ ] Verify date, confidence, source, and staleness status are present.
- [ ] Check examples and placeholders cannot be mistaken for real credentials.
- [ ] If content came from an external source, confirm attribution and licensing requirements before committing.

For a reusable worksheet, see `templates/memory-redaction-checklist.md`.

## Example good memory entries

### Good: durable decision

```md
# Memory: 2026-06-06 reference validation scope

## Durable facts

- Repository structure changes should be validated with `npm run validate` because it runs both repository and reference validation.

## Decisions

- Use the broader validation command after memory convention changes that touch docs, templates, commands, or reference mappings.

## Commands and results

- `npm run validate` passed on 2026-06-06.

## Gotchas

- `npm run validate:references` is sufficient only for reference-only edits.

## Follow-ups

- Re-check this if validation scripts change.

## Metadata

- Date: 2026-06-06
- Confidence: High; supported by `package.json` scripts.
- Source: `package.json`
- Staleness: Review when validation scripts change.

## Sensitivity check

- Contains no secrets, credentials, private keys, tokens, unnecessary personal data, or raw transcripts.
```

### Good: gotcha

```md
# Memory: 2026-06-06 memory examples

## Gotchas

- Do not save full chat transcripts as project memory. Capture only durable decisions, constraints, worked commands, gotchas, and follow-ups.

## Metadata

- Date: 2026-06-06
- Confidence: High; matches memory conventions.
- Source: `docs/memory-conventions.md`
- Staleness: Fresh.

## Sensitivity check

- Contains no secrets, credentials, private keys, tokens, unnecessary personal data, or raw transcripts.
```

## Example bad memory entries

### Bad: secret-like value

```md
- CI failed until I copied a live API token from CI into the memory entry.
```

Why it is bad: it stores a token-shaped value. Replace with a placeholder and record only the durable lesson:

```md
- CI requires `<REDACTED_API_TOKEN>` to be configured in the environment; do not commit the token value.
```

### Bad: unnecessary personal data

```md
- Ask Jane Doe at jane.personal@example.com about the customer export for Acme user 12345.
```

Why it is bad: it stores unnecessary identifying information. Prefer a role or issue link when needed:

```md
- Follow up with the data owner listed in the relevant issue about the customer export requirements.
```

### Bad: long raw transcript

```md
- Full terminal transcript: <hundreds of lines of logs, stack traces, and repeated output>
```

Why it is bad: it adds noise and may leak sensitive data. Summarize the durable outcome instead:

```md
- `npm run validate` failed because `references/index.json` contained invalid JSON; fix was to remove the trailing comma.
```

## Mapping to local memory system

- `skills/memory/project-memory/SKILL.md`: owns durable project memory capture. It should enforce allowed categories, required metadata, confidence, source, safety status, and staleness labels.
- `skills/memory/project-memory/SKILL.md`: owns redaction before saving memory, publishing examples, sharing logs, or committing transcript-derived artifacts.
- `skills/memory/memory-search/SKILL.md`: owns finding relevant prior memory and flagging missing, uncertain, or stale context before planning or changing files.
- `skills/memory/session-capture/SKILL.md`: owns end-of-session compression into concise handoff context that can be promoted to project memory after redaction.
- `templates/memory-template.md`: provides the standard structure for memory entries and should include date, confidence, source, staleness, and sensitivity checks.
- `templates/memory-redaction-checklist.md`: provides a pre-commit checklist for memory entries, examples, and summaries.
- `commands/vibe-memory.md`: should direct agents to these conventions when summarizing durable session knowledge.
