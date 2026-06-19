---
title: "<short descriptive title>"
date: YYYY-MM-DD
status: draft | reviewed | active | superseded
source: "lesson <lessonId> from <sourceRepoName> (<sourceRepoId>)"
scope: global | language | framework | local
tags: [comma, separated, tags]
model: <model-id-that-produced-or-validated-this>
---

# Golden Example: <short descriptive title>

## Problem

<What mistake, anti-pattern, or gotcha does this example prevent? Describe the observable failure mode in terms any developer on any repo can recognize. Use synthetic names and generic paths — no private project data.>

**Bad pattern (do not do this):**

```<language>
// A code snippet or config example that shows the problematic approach.
// Everything here must be safe to show publicly — no secrets, no internal URLs.
```

**Why it fails:**

<The root cause as a re-usable insight, not a one-off bug report. Explain the mechanism (e.g., "Shell interpolation with user input opens injection vectors" rather than "Branch name xyz broke our build").>

## Solution

**Good pattern (preferred approach):**

```<language>
// A code snippet or config example that shows the corrected approach.
// Use synthetic names (e.g. example-project, demo-service, acme-api).
```

**Preservation notes:**

- <What to keep: the invariant that makes this safe, the specific call pattern, etc.>
- <What to parameterize if adapting to another repo.>

## Prevention rule

<One or two sentences that state the rule as a clear, reviewable, or automatable guard. This is what goes into checklists, quality gates, or linter rules.>

**Checklist item:** [ ] <The rule as a review checkbox.>

## Evidence

<Optional but recommended. A link to a passing test run, a quality-gate manifest entry, or a before/after metric that shows the fix prevented recurrence.>

```<language or plaintext>
// Minimal test or assertion that validates the rule.
```

## Provenance

- **Source lesson:** `lessonId` from `sourceRepoName` (`path/to/export.json` — use a real relative link when the export is stored in this repo)
- **Source URI:** `<uri or path to the originating export within this repo>`
- **Reviewed by:** `<maintainer or agent handle>` on YYYY-MM-DD
- **Privacy review:** <link to review record or checklist>
- **Cross-repo verified:** true | false

## Expiry

<Set to null for durable lessons. Set to a specific date for lessons tied to a model version, framework release, or unstable dependency.>

```json
"expiry": null
```

## Relationships

- **Related templates:** [`templates/lesson-entry-template.md`](lesson-entry-template.md), [`templates/quality-rubric.md`](quality-rubric.md)
- **Related commands:** <any commands that implement the prevention rule>
- **Related scripts:** <any automated checks or quality gates>
