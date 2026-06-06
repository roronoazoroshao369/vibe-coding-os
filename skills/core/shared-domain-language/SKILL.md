# Skill: Shared Domain Language

## Purpose

Keep a small, durable vocabulary that makes humans, agents, docs, and code use the same domain terms.

## When to use

Use when terms are ambiguous, a project has repeated concepts, or a change introduces new nouns or workflows.

## Inputs

Current terminology, code names, docs, user language, and conflicts between terms.

## Workflow

1. Inventory important terms from conversation and code.
2. Prefer existing local names unless they mislead.
3. Define terms by behavior and boundaries, not slogans.
4. Note avoid-terms and ambiguities.
5. Update `CONTEXT.md` or a project-context document with concise entries.

## Outputs

Glossary updates, naming guidance, ambiguity notes, and links to affected docs or ADRs.

## Failure modes

Creating a giant dictionary, using marketing language, changing names without implementation follow-through, or storing sensitive details.

## Verification checklist

Definitions are actionable; aliases and avoid-terms are clear; affected files are linked; maintainers can update entries later.

## Ghi chú tiếng Việt

Ngôn ngữ chung giúp agent không hiểu sai domain. Dùng cho glossary trong `CONTEXT.md` và template `templates/project-context-template.md`. Khi upstream đổi cách quản lý context, cập nhật mapping và giữ văn phong địa phương.
