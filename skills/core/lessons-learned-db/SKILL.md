---
name: lessons-learned-db
description: Maintain a structured, searchable record of coding mistakes, root causes, fixes, and prevention rules for future similar work.
version: 1.0.0
author: Hermes Agent
license: MIT
platforms:
  - portable
tags:
  - quality
  - memory
  - prevention
  - debugging
---

# Lessons Learned DB

## Purpose

Create and use a structured record of coding mistakes and fixes so agents can learn from local project history. The lessons log captures what went wrong, why it happened, how it was fixed, and the prevention rule to inject before similar future tasks.

## When to use

Use this skill:

- After a bug fix, once the root cause and fix are known.
- After a quality diff audit finding that reveals a repeatable mistake pattern.
- After a review finding, especially when the same issue could recur in future coding tasks.
- Before starting a similar task where past mistakes may provide prevention rules.

## Inputs

- Error description: what failed, where it appeared, and how it was detected.
- Root cause: the specific mistaken assumption, missing check, workflow gap, or implementation defect.
- Fix: the concrete change that resolved the issue.
- Prevention: the rule, checklist item, test pattern, or prompt instruction that would have prevented recurrence.
- Optional metadata: date, severity, model/agent, area, related files, validation command, and source review/audit link.

## Workflow

1. **After the fix, prompt for a lesson**
   - Ask whether the resolved issue represents a reusable mistake pattern.
   - If yes, collect the error, root cause, fix, and prevention rule.
   - If no, record why no durable lesson is needed.

2. **Add an entry to the lessons log**
   - Use `templates/lesson-entry-template.md` for a consistent entry shape.
   - Store entries in the project lessons log location chosen by the repository, such as `docs/lessons-learned/`, `.vibe/lessons-learned/`, or another agreed local path.
   - Keep entries concise, searchable, and free of secrets or sensitive raw logs.

3. **Before similar tasks, search the log**
   - Query by area, file type, error keyword, framework, subsystem, and severity.
   - Prefer recent and high-severity lessons first, but include older lessons when the pattern still applies.
   - Cite the lesson source when injecting guidance into a plan or implementation brief.

4. **Inject prevention rules**
   - Convert matching lessons into explicit pre-coding checks, test requirements, or review checklist items.
   - Add only relevant rules; do not overload the prompt with unrelated history.
   - After implementation, verify whether the injected prevention rules were satisfied.

## Outputs

- New or updated lessons log entry using the standard template.
- Search results for prior lessons relevant to the current task.
- Injected prevention rules added to the implementation plan, brief, review checklist, or final verification notes.
- A short statement when no relevant lessons were found.

## Failure modes

- Recording vague lessons that do not identify a concrete prevention rule.
- Storing secrets, raw private logs, tokens, credentials, or unnecessary personal data.
- Treating every small fix as a durable lesson and creating noisy history.
- Failing to search lessons before repeating work in the same area.
- Injecting stale or irrelevant prevention rules that distract from the current task.
- Recording the symptom but not the root cause.
- Skipping verification that the prevention rule was applied.

## Verification checklist

- [ ] Lesson entry includes error description, root cause, fix, and prevention rule.
- [ ] Entry metadata includes date, severity, model/agent, and area when known.
- [ ] Entry contains no secrets, credentials, private keys, or sensitive raw logs.
- [ ] Similar-task search was performed before implementing related work.
- [ ] Relevant prevention rules were injected into the active workflow.
- [ ] Final verification confirms the prevention rule was satisfied or explains why it did not apply.
