# Feature: Skill orchestration

## Goal

Define how Vibe Coding OS should support skill orchestration as an original local capability while learning from tracked references.

## Reference sources

- obra/superpowers
- github/spec-kit
- yeachan-heo/oh-my-claudecode

## Local implementation

- `registry/skills.json`
- `skills/core/vibe-bootstrap/SKILL.md`
- `commands/vibe-init.md`
- `CLAUDE.md`

## Must-have behavior

- Skills remain composable and independently useful.
- Agents select only the skills required for the current workflow phase.
- Registries make skills discoverable without hidden magic.

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
