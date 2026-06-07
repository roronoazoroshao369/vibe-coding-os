# Team Architecture: <name>

## Intent

- Goal:
- User-visible outcome:
- Non-goals:
- Adaptive Flow tier:

## Domain analysis

| Domain / file area | Why it matters | Owner | Risks | Existing checks |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

## Team pattern

- Selected pattern: Pipeline / Fan-out-Fan-in / Expert Pool / Producer-Reviewer / Supervisor / Hierarchical Delegation
- Why this pattern fits:
- Why a simpler solo flow is insufficient:
- Downshift condition:

## Roles

| Role | Mission | Context bundle | Write scope | Forbidden scope | Output |
| --- | --- | --- | --- | --- | --- |
| Integrator | Own final result and verification. | Full spec/plan/tasks. | Shared docs/registries/final patch. | None beyond user constraints. | Integrated change + evidence. |
|  |  |  |  |  |  |

## Task graph

| Task | Owner | Blocks | Blocked by | Parallel-safe? | Done when |
| --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |

## Handoff contract

Each role reports Scope, Findings/changes, Decisions, Risks, Verification, and Next action.

## Watchdog rules

- Idle timeout:
- Conflict escalation:
- Shared-file serialization rule:
- Stop condition:
- Worktree/isolation policy:

## Validation plan

### Dry-run validation

- Can every role start with its context bundle?
- Are write scopes disjoint or serialized?
- Does every acceptance criterion have an owner and check?
- Does attribution/reference work have one accountable owner?

### Real checks

| Check | Command / method | Owner | Expected result |
| --- | --- | --- | --- |
|  |  |  |  |

## With-team vs without-team comparison

- Solo risk:
- Team cost:
- Team risk reduction:
- Keep/drop team next time:

## Attribution / reference hygiene

- Inspiration sources:
- License status:
- Local files updated:
- No vendored code/text/runtime confirmed: yes/no
