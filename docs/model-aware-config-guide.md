# Model-Aware Config Guide

Model-aware config chooses Quality Engine gates based on **model capability** and **task risk**. Instead of picking checks by hand, you declare the model and the task, and the workflow selects a proportional verification profile.

This is useful when the same task should receive different scrutiny depending on whether a strong or weaker model produced the code.

## Quick start

```bash
npm run quality:model-config -- --model claude-haiku-3.5 --task "add user auth"
```

This will:

1. classify task risk from the description,
2. map the model to a capability profile,
3. select Quality Engine gates, and
4. either run the engine or hand off the selected gates for review.

If you want to inspect available options first:

```bash
npm run quality:model-config -- --list-models
npm run quality:model-config -- --list-tasks
```

## How it works

1. **Classify task risk.**
   The task is rated `low`, `medium`, or `high` using the description and project context. Security, auth, data migrations, production incidents, and broad refactors raise risk.

2. **Select model profile.**
   The model ID maps to a capability tier such as `lean`, `standard`, or `heavy`. Unknown models usually fall back to `standard`, or the project can enforce a stricter default.

3. **Combine model capability + task risk.**
   A strong model on low-risk work may stay light. A weaker model or high-risk task increases rigor. Explicit overrides are allowed but should be justified.

4. **Run adaptive gate selection.**
   The workflow picks required and optional gates using profile, risk, domain signals, weakness memory, and project config.

5. **Execute the Quality Engine.**
   Selected gates run, and results are returned as pass/warn/fail with recommendations.

## Profile reference

- **lean** — minimal checks, fast feedback, low evidence burden. Best for trivial or low-risk changes.
- **standard** — balanced speed and rigor. Default for most tasks.
- **heavy** — broad, deep checks with stronger evidence expectations. Use for high-risk or safety-sensitive work.

You can also let the system choose automatically. Manual overrides are useful when you have domain knowledge the classifier cannot see.

## Model profile examples

Common patterns:

- `claude-haiku-3.5` or other small/fast models may default toward tighter verification for code-heavy tasks.
- `claude-sonnet` or `gpt-4` class models may use standard verification by default.
- Unknown local models may be treated conservatively depending on project policy.

If your project needs custom behavior, maintain a project-level config that defines:

- model ID / alias mapping,
- default profiles per model,
- unknown-model fallback policy,
- task-risk thresholds,
- any required or blocked gates.

## Custom model profiles

A custom model profile is useful when your team wants stricter or lighter defaults than the generic mapper.

Common additions:

- strong models on low-risk work: allow `lean` with a short note,
- weaker models on security or data work: force `standard` or `heavy`,
- unknown models: default to `standard` and raise a warning,
- regulated or sensitive repositories: forbid `lean` for high-risk tasks.

Keep profiles simple. The goal is **proportional verification**, not bureaucratic process.

## Task risk signals

Risk usually rises when a change:

- touches auth, tokens, sessions, or permissions,
- modifies database schema or migrations,
- affects APIs with external consumers,
- changes frontend state, navigation, or critical UI flows,
- touches async jobs, queues, retries, or idempotency,
- risks data loss or rollback complexity,
- broadens blast radius across many files or services.

Risk usually falls when a change is:

- documentation-only,
- cosmetic or formatting,
- isolated comment or logging edits,
- tiny, reversible, and test-covered.

## Integration with the quality engine

Model-aware config feeds the Quality Engine, not replace it. It decides **which gates** to run and **how much evidence** to expect.

Typical flow:

1. `vibe-model-config` selects the gate set.
2. `quality-engine` executes the selected gates.
3. Results come back with status, timing, and recommendations.

This keeps one execution path for quality while allowing the inputs to adapt.

## Best practices

- Start with automatic selection, and override only when you have a clear reason.
- Record the rationale when you override `--profile`.
- Be careful about skipping gates on auth, data, or production-surface changes.
- Treat warnings as review signals, not noise.
- Review unknown-model fallback policy per repository.
- Keep model profiles and task-risk rules in project config so behavior is predictable.

## Troubleshooting

- **Checks feel too light for a risky task.** Move to `standard` or `heavy`, or update the task-risk classification.
- **Checks feel too heavy for trivial work.** Use `lean` or let automatic selection decide.
- **Unknown model keeps getting the wrong default.** Add the model ID to project config with an explicit profile.
- **Conflicting overrides.** Record the trade-off and choose the stricter path for safety-sensitive work.

## Next steps

- Use `vibe-quality-engine` after gate selection to run the actual checks.
- Pair with model-weakness memory when you want prevention for repeated model-specific failure patterns.
- Pair with adaptive prompt selection when you also want task-type quality packs composed into context.
