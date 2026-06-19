# Quality Engine Guide

## What is it?

The Quality Engine is a coordinated quality pass for a task or repository. It selects relevant gates, runs them with an appropriate depth profile, and produces structured results plus a concise markdown report.

Use it to avoid ad hoc verification: one command chooses the right checks, captures timing, and recommends fixes.

---

## Quickstart

Run the engine in under 30 seconds:

```bash
# Lean profile — fastest, minimum checks (4 gates)
npm run quality:engine:lean -- --output-json | node scripts/quality-engine-report.mjs --stdin

# Or with explicit flags:
node scripts/quality-engine.mjs --profile=lean --output-json > report.json
node scripts/quality-engine-report.mjs --output-json=report.json

# Combine profile and task-type for targeted gates:
node scripts/quality-engine.mjs --profile=lean --task-type=bugfix --output-json

# Generate a markdown report from the latest run:
npm run quality:engine:report
```

To see all available profiles and task-types, run:

```bash
node scripts/quality-engine.mjs --profile=lean --output-json
# Look for 'selected_gates' and 'skipped_gates' in the JSON output.
```

---

## Configuration

The engine loads project configuration first, then defaults. A config can define:

- Enabled or disabled gates
- Gate ordering
- Profile defaults
- Task-type profiles
- Warning and failure thresholds
- Report output preferences
- Project-specific exclusions

Configuration is loaded from (in priority order):
1. `.quality-engine.json` in the project root (local overrides)
2. `templates/quality-engine-config.json` (template defaults)
3. Built-in defaults

If no config is present, the engine uses sensible defaults and notes that defaults were applied.

---

## Profiles

Profiles control how many gates run and how deep the inspection goes.

### `lean`

**Intended for:** small, low-risk changes (typos, single-file fixes, docs-only).

**Gates:** 4 — repo-structure, injection-scan, secret-scan, quality-diff-audit.

**Behavior:** Fastest profile. Skips references, schema validation, traceability, and heavy analysis. Favours quick signal over deep inspection.

**Command:** `npm run quality:engine:lean`

### `standard`

**Intended for:** normal implementation work, features, bug fixes, refactors, documentation.

**Gates:** 8 — repo-structure, references, registry-schemas, traceability, injection-scan, secret-scan, quality-diff-audit, quality-scorecard-report.

**Behavior:** Default profile. Balances coverage, speed, and evidence quality.

**Command:** `npm run quality:engine` (default)

### `heavy`

**Intended for:** high-risk changes — auth, data migrations, security-sensitive work, public APIs, release branches, broad refactors.

**Gates:** 12 — repo-structure, references, registry-schemas, pack-schemas, traceability, injection-scan, secret-scan, memory-redaction, cli-smoke-tests, dashboard-data, quality-diff-audit, quality-scorecard-report.

**Behavior:** Deepest inspection. Includes schema packing, memory-redaction verification, CLI smoke tests, and dashboard data checks.

**Command:** `npm run quality:engine:heavy`

---

## Task-type selection

The `--task-type` flag narrows the gate selection to gates most relevant to a specific kind of work. When combined with a profile, only the intersection of both gate sets runs.

### Available task types

| Type | Focus | Typical gates |
|------|-------|---------------|
| `feature` | New capabilities | All standard gates + traceability, scorecard |
| `bugfix` | Defect correction | Core gates excluding schema-heavy checks |
| `refactor` | Structural changes | Core gates + smoke tests for CLI confidence |
| `security` | Security-sensitive work | Core gates + memory redaction, deep injection/secret scan |

### Examples

```bash
# Lean security audit — fast, focused on injection and secrets
node scripts/quality-engine.mjs --profile=lean --task-type=security --output-json

# Standard feature validation — full standard set gated by task
node scripts/quality-engine.mjs --profile=standard --task-type=feature --output-json

# Heavy refactor — includes smoke tests for CLI confidence
node scripts/quality-engine.mjs --profile=heavy --task-type=refactor --output-json
```

When `--task-type` is combined with a profile, the engine computes the **intersection** of both gate sets. This means only gates present in both the profile and the task-type list are executed. If the intersection is empty, the task-type gates alone are used as a fallback (with a warning).

If no `--task-type` is specified, the engine falls back to the `task_profile` field in config, or `'any'` (no task-level filtering).

---

## Gate list

Common gates include:

- Repo structure validation
- Reference integrity checks
- Schema validation
- Traceability checks (internal cross-references)
- Injection scan (prompt injection, role hijacking)
- Secret scan (leaked credentials)
- Quality diff audit (regression detection)
- Quality scorecard report (aggregated metrics)
- Memory redaction verification (heavy profile)
- CLI smoke tests (heavy profile)
- Dashboard data checks (heavy profile)

Exact gates depend on config, task type, and selected profile. Run with `--output-json` to see the full `selected_gates` and `skipped_gates` arrays.

---

## Output structure (JSON)

When the `--output-json` flag is used, the engine emits a deterministic, auditable JSON structure with these top-level keys:

```
{
  engine: 'quality-engine',
  version: 2,
  profile: string,           // lean / standard / heavy
  taskType: string,          // feature / bugfix / refactor / security / any
  configVersion: string,
  startedAt: string,         // ISO 8601
  finishedAt: string,        // ISO 8601
  durationMs: number,
  totalTimeoutMs: number,
  passed: boolean,
  selected_gates: string[],  // deterministic ordered list of gate IDs
  skipped_gates: [{id, name, reason}],
  summary: {total, passed, failed, criticalFailures, advisoryFailures},
  warnings: string[],
  results: [...],            // per-gate results with stdout/stderr
  evidence: {                // per-gate evidence snippets
    [gateId]: {command, exitCode, signal, durationMs, timedOut, snippets}
  },
  residual_risks: [{gate, severity, reason}]  // failed/skipped/warning items
}
```

---

## Custom gates

Projects can define custom gates when default checks are not enough. A good gate has:

- A clear name and purpose
- Required inputs
- A deterministic pass, warn, or fail result
- Evidence for failures
- Recommended remediation
- Estimated runtime or timeout

Prefer small composable gates over one large opaque review.

---

## Integration with existing quality checks

The Quality Engine should orchestrate existing checks, not replace them. Reuse project commands such as test, lint, typecheck, schema validation, traceability validation, or smoke tests when available.

Recommended integration pattern:

1. Discover existing quality commands from project docs or package scripts.
2. Map each command to a gate.
3. Assign gates to `lean`, `standard`, or `heavy` profiles.
4. Run the smallest profile that matches task risk.
5. Include command output summaries in the final report.
