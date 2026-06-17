# Team Spec Template

> Typed team role/task specification for coordinated multi-agent work.

## Team

- Name: `{team_name}`
- Goal: `{goal}`
- Orchestration pattern: sequential / parallel / reviewer-gate / swarm-with-integrator

## Roles

Each role should be typed enough for dispatch and handoff.

- Name: `{role_name}`
  - Purpose: `{purpose}`
  - Owned paths: `{owned_paths}`
  - Tools: `{tools}`
  - Validation: `{validation}`
  - Handoff fields: `{handoff_fields}`

## Task Refs

- `{task_id_or_issue_ref}`

## Stop Conditions

- Stop if validation fails and no safe local fix is available.
- Stop if task scope exceeds the stated goal.
- Stop if a secret or sensitive credential would be exposed.

## Handoff Contract

- Summary:
- Files changed:
- Validation run:
- Known issues:
- Next action:
