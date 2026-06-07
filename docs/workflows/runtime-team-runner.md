# Runtime Team Runner (tmux)

An **opt-in**, pure-Node runner that launches a team spec across parallel
`tmux` panes — one window per role — writes per-role prompt files, collects
each pane's output, and maps results back into the runtime task-store.

It is fully optional: nothing in the core runtime depends on it, and it
degrades gracefully when `tmux` is not installed.

## Why tmux

A team spec describes several roles that can work in parallel. Rather than
serialising them, the runner gives each role its own terminal window inside a
single detached tmux session. You can attach to watch progress live, while the
runner keeps a durable copy of each pane's output on disk.

## Prerequisites

- `tmux` on the `PATH`. If absent, the runner prints install instructions and
  exits non-zero (graceful degrade — no partial state is written).
  - macOS: `brew install tmux`
  - Ubuntu/Debian: `sudo apt install tmux`
  - Fedora: `sudo dnf install tmux`
  - Arch: `sudo pacman -S tmux`
- A team spec already imported into the team-store
  (`node scripts/runtime-team.mjs import <spec.json>`).

## Commands

The CLI lives at `scripts/runtime-team-run.mjs`.

```bash
# Check tmux availability (exit 0 if present, 1 if not)
node scripts/runtime-team-run.mjs check

# List imported team specs with their roles
node scripts/runtime-team-run.mjs list

# Dry-run: print the tmux commands without executing them
node scripts/runtime-team-run.mjs run <teamId> --dry-run

# Launch the session for real
node scripts/runtime-team-run.mjs run <teamId>

# Collect pane outputs and map them into the task-store
node scripts/runtime-team-run.mjs collect <teamId>

# Help
node scripts/runtime-team-run.mjs --help
```

### Options

| Option            | Applies to | Meaning                                            |
| ----------------- | ---------- | -------------------------------------------------- |
| `--team <id>`     | run, collect | Team id (alternative to the positional argument) |
| `--dry-run`       | run        | Print tmux commands without executing              |
| `--command <cmd>` | run        | Command the prompt is piped into (default `claude`)|
| `--no-map`        | collect    | Skip writing results into the task-store           |

## How it works

1. **Prepare** (`prepareTeamRun`): validates the spec, acquires an exclusive
   directory lock for the team (atomic `mkdir .lock`), and writes a
   `prompt.md` for each role under
   `.omc/runtime/teams/<teamId>/<roleName>/`.
2. **Launch** (`launchSession`): creates a detached tmux session named
   `rt-<sanitizedTeamId>`, one window per role. Each window is wired with
   `tmux pipe-pane` so its output is appended to
   `<roleDir>/output.log`, then the role prompt is piped into the configured
   command (`claude` by default).
3. **Collect** (`collectOutputs`): reads each role's `output.log` under an
   exclusive per-role lock. If the log is missing it falls back to
   `tmux capture-pane`.
4. **Map** (`mapResults`): for each role that produced output, creates a task
   in the task-store and marks it completed, tagged with the originating tmux
   session/role.

## Safety properties

- **Exclusive file ownership**: every write path is guarded by an atomic
  `mkdir`-based lock so two runs cannot write the same role directory at once.
- **Name sanitisation**: team and role names are sanitised
  (`[^a-zA-Z0-9_.-]` → `-`, collapsed, trimmed, capped at 64 chars) before they
  reach tmux or the filesystem, preventing session-name / path injection.
- **Graceful degrade**: with no tmux, `run` exits non-zero after printing
  install help; `check` reports `{ available: false }`.
- **No core coupling**: this module imports only existing runtime stores; the
  rest of the runtime never imports it.

## Output layout

```
.omc/runtime/teams/<teamId>/
  .lock/                 # transient run lock
  <role-a>/
    prompt.md
    output.log
  <role-b>/
    prompt.md
    output.log
```

Events (`team.run.prepared`, `team.run.collected`, `team.run.mapped`) are
appended to the runtime event log via the shared `appendEvent` helper.

## Suggested package.json scripts

This runner does **not** modify `package.json`. To wire it up, add:

```json
{
  "scripts": {
    "runtime:team-run": "node scripts/runtime-team-run.mjs",
    "runtime:team-run:check": "node scripts/runtime-team-run.mjs check"
  }
}
```
