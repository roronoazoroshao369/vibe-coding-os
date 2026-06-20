---
name: context-policy
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: core
tags:
  - core
status: stable
---

# Skill: Policy-Based Context Control (DLP)

## Purpose

Control what context enters and leaves the agent's working window through policy-based rules
that define allowed, blocked, and flagged file patterns, directory rules, and sensitive content
patterns. This brings data-loss-prevention (DLP) discipline to agent context management by
treating context as a scoped resource that must be intentionally granted, not implicitly
inherited.

## When to use

Use before loading context for any task involving sensitive data, cross-repository boundaries,
or when the agent's working context could inadvertently include files or directories that
should not be read, analyzed, or transmitted. Use proactively during project setup and
reactively when a task involves privacy-sensitive or organization-restricted code.

## Inputs

- A context policy file following `templates/context-policy-template.md`.
- The current working directory and file tree.
- Optional: a list of task-relevant files or patterns.

## Policy Rule Types

A context policy defines three types of rules, each scoped to a policy section:

### 1. Scope

Defines what the policy applies to. Scopes can be:

- `project` — applies to the entire repository.
- `directory:<path>` — applies to a specific directory subtree.
- `task:<task-id>` — applies only during a specific task.
- `session` — applies for the current agent session only.

### 2. Rules

Each rule has a `pattern` (glob or regex), an `action`, and an optional `reason`:

| Action | Meaning | Behavior |
|--------|---------|----------|
| `allow` | Permit access | File/directory is included in context |
| `block` | Deny access | File/directory is excluded; reason recorded |
| `flag` | Warn and permit | Access is allowed but logged for review |

### 3. Severity

Each rule carries a severity that determines the response when violated:

| Severity | Allow violation | Block violation | Flag violation |
|----------|----------------|-----------------|----------------|
| `error` | Not applicable | Stops processing | Not applicable |
| `warn` | Not applicable | Logs warning | Logs warning |
| `info` | Not applicable | Logs quietly | Logs quietly |

## Policy Evaluation Order

Rules are evaluated in this order:

1. Block rules checked first (deny-based security: anything not explicitly allowed is suspect).
2. Allow rules checked second (explicit opt-in for sensitive directories).
3. Flag rules checked last (advisory warnings for patterns of interest).

If a path matches multiple rules, the most restrictive action wins: `block` > `flag` > `allow`.
If a path matches no rule, the default depends on the scope:

- `restrictive` default: block all paths not explicitly allowed.
- `permissive` default: allow all paths not explicitly blocked.
- Default mode is `restrictive` for privacy-sensitive scopes, `permissive` for general project
  scopes. The policy file declares which default applies.

## Sensitive Content Patterns

Patterns can match on file name, directory path, or file content. Built-in pattern categories:

### File path patterns

```
*.env           # Environment files with secrets
*.key           # Private keys
*.pem           # Certificates
*credentials*   # Credential files
*secret*        # Any file with 'secret' in the name
*.log           # Log files (may contain sensitive data)
```

### Directory patterns

```
node_modules/   # Typically excluded from context
.vendor/        # Vendored dependencies
.git/           # Git internals
.env/           # Environment directories
secrets/        # Secret storage
```

### Content patterns (scanned when loading files)

```
api[_-]?key     # API key declarations
password        # Password assignments
secret[_-]?key  # Secret key declarations
token[_-]?      # Token assignments
-----BEGIN.*KEY-----  # PEM-encoded keys
```

## Workflow

### Setup Phase

1. Define the policy scope: project-wide, directory-specific, or task-specific.
2. Choose the default mode: `restrictive` or `permissive`.
3. List allow, block, and flag rules with patterns, actions, and severities.
4. Save the policy file (convention: `context-policy.yaml` or `.context-policy.yaml` in the
   scope root).

### Ingress Filtering (before loading context)

1. Before loading any file into context, check it against the active policy.
2. Blocked files are excluded entirely; a placeholder note is inserted:
   `[Blocked by context-policy: <rule-id> — <reason>]`
3. Flagged files are loaded but logged for post-session review.
4. Allowed files are loaded normally.

### Audit Phase (reviewing what was loaded)

1. After a session or task, generate a context-access report:
   - Files allowed: count
   - Files blocked: list + reasons
   - Files flagged: list + reasons
2. Review flagged files for any sensitive data that may have leaked.
3. Update policy rules based on audit findings.

## Example Rules

```yaml
scope: project
default: permissive
rules:
  # Block sensitive directories
  - id: block-secrets-dir
    pattern: secrets/**
    action: block
    severity: error
    reason: "Secrets directory must never enter agent context"

  # Block credential files
  - id: block-credentials
    pattern: "**/*credentials*"
    action: block
    severity: error
    reason: "Credential files contain sensitive access data"

  # Allow specific config dir for this task
  - id: allow-config
    pattern: config/deploy/**/*.yaml
    action: allow
    severity: info
    reason: "Deployment config needed for infrastructure task"

  # Flag log files for review
  - id: flag-logs
    pattern: "**/*.log"
    action: flag
    severity: warn
    reason: "Log files may contain request/response data"
```

## Integration with Privacy Filter

The context-policy skill works upstream of the privacy filter
(`skills/memory/privacy-filter/SKILL.md`). Policy-based context control determines *what*
files are loaded into context; the privacy filter then sanitizes the loaded content before
it enters memory or is transmitted. Together they form a defense-in-depth pipeline:

```
File system → Context Policy (allow/block/flag) → Privacy Filter (redact) → Context Window
```

## Outputs

- A policy file defining allowed, blocked, and flagged paths and patterns.
- A context-access log recording what was loaded, blocked, or flagged during a session.
- A post-session audit report for review.

## Failure modes

- Overly restrictive policy blocks legitimate context, causing rework. Mitigation: start
  with `permissive` default, tighten iteratively based on audit reports.
- Policy file is missing or malformed. Mitigation: fall back to no policy (allow all) and
  log a warning; do not block work.
- Glob patterns are too broad and unintentionally block needed files. Mitigation: use specific
  patterns; test with `policy check <path>` before applying.
- Content pattern scanning is slow on large repositories. Mitigation: prefer file/directory
  patterns over content scanning; content scan only on flagged paths.

## Verification checklist

- [ ] Policy file is valid and all rules have `id`, `pattern`, `action`, `severity`, `reason`.
- [ ] Block rules catch known-sensitive paths (`.env`, `secrets/`, credential files).
- [ ] Allow rules correctly permit task-necessary paths.
- [ ] Default mode is correctly set for the scope.
- [ ] Flag rules do not create excessive noise.
- [ ] Context-access log records blocked paths with correct rule IDs.

## Applied / Not Applied

- Applied: policy-based file access control with allow/block/flag actions, scope declaration,
  severity levels, restrictive vs permissive defaults, ingress filtering workflow, post-session
  audit, integration with privacy-filter pipeline.
- Not applied: runtime policy daemon, inotify watcher, network-level DLP, real-time content
  inspection engine, or any external runtime dependency.

## Ghi chú tiếng Việt

Kiểm soát ngữ cảnh dựa trên chính sách: ba loại luật (allow/block/flag), ba mức độ nghiêm
trọng (error/warn/info), hai chế độ mặc định (restrictive/permissive). Luật block được kiểm
tra trước, sau đó allow, cuối cùng flag. Tích hợp với privacy filter: policy quyết định file
nào được nạp, privacy filter làm sạch nội dung trước khi vào memory. Lấy cảm hứng từ
`yvgude/lean-ctx`, viết lại hoàn toàn nguyên bản.
