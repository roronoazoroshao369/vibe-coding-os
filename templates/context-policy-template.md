# Context Policy: <name>

## Metadata

```yaml
policy-id: POLICY-YYYY-MM-DD-<slug>
scope: <project|directory:<path>|task:<task-id>|session>
default-mode: <restrictive|permissive>
created: YYYY-MM-DD
last-reviewed: YYYY-MM-DD
owner: <agent-or-human>
```

## Scope

Describe what this policy applies to. For directory scopes, list the exact paths. For task
scopes, reference the task ID and plan. For session scopes, describe the session's purpose.

```
Scope: project
Path: /path/to/repository
Description: Base policy for the entire repository. Tighten with directory-scoped overrides.
```

## Default Mode

```
Default: permissive
Explanation: General project scope; block only known-sensitive paths.
```

OR

```
Default: restrictive
Explanation: Privacy-sensitive scope; allow only explicitly listed paths.
```

## Rules

### Block Rules

Paths matching these patterns are excluded from context entirely. A placeholder note is
inserted indicating the block reason.

| ID | Pattern | Severity | Reason |
|----|---------|----------|--------|
| block-1 | `secrets/**` | error | Secrets directory must never enter agent context |
| block-2 | `**/*credentials*` | error | Credential files contain sensitive access data |
| block-3 | `**/*.env` | error | Environment files may contain secrets |
| block-4 | `**/*.key` | error | Private key files |

### Allow Rules

Paths matching these patterns are explicitly permitted when default is `restrictive`, or
serve as documentation of intentionally-allowed sensitive paths when default is `permissive`.

| ID | Pattern | Severity | Reason |
|----|---------|----------|--------|
| allow-1 | `config/deploy/*.yaml` | info | Deployment config needed for infra task |
| allow-2 | `docs/**/*.md` | info | Documentation files are safe for context |

### Flag Rules

Paths matching these patterns are allowed but logged for post-session audit review.

| ID | Pattern | Severity | Reason |
|----|---------|----------|--------|
| flag-1 | `**/*.log` | warn | Log files may contain request/response data |
| flag-2 | `**/test/fixtures/**` | info | Test fixtures may contain sample sensitive data |

## Sensitive Content Patterns

Optional: patterns to scan inside files (not just file paths). Use sparingly — content
scanning is slow on large repos.

| Pattern | Severity | Action |
|---------|----------|--------|
| `api[_-]?key\s*=` | warn | flag |
| `password\s*=` | error | block |
| `-----BEGIN.*KEY-----` | error | block |

## Inheritance

If this policy is scoped within a larger policy (e.g., directory scope within project scope),
declare the parent policy:

```
Parent: POLICY-YYYY-MM-DD-project-default
Override: tighten default to restrictive for this directory
```

## Audit Log

Record context-access activity during the applicable session or task.

```
Session: <session-id>
Task: <task-id>
Files allowed: N
Files blocked: N (list reasons)
Files flagged: N (list reasons)
Review notes: <findings, policy adjustment recommendations>
```

## Ghi chú tiếng Việt

Template chính sách ngữ cảnh: định nghĩa phạm vi (project/directory/task/session), chế độ
mặc định (restrictive/permissive), ba loại luật (block/allow/flag), mẫu nhạy cảm nội dung,
kế thừa từ policy cha, và nhật ký kiểm toán. Dùng với
`skills/core/context-policy/SKILL.md`. Lấy cảm hứng từ `yvgude/lean-ctx`, viết lại hoàn
toàn nguyên bản.
