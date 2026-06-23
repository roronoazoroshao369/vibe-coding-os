/**
 * runtime/core/doctor.mjs — Runtime health diagnostics
 *
 * Provides comprehensive checks for runtime state, configuration,
 * schema integrity, and store health. Used by `vibe doctor` CLI.
 *
 * Returns a structured report with checks, warnings, and recommendations.
 */

import { existsSync, statSync, readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadConfig } from './config.mjs';
import { createStore } from './fs-store.mjs';
import { getStateMachineSummary } from './task-state-machine.mjs';
import { getEventMetadata } from './event-store.mjs';

// Project root: doctor.mjs lives at runtime/core/doctor.mjs, so ../../ is the project root.
const PROJECT_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

// ---------------------------------------------------------------------------
// Check runner
// ---------------------------------------------------------------------------

function makeCheck(name, fn) {
  return { name, run: fn };
}

// ---------------------------------------------------------------------------
// Individual checks
// ---------------------------------------------------------------------------

const checks = [
  makeCheck('runtime_directory', async (root) => {
    const store = createStore(root);
    const exists = existsSync(store.runtimeDir);
    return {
      status: exists ? 'pass' : 'warn',
      message: exists ? `Runtime directory exists: ${store.runtimeDir}` : `No runtime directory at ${store.runtimeDir}`,
      recommendation: exists ? null : 'Run `vibe init` to initialize runtime',
    };
  }),

  makeCheck('config_file', async (root) => {
    const store = createStore(root);
    const configFile = join(store.runtimeDir, 'config.json');
    if (!existsSync(configFile)) {
      return {
        status: 'info',
        message: 'No config.json — using defaults',
        recommendation: 'Optional: create .omc/runtime/config.json for customization',
      };
    }
    try {
      const config = loadConfig(store);
      return {
        status: 'pass',
        message: `Config loaded (maxRiskLevel: ${config.runtime?.maxRiskLevel}, requireApproval: ${config.runtime?.requireApproval})`,
      };
    } catch (err) {
      return {
        status: 'warn',
        message: `Config file has errors: ${err.message}`,
        recommendation: 'Fix config.json or delete it to use defaults',
      };
    }
  }),

  makeCheck('task_store', async (root) => {
    const store = createStore(root);
    const file = join(store.runtimeDir, 'tasks.json');
    if (!existsSync(file)) {
      return { status: 'info', message: 'No task store (empty state)' };
    }
    try {
      const data = JSON.parse(readFileSync(file, 'utf8'));
      const items = data.items || [];
      const statusCounts = {};
      for (const t of items) {
        statusCounts[t.status] = (statusCounts[t.status] || 0) + 1;
      }
      return {
        status: 'pass',
        message: `Task store: ${items.length} tasks (${Object.entries(statusCounts).map(([k, v]) => `${k}:${v}`).join(', ')})`,
        data: { count: items.length, statusCounts },
      };
    } catch {
      return { status: 'warn', message: 'Task store is corrupted' };
    }
  }),

  makeCheck('approval_store', async (root) => {
    const store = createStore(root);
    const file = join(store.runtimeDir, 'approvals.json');
    if (!existsSync(file)) {
      return { status: 'info', message: 'No approval store (empty state)' };
    }
    try {
      const data = JSON.parse(readFileSync(file, 'utf8'));
      const items = data.items || [];
      const pending = items.filter(a => a.approval?.status === 'required' || a.approval?.status === 'pending').length;
      const denied = items.filter(a => a.approval?.status === 'denied').length;
      return {
        status: denied > 0 ? 'warn' : 'pass',
        message: `Approvals: ${items.length} total, ${pending} pending, ${denied} denied`,
        data: { total: items.length, pending, denied },
      };
    } catch {
      return { status: 'warn', message: 'Approval store is corrupted' };
    }
  }),

  makeCheck('event_store', async (root) => {
    const store = createStore(root);
    const file = join(store.runtimeDir, 'events.jsonl');
    if (!existsSync(file)) {
      return { status: 'info', message: 'No event store (empty state)' };
    }
    try {
      const meta = await getEventMetadata(store);
      return {
        status: 'pass',
        message: `Event store: ${meta.totalEvents} events (seq: ${meta.nextSeq - 1}), ${meta.fileSize} bytes`,
        data: meta,
      };
    } catch (err) {
      return { status: 'warn', message: `Event store check failed: ${err.message}` };
    }
  }),

  makeCheck('schema_validation', async () => {
    const summary = getStateMachineSummary();
    return {
      status: 'pass',
      message: `State machine: ${summary.states.length} states, ${summary.transitions.length} transition groups, ${summary.guardCount} guards`,
    };
  }),

  makeCheck('skills_installed', async (root) => {
    const skillsDir = join(root, '.vibe', 'skills');
    if (!existsSync(skillsDir)) {
      return {
        status: 'info',
        message: 'No .vibe/skills/ directory',
        recommendation: 'Run `vibe install-pack <name>` to install skill packs',
      };
    }
    const packs = existsSync(skillsDir)
      ? readdirSync(skillsDir).filter(f => {
          try { return statSync(join(skillsDir, f)).isDirectory(); } catch { return false; }
        })
      : [];
    return {
      status: packs.length > 0 ? 'pass' : 'info',
      message: packs.length > 0 ? `Installed packs: ${packs.join(', ')}` : 'No skill packs installed',
    };
  }),

  makeCheck('lock_health', async (root) => {
    const store = createStore(root);
    const lockDir = join(store.runtimeDir, 'locks');
    if (!existsSync(lockDir)) {
      return { status: 'pass', message: 'No lock directory (clean state)' };
    }
    const { readdirSync } = await import('node:fs');
    const locks = readdirSync(lockDir);
    if (locks.length === 0) {
      return { status: 'pass', message: 'No active locks' };
    }
    // Check for stale locks (> 10 minutes)
    const stale = locks.filter(f => {
      try {
        const lockFile = join(lockDir, f);
        const age = Date.now() - statSync(lockFile).mtimeMs;
        return age > 600_000; // 10 minutes
      } catch { return false; }
    });
    return {
      status: stale.length > 0 ? 'warn' : 'pass',
      message: `${locks.length} active locks${stale.length > 0 ? `, ${stale.length} stale (>${10}min)` : ''}`,
      recommendation: stale.length > 0 ? 'Stale locks may need manual cleanup' : null,
      data: { total: locks.length, stale: stale.length },
    };
  }),

  makeCheck('version_check', async () => {
    try {
      const pkgPath = join(PROJECT_ROOT, 'package.json');
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
      const localVersion = pkg.version;

      // Try online check (non-blocking if offline)
      try {
        const { execSync } = await import('node:child_process');
        // Fetch latest tag, take the first line with a v-prefixed semver (skip annotated deref with ^{})
        const out = execSync(
          'git ls-remote --tags --sort=-v:refname https://github.com/roronoazoroshao369/vibe-coding-os.git 2>/dev/null | head -10',
          { encoding: 'utf8', timeout: 5000, stdio: ['pipe', 'pipe', 'pipe'] }
        );
        // First non-^{} entry is the latest
        const tagLines = out.split('\n').map(l => l.split('\t')[1] || '').filter(t => t && !t.includes('^{}'));
        const latest = tagLines.length > 0 ? tagLines[0].replace('refs/tags/', '') : null;

        if (latest && latest !== localVersion) {
          return {
            status: 'warn',
            message: `Local v${localVersion}, latest release is ${latest}`,
            recommendation: `Run \`git pull origin main\` to update to ${latest}`,
            data: { local: localVersion, latest, updateAvailable: true },
          };
        }
        return {
          status: 'pass',
          message: `v${localVersion} — up to date`,
          data: { local: localVersion, latest, updateAvailable: false },
        };
      } catch {
        // Offline or network error — just report local version
        return {
          status: 'info',
          message: `v${localVersion} — could not check latest (offline)`,
          data: { local: localVersion, latest: null, updateAvailable: null },
        };
      }
    } catch {
      return { status: 'info', message: 'No package.json — version unknown' };
    }
  }),
];

// ────────────────────────────────────────────────────────────────────────────
// Main doctor function
// ---------------------------------------------------------------------------

/**
 * Run all health checks and return a structured report.
 *
 * @param {string} root - Project root directory
 * @returns {object} Health report
 */
export async function runDoctor(root = process.cwd()) {
  const startTime = Date.now();
  const results = [];
  const store = createStore(root);

  for (const check of checks) {
    const checkStart = Date.now();
    try {
      const result = await check.run(root);
      results.push({
        name: check.name,
        ...result,
        duration: Date.now() - checkStart,
      });
    } catch (err) {
      results.push({
        name: check.name,
        status: 'error',
        message: `Check failed: ${err.message}`,
        duration: Date.now() - checkStart,
      });
    }
  }

  const passCount = results.filter(r => r.status === 'pass').length;
  const warnCount = results.filter(r => r.status === 'warn').length;
  const errorCount = results.filter(r => r.status === 'error').length;
  const infoCount = results.filter(r => r.status === 'info').length;

  return {
    timestamp: new Date().toISOString(),
    root,
    duration: Date.now() - startTime,
    summary: {
      total: results.length,
      pass: passCount,
      warn: warnCount,
      error: errorCount,
      info: infoCount,
      healthy: errorCount === 0 && warnCount === 0,
      operational: errorCount === 0,
      clean: errorCount === 0 && warnCount === 0,
    },
    healthy: errorCount === 0 && warnCount === 0,
    operational: errorCount === 0,
    clean: errorCount === 0 && warnCount === 0,
    metadataConsistent: warnCount === 0,
    checks: results,
  };
}

/**
 * Format doctor report for CLI output.
 */
export function formatDoctorReport(report) {
  const statusIcon = { pass: '✅', warn: '⚠️', error: '❌', info: 'ℹ️' };
  const lines = [
    `🔍 Runtime Health Check — ${report.root}`,
    `   ${report.timestamp}`,
    '',
  ];

  for (const check of report.checks) {
    const icon = statusIcon[check.status] || '?';
    lines.push(`${icon} ${check.name}: ${check.message}`);
    if (check.recommendation) {
      lines.push(`   💡 ${check.recommendation}`);
    }
  }

  lines.push('');
  const { pass, warn, error, info } = report.summary;
  const health = report.summary.healthy ? '✅ HEALTHY' : '❌ ISSUES FOUND';
  lines.push(`${health} — ${pass} pass, ${warn} warn, ${error} error, ${info} info (${report.duration}ms)`);

  return lines.join('\n');
}
