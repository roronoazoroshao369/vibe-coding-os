#!/usr/bin/env node
// session-metrics-collector.mjs — aggregate quality telemetry events into session metrics.
// Dependency-free collector for docs/metrics/quality-events.ndjson.

import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DEFAULT_EVENTS_PATH = resolve(ROOT, 'docs', 'metrics', 'quality-events.ndjson');

function parseArgs(argv) {
  const args = { since: null, model: null, outputJson: false, eventsPath: DEFAULT_EVENTS_PATH };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--output-json') args.outputJson = true;
    else if (arg === '--since' && argv[i + 1]) args.since = argv[++i];
    else if (arg.startsWith('--since=')) args.since = arg.slice('--since='.length);
    else if (arg === '--model' && argv[i + 1]) args.model = argv[++i];
    else if (arg.startsWith('--model=')) args.model = arg.slice('--model='.length);
    else if (arg === '--events' && argv[i + 1]) args.eventsPath = resolve(ROOT, argv[++i]);
    else if (arg.startsWith('--events=')) args.eventsPath = resolve(ROOT, arg.slice('--events='.length));
  }
  return args;
}

function toDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function readNdjson(path) {
  if (!existsSync(path)) return { events: [], warnings: [`Event file not found: ${path}`] };
  const warnings = [];
  const lines = readFileSync(path, 'utf8').split(/\r?\n/);
  const events = [];
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index].trim();
    if (!line) continue;
    try {
      events.push(JSON.parse(line));
    } catch (error) {
      warnings.push(`Skipping invalid JSON on line ${index + 1}: ${error.message}`);
    }
  }
  return { events, warnings };
}

function valueAt(object, paths, fallback = undefined) {
  for (const path of paths) {
    const parts = path.split('.');
    let current = object;
    for (const part of parts) current = current?.[part];
    if (current !== undefined && current !== null && current !== '') return current;
  }
  return fallback;
}

function normalizeEvent(event) {
  const timestamp = valueAt(event, ['timestamp', 'data.timestamp', 'time', 'data.time', 'createdAt', 'data.createdAt', 'startedAt', 'data.startedAt', 'finishedAt', 'data.finishedAt']);
  const sessionId = String(valueAt(event, ['data.sessionId', 'sessionId', 'session_id', 'data.session_id', 'session.id', 'data.session.id', 'trace.sessionId'], 'unknown-session'));
  const gateId = String(valueAt(event, ['data.gateId', 'gateId', 'gate_id', 'data.gate_id', 'gate.id', 'data.gate.id', 'gate', 'id', 'name'], 'unknown-gate'));
  const modelId = String(valueAt(event, ['data.modelId', 'modelId', 'model_id', 'data.model_id', 'model.id', 'data.model.id', 'model', 'metadata.modelId'], 'unknown-model'));
  const taskType = String(valueAt(event, ['data.taskType', 'taskType', 'task_type', 'data.task_type', 'task.type', 'data.task.type', 'task', 'metadata.taskType'], 'unknown-task'));
  const durationMs = Number(valueAt(event, ['data.duration', 'data.durationMs', 'durationMs', 'durationMillis', 'duration_ms', 'data.durationMillis', 'data.duration_ms', 'duration', 'gate.durationMs', 'data.gate.durationMs'], 0)) || 0;
  const status = String(valueAt(event, ['data.status', 'status', 'data.result', 'result', 'data.outcome', 'outcome', 'data.gate.status', 'gate.status'], '')).toLowerCase();
  const passedValue = valueAt(event, ['data.pass', 'data.passed', 'passed', 'success', 'ok', 'data.success', 'data.ok', 'gate.passed', 'data.gate.passed']);
  const passed = typeof passedValue === 'boolean'
    ? passedValue
    : ['pass', 'passed', 'success', 'ok', 'true'].includes(status);
  return { ...event, timestamp, sessionId, gateId, modelId, taskType, durationMs, passed };
}

function percentage(value) {
  return Math.round(value * 10000) / 100;
}

function topEntries(map, limit = 5) {
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([gate, count]) => ({ gate, count }));
}

export function collectMetrics(options = {}) {
  const eventsPath = options.eventsPath || DEFAULT_EVENTS_PATH;
  const sinceDate = toDate(options.since);
  const { events: rawEvents, warnings } = readNdjson(eventsPath);
  if (options.since && !sinceDate) warnings.push(`Invalid --since date ignored: ${options.since}`);

  const events = rawEvents
    .map(normalizeEvent)
    .filter((event) => !sinceDate || (toDate(event.timestamp)?.getTime() ?? 0) >= sinceDate.getTime())
    .filter((event) => !options.model || event.modelId === options.model);

  const sessionMap = new Map();
  const gateMap = new Map();

  for (const event of events) {
    if (!sessionMap.has(event.sessionId)) {
      sessionMap.set(event.sessionId, {
        sessionId: event.sessionId,
        gatesRun: 0,
        gatesPassed: 0,
        gatesFailed: 0,
        passRate: 0,
        duration: 0,
        durationMs: 0,
        modelId: event.modelId,
        taskType: event.taskType,
        startedAt: event.timestamp || null,
        finishedAt: event.timestamp || null,
        gates: []
      });
    }
    const session = sessionMap.get(event.sessionId);
    session.gatesRun += 1;
    session.gatesPassed += event.passed ? 1 : 0;
    session.gatesFailed += event.passed ? 0 : 1;
    session.durationMs += event.durationMs;
    session.duration = session.durationMs;
    session.modelId = session.modelId === 'unknown-model' ? event.modelId : session.modelId;
    session.taskType = session.taskType === 'unknown-task' ? event.taskType : session.taskType;
    session.gates.push({ gateId: event.gateId, passed: event.passed, durationMs: event.durationMs, timestamp: event.timestamp });
    if (event.timestamp && (!session.startedAt || event.timestamp < session.startedAt)) session.startedAt = event.timestamp;
    if (event.timestamp && (!session.finishedAt || event.timestamp > session.finishedAt)) session.finishedAt = event.timestamp;

    if (!gateMap.has(event.gateId)) gateMap.set(event.gateId, { gateId: event.gateId, totalRuns: 0, totalPasses: 0, totalFailures: 0, durationTotalMs: 0, avgDuration: 0, avgDurationMs: 0 });
    const gate = gateMap.get(event.gateId);
    gate.totalRuns += 1;
    gate.totalPasses += event.passed ? 1 : 0;
    gate.totalFailures += event.passed ? 0 : 1;
    gate.durationTotalMs += event.durationMs;
  }

  const sessions = [...sessionMap.values()].map((session) => ({
    ...session,
    passRate: session.gatesRun ? percentage(session.gatesPassed / session.gatesRun) : 0
  })).sort((a, b) => String(a.startedAt).localeCompare(String(b.startedAt)) || a.sessionId.localeCompare(b.sessionId));

  const gates = [...gateMap.values()].map((gate) => ({
    gateId: gate.gateId,
    totalRuns: gate.totalRuns,
    totalPasses: gate.totalPasses,
    totalFailures: gate.totalFailures,
    passRate: gate.totalRuns ? percentage(gate.totalPasses / gate.totalRuns) : 0,
    avgDuration: gate.totalRuns ? Math.round(gate.durationTotalMs / gate.totalRuns) : 0,
    avgDurationMs: gate.totalRuns ? Math.round(gate.durationTotalMs / gate.totalRuns) : 0
  })).sort((a, b) => b.totalRuns - a.totalRuns || a.gateId.localeCompare(b.gateId));

  const modelGroups = new Map();
  for (const session of sessions) {
    if (!modelGroups.has(session.modelId)) modelGroups.set(session.modelId, { modelId: session.modelId, sessions: [], gateRuns: new Map(), gateFailures: new Map() });
    const model = modelGroups.get(session.modelId);
    model.sessions.push(session);
    for (const gate of session.gates) {
      model.gateRuns.set(gate.gateId, (model.gateRuns.get(gate.gateId) || 0) + 1);
      if (!gate.passed) model.gateFailures.set(gate.gateId, (model.gateFailures.get(gate.gateId) || 0) + 1);
    }
  }

  const models = [...modelGroups.values()].map((model) => ({
    modelId: model.modelId,
    totalSessions: model.sessions.length,
    avgPassRate: model.sessions.length ? percentage(model.sessions.reduce((sum, session) => sum + session.passRate, 0) / (model.sessions.length * 100)) : 0,
    topGates: topEntries(model.gateRuns),
    commonlyFailedGates: topEntries(model.gateFailures)
  })).sort((a, b) => b.totalSessions - a.totalSessions || a.modelId.localeCompare(b.modelId));

  const totalRuns = gates.reduce((sum, gate) => sum + gate.totalRuns, 0);
  const totalPasses = gates.reduce((sum, gate) => sum + gate.totalPasses, 0);

  return {
    schemaVersion: '2.2.0',
    generatedAt: new Date().toISOString(),
    source: eventsPath,
    filters: { since: sinceDate ? sinceDate.toISOString() : null, model: options.model || null },
    summary: {
      totalEvents: events.length,
      totalSessions: sessions.length,
      totalGateRuns: totalRuns,
      totalGatePasses: totalPasses,
      totalGateFailures: totalRuns - totalPasses,
      overallPassRate: totalRuns ? percentage(totalPasses / totalRuns) : 0
    },
    sessions,
    gates,
    models,
    warnings
  };
}

function formatDuration(ms) {
  return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(2)}s`;
}

function printHuman(metrics) {
  console.log('=== Session Quality Metrics ===');
  console.log(`Source: ${metrics.source}`);
  if (metrics.filters.since) console.log(`Since: ${metrics.filters.since}`);
  if (metrics.filters.model) console.log(`Model: ${metrics.filters.model}`);
  console.log('');
  console.log(`Sessions: ${metrics.summary.totalSessions}`);
  console.log(`Gate runs: ${metrics.summary.totalGateRuns}`);
  console.log(`Overall pass rate: ${metrics.summary.overallPassRate}%`);
  console.log('');
  console.log('Per-gate reliability:');
  if (!metrics.gates.length) console.log('- No gate events found.');
  for (const gate of metrics.gates) {
    console.log(`- ${gate.gateId}: ${gate.totalPasses}/${gate.totalRuns} passed (${gate.passRate}%), avg ${formatDuration(gate.avgDurationMs)}`);
  }
  console.log('');
  console.log('Per-model summary:');
  if (!metrics.models.length) console.log('- No model sessions found.');
  for (const model of metrics.models) {
    const failed = model.commonlyFailedGates[0]?.gate || 'none';
    console.log(`- ${model.modelId}: ${model.totalSessions} session(s), avg pass rate ${model.avgPassRate}%, most failed gate: ${failed}`);
  }
  if (metrics.warnings.length) {
    console.log('');
    console.log('Warnings:');
    for (const warning of metrics.warnings) console.log(`- ${warning}`);
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const metrics = collectMetrics(args);
  if (args.outputJson) console.log(JSON.stringify(metrics, null, 2));
  else printHuman(metrics);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(`Session metrics collector failed: ${error.message}`);
    process.exit(1);
  });
}
