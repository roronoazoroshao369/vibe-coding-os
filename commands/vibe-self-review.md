---
description: "Run the self-review checklist on your diff before responding to the user."
---

# vibe-self-review

## When to use
Use before responding to the user after any code changes.

## Required inputs
Your diff, the original request, and verification results.

## Step-by-step behavior
1. Open `templates/self-review-checklist.md`.
2. Work through each checkbox, marking pass or fail for each item.
3. If any item fails, fix the issue or record it as a deferred risk.
4. Report the summary: files changed, verification run, risks/follow-up.
5. Include the completed checklist in your final response.

## Stopping conditions
Do not respond to the user until every checklist item is either pass or explicitly deferred with a documented reason.

## Verification checklist
All checklist items from the template are accounted for. No unchecked items remain.
