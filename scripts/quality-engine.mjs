#!/usr/bin/env node
// quality-engine.mjs — dependency-free quality gate runner for Vibe Coding OS v2.0.
//
// Reads templates/quality-engine-config.json (or .quality-engine.json in cwd) and
// templates/quality-gate-manifest.json.  Runs enabled gates, aggregates results,
// and exits 0 if all critical gates pass, 1 otherwise.

import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// ---------------------------------------------------------------------------
// Defaults (used when config / manifest files are missing or incomplete)
// ---------------------------------------------------------------------------
const DEFAULT_CONFIG = {
  version: '1.0.0',
  model_profile: 'standard',
  enabled_gates: [
    'repo-structure', 'references', 'registry-schemas', 'traceability',
    'injection-scan', 'secret-scan', 'quality-diff-audit', 'quality-scorecard-report'
  ],
  disabled_gates: [],
  gate_overrides: {},
  telemetry_enabled: false
};

const DEFAULT_MANIFEST = {
  version: '1.0.0',
  gates: [
    { id: 'repo-structure', name: 'Repo structure', script: 'scripts/validate-repo.mjs', level: 'critical', timeout: 30, auto_fixable: false, category: 'quality' },
    { id: 'references', name: 'References', script: 'scripts/validate-references.mjs', level: 'critical', timeout: 30, auto_fixable: false, category: 'quality' },
    { id: 'registry-schemas', name: 'Registry schemas', script: 'scripts/validate-schemas.mjs', level: 'critical', timeout: 30, auto_fixable: false, category: 'quality' },
    { id: 'traceability', name: 'Traceability', script: 'scripts/validate-traceability.mjs', level: 'warning', timeout: 30, auto_fixable: false, category: 'quality' },
    { id: 'injection-scan', name: 'Injection scan', script: 'scripts/validate-injection.mjs', level: 'critical', timeout: 60, auto_fixable: false, category: 'security' },
    { id: 'secret-scan', name: 'Secret scan', script: 'scripts/validate-secrets.mjs', level: 'critical', timeout: 60, auto_fixable: false, category: 'security' },
    { id: 'quality-diff-audit', name: 'Quality diff audit', script: 'scripts/validate-quality-diff.mjs', level: 'warning', timeout: 30, auto_fixable: false, category: 'quality' },
    { id: 'quality-scorecard-report', name: 'Quality scorecard report', script: 'scripts/quality-scorecard-report.mjs', level: 'advisory', timeout: 30, auto_fixable: true, category: 'quality' }
  ]
};

// Profile presets map to gate subsets (used only when --profile flag is given)
const PROFILE_GATES = {
  lean: ['repo-structure', 'injection-scan', 'secret-scan', 'quality-diff-audit'],
  standard: [
    'repo-structure', 'references', 'registry-schemas', 'traceability',
    'injection-scan', 'secret-scan', 'quality-diff-audit', 'quality-scorecard-report'
  ],
  heavy: [
    'repo-structure', 'references', 'registry-schemas', 'pack-schemas',
    'traceability', 'injection-scan', 'secret-scan', 'memory-redaction',
    'cli-smoke-tests', 'dashboard-data', 'quality-diff-audit', 'quality-scorecard-report'
  ]
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function parseArgs(argv) {
  const args = { outputJson: false, gates: null, profile: null, totalTimeoutMs: null };
  for (const arg of argv) {
    if (arg === '--output-json') args.outputJson = true;
    else if (arg.startsWith('--profile=')) args.profile = arg.slice('--profile='.length).trim();
    else if (arg.startsWith('--gates=')) args.gates = arg.slice('--gates='.length).split(',').map(v => v.trim()).filter(Boolean);
    else if (arg.startsWith('--timeout-ms=')) args.totalTimeoutMs = Number(arg.slice('--timeout-ms='.length));
  }
  return args;
}

function readJsonIfExists(path) {
  if (!existsSync(path)) return null;
  try { return JSON.parse(readFileSync(path, 'utf8')); }
  catch (error) { return { __readError: `Could not parse ${path}: ${error.message}` }; }
}

function deepMerge(base, override) {
  if (!override || typeof override !== 'object') return base;
  const out = Array.isArray(base) ? [...base] : { ...base };
  for (const [key, value] of Object.entries(override)) {
    if (value && typeof value === 'object' && !Array.isArray(value) &&
        base && typeof base[key] === 'object' && !Array.isArray(base[key])) {
      out[key] = deepMerge(base[key], value);
    } else {
      out[key] = value;
    }
  }
  return out;
}

function isLevelCritical(level) {
  return String(level || 'warning').toLowerCase() === 'critical';
}

function normalizeGates(raw) {
  const gates = Array.isArray(raw) ? raw : Array.isArray(raw?.gates) ? raw.gates : [];
  return gates.map((gate) => ({
    id: gate.id || gate.name || `gate-${Math.random().toString(36).slice(2, 6)}`,
    name: gate.name || gate.id || 'Unnamed gate',
    enabled: gate.enabled !== false,
    critical: isLevelCritical(gate.level ?? gate.severity ?? 'warning'),
    // `timeout` is seconds in the v2.0 manifest; `timeoutMs` is already milliseconds.
    timeoutMs: gate.timeoutMs ? Number(gate.timeoutMs) : (Number(gate.timeout ?? 30) * 1000),
    script: gate.script || '',
    command: gate.command || '',
    args: Array.isArray(gate.args) ? gate.args : undefined,
    category: gate.category || 'uncategorized',
    auto_fixable: !!gate.auto_fixable
  }));
}

function gateCommand(gate) {
  if (gate.command) return { command: gate.command, args: gate.args || [] };
  if (gate.script) return { command: 'node', args: [gate.script] };
  // Fallback: derive script path from id
  return { command: 'node', args: [`scripts/${gate.id}.mjs`] };
}

// ---------------------------------------------------------------------------
// Run a single gate (returns Promise)
// ---------------------------------------------------------------------------
function runGate(gate, remainingMs) {
  return new Promise((resolve) => {
    const started = Date.now();
    // Enforce per-gate timeout but cap at remaining total time
    const limit = Math.max(1000, Math.min(gate.timeoutMs, remainingMs));
    const { command, args } = gateCommand(gate);
    let stdout = '';
    let stderr = '';
    let timedOut = false;

    const child = spawn(command, args, {
      cwd: ROOT,
      stdio: ['ignore', 'pipe', 'pipe']
    });

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGTERM');
      // Force kill if graceful shutdown doesn't work
      setTimeout(() => { try { child.kill('SIGKILL'); } catch {} }, 1000).unref();
    }, limit);

    child.stdout.on('data', (chunk) => { stdout += chunk.toString(); });
    child.stderr.on('data', (chunk) => { stderr += chunk.toString(); });
    child.on('error', (error) => { stderr += `${error.message}\n`; });
    child.on('close', (code, signal) => {
      clearTimeout(timer);
      const durationMs = Date.now() - started;
      const passed = !timedOut && code === 0;
      resolve({
        id: gate.id,
        name: gate.name,
        critical: gate.critical,
        category: gate.category,
        auto_fixable: gate.auto_fixable,
        passed,
        timedOut,
        status: typeof code === 'number' ? code : null,
        signal: signal || null,
        durationMs,
        command: [command, ...args].join(' '),
        stdout: stdout.trim(),
        stderr: (timedOut ? `${stderr}\nTimed out after ${limit}ms.` : stderr).trim()
      });
    });
  });
}

// ---------------------------------------------------------------------------
// Output formatting
// ---------------------------------------------------------------------------
function formatDuration(ms) {
  return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(2)}s`;
}

function printHumanSummary(output) {
  const { profile, startedAt, durationMs, totalTimeoutMs, summary, warnings, results } = output;
  console.log('=== Vibe Coding OS Quality Engine ===');
  console.log(`Profile: ${profile}`);
  console.log(`Started: ${startedAt}`);
  console.log('');
  for (const result of results) {
    const icon = result.passed ? '✅' : result.critical ? '❌' : '⚠️';
    const kind = result.critical ? 'critical' : 'advisory';
    console.log(`${icon} ${result.name} (${kind}): ${result.passed ? 'PASS' : result.timedOut ? 'TIMEOUT' : 'FAIL'} (${formatDuration(result.durationMs)})`);
    if (!result.passed && (result.stderr || result.stdout)) {
      const lines = `${result.stderr || result.stdout}`.split('\n').filter(Boolean).slice(-5);
      for (const line of lines) console.log(`  ${line}`);
    }
  }
  console.log('');
  if (warnings.length) {
    console.log('Warnings:');
    for (const w of warnings) console.log(`- ${w}`);
    console.log('');
  }
  console.log(`Overall: ${summary.passed}/${summary.total} gates passed in ${formatDuration(durationMs)}`);
  console.log(summary.criticalFailures === 0
    ? 'Result: PASS (no critical gate failures)'
    : `Result: FAIL (${summary.criticalFailures} critical gate failure(s))`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const args = parseArgs(process.argv.slice(2));
  const warnings = [];

  // Read external config files (files may not exist — handled gracefully)
  const templateConfig = readJsonIfExists(resolve(ROOT, 'templates/quality-engine-config.json'));
  const localConfig = readJsonIfExists(resolve(ROOT, '.quality-engine.json'));
  const rawManifest = readJsonIfExists(resolve(ROOT, 'templates/quality-gate-manifest.json'));

  for (const item of [templateConfig, localConfig, rawManifest]) {
    if (item?.__readError) warnings.push(item.__readError);
  }

  // Merge configs (local overrides template)
  let config = deepMerge(DEFAULT_CONFIG, templateConfig && !templateConfig.__readError ? templateConfig : null);
  config = deepMerge(config, localConfig && !localConfig.__readError ? localConfig : null);
  const manifest = rawManifest && !rawManifest.__readError ? rawManifest : DEFAULT_MANIFEST;

  // Determine which gates to run
  // Priority: --gates flag > --profile flag > config enabled_gates > default
  const profileName = args.profile || config.model_profile || 'standard';
  const allGates = normalizeGates(manifest);

  let gateFilter;
  if (args.gates) {
    // Explicit --gates flag
    gateFilter = new Set(args.gates);
  } else if (args.profile && PROFILE_GATES[args.profile]) {
    // --profile flag: use the hardcoded profile gate sets
    gateFilter = new Set(PROFILE_GATES[args.profile]);
  } else if (config.enabled_gates && Array.isArray(config.enabled_gates)) {
    // Config's enabled_gates list
    const enabledSet = new Set(config.enabled_gates);
    if (config.disabled_gates && Array.isArray(config.disabled_gates)) {
      for (const d of config.disabled_gates) enabledSet.delete(d);
    }
    gateFilter = enabledSet;
  } else {
    // No config: use first 8 gates from manifest
    gateFilter = new Set(allGates.slice(0, 8).map(g => g.id));
  }

  // Apply gate_overrides from config
  const gateOverrides = config.gate_overrides || {};
  const gates = allGates.filter((gate) => {
    if (!gate.enabled) return false;
    if (!gateFilter.has(gate.id) && !gateFilter.has(gate.name)) return false;
    // Apply overrides (timeout in overrides is also in seconds, matching manifest convention)
    if (gateOverrides[gate.id]) {
      const { timeout, timeoutMs, ...override } = gateOverrides[gate.id];
      if (timeout != null) gate.timeoutMs = Number(timeout) * 1000;
      if (timeoutMs != null) gate.timeoutMs = Number(timeoutMs);
      Object.assign(gate, override);
    }
    return true;
  });

  if (gates.length === 0) {
    warnings.push('No gates selected to run.');
  }

  // Timing — CLI flag overrides config which overrides default
  const configTimeout = Number(config.total_timeout_ms || config.max_execution_time_ms || 0);
  const totalTimeoutMs = Number(args.totalTimeoutMs) || configTimeout || 120000;
  const startedAt = new Date();
  const started = Date.now();
  const results = [];

  // Run gates sequentially
  for (const gate of gates) {
    const elapsed = Date.now() - started;
    const remaining = totalTimeoutMs - elapsed;
    if (remaining <= 0) {
      results.push({
        id: gate.id, name: gate.name, critical: gate.critical,
        category: gate.category, auto_fixable: gate.auto_fixable,
        passed: false, timedOut: true,
        status: null, signal: null, durationMs: 0,
        command: gateCommand(gate).command + ' ' + (gateCommand(gate).args || []).join(' '),
        stdout: '', stderr: `Total quality engine timeout exceeded after ${totalTimeoutMs}ms.`
      });
      continue;
    }
    results.push(await runGate(gate, remaining));
  }

  const durationMs = Date.now() - started;
  const criticalFailures = results.filter(r => r.critical && !r.passed);
  const advisoryFailures = results.filter(r => !r.critical && !r.passed);

  const output = {
    engine: 'quality-engine',
    version: 2,
    profile: profileName,
    startedAt: startedAt.toISOString(),
    finishedAt: new Date().toISOString(),
    durationMs,
    totalTimeoutMs,
    passed: criticalFailures.length === 0,
    summary: {
      total: results.length,
      passed: results.filter(r => r.passed).length,
      failed: results.filter(r => !r.passed).length,
      criticalFailures: criticalFailures.length,
      advisoryFailures: advisoryFailures.length
    },
    warnings,
    results
  };

  if (args.outputJson) {
    console.log(JSON.stringify(output, null, 2));
  } else {
    printHumanSummary(output);
  }

  process.exit(output.passed ? 0 : 1);
}

main().catch((error) => {
  const fallback = { engine: 'quality-engine', passed: false, error: error.message };
  if (process.argv.includes('--output-json')) console.log(JSON.stringify(fallback, null, 2));
  else console.error(`Quality engine failed: ${error.message}`);
  process.exit(1);
});
