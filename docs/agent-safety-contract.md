# Agent–Computer Safety Contract v1.0

A practical contract between an agent and the environment it operates in — command risk levels, filesystem scope, network access, rollback, and examples.

## 1. Command Risk Levels

Every command an agent runs is classified into one of four levels:

| Level | Label | What it covers | Approval needed |
|-------|-------|----------------|-----------------|
| ✅ Safe | Safe | Read-only, non-destructive: `ls`, `cat`, `find`, `npm run validate`, `git diff`, `curl GET` to documented APIs, listing files | None |
| ⚠️ Review | Review | Local mutations with reversible impact: `npm install`, `git commit`, `git revert`, `mkdir`, `touch`, install scripts, local file writes, test runs | Self-review or explicit user approval |
| 🔴 Dangerous | Dangerous | Mutation beyond the task directory: writes outside project root, package deletions, database writes, `rm -rf`, `git push`, `git reset --hard`, system config changes, daemon restarts | Explicit user approval required |
| 🚫 Blocked | Blocked | Never executable without extraordinary exception: `chmod -R`, `rm -rf /`, network-wide changes, production deployments, privilege escalation, credential access, environment variable mutations, execution of unverified downloads | Blocked unless explicitly exempted by user |

## 2. Filesystem Write Scope

| Scope | Write target | Policy |
|-------|-------------|--------|
| Local | Within the repository root (current working branch) | Allowed at ⚠️ Review level after self-review |
| Global | Outside the repository root | 🔴 Dangerous — requires explicit user approval for each path |
| Sandbox | A designated sandbox directory (e.g., `/tmp/vibe-test-*` or `docs/examples/`) | Allowed at ⚠️ Review level if documented in the task |

## 3. Network Policy

| Policy | What it permits | Requires |
|--------|----------------|----------|
| 🟢 Allow | All outbound HTTP/HTTPS connections | None (✅ Safe) |
| 🟡 Restricted | Only connections to documented or approved hosts | Task or user approval if not documented |
| 🔴 Deny | No outbound connections | Default policy for sensitive tasks — must be explicitly overridden |

In practice:
- Fetching an NPM package or cloning a public repo: 🟢 Allow (✅ Safe)
- Making API calls to a service not listed in project docs: 🟡 Restricted (⚠️ Review)
- Unrestricted network scanning, probes, or tunnels: 🔴 Deny unless user explicitly authorizes

## 4. Rollback Requirements

Before any 🔴 Dangerous operation, the agent must document:
- What will change
- How to revert the change
- What data or state could be lost and whether it is recoverable
- The exact command(s) to roll back
- A rollback test command to verify recovery

After any ⚠️ Review operation, the agent should be able to describe the rollback approach, even if not documented.

## 5. Examples

| Scenario | Level | Rationale |
|----------|-------|-----------|
| `npm run validate` | ✅ Safe | Read-only execution of project scripts |
| `curl https://api.github.com/repos/owner/repo` | ✅ Safe | Well-known public API |
| `npm install some-package` | ⚠️ Review | Modifies `node_modules` and `package-lock.json` |
| `git commit -m "fix: typo"` | ⚠️ Review | Creates a new commit, can be undone with `git revert` |
| `git push origin feat/branch` | 🔴 Dangerous | Publishes changes remotely |
| `rm -rf node_modules` | 🔴 Dangerous | Destructive deletion; needs rollback via `npm install` |
| `sudo systemctl restart nginx` | 🚫 Blocked | Privileged system daemon operation |
| `chmod -R 777 /home` | 🚫 Blocked | Massive permission change with security risk |

## 6. Overrides

- The user may override any level for a specific command by stating it explicitly: "Override: this `git push` is safe."
- Overrides must be logged or documented.
- When in doubt, default to the more restrictive level and ask.
