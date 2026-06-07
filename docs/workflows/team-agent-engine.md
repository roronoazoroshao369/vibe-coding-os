# Team Agent Scaffold Engine

## Purpose

Generate deterministic team-agent scaffold files for Vibe Coding OS without adding a runtime.

## What it creates

`scripts/scaffold-team.mjs` reads a JSON team spec and emits:

- `.claude/agents/<role>.md` project-local Claude Code subagent definitions;
- `.omc/plans/<team>.md` team architecture and handoff plan;
- optional `.claude/<team>-role-routing.json` snippet that can be copied into `.claude/omc.jsonc` when useful.

The generated files are reviewable markdown/json artifacts. They are not framework agents in `registry/agents.json` and are not installed globally.

## What it does not do

The scaffold engine does **not** run a daemon, tmux session, MCP server, scheduler, worker pool, or custom orchestration runtime. Execution still happens through Claude Code native Team / OMC when available, or by manually invoking generated subagents with scoped prompts.

## Input shape

Use `templates/team-spec-template.json` as the starting point. Required fields:

- `name`: team name;
- `pattern`: one of `Pipeline`, `Fan-out/Fan-in`, `Expert Pool`, `Producer-Reviewer`, `Supervisor`, `Hierarchical Delegation`.

Optional fields include `goal`, `outcome`, `nonGoals`, `roles`, `tasks`, `taskGraph`, `watchdog`, `validation`, and `emitRoleRouting`.

If `roles` is omitted, the generator uses deterministic defaults for the selected pattern.

## Commands

```bash
npm run team:scaffold:dry -- templates/team-spec-template.json
npm run team:scaffold -- templates/team-spec-template.json -- --force
node scripts/scaffold-team.mjs templates/team-spec-template.json --dry-run --out-dir /tmp/team-scaffold
```

Flags:

- `--dry-run`: list outputs without writing;
- `--force`: allow overwriting existing generated paths;
- `--out-dir <dir>`: generate under another root instead of the repo root;
- `--routing`: emit the optional role routing snippet even when the spec does not request it.

## Workflow

1. Fill a JSON spec from `templates/team-spec-template.json`.
2. Run a dry run and inspect the planned paths.
3. Generate into the project or a scratch `--out-dir`.
4. Review generated agents and the plan before use.
5. Run work through Claude Code native Team / OMC when available, or invoke subagents manually with the generated role contracts.
6. Record validation evidence in the generated plan or final handoff.

## Built-in team patterns

- Pipeline: sequential intake → plan → implement → test → review → integrate.
- Fan-out/Fan-in: coordinator assigns parallel domain workers, integrator merges, verifier checks.
- Expert Pool: coordinator gathers specialist opinions, integrator synthesizes.
- Producer-Reviewer: producer writes, reviewer critiques, verifier checks.
- Supervisor: supervisor assigns workers, receives outputs, reviewer checks.
- Hierarchical Delegation: lead coordinates sub-leads, integrator combines results.

## Safety and idempotency

The generator validates required fields, slugs names, rejects unknown models/patterns, and refuses to overwrite existing files unless `--force` is supplied. Prefer dry runs before writing.
