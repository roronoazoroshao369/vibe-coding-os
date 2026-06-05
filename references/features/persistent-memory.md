# Feature: Persistent memory

## Goal

Define how Vibe Coding OS should support persistent memory as an original local capability while learning from tracked references.

## Reference sources

- supermemoryai/supermemory
- thedotmack/claude-mem

## Local implementation

- `skills/memory/project-memory/SKILL.md`
- `skills/memory/session-summarizer/SKILL.md`
- `skills/memory/context-retrieval/SKILL.md`
- `skills/memory/privacy-filter/SKILL.md`
- `templates/memory-template.md`

## Must-have behavior

- Durable decisions are captured with context and confidence.
- Secrets and sensitive personal data are filtered out.
- Stale or uncertain memory is labeled.

## Failure modes

- Copying upstream wording instead of adapting the idea.
- Adding process overhead that does not improve local outcomes.
- Letting a feature become stale because mappings and changelogs are not updated.
- Treating reference popularity as proof that the pattern fits this project.

## Update signals

- A tracked source changes its workflow model, command names, or recommended practices.
- Local users repeatedly hit ambiguity, verification gaps, or memory staleness related to this feature.
- A local skill, command, or template changes enough that mappings need to be refreshed.

## Evaluation ideas

- Can an agent find the relevant local files from this feature document in under a minute?
- Does the feature reduce mistakes without adding unnecessary ceremony?
- Are acceptance criteria, verification, and attribution implications visible?
