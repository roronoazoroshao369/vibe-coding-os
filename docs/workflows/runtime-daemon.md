# Runtime Daemon

An opt-in, long-running background process for the JSON-first runtime under `.omc/runtime/`. It watches runtime state for changes, processes a work queue, and exposes status — all in pure Node (`fs.watch`, no heavy dependencies).

## Design principles

- **Opt-in only.** The daemon NEVER auto-starts. It runs only when you explicitly invoke `runtime-daemon start`. Nothing in `runtime-init` or any other module spawns it.
- **Pure Node.** Uses `fs.watch` and `setTimeout`. No external watcher library required.
- **Observable.** Writes a pidfile and a heartbeat so other processes (and you) can check liveness.
- **Bounded.** Supports a max-iteration cap and a configurable interval so it can never spin unbounded.
- **Killable.** Stop via the CLI (`stop`), a kill-switch file, or a signal (SIGINT/SIGTERM).

## Files

| File | Purpose |
| --- | --- |
| `runtime/daemon/daemon.mjs` | Watch loop, work queue, status, start/stop logic |
| `scripts/runtime-daemon.mjs` | CLI entry point (`start` / `stop` / `status`) |

State lives under `.omc/runtime/daemon/`:

| File | Purpose |
| --- | --- |
| `daemon.pid` | PID of the running daemon (removed on exit) |
| `heartbeat.json` | Last heartbeat: pid, iteration count, timestamp, last work item |
| `daemon.stop` | Kill-switch. Create it to ask the daemon to stop; removed on exit |

## CLI usage

Run directly with Node:

```bash
# Start the daemon (blocks; runs until stopped)
node scripts/runtime-daemon.mjs start

# Start with a custom interval and an iteration cap (good for testing)
node scripts/runtime-daemon.mjs start --interval 500 --maxIterations 5

# Check whether a daemon is running, and read its heartbeat
node scripts/runtime-daemon.mjs status

# Stop a running daemon (writes the kill-switch + sends SIGTERM)
node scripts/runtime-daemon.mjs stop
```

### Suggested npm script names

The daemon does not edit `package.json`. Suggested scripts for the lead to consolidate:

```json
{
  "runtime:daemon": "node scripts/runtime-daemon.mjs",
  "runtime:daemon:start": "node scripts/runtime-daemon.mjs start",
  "runtime:daemon:stop": "node scripts/runtime-daemon.mjs stop",
  "runtime:daemon:status": "node scripts/runtime-daemon.mjs status"
}
```

## Work queue

By default the daemon polls `nextReadyTask` from the task store each time runtime state changes and emits a `daemon.work` event when a task is ready. The handler is pluggable via `runDaemon(store, { handler })` for callers that embed the daemon programmatically.

## Lifecycle & events

Every transition appends a redacted event to `.omc/runtime/events.jsonl`:

- `daemon.started` — pid, interval, max iterations
- `daemon.work` — the work item processed on a change
- `daemon.error` — handler error message (loop continues)
- `daemon.stopped` — pid, iteration count, stop reason (`signal` / `stopfile` / `maxIterations`)

## Stopping

The loop checks for the kill-switch file and signals on each tick. `stopDaemon` writes `daemon.stop` and sends `SIGTERM`; the daemon cleans up its pidfile and stop-file on exit. Stale pidfiles (process no longer alive) are detected by `status` and cleared by `stop`.

## Safety notes

- Only one daemon runs per runtime dir; `start` refuses to launch if a live daemon is detected.
- The interval is floored at 250ms to avoid tight spins.
- No raw transcripts or secrets are written — events go through the runtime's redaction layer.
