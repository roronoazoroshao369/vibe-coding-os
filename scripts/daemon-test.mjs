#!/usr/bin/env node
/**
 * daemon-test.mjs — Daemon lifecycle test
 */
import { spawn } from 'node:child_process';
import { existsSync, rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

function parseArgs(argv) {
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--help') flags.help = true;
    else if (a.startsWith('--')) { const k = a.slice(2); const n = argv[i + 1];
      if (n === undefined || n.startsWith('--')) flags[k] = true; else { flags[k] = n; i++; }
    }
  }
  return flags;
}

function usage() {
  console.log(`
Usage: daemon-test

Tests daemon lifecycle: start, verify PID file, stop, verify cleanup.
Supports --interval N (ms) for custom interval.
`.trim());
}

const flags = parseArgs(process.argv.slice(2));
if (flags.help) { usage(); process.exit(0); }

const interval = Number(flags.interval) || 1000;
const pidFile = path.join(ROOT, '.omc', 'runtime', 'daemon', 'daemon.pid');

async function runScript(script, args = []) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [path.join(ROOT, 'scripts', script), ...args], {
      cwd: ROOT,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stdout = ''; let stderr = '';
    child.stdout.on('data', (d) => { stdout += d; });
    child.stderr.on('data', (d) => { stderr += d; });
    child.on('close', (code) => {
      resolve({ code, stdout: stdout.trim(), stderr: stderr.trim() });
    });
    child.on('error', reject);
  });
}

// Wait for PID file to appear
function waitForPidFile(path, maxMs = 10000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const check = () => {
      if (existsSync(path)) return resolve(true);
      if (Date.now() - start > maxMs) return reject(new Error('PID file not found within timeout'));
      setTimeout(check, 50);
    };
    check();
  });
}

// Wait for file removal
function waitForFileRemoved(p, maxMs = 10000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const check = () => {
      if (!existsSync(p)) return resolve(true);
      if (Date.now() - start > maxMs) return reject(new Error('PID file still exists after stop'));
      setTimeout(check, 50);
    };
    check();
  });
}

let exitCode = 0;

try {
  // Ensure runtime is initialized
  await runScript('runtime-init.mjs');

  // Start daemon with short interval and 1 iteration
  console.log(`Starting daemon (interval: ${interval}ms, maxIterations: 1)...`);
  const startChild = spawn(process.execPath, [path.join(ROOT, 'scripts', 'runtime-daemon.mjs'), 'start', '--interval', String(interval), '--maxIterations', '1'], {
    cwd: ROOT,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  // Wait for PID file
  await waitForPidFile(pidFile);
  console.log('PID file found — daemon started.');

  // Let daemon run a few beats
  await new Promise(r => setTimeout(r, Math.max(interval * 2, 500)));

  // Stop daemon
  console.log('Stopping daemon...');
  const stopResult = await runScript('runtime-daemon.mjs', ['stop']);
  console.log(`Stop result: ${stopResult.stdout || stopResult.stderr}`);

  // Verify PID file cleaned up
  await waitForFileRemoved(pidFile);
  console.log('PID file cleaned up after stop.');

  console.log('✅ Daemon lifecycle test passed.');
} catch (err) {
  console.error(`❌ Daemon lifecycle test failed: ${err.message}`);
  exitCode = 1;
}

process.exit(exitCode);
