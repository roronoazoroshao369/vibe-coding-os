import { mkdir, writeFile, readFile, rm, rename } from 'node:fs/promises';
import { existsSync, watch } from 'node:fs';
import path from 'node:path';
import { nowIso } from '../core/ids.mjs';
import { ensureRuntime } from '../core/fs-store.mjs';
import { appendEvent } from '../core/events.mjs';
import { nextReadyTask } from '../tasks/task-store.mjs';

// Opt-in long-running runtime daemon. Pure Node (fs.watch), no heavy deps.
// NEVER auto-starts: callers must explicitly invoke runDaemon().

export function daemonDir(store) {
  return path.join(store.runtimeDir, 'daemon');
}

function paths(store) {
  const dir = daemonDir(store);
  return {
    dir,
    pidFile: path.join(dir, 'daemon.pid'),
    heartbeatFile: path.join(dir, 'heartbeat.json'),
    stopFile: path.join(dir, 'daemon.stop')
  };
}

async function ensureDaemonDir(store) {
  await ensureRuntime(store);
  await mkdir(daemonDir(store), { recursive: true });
}

function pidAlive(pid) {
  if (!pid) return false;
  try { process.kill(pid, 0); return true; } catch (err) { return err.code === 'EPERM'; }
}

export async function readStatus(store) {
  const { pidFile, heartbeatFile } = paths(store);
  if (!existsSync(pidFile)) return { running: false };
  const pid = Number((await readFile(pidFile, 'utf8')).trim());
  const alive = pidAlive(pid);
  let heartbeat = null;
  if (existsSync(heartbeatFile)) {
    try { heartbeat = JSON.parse(await readFile(heartbeatFile, 'utf8')); } catch { heartbeat = null; }
  }
  return { running: alive, pid, stale: !alive, heartbeat };
}

async function writeHeartbeat(store, data) {
  const { heartbeatFile } = paths(store);
  const tmp = `${heartbeatFile}.${process.pid}.tmp`;
  await writeFile(tmp, `${JSON.stringify({ schemaVersion: 1, ...data }, null, 2)}\n`, 'utf8');
  await rename(tmp, heartbeatFile);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Default work handler: surface the next ready task. Override via options.handler.
async function defaultHandler(store) {
  const task = await nextReadyTask(store);
  return task ? { kind: 'task.ready', id: task.id, title: task.title } : null;
}

export async function runDaemon(store, options = {}) {
  const intervalMs = Math.max(250, Number(options.intervalMs) || 2000);
  const maxIterations = Number(options.maxIterations) > 0 ? Number(options.maxIterations) : Infinity;
  const handler = typeof options.handler === 'function' ? options.handler : defaultHandler;
  const { dir, pidFile, heartbeatFile, stopFile } = paths(store);

  await ensureDaemonDir(store);

  const existing = await readStatus(store);
  if (existing.running) throw new Error(`daemon already running (pid ${existing.pid})`);
  if (existsSync(stopFile)) await rm(stopFile, { force: true });

  await writeFile(pidFile, String(process.pid), 'utf8');
  await appendEvent(store, 'daemon.started', { pid: process.pid, intervalMs, maxIterations: maxIterations === Infinity ? null : maxIterations });

  let iterations = 0;
  let dirty = true; // run once immediately
  let stopReason = null;

  const watcher = watch(store.runtimeDir, { persistent: false }, () => { dirty = true; });
  const onSignal = () => { stopReason = 'signal'; };
  process.once('SIGINT', onSignal);
  process.once('SIGTERM', onSignal);

  try {
    while (!stopReason) {
      if (existsSync(stopFile)) { stopReason = 'stopfile'; break; }
      if (iterations >= maxIterations) { stopReason = 'maxIterations'; break; }

      let processed = null;
      if (dirty) {
        dirty = false;
        try {
          processed = await handler(store);
          if (processed) await appendEvent(store, 'daemon.work', processed);
        } catch (err) {
          await appendEvent(store, 'daemon.error', { message: err.message });
        }
      }

      iterations += 1;
      await writeHeartbeat(store, { pid: process.pid, iterations, lastBeat: nowIso(), lastWork: processed, intervalMs });
      await sleep(intervalMs);
    }
  } finally {
    watcher.close();
    process.removeListener('SIGINT', onSignal);
    process.removeListener('SIGTERM', onSignal);
    await rm(pidFile, { force: true });
    await rm(stopFile, { force: true });
    await appendEvent(store, 'daemon.stopped', { pid: process.pid, iterations, reason: stopReason });
  }

  return { iterations, reason: stopReason };
}

// Signal a running daemon to stop via kill switch file, then escalate to SIGTERM.
export async function stopDaemon(store) {
  const { stopFile, pidFile } = paths(store);
  const status = await readStatus(store);
  if (!status.running) {
    if (status.stale && existsSync(pidFile)) { await rm(pidFile, { force: true }); return { stopped: false, cleared: 'stale-pidfile' }; }
    return { stopped: false, reason: 'not-running' };
  }
  await ensureDaemonDir(store);
  await writeFile(stopFile, nowIso(), 'utf8');
  try { process.kill(status.pid, 'SIGTERM'); } catch { /* may already be exiting */ }
  return { stopped: true, pid: status.pid };
}
