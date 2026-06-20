---
name: multi-platform-skill-guide
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: meta
tags:
  - meta
status: stable
---

# Skill: Multi-Platform Skill Guide — Writing Portable Skills Across Agent Harnesses

## Purpose

Write skills that work reliably across Claude Code, Cursor, Codex CLI, Gemini CLI, GitHub Copilot, and OpenCode without duplication or platform-specific forks. A portable skill uses only concepts and instructions that every harness can interpret, with platform-specific notes kept in sidecar sections.

## When to use

Use when writing a new skill that will be used across multiple agent harnesses, adapting an existing single-platform skill for broader use, auditing skills for portability gaps, or configuring adapter READMEs for skill loading conventions.

## Inputs

Target platform list, each platform's instruction-loading mechanism (CLAUDE.md, AGENTS.md, GEMINI.md, .cursorrules, prompts), the skill's core procedure, and platform-specific capabilities (subagents, workers, parallel chat, file-attachment limits).

## Core principle: write once, annotate for each platform

The skill body contains the platform-agnostic procedure. Platform-specific notes go in annotated sections at the bottom, marked with the platform name. An agent reading the skill skips sections that do not match its harness.

## Platform capability summary

| Capability | Claude Code | Codex CLI | Cursor | Gemini CLI | Copilot | OpenCode |
|---|---|---|---|---|---|---|
| Instruction file | CLAUDE.md | AGENTS.md | .cursorrules | GEMINI.md | .github/copilot-instructions.md | OPENCODE.md |
| Subagent/worker | Native subagents | Delegated workers | Manual chat | Multi-turn sessions | Chat variants | Agent mode |
| Skill attachment | File reference | File reference | Paste into chat | File reference | Prompt context | File reference |
| Parallel execution | Built-in | Workers | Manual | Limited | Limited | Limited |
| File context loading | Automatic per file | Directory-scoped | Chat-attached | Session-start | Context file | Session-scoped |

## Writing portable skills

### Do

- Use generic action verbs: "read", "write", "update", "verify", "check". Avoid tool-specific names like "subagent" unless the section is platform-specific.
- Reference files by path. Every harness can read a file path.
- Keep the skill body focused on behavior, not invocation mechanism. "Run the validation script" works everywhere. "Call the validate subagent" does not.
- Use `## Platform notes` at the end of the skill for platform-specific invocation details.

### Avoid

- Assuming subagents are available (Claude Code has them; Cursor does not by default).
- Assuming automatic prompt injection (Codex reads AGENTS.md; Cursor requires paste).
- Using tool-specific syntax (Claude Code's `<answer>`, Codex's `[FILE]` markers).
- Embedding platform-specific setup steps in the main workflow.

## SKILL.md structure for portability

```
# Skill: Skill Name

## Purpose
(Harness-agnostic description)

## When to use
(Harness-agnostic triggers)

## Inputs
(File paths, context, prior artifacts — all harness-agnostic)

## Workflow
(Steps written with generic verbs and file references)

## Outputs
(Expected artifacts — all harness-agnostic)

## Platform notes

### Claude Code
- Attach this skill via `CLAUDE.md` reference.
- Use subagents for Step 4 when available.

### Codex CLI
- Reference in `AGENTS.md` or paste into session.
- Use delegated workers for Step 4.

### Cursor
- Paste the skill content into chat context.
- Step 4 requires manual parallel chat if done concurrently.

### Gemini CLI
- Reference in `GEMINI.md` or load at session start.
- Multi-turn sessions work for Step 4.

## Failure modes
(Harness-agnostic failure descriptions)
```

## Platform-specific loading conventions

Each adapter README documents how skills are loaded for that harness:

- **Claude Code**: Attach `skills/*/*/SKILL.md` via file reference or `CLAUDE.md` directive.
- **Codex CLI**: Reference skill paths in `AGENTS.md` or paste content into the session prompt.
- **Cursor**: Paste selected skill content into chat context per workflow phase.
- **Gemini CLI**: Point `GEMINI.md` at skill paths or paste content at session start.
- **Copilot**: Reference skill paths in `.github/copilot-instructions.md`.
- **OpenCode**: Include skill references in `OPENCODE.md` or session context.

## Testing portability

Run the skill against at least two harnesses before declaring it portable. Common portability failures:

- Skill uses "subagent" as a verb (not available in Cursor).
- Skill assumes automatic file discovery (Codex scopes to directory).
- Skill references a command that only exists in one harness's CLI.
- Skill assumes the agent can attach files without being told to.

## Outputs

A portable skill body with platform-agnostic core workflow, platform-specific notes section, and adapter README entries that document loading conventions.

## Failure modes

- Writing platform-specific code paths in the main workflow section.
- Assuming every harness supports subagents or parallel execution.
- Forgetting to test the skill on a second harness.
- Making the platform notes section longer than the core workflow.

## Verification checklist

- [ ] Core workflow uses only harness-agnostic verbs and file references.
- [ ] Platform-specific notes are isolated in a dedicated section.
- [ ] Skill has been tested on at least two target harnesses.
- [ ] Adapter README documents how to load this skill type.
- [ ] Registry entry lists `platforms` if skill is not universal.

## Ghi chú tiếng Việt

Viết skill portable: phần thân chỉ dùng hành động chung chung (đọc, ghi, kiểm tra), không dùng tên công cụ riêng. Phần ghi chú riêng cho từng nền tảng ở cuối. Kiểm thử trên ít nhất hai harness trước khi công bố là portable. Tránh giả định subagent hay tự động nạp file.
