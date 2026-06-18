---
description: "Search, add, or review recent lessons learned from coding mistakes, fixes, reviews, and quality audits."
---

# vibe-lessons-learned

## Purpose

Use the Lessons Learned DB to find prior mistake patterns before similar work, add a new lesson after a fix or finding, or show recent lessons for review.

## When to use

Run when you need to:

- Search/query the lessons log before a similar task.
- Add a new entry after a bug fix, quality diff audit finding, or review finding.
- Show recent lessons to refresh prevention rules before planning or coding.

## Required inputs

For search/query:

- Query terms: area, file path, framework, error keyword, task type, or severity.
- Optional limit or date range.

For add:

- Error description.
- Root cause.
- Fix.
- Prevention rule.
- Metadata: date, severity, model/agent, and area when known.

For recent:

- Optional count, area, or severity filter.

## Step-by-step behavior

1. Identify the requested mode: `search`, `add`, or `recent`.
2. Locate the repository lessons log. Prefer an existing local lessons directory or file; otherwise propose a durable location before writing.
3. For `search`, scan lessons for matching area, keywords, root causes, fixes, and prevention rules. Return the most relevant matches first.
4. For `add`, use `templates/lesson-entry-template.md`, keep the entry concise, and remove secrets or sensitive raw logs before saving.
5. For `recent`, list the newest lessons with severity, area, short error summary, and prevention rule.
6. Convert relevant lessons into prevention rules that can be injected into the current spec, plan, implementation brief, or review checklist.
7. Report exact files read or written and any limitations, such as no lessons log found.

## Outputs

- Search results with matching lesson summaries and prevention rules.
- New lesson entry path when adding a lesson.
- Recent lesson list when requested.
- Prevention rules ready to apply to the active task.

## Stopping conditions

Stop before writing if the lesson would include secrets, credentials, private keys, private personal data, or raw logs that are not needed for prevention. Ask for a sanitized version instead.
