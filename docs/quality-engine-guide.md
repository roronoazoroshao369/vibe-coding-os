# Quality Engine Guide

## What is it?

The Quality Engine is a coordinated quality pass for a task or repository. It selects relevant gates, runs them with an appropriate depth profile, and produces structured results plus a concise markdown report.

Use it to avoid ad hoc verification: one command chooses the right checks, captures timing, and recommends fixes.

## Quick start

1. Describe the task or changed area.
2. Choose a profile:
   - `lean` for small, low-risk changes
   - `standard` for normal implementation work
   - `heavy` for risky, cross-cutting, security, data, or release-bound changes
3. Run `/vibe-quality-engine` with the task description, profile, and optional config path.
4. Review blockers first, then warnings.
5. Apply fixes and rerun the failed gates.

Example request:

```text
/vibe-quality-engine profile=standard task="Validate the API endpoint changes before PR"
```

## Configuration

The engine loads project configuration first, then defaults. A config can define:

- Enabled or disabled gates
- Gate ordering
- Profile defaults
- Warning and failure thresholds
- Report output preferences
- Project-specific exclusions

If no config is present, use defaults and state that defaults were applied.

## Profiles

### lean

Fastest profile for small, low-risk changes. Runs the most relevant gates only and favors quick signal over deep inspection.

### standard

Default profile for most work. Balances coverage, speed, and evidence quality. Use for normal feature, bug fix, refactor, and documentation work.

### heavy

Deepest profile for high-risk changes. Use for auth, data migrations, security-sensitive work, public APIs, release branches, or broad refactors.

## Gate list

Common gates include:

- Scope and acceptance criteria check
- Repository context and pattern check
- Test or validation command selection
- Static validation or lint check where available
- Task-specific checklist selection
- Self-review pass
- Adversarial review pass for higher-risk work
- Report and recommendation generation

Exact gates depend on config, task type, and selected profile.

## Custom gates

Projects can define custom gates when default checks are not enough. A good gate has:

- A clear name and purpose
- Required inputs
- A deterministic pass, warn, or fail result
- Evidence for failures
- Recommended remediation
- Estimated runtime or timeout

Prefer small composable gates over one large opaque review.

## Integration with existing quality checks

The Quality Engine should orchestrate existing checks, not replace them. Reuse project commands such as test, lint, typecheck, schema validation, traceability validation, or smoke tests when available.

Recommended integration pattern:

1. Discover existing quality commands from project docs or package scripts.
2. Map each command to a gate.
3. Assign gates to `lean`, `standard`, or `heavy` profiles.
4. Run the smallest profile that matches task risk.
5. Include command output summaries in the final report.
