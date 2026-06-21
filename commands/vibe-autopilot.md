---
description: "Configure and run the autopilot loop with policy-based action control for automated tool execution."
---

# vibe-autopilot

## Purpose

Run a policy-controlled autopilot loop that automatically executes tools and actions according to defined allow/deny rules. The autopilot distinguishes automated execution from manual mode by enforcing a `Policy` object that gates every action by risk level, approval requirement, and call-count limits.

## When to use

Use when:
- You want to delegate routine tool calls to an automated loop.
- You need controlled, audited batch execution of file write, network, or shell actions.
- You want to enforce approval gates on dangerous operations.
- You are building autonomous sub-agents that operate within bounded safety rules.

Do NOT use when:
- Actions require case-by-case human judgment for each step.
- The task involves unconstrained or exploratory operations without a safety policy.

## How to use

```
vibe-autopilot start [--policy <file>]   # Start the autopilot loop
vibe-autopilot stop                       # Stop the running loop
vibe-autopilot status                     # Show loop stats and policy rules
vibe-autopilot policy                     # Print current policy configuration
```

### Arguments

- `--policy <file>` — Path to a JSON policy definition file. If omitted, a safe default policy is used (allow reads, block writes/shell/network).
- `--iterations <n>` — Maximum loop iterations. Default: 100.
- `--auto-approve` — Auto-approve all actions (use with caution).

### Default policy

When no policy file is given, the autopilot uses a conservative default:

| Action pattern | Risk | Approval | Max calls |
| --- | --- | --- | --- |
| file.read | low | auto | unlimited |
| file.write | high | require | 50 |
| shell.command | critical | block | 0 |
| network.request | high | require | 10 |

## Output

The `status` command returns:
- Total actions executed
- Approved / denied / error counts
- Per-rule call usage (current / max)

## Related commands

- `vibe-bypass` — Autonomous bypass loop with different constraints
- `vibe-review` — Review diff against spec and plan
- `vibe-init` — Initialize session with orientation

## Related runtime

- `runtime/autopilot/policy.mjs` — Policy class for allow/deny rules
- `runtime/autopilot/loop.mjs` — Autopilot execution loop core
- `adapters/hooks/autopilot-hook.mjs` — Adapter integration hook
