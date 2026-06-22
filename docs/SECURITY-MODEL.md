# Security Model

Vibe Coding OS is a portable workflow contract and discipline layer for AI-assisted coding. It is not a sandbox, an agent runtime replacement, or a security boundary by itself. This document defines what the project protects, what it does not protect, and how contributors should reason about security-sensitive changes.

## Security goals

Vibe Coding OS aims to:

- **Reduce accidental unsafe agent behavior** through explicit contracts, approval gates, tool policies, schemas, and validation scripts.
- **Make workflows portable across tools** by exporting consistent guidance for Cursor, Claude, Codex, Gemini, and other coding assistants.
- **Preserve human control over risky actions** such as remote writes, destructive filesystem mutations, production deployments, credential access, and policy exceptions.
- **Make state auditable** through runtime envelopes, event logs, snapshots, migrations, replay, and validation evidence.
- **Fail closed for malformed runtime state** when schema validation or known-field checks detect unexpected persisted data.

## Non-goals

Vibe Coding OS does not claim to:

- Securely sandbox arbitrary code execution.
- Prevent a compromised local machine, editor, shell, model provider, or CI runner from acting maliciously.
- Replace operating-system permissions, container isolation, browser sandboxing, GitHub branch protection, or secret scanners.
- Guarantee that an AI tool follows generated instructions. Tool exports are contracts and prompts, not enforcement boundaries.
- Provide production-grade distributed locking or transactional storage in v1.3.x. Runtime state is local-file based and suitable for discipline, recovery, and testing, not high-concurrency production orchestration.

## Trust boundaries

### Trusted inputs

- Repository-maintained schemas, skills, commands, templates, adapters, and scripts.
- Maintainer-reviewed changes merged through normal repository workflow.
- User-approved configuration, profile selection, and tool export targets.

### Untrusted inputs

- Model-generated plans, code, commands, and summaries.
- Third-party package scripts, downloaded examples, generated artifacts, and copied snippets.
- User project files when running Vibe Coding OS against an external repository.
- Tool output from shells, browsers, MCP servers, and web APIs unless verified.

### Sensitive assets

- Secrets and credentials: API keys, GitHub tokens, SSH keys, `.env` values, cookies, browser sessions.
- Destructive authority: `git push`, release publishing, package publishing, production deploys, database writes, and filesystem deletion.
- User data: project files, notes, task state, runtime events, snapshots, and logs.

## Enforcement layers

Vibe Coding OS uses multiple lightweight layers. No single layer is sufficient alone.

1. **Instruction contracts**
   - Skills, commands, templates, and adapter exports define expected behavior.
   - `docs/agent-safety-contract.md` classifies safe, review, dangerous, and blocked actions.

2. **Schema validation**
   - Runtime collections use strict collection envelopes and item schemas.
   - Unknown fields and invalid item shapes should be rejected before persistence.
   - Schema validation is intentionally minimal and dependency-free in v1.3.x; complex validation belongs in future v1.4 hardening.

3. **Tool contracts**
   - `runtime/core/tool-contract.mjs` defines allowed tools by policy level.
   - `assertToolAllowed()` should be checked before tool execution in integrations that opt into runtime enforcement.

4. **Approval gates**
   - `runtime/core/approval-gate.mjs` models approval-required actions and records decisions.
   - Dangerous actions should require explicit approval and include enough context for review.

5. **Audit and recovery**
   - Events, snapshots, replay, migration status, backups, and runtime audit scripts provide traceability.
   - Local-file runtime state is recoverable when snapshots/backups are present, but it is not a substitute for Git history or external backups.

6. **MCP server authentication** (v2.17.6+)
   - `runtime/mcp/server.mjs` requires a token handshake before any tool can execute.
   - Token resolved from `MCP_AUTH_TOKEN` env var → `~/.vibe/mcp-token` file → auto-generated on first start.
   - Client must call `_mcp.auth.verify({ token })` as first tool call; all others return `isError` until authenticated.
   - Token is 24-byte hex string, persisted with `0o600` permissions.

7. **Runtime injection scanning on MCP tool arguments** (v2.17.6+)
   - Before executing any tool, `callToolRequest` handler scans `request.params.arguments` against `INJECTION_PATTERNS` from `runtime/core/injection-patterns.mjs`.
   - `error`-severity patterns (instruction-override, role-reassignment, exfiltration, bidi-override) block the call and return `isError` with the pattern name.
   - `warn`-severity patterns (conceal-from-user, zero-width-unicode, base64-blob) log to stderr but allow the call.
   - Blocked calls are recorded to the event audit log as `mcp.injection.blocked`.

8. **Validation gates**
   - `npm run validate:all` is the release-quality gate for docs, registries, schemas, adapters, dashboard sync, traceability, and runtime smoke tests.
   - Release changes should include validation evidence in PRs or release notes.

## Required behavior for risky actions

Before performing or instructing a risky action, agents and integrations should:

- Classify the action using `docs/agent-safety-contract.md`.
- Explain what changes, what can be lost, and how to roll back.
- Require explicit user approval for dangerous actions.
- Prefer reversible commands and isolated branches.
- Never expose, print, commit, or synthesize realistic secrets.
- Avoid writing outside the intended project root unless explicitly approved.
- Verify outcomes with tests, status checks, or read-back evidence.

## Runtime storage model

The optional runtime layer persists local JSON collections and event files. In v1.3.x:

- Writes use atomic file replacement for collection documents where supported.
- Strict collection envelopes reduce accidental shape drift.
- Per-item schema validation prevents malformed items from being silently saved.
- Event append is file based and not a production-grade transactional event store.
- Multi-process and high-contention usage should be treated as experimental until the v1.4 event store and state-machine hardening work lands.

## Secrets handling

Contributors must not commit real secrets or realistic-looking fake secrets. Use placeholders such as:

- `GITHUB_TOKEN_PLACEHOLDER`
- `STRIPE_SECRET_KEY_PLACEHOLDER`
- `SLACK_WEBHOOK_URL_PLACEHOLDER`

Do not include `sk_live_*`, real webhook URLs, private keys, session cookies, or copied `.env` values in fixtures, docs, tests, commits, issues, or release notes.

## Reporting security issues

For public documentation or validation gaps, open an issue using the safety evaluation template when available. For suspected credential exposure or exploitable vulnerabilities, avoid posting sensitive details publicly; contact the maintainer privately if a private channel is available, or provide a minimal public report without secrets or exploit payloads.

## Maintainer checklist

Security-sensitive PRs should confirm:

- [ ] MCP auth token resolves correctly (env → file → auto-generate).
- [ ] MCP injection scan blocks adversarial payloads and passes benign content.
- [ ] No real or realistic-looking secrets are added.
- [ ] New runtime writes validate collection and item shape.
- [ ] Dangerous actions pass through approval gates or are explicitly documented as out of scope.
- [ ] Tool permissions are least-privilege for the workflow.
- [ ] Rollback or recovery path is documented for destructive changes.
- [ ] `npm run validate:all` passes before release.
