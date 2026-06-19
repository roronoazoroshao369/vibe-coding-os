# Reference: yvgude/lean-ctx

## Metadata

- Repo: https://github.com/yvgude/lean-ctx
- Owner: yvgude
- Name: lean-ctx
- Category: context-control
- Status: tracked
- Import mode: inspiration
- License: Apache-2.0 (2.7k★)
- Last checked: 2026-06-19
- Last known commit: unknown

## Why this repo matters

`yvgude/lean-ctx` (2,700+ stars, Apache-2.0) introduces the concept of policy-based context
control for AI coding agents. The core insight is that not all files in a repository should
be loaded into an agent's context window — some contain secrets, private configuration,
credentials, or large dependency trees that waste context budget and create privacy risk.

The repo provides a rule-based system where agents define which files and directories are
allowed, blocked, or flagged for review. This brings data-loss-prevention (DLP) thinking to
AI-assisted development: treat the context window as a scoped resource with explicit access
controls, not an implicit full-repository dump.

## Key concepts

- Policy-based context control: define rules for what enters the agent's context.
- Three rule types: allow (explicitly permitted), block (excluded entirely), flag (permitted
  but logged for review).
- Severity levels: error (stops processing), warn (logs warning), info (logs quietly).
- Default modes: restrictive (block unless allowed) and permissive (allow unless blocked).
- File patterns and directory rules using glob syntax.
- Sensitive content patterns for scanning inside files.

## Features to study

| Feature | Why it matters | Local equivalent | Status | Target local files |
|---------|---------------|------------------|--------|-------------------|
| policy-based-context-control | Brings DLP discipline to agent context management. | `skills/core/context-policy/SKILL.md` | implemented | `skills/core/context-policy/SKILL.md` |
| allow-block-flag-rules | Three-action rule system for granular control. | Allow/Block/Flag rules in context-policy skill | implemented | `templates/context-policy-template.md` |
| severity-levels | Error/warn/info determines violation response. | Severity levels in context-policy skill | implemented | `skills/core/context-policy/SKILL.md` |
| default-modes | Restrictive vs permissive defaults for different scopes. | `default-mode` in policy | implemented | `templates/context-policy-template.md` |
| sensitive-content-patterns | Scanning file contents for sensitive data patterns. | Content pattern rules in context-policy skill | implemented | `skills/core/context-policy/SKILL.md` |
| scope-declaration | Policy applies to project, directory, task, or session. | Scope types in context-policy skill | implemented | `templates/context-policy-template.md` |

## Applied to Vibe Coding OS

- Policy-based context control with allow/block/flag action system.
- Scope declaration (project, directory, task, session).
- Default modes (restrictive, permissive) with guidance on when to use each.
- Severity levels (error, warn, info) mapped to rule violation responses.
- Sensitive content pattern scanning for in-file data patterns.
- Ingress filtering workflow: policies checked before files enter context.
- Integration with privacy filter as defense-in-depth pipeline.
- Post-session audit log for reviewing flagged access.

## Not applied to Vibe Coding OS

- The upstream repository's specific rule file format or CLI tool.
- Any runtime policy daemon, inotify watcher, or network-level DLP.
- Real-time content inspection engine or streaming file scanner.
- Upstream code, rule definitions, or documentation text (no vendoring).

## Local mapping

- `skills/core/context-policy/SKILL.md` — Policy-based context control skill
- `templates/context-policy-template.md` — Policy definition template
- `skills/memory/privacy-filter/SKILL.md` — Enhanced with context-policy reference
- `docs/workflows/context-engineering.md` — Enhanced with policy-based context section

## Upstream structure notes

Observed during initial tracking (do not copy content): the upstream repo provides a
`.claude/settings/` based configuration system for context rules, with a CLI tool for
checking policy compliance. The core innovation is the rule taxonomy (allow/block/flag)
and the concept of treating context as a controlled resource. Vibe Coding OS adapts these
concepts into an original policy framework using its own template format, workflow
conventions, and integration with the existing privacy filter.

## Ghi chú tiếng Việt

Nguồn cảm hứng `yvgude/lean-ctx` (2.7k★, Apache-2.0): kiểm soát ngữ cảnh theo chính sách
với ba loại luật (allow/block/flag), mức độ nghiêm trọng (error/warn/info), chế độ mặc định
(restrictive/permissive), và quét nội dung nhạy cảm. Vibe Coding OS chuyển thành
skill/template nguyên bản tích hợp với privacy filter thành pipeline phòng thủ theo chiều
sâu. Không copy upstream.
