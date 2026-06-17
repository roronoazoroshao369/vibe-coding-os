import { mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { makeId, nowIso } from '../core/ids.mjs';
import { appendEvent } from '../core/events.mjs';

const TMUX_PREFIX = 'rt';

// ── Shell-safe quoting -------------------------------------------------------

/** Single-quote a string for POSIX shell safety. */
function shQuote(s) {
  return "'" + String(s).replace(/'/g, "'\\''") + "'";
}

/** Validate the agent command before inserting it into a shell pipeline. */
function assertSafeAgentCommand(command) {
  const value = String(command || '').trim();
  if (!value) throw new Error('[tmux-runner] command must not be empty');
  if (!/^[a-zA-Z0-9_./:-]+( [a-zA-Z0-9_./:=@%+-]+)*$/.test(value)) {
    throw new Error('[tmux-runner] unsafe command: use a simple executable plus safe flags only');
  }
  return value;
}

// ── Tmux availability -------------------------------------------------------

export function checkTmux() {
  try {
    const out = execSync('tmux -V', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    return { available: true, version: out.trim() };
  } catch {
    return { available: false, version: null };
  }
}

export function requireTmux() {
  const r = checkTmux();
  if (!r.available) {
    const msg = [
      '[tmux-runner] tmux is required but not found.',
      '',
      '  macOS:    brew install tmux',
      '  Ubuntu:   sudo apt install tmux',
      '  Fedora:   sudo dnf install tmux',
      '  Arch:     sudo pacman -S tmux',
    ].join('\n');
    throw new Error(msg);
  }
  return r;
}

// ── Name sanitisation (session/window/file safety) --------------------------

export function sanitizeName(raw) {
  return String(raw)
    .replace(/[^a-zA-Z0-9_.-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 64) || 'unnamed';
}

/** Full tmux session name for a team run. */
export function sessionName(teamId) {
  return `${TMUX_PREFIX}-${sanitizeName(teamId)}`;
}

// ── Directory helpers -------------------------------------------------------

function teamDir(store, teamId) {
  return path.join(store.runtimeDir, 'teams', sanitizeName(teamId));
}
function roleDir(store, teamId, roleName) {
  return path.join(teamDir(store, teamId), sanitizeName(roleName));
}

// ── Exclusive dir-based lock (atomic mkdir) ---------------------------------

async function acquireLock(dir, label, timeoutMs = 5000) {
  await mkdir(dir, { recursive: true });
  const lockDir = path.join(dir, '.lock');
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      await mkdir(lockDir);
      return {
        release: async () => { await rm(lockDir, { force: true, recursive: true }); },
      };
    } catch {
      await new Promise(r => setTimeout(r, 150));
    }
  }
  throw new Error(`[tmux-runner] Could not acquire lock for ${label} (${dir})`);
}

// ── Prompt generation -------------------------------------------------------

function generatePrompt(role, teamSpec) {
  const lines = [`# Role: ${role.name}`];
  if (teamSpec.goal) lines.push('', `## Team Goal\n${teamSpec.goal}`);
  if (role.description) lines.push('', `## Description\n${role.description}`);
  if (role.prompt) lines.push('', `## Instructions\n${role.prompt}`);
  if (role.outputFormat) lines.push('', `## Output Format\n${role.outputFormat}`);
  return lines.join('\n');
}

// ── Prepare: validate spec, write prompt files, acquire run lock ------------

/**
 * Prepare a team run by writing prompt files for each role.
 * Returns a run descriptor used by launchSession() / collectOutputs().
 */
export async function prepareTeamRun(store, teamSpec) {
  if (!teamSpec || !teamSpec.id) throw new Error('teamSpec.id is required');
  if (!Array.isArray(teamSpec.roles) || teamSpec.roles.length === 0) {
    throw new Error('teamSpec.roles must be a non-empty array');
  }

  const runId = makeId('run');
  const tDir = teamDir(store, teamSpec.id);

  // Lock the team to prevent concurrent runs
  const lock = await acquireLock(tDir, `team ${teamSpec.id}`);
  try {
    for (const role of teamSpec.roles) {
      const rDir = roleDir(store, teamSpec.id, role.name);
      await mkdir(rDir, { recursive: true });
      await writeFile(path.join(rDir, 'prompt.md'), generatePrompt(role, teamSpec), 'utf8');
    }
    await appendEvent(store, 'team.run.prepared', { teamId: teamSpec.id, runId, roles: teamSpec.roles.length });

    return {
      runId,
      teamId: teamSpec.id,
      name: teamSpec.name || 'Unnamed team',
      sessionName: sessionName(teamSpec.id),
      roles: (() => {
        const sanitized = teamSpec.roles.map(r => ({
          name: sanitizeName(r.name),
          original: r,
          dir: roleDir(store, teamSpec.id, r.name),
        }));
        const nameCounts = {};
        for (const r of sanitized) {
          nameCounts[r.name] = (nameCounts[r.name] || 0) + 1;
        }
        const dupes = Object.entries(nameCounts).filter(([, c]) => c > 1);
        if (dupes.length > 0) {
          throw new Error(`[tmux-runner] duplicate role names after sanitization: ${dupes.map(([n]) => n).join(', ')}. Use unique role names.`);
        }
        return sanitized;
      })(),
      createdAt: nowIso(),
    };
  } finally {
    await lock.release();
  }
}

// ── Launch: create tmux session, one window per role ------------------------

/**
 * Launch a tmux session with one window per role.
 * Each window pipes output to <roleDir>/output.log.
 */
export function launchSession(store, teamRun, options = {}) {
  const { dryRun = false, command: claudeCommand = 'claude' } = options;
  assertSafeAgentCommand(claudeCommand);

  if (!dryRun) requireTmux();

  const sess = teamRun.sessionName;

  if (!dryRun) {
    // Kill any leftover session with the same name
    try { execSync(`tmux kill-session -t "${sess}" 2>/dev/null`, { stdio: 'ignore' }); } catch { /* ok */ }
  }

  for (let i = 0; i < teamRun.roles.length; i++) {
    const role = teamRun.roles[i];
    const win = `${sess}:${role.name}`;
    const outFile = path.join(role.dir, 'output.log');

    if (dryRun) {
      console.log(`[dry-run] tmux new-session -d -s "${sess}" -n "${role.name}"`);
      console.log(`[dry-run] tmux pipe-pane -t "${win}" -o "cat >> ${shQuote(outFile)}"`);
      const promptPath = path.join(role.dir, 'prompt.md');
      console.log(`[dry-run] tmux send-keys -t "${win}" "cat ${shQuote(promptPath)} | ${claudeCommand}" Enter`);
      continue;
    }

    // First role creates the session; subsequent roles get new windows
    if (i === 0) {
      execSync(`tmux new-session -d -s "${sess}" -n "${role.name}"`, { stdio: 'pipe' });
      // Small sleep ensures the session is ready for subsequent commands
      execSync('sleep 0.1', { stdio: 'ignore' });
      execSync(`tmux pipe-pane -t "${win}" -o "cat >> ${shQuote(outFile)}"`, { stdio: 'pipe' });
    } else {
      execSync(`tmux new-window -t "${sess}" -n "${role.name}"`, { stdio: 'pipe' });
      execSync('sleep 0.1', { stdio: 'ignore' });
      execSync(`tmux pipe-pane -t "${win}" -o "cat >> ${shQuote(outFile)}"`, { stdio: 'pipe' });
    }

    // Send the command that runs claude with the role prompt
    const promptPath = path.join(role.dir, 'prompt.md');
    const cmd = `cat ${shQuote(promptPath)} | ${claudeCommand}`;
    execSync(`tmux send-keys -t "${win}" "${cmd}" Enter`, { stdio: 'pipe' });
  }

  if (!dryRun) {
    console.error(`Tmux session "${sess}" launched with ${teamRun.roles.length} role(s).`);
    console.error(`Attach: tmux attach -t "${sess}"`);
    console.error(`Output dir: ${teamDir(store, teamRun.teamId)}`);
  }

  return teamRun;
}

// ── Collect: read output logs for each role ---------------------------------

/**
 * Read output.log files for each role in the team run.
 * Returns an array of { role, output } objects.
 */
export async function collectOutputs(store, teamRun) {
  const results = [];
  for (const role of teamRun.roles) {
    const outFile = path.join(role.dir, 'output.log');
    const lock = await acquireLock(role.dir, `role ${role.name}`, 3000);
    try {
      if (existsSync(outFile)) {
        const raw = await readFile(outFile, 'utf8');
        results.push({ role: role.name, output: raw, file: outFile });
      } else {
        // Fallback: try tmux capture-pane
        const win = `${teamRun.sessionName}:${role.name}`;
        try {
          const captured = execSync(`tmux capture-pane -t "${win}" -p -S -500 2>/dev/null`, {
            encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
          });
          results.push({ role: role.name, output: captured || '', file: null, captured: true });
        } catch {
          results.push({ role: role.name, output: '', file: null, captured: false });
        }
      }
    } finally {
      await lock.release();
    }
  }
  await appendEvent(store, 'team.run.collected', { teamId: teamRun.teamId, runId: teamRun.runId });
  return results;
}

// ── Map results to task-store -----------------------------------------------

/**
 * Create a task in the task-store for each role that produced output.
 * Uses the task-store's createTask export.
 * @param {import('../tasks/task-store.mjs')} taskStore - task-store module
 */
export async function mapResults(store, teamRun, results, taskStore) {
  const created = [];
  for (const r of results) {
    if (!r.output || r.output.trim().length === 0) continue;

    const task = await taskStore.createTask(store, {
      title: `[team-run] ${teamRun.name} → ${r.role}`,
      owner: `tmux:${teamRun.sessionName}/${r.role}`,
      source: `tmux-runner:${teamRun.runId}`,
      dependsOn: [],
    });
    // State machine: pending → in_progress → completed
    await taskStore.updateTaskStatus(store, task.id, 'in_progress');
    const completed = await taskStore.updateTaskStatus(store, task.id, 'completed');
    created.push(completed);
  }
  await appendEvent(store, 'team.run.mapped', {
    teamId: teamRun.teamId, runId: teamRun.runId, tasks: created.length,
  });
  return created;
}

// ── High-level: prepare + launch in one call --------------------------------

/**
 * Full lifecycle: prepare prompt files, launch tmux session.
 * Returns the teamRun descriptor for later collect/map calls.
 */
export async function runTeam(store, teamSpec, options = {}) {
  const teamRun = await prepareTeamRun(store, teamSpec);
  launchSession(store, teamRun, options);
  return teamRun;
}
