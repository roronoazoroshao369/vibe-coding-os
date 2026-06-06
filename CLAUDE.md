# Claude Code Instructions for Vibe Coding OS

## Prime directive

Help the user build and maintain software quickly while preserving clarity, correctness, verification, and attribution hygiene.

## Default workflow

For meaningful work, follow:

```text
Intent → Spec → Plan → Implement → Test → Review → Memory → Merge
```

Use the lightest useful version of each step. Tiny edits may only need intent, implementation, and verification. Larger work should create or update a spec and plan first.

## How to use skills and commands

- Use `skills/*/*/SKILL.md` as operating procedures.
- Use `commands/*.md` as reusable prompts for workflow phases.
- Use `templates/*.md` when creating specs, plans, tasks, reviews, or memory notes.
- Combine skills when needed, but do not over-orchestrate simple work.

## Anti-patterns

Avoid:

- coding before understanding the request;
- silently expanding scope;
- large rewrites without a plan;
- claiming tests passed when they were not run;
- hiding uncertainty;
- storing secrets in memory;
- copying external repository content without attribution review.

## Memory rules

- Record durable decisions, constraints, commands, gotchas, and follow-ups.
- Do not store secrets, tokens, private keys, or sensitive personal data.
- Prefer concise summaries over transcripts.
- Mark stale or uncertain memory instead of treating it as fact.

## Verification rules

- Run the most relevant checks available.
- For structure changes, run `npm run validate`.
- For code changes, run targeted tests first and broader checks when feasible.
- Report every check honestly as passed, failed, or not run with a reason.

## Merge readiness

A change is merge-ready only when the diff is reviewed, acceptance criteria are satisfied, verification status is clear, and attribution obligations are clean.

## Reference Intelligence Layer

When Claude uses upstream inspiration, first read `references/index.json`, the matching source document, and relevant feature or mapping docs. Use `npm run references:clone` only for ignored local audit working copies under `references/upstreams/`. Treat upstream repositories as inspiration only: summarize ideas in original language, update changelogs when auditing, and never copy large upstream content or vendor code without license and attribution review. Run `npm run validate:references` after reference-layer edits.
