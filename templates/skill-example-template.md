---
description: "Template for per-skill usage examples (CLI invocation, code block, expected output)."
---

# Skill Example Template

## When to fill

When you write a new skill, attach 1-3 usage examples to the skill's SKILL.md in an `## Examples` section, or as standalone files in `examples/<skill-name>/`. This template is the canonical structure.

## Structure

```yaml
---
skill: <skill-name>
example_id: <unique-id>
difficulty: trivial | standard | advanced
---

# Example: <short title>

## Scenario

<1-2 sentence description of the situation>

## Invocation

<CLI command, code block, or agent prompt>

## Expected output

<What the user should see — pass/fail, success criterion, artifact path>

## Failure modes

<What could go wrong, with mitigations>
```
