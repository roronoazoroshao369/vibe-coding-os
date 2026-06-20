---
name: skills-root-readme
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: meta
tags: [skills, template, meta]
status: stable
---

# Skills Root Template

This file is a template for the canonical SKILL.md structure. The actual skills live in `skills/<category>/<skill-name>/SKILL.md`.

## Canonical structure

```markdown
---
name: <skill-name>
version: 1.0.0
introduced_in: <version>
last_reviewed: <date>
category: <category>
tags: [<tag-1>, <tag-2>]
status: <stable|beta|draft|abandoned>
---

# Skill: <Title>

## Purpose

<1-2 sentences>

## When to use

<3-5 trigger phrases>

## Inputs

<list>

## Workflow

<numbered steps>

## Outputs

<list>

## Failure modes

<numbered list with mitigations>

## Verification checklist

<- [ ] check 1
- [ ] check 2

## Related skills

<links>
```
