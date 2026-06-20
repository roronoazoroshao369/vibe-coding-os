---
title: Doubt Log
type: template
name: doubt-log
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: template
tags:

status: stable
---

# Doubt Log

Append-only ledger of in-flight doubt sessions. One entry per decision.

## Format

```
### YYYY-MM-DD — <decision title>

- **Persona:** <name>
- **CLAIM:** <assertion being doubted>
- **LOCATE:** <file:line | ADR-id | registry-path>
- **FOR:** <3 evidence points, each with source>
- **AGAINST:** <3 evidence points, each with source>
- **Adjudication:** keep | modify | reverse | drop
- **Confidence:** <0-100>%
- **Red flags fired:** <list or "none">
- **Next action:** <explicit step, single owner>
- **Context budget impact:** <%>
```

## Entries

<!-- Add new entries below. Do not edit past entries except to add ## Resolution line. -->

