#!/usr/bin/env node
// quality-telemetry.mjs — collect v2.2 quality telemetry events from quality engine JSON and scorecard reports.
// Dependency-free, local-first, redacts raw evidence by storing only SHA-256 hashes.

import { createHash, randomUUID } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync, appendFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const VERSION = '2.2.0';
const DEFAULT_OUTPUT = resolve(ROOT, 'docs', 'metrics', 'quality-telemetry-events.ndjson');
const STATUS = new Set(['pass', 'fail', 'warn', 'skip', 'timeout', 'unknown']);

function parseArgs(argv) {
  const args = {
    engine: null,
    scorecard: null,
    output: DEFAULT_OUTPUT,
    append: true,
    json: false,
    dryRun: false,
    modelId: 'unknown',
    taskType: null,
    profile: null,
    help: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') args.help = true;
    else if (arg === '--engine' && argv[i + 1]) args.engine = resolve(ROOT, argv[++i]);
    else if (arg.startsWith('--engine=')) args.engine = resolve(ROOT, arg.slice('--engine='.length));
    else if (arg === '--scorecard' && argv[i + 1]) args.scorecard = resolve(ROOT, argv[++i]);
    else if (arg.startsWith('--scorecard=')) args.scorecard = resolve(ROOT, arg.slice('--scorecard='.length));
    else if (arg === '--output' && argv[i + 1]) args.output = resolve(ROOT, argv[++i]);
    else if (arg.startsWith('--output=')) args.output = resolve(ROOT, arg.slice('--output='.length));
    else if (arg === '--stdout' || arg === '--json') args.json = true;
    else if (arg === '--dry-run') args.dryRun = true;
    else if (arg === '--replace') args.append = false;
    else if (arg === '--model-id' && argv[i + 1]) args.modelId = argv[++i];
    else if (arg.startsWith('--model-id=')) args.modelId = arg.slice('--model-id='.length);
    else if (arg === '--task-type' && argv[i + 1]) args.taskType = argv[++i];
    else if (arg.startsWith('--task-type=')) args.taskType = arg.slice('--task-type='.length);
    else if (arg === '--profile' && argv[i + 1]) args.profile = argv[++i];
    else if (arg.startsWith('--profile=')) args.profile = arg.slice('--profile='.length);
  }
  return args;
}

function printHelp() {
  console.log(`Usage:
  node scripts/quality-telemetry.mjs --engine <quality-engine-output.json> [--scorecard <report.md>] [options]

Options:
  --engine <path>       Quality engine --output-json file
  --scorecard <path>    Quality scorecard report markdown or JSON
  --output <path>       NDJSON output path (default docs/metrics/quality-telemetry-events.ndjson)
  --replace             Replace output file instead of appending
  --stdout, --json      Print events as JSON array
  --dry-run             Transform and validate only; do not write
  --model-id <id>       Model identifier when source does not contain one (default unknown)
  --task-type <type>    Override/inject task type
  --profile <profile>   Override/inject quality profile
  --help, -h            Show this help

Each emitted event follows schemas/quality-telemetry-event.json and stores only a SHA-256 evidence hash, never raw stdout, stderr, prompts, paths from scorecards, or model output.`);
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function sha256(value) {
  return `sha256:${createHash('sha256').update(stableStringify(value)).digest('hex')}`;
}

function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

function normalizeStatus(item) {
  if (item?.timedOut) return 'timeout';
  if (item?.skipped || item?.reason) return 'skip';
  if (typeof item?.passed === 'boolean') return item.passed ? 'pass' : 'fail';
  const raw = String(item?.status ?? item?.result ?? item?.outcome ?? '').toLowerCase();
  if (['passed', 'success', 'ok', 'true'].includes(raw)) return 'pass';
  if (['failed', 'error', 'false'].includes(raw)) return 'fail';
  if (['warning', 'advisory'].includes(raw)) return 'warn';
  return STATUS.has(raw) ? raw : 'unknown';
}

function event(fields) {
  const evt = {
    event_id: fields.event_id || randomUUID(),
    timestamp: fields.timestamp || new Date().toISOString(),
    version: VERSION,
    gate_id: String(fields.gate_id || 'unknown-gate'),
    status: STATUS.has(fields.status) ? fields.status : 'unknown',
    duration_ms: Math.max(0, Math.round(Number(fields.duration_ms || 0))),
    model_id: String(fields.model_id || 'unknown'),
    task_type: String(fields.task_type || 'unknown'),
    profile: String(fields.profile || 'unknown'),
    evidence_hash: fields.evidence_hash,
  };
  validateEvent(evt);
  return evt;
}

function validateEvent(evt) {
  const required = ['event_id', 'timestamp', 'version', 'gate_id', 'status', 'duration_ms', 'model_id', 'task_type', 'profile', 'evidence_hash'];
  for (const key of required) {
    if (evt[key] === undefined || evt[key] === null || evt[key] === '') throw new Error(`Invalid telemetry event: missing ${key}`);
  }
  if (Number.isNaN(Date.parse(evt.timestamp))) throw new Error(`Invalid telemetry event timestamp: ${evt.timestamp}`);
  if (!STATUS.has(evt.status)) throw new Error(`Invalid telemetry event status: ${evt.status}`);
  if (!Number.isInteger(evt.duration_ms) || evt.duration_ms < 0) throw new Error(`Invalid telemetry event duration_ms: ${evt.duration_ms}`);
  if (!/^sha256:[a-f0-9]{64}$/.test(evt.evidence_hash)) throw new Error(`Invalid telemetry event evidence_hash: ${evt.evidence_hash}`);
}

function collectFromEngine(path, options) {
  if (!path) return [];
  if (!existsSync(path)) throw new Error(`Quality engine output not found: ${path}`);
  const run = readJson(path);
  const profile = options.profile || run.profile || 'unknown';
  const taskType = options.taskType || run.taskType || run.task_type || 'unknown';
  const modelId = options.modelId || run.modelId || run.model_id || run.model || 'unknown';
  const timestamp = run.finishedAt || run.startedAt || new Date().toISOString();
  const events = [];

  events.push(event({
    timestamp,
    gate_id: 'quality-engine',
    status: run.passed === true ? 'pass' : run.passed === false ? 'fail' : 'unknown',
    duration_ms: run.durationMs || run.duration_ms || 0,
    model_id: modelId,
    task_type: taskType,
    profile,
    evidence_hash: sha256({
      source: 'quality-engine-summary',
      summary: run.summary,
      warnings_count: Array.isArray(run.warnings) ? run.warnings.length : 0,
      residual_risks_count: Array.isArray(run.residual_risks) ? run.residual_risks.length : 0,
      selected_gates: run.selected_gates,
      skipped_gate_count: Array.isArray(run.skipped_gates) ? run.skipped_gates.length : 0,
    }),
  }));

  for (const result of Array.isArray(run.results) ? run.results : []) {
    const gateId = result.id || result.gate_id || result.gateId || result.name || 'unknown-gate';
    events.push(event({
      timestamp,
      gate_id: gateId,
      status: normalizeStatus(result),
      duration_ms: result.durationMs || result.duration_ms || 0,
      model_id: modelId,
      task_type: taskType,
      profile,
      evidence_hash: sha256({
        source: 'quality-engine-gate',
        gate_id: gateId,
        status: normalizeStatus(result),
        exit_code: result.status ?? null,
        signal: result.signal ?? null,
        timed_out: !!result.timedOut,
        critical: !!result.critical,
        category: result.category || null,
        evidence: run.evidence?.[gateId] ? {
          exitCode: run.evidence[gateId].exitCode ?? null,
          signal: run.evidence[gateId].signal ?? null,
          durationMs: run.evidence[gateId].durationMs ?? null,
          timedOut: !!run.evidence[gateId].timedOut,
        } : null,
      }),
    }));
  }

  for (const skipped of Array.isArray(run.skipped_gates) ? run.skipped_gates : []) {
    const gateId = skipped.id || skipped.gate_id || skipped.gateId || skipped.name || 'unknown-gate';
    events.push(event({
      timestamp,
      gate_id: gateId,
      status: 'skip',
      duration_ms: 0,
      model_id: modelId,
      task_type: taskType,
      profile,
      evidence_hash: sha256({ source: 'quality-engine-skipped-gate', gate_id: gateId, reason: skipped.reason || 'unknown' }),
    }));
  }

  return events;
}

function extractNumber(content, pattern, fallback = 0) {
  const match = content.match(pattern);
  return match ? Number.parseInt(match[1], 10) || fallback : fallback;
}

function scorecardStatus(content) {
  if (/\bBLOCK\b|blocker|regress|risk/i.test(content)) return 'warn';
  if (/no blockers|healthy|pass/i.test(content)) return 'pass';
  return 'unknown';
}

function collectFromScorecard(path, options) {
  if (!path) return [];
  if (!existsSync(path)) throw new Error(`Scorecard report not found: ${path}`);
  const content = readFileSync(path, 'utf8');
  const changedFiles = extractNumber(content, /Changed files[:\s]*(\d+)/i, 0);
  const testsTouched = extractNumber(content, /Tests? (?:touched|added or updated)[:\s]*(\d+)/i, 0);
  const docsTouched = extractNumber(content, /Docs? touched[:\s]*(\d+)/i, 0);
  const warnings = (content.match(/warning|blocker|risk|review|regress/gi) || []).length;
  return [event({
    timestamp: new Date().toISOString(),
    gate_id: 'quality-scorecard-report',
    status: scorecardStatus(content),
    duration_ms: 0,
    model_id: options.modelId || 'unknown',
    task_type: options.taskType || 'unknown',
    profile: options.profile || 'unknown',
    evidence_hash: sha256({
      source: 'quality-scorecard-report',
      changed_files_count: changedFiles,
      tests_touched_count: testsTouched,
      docs_touched_count: docsTouched,
      warning_signal_count: warnings,
      byte_length: Buffer.byteLength(content, 'utf8'),
    }),
  })];
}

function writeEvents(events, options) {
  if (options.dryRun || options.json) return;
  mkdirSync(dirname(options.output), { recursive: true });
  const payload = events.map((evt) => JSON.stringify(evt)).join('\n') + (events.length ? '\n' : '');
  if (options.append) appendFileSync(options.output, payload, 'utf8');
  else writeFileSync(options.output, payload, 'utf8');
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    process.exit(0);
  }
  if (!args.engine && !args.scorecard) {
    console.error('Error: provide --engine <path>, --scorecard <path>, or both. Use --help for usage.');
    process.exit(1);
  }
  const events = [
    ...collectFromEngine(args.engine, args),
    ...collectFromScorecard(args.scorecard, args),
  ];
  writeEvents(events, args);
  if (args.json || args.dryRun) console.log(JSON.stringify(events, null, 2));
  else console.log(`Wrote ${events.length} quality telemetry event(s) to ${args.output}`);
}

main();
