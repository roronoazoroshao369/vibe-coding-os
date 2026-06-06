# vibe-spec

## Purpose

Create or update a concise implementation spec before coding. Capture intent, goals, non-goals, constraints, user-visible behavior, edge cases, acceptance criteria, open questions, and verification strategy.

## When to use

Use this command before non-trivial implementation, when requirements are ambiguous, when a change affects user-facing behavior or repository structure, or when an existing spec needs to be refreshed after new facts are discovered.

## Required inputs

- User request or product requirement.
- Existing spec path, if updating rather than creating.
- Relevant context from `vibe-init`, issue notes, prior memory, or repository docs.
- Known constraints, deadlines, non-goals, and validation requirements.

## Step-by-step workflow

1. Restate the user's intent in plain language and identify the target users or maintainers.
2. Inspect the relevant existing files, templates, registries, and instructions before drafting requirements.
3. Check `references/index.json` before using upstream inspiration, then read only the relevant source or feature mapping docs.
4. Separate goals from non-goals so implementation scope stays reviewable.
5. Define expected behavior, important edge cases, data or security constraints, and compatibility concerns.
6. Write acceptance criteria that can be checked by review, tests, or explicit validation commands.
7. Document open questions. Ask only the questions that would materially change the implementation.
8. Save or present the spec using the repository's spec conventions.

## Output format

Produce a spec with these sections:

- **Intent**
- **Goals**
- **Non-goals**
- **Constraints and assumptions**
- **User-visible behavior**
- **Edge cases**
- **Acceptance criteria**
- **Verification strategy**
- **Open questions**

## Verification expectation

Verify the spec against the original request and repository constraints. If the spec touches reference files or upstream-derived ideas, plan to run `npm run validate:references`; for broader repository changes, plan to run `npm run validate` after implementation.

## Stop/ask-clarifying-question condition

Stop and ask when acceptance criteria cannot be defined, requirements conflict, required inputs are missing, the user asks for behavior that violates repository policy, or upstream material would need license or attribution review before adaptation.

## Related skills/templates

- `skills/core/spec-first-development/SKILL.md`
- `skills/core/clarify-before-code/SKILL.md`
- `skills/prompts/ask-when-confused/SKILL.md`
- `templates/spec-template.md`
