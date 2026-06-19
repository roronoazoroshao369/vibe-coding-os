#!/usr/bin/env node
// quality-telemetry-report.mjs — aggregate quality telemetry events into trend markdown.
// Dependency-free reader for local-first docs/metrics/quality-events.ndjson.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DEFAULT_EVENTS_PATH = join(ROOT, 'docs', 'metrics', 'quality-events.ndjson');
const DEFAULT_OUTPUT_DIR = join(ROOT, 'docs', 'reports', 'quality-telemetry');

function parseArgs(argv) {
  const args = {
    eventsPath: DEFAULT_EVENTS_PATH,
    outputDir: DEFAULT_OUTPUT_DIR,
    output: null,
    since: null,
    until: null,
    model: null,
    taskType: null,
    stdout: false,
    json: false,
    help: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') args.help = true;
    else if (arg === '--stdout') args.stdout = true;
    else if (arg === '--json') args.json = true;
    else if (arg === '--events' && argv[i + 1]) args.eventsPath = resolve(ROOT, argv[++i]);
    else if (arg.startsWith('--events=')) args.eventsPath = resolve(ROOT, arg.slice('--events='.length));
    else if (arg === '--output-dir' && argv[i + 1]) args.outputDir = resolve(ROOT, argv[++i]);
    else if (arg.startsWith('--output-dir=')) args.outputDir = resolve(ROOT, arg.slice('--output-dir='.length));
    else if (arg === '--output' && argv[i + 1]) args.output = resolve(ROOT, argv[++i]);
    else if (arg.startsWith('--output=')) args.output = resolve(ROOT, arg.slice('--output='.length));
    else if (arg === '--since' && argv[i + 1]) args.since = argv[++i];
    else if (arg.startsWith('--since=')) args.since = arg.slice('--since='.length);
    else if (arg === '--until' && argv[i + 1]) args.until = argv[++i];
    else if (arg.startsWith('--until=')) args.until = arg.slice('--until='.length);
    else if (arg === '--model' && argv[i + 1]) args.model = argv[++i];
    else if (arg.startsWith('--model=')) args.model = arg.slice('--model='.length);
    else if (arg === '--task-type' && argv[i + 1]) args.taskType = argv[++i];
    else if (arg.startsWith('--task-type=')) args.taskType = arg.slice('--task-type='.length);
  }
  return args;
}

function printHelp() {
  console.log(`Usage:
  node scripts/quality-telemetry-report.mjs [options]

Options:
  --events <path>       NDJSON event source (default: docs/metrics/quality-events.ndjson)
  --since <date|Nd>     Include events on/after ISO date or relative window, e.g. 7d, 30d
  --until <date>        Include events before/on ISO date
  --model <id>          Filter to a model/profile id
  --task-type <type>    Filter to a task type
  --output-dir <path>   Directory for timestamped markdown reports
  --output <path>       Exact output markdown path
  --stdout             Print markdown instead of writing a file
  --json               Print aggregate JSON instead of markdown
  --help, -h           Show this help`);
}

function parseDateWindow(value, now = new Date()) {
  if (!value) return null;
  const relative = String(value).match(/^(\d+)([dhw])$/i);
  if (relative) {
    const amount = Number(relative[1]);
    const unit = relative[2].toLowerCase();
    const ms = unit === 'd' ? amount * 86400000 : unit === 'h' ? amount * 3600000 : amount * 7 * 86400000;
    return new Date(now.getTime() - ms);
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
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

function readEvents(eventsPath) {
  if (!existsSync(eventsPath)) return { events: [], warnings: [`Event file not found: ${eventsPath}`] };
  const warnings = [];
  const events = [];
  const lines = readFileSync(eventsPath, 'utf8').split(/\r?\n/);
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

function resultFromEvent(event) {
  const explicitStatus = String(valueAt(event, ['status', 'result', 'outcome', 'data.status', 'data.outcomes.status'], '')).toLowerCase();
  const passValue = valueAt(event, ['passed', 'pass', 'success', 'ok', 'data.passed', 'data.pass', 'gate.passed']);
  const warnings = Number(valueAt(event, ['warnings', 'warningCount', 'data.warnings', 'data.outcomes.warnings'], 0)) || 0;
  if (typeof passValue === 'boolean') return passValue ? (warnings > 0 ? 'warn' : 'pass') : 'fail';
  if (['fail', 'failed', 'failure', 'error', 'cancelled'].includes(explicitStatus)) return 'fail';
  if (['warn', 'warning', 'partial'].includes(explicitStatus)) return 'warn';
  if (['pass', 'passed', 'success', 'ok', 'true'].includes(explicitStatus)) return warnings > 0 ? 'warn' : 'pass';
  const gatesFailed = Number(valueAt(event, ['gatesFailed', 'data.gatesFailed'], 0)) || 0;
  if (gatesFailed > 0) return 'fail';
  return warnings > 0 ? 'warn' : 'pass';
}

function normalizeEvent(event) {
  const data = event.data || {};
  const eventType = event.eventType || 'unknown';
  const timestamp = valueAt(event, ['timestamp', 'time', 'createdAt', 'startedAt', 'finishedAt']);
  const sessionId = String(valueAt(event, ['sessionId', 'session_id', 'session.id', 'trace.sessionId', 'data.sessionId'], event.eventId || 'unknown-session'));
  const gateId = String(valueAt(event, ['gateId', 'gate_id', 'gate.id', 'gate', 'id', 'name', 'data.gateId'], eventType === 'quality-engine-run' ? 'quality-engine' : 'unknown-gate'));
  const modelId = String(valueAt(event, ['modelId', 'model_id', 'model.id', 'model', 'metadata.modelId', 'data.modelId', 'data.profile'], 'unknown-model'));
  const taskType = String(valueAt(event, ['taskType', 'task_type', 'task.type', 'task', 'metadata.taskType', 'data.taskType'], 'unknown-task'));
  const durationMs = Number(valueAt(event, ['durationMs', 'durationMillis', 'duration_ms', 'duration', 'data.duration', 'data.durationMs', 'gate.durationMs'], 0)) || 0;
  const gatesRun = Number(valueAt(event, ['gatesRun', 'data.gatesRun'], eventType === 'quality-engine-run' ? 1 : 1)) || 1;
  const gatesPassed = Number(valueAt(event, ['gatesPassed', 'data.gatesPassed'], resultFromEvent(event) === 'fail' ? 0 : 1)) || 0;
  const gatesFailed = Number(valueAt(event, ['gatesFailed', 'data.gatesFailed'], resultFromEvent(event) === 'fail' ? 1 : 0)) || 0;
  const result = resultFromEvent(event);

  return {
    raw: event,
    eventType,
    timestamp,
    date: toDateKey(timestamp),
    sessionId,
    gateId,
    modelId,
    taskType,
    durationMs,
    gatesRun,
    gatesPassed,
    gatesFailed,
    result,
    warnings: Number(valueAt({ ...event, data }, ['warnings', 'warningCount', 'data.warnings', 'data.outcomes.warnings'], 0)) || 0,
  };
}

function toDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function toDateKey(value) {
  const date = toDate(value);
  return date ? date.toISOString().slice(0, 10) : 'unknown';
}

function percentage(numerator, denominator) {
  return denominator ? Math.round((numerator / denominator) * 10000) / 100 : 0;
}

function avg(total, count) {
  return count ? Math.round(total / count) : 0;
}

function ensureBucket(map, key, seed = {}) {
  if (!map.has(key)) {
    map.set(key, {
      key,
      events: 0,
      sessions: new Set(),
      pass: 0,
      warn: 0,
      fail: 0,
      gatesRun: 0,
      gatesPassed: 0,
      gatesFailed: 0,
      durationTotalMs: 0,
      ...seed,
    });
  }
  return map.get(key);
}

function addEvent(bucket, event) {
  bucket.events += 1;
  bucket.sessions.add(event.sessionId);
  bucket[event.result] += 1;
  bucket.gatesRun += event.gatesRun;
  bucket.gatesPassed += event.gatesPassed;
  bucket.gatesFailed += event.gatesFailed;
  bucket.durationTotalMs += event.durationMs;
}

function finalizeBucket(bucket) {
  return {
    key: bucket.key,
    events: bucket.events,
    sessions: bucket.sessions.size,
    pass: bucket.pass,
    warn: bucket.warn,
    fail: bucket.fail,
    passRate: percentage(bucket.pass, bucket.events),
    warnRate: percentage(bucket.warn, bucket.events),
    failRate: percentage(bucket.fail, bucket.events),
    gatePassRate: percentage(bucket.gatesPassed, bucket.gatesRun),
    gatesRun: bucket.gatesRun,
    gatesPassed: bucket.gatesPassed,
    gatesFailed: bucket.gatesFailed,
    avgDurationMs: avg(bucket.durationTotalMs, bucket.events),
  };
}

export function aggregateTelemetry(options = {}) {
  const now = options.now || new Date();
  const sinceDate = parseDateWindow(options.since, now);
  const untilDate = parseDateWindow(options.until, now);
  const { events: rawEvents, warnings } = readEvents(options.eventsPath || DEFAULT_EVENTS_PATH);
  if (options.since && !sinceDate) warnings.push(`Invalid --since value ignored: ${options.since}`);
  if (options.until && !untilDate) warnings.push(`Invalid --until value ignored: ${options.until}`);

  const events = rawEvents
    .map(normalizeEvent)
    .filter((event) => {
      const eventDate = toDate(event.timestamp);
      if (sinceDate && (!eventDate || eventDate < sinceDate)) return false;
      if (untilDate && (!eventDate || eventDate > untilDate)) return false;
      if (options.model && event.modelId !== options.model) return false;
      if (options.taskType && event.taskType !== options.taskType) return false;
      return true;
    });

  const daily = new Map();
  const gates = new Map();
  const models = new Map();
  const taskTypes = new Map();
  const summary = ensureBucket(new Map(), 'summary');

  for (const event of events) {
    addEvent(summary, event);
    addEvent(ensureBucket(daily, event.date), event);
    addEvent(ensureBucket(gates, event.gateId), event);
    addEvent(ensureBucket(models, event.modelId), event);
    addEvent(ensureBucket(taskTypes, event.taskType), event);
  }

  const finalizedGates = [...gates.values()].map(finalizeBucket).sort((a, b) => b.fail - a.fail || a.key.localeCompare(b.key));
  const finalizedModels = [...models.values()].map(finalizeBucket).sort((a, b) => b.events - a.events || a.key.localeCompare(b.key));

  return {
    schemaVersion: '2.2.0',
    generatedAt: now.toISOString(),
    source: options.eventsPath || DEFAULT_EVENTS_PATH,
    filters: {
      since: sinceDate ? sinceDate.toISOString() : null,
      until: untilDate ? untilDate.toISOString() : null,
      model: options.model || null,
      taskType: options.taskType || null,
    },
    summary: finalizeBucket(summary),
    daily: [...daily.values()].map(finalizeBucket).sort((a, b) => a.key.localeCompare(b.key)),
    gates: finalizedGates,
    models: finalizedModels,
    taskTypes: [...taskTypes.values()].map(finalizeBucket).sort((a, b) => b.events - a.events || a.key.localeCompare(b.key)),
    warnings,
  };
}

function formatDuration(ms) {
  return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(2)}s`;
}

function formatDelta(current, previous) {
  if (!previous) return 'n/a';
  const delta = Math.round((current - previous) * 100) / 100;
  if (delta === 0) return '0 pts';
  return `${delta > 0 ? '+' : ''}${delta} pts`;
}

function insightLines(metrics) {
  const lines = [];
  const days = metrics.daily;
  if (days.length >= 2) {
    const previous = days[days.length - 2];
    const current = days[days.length - 1];
    lines.push(`- Latest daily gate pass rate changed ${formatDelta(current.gatePassRate, previous.gatePassRate)} (${previous.key}: ${previous.gatePassRate}%, ${current.key}: ${current.gatePassRate}%).`);
    lines.push(`- Latest daily average duration changed from ${formatDuration(previous.avgDurationMs)} to ${formatDuration(current.avgDurationMs)}.`);
  } else {
    lines.push('- Add at least two days of telemetry to compute day-over-day movement.');
  }

  const weakestGate = metrics.gates.find((gate) => gate.fail > 0 || gate.gatesFailed > 0);
  if (weakestGate) lines.push(`- Highest failure concentration: \`${weakestGate.key}\` (${weakestGate.fail} fail event(s), ${weakestGate.gatePassRate}% gate pass rate).`);

  const modelSpread = metrics.models.filter((model) => model.events > 0);
  if (modelSpread.length >= 2) {
    const sorted = [...modelSpread].sort((a, b) => b.gatePassRate - a.gatePassRate);
    lines.push(`- Model comparison leader: \`${sorted[0].key}\` at ${sorted[0].gatePassRate}% gate pass rate; lowest observed: \`${sorted[sorted.length - 1].key}\` at ${sorted[sorted.length - 1].gatePassRate}%.`);
  }

  if (!metrics.summary.events) lines.push('- No telemetry events matched the selected filters.');
  return lines;
}

export function generateMarkdown(metrics) {
  const lines = [];
  lines.push('# Quality Telemetry Trend Report');
  lines.push('');
  lines.push(`Generated: ${metrics.generatedAt}`);
  lines.push(`Source: \`${metrics.source}\``);
  lines.push('');
  lines.push('## Filters');
  lines.push('');
  lines.push(`- Since: ${metrics.filters.since || 'all available events'}`);
  lines.push(`- Until: ${metrics.filters.until || 'latest available event'}`);
  lines.push(`- Model: ${metrics.filters.model || 'all models'}`);
  lines.push(`- Task type: ${metrics.filters.taskType || 'all task types'}`);
  lines.push('');
  lines.push('## Executive summary');
  lines.push('');
  lines.push(`- Events: ${metrics.summary.events}`);
  lines.push(`- Sessions: ${metrics.summary.sessions}`);
  lines.push(`- Gate runs: ${metrics.summary.gatesRun}`);
  lines.push(`- Gate pass rate: ${metrics.summary.gatePassRate}% (${metrics.summary.gatesPassed}/${metrics.summary.gatesRun})`);
  lines.push(`- Event result mix: ${metrics.summary.pass} pass, ${metrics.summary.warn} warn, ${metrics.summary.fail} fail`);
  lines.push(`- Average event duration: ${formatDuration(metrics.summary.avgDurationMs)}`);
  lines.push('');
  lines.push('## Trend over time');
  lines.push('');
  if (!metrics.daily.length) lines.push('- No daily trend data available.');
  for (const day of metrics.daily) {
    lines.push(`- ${day.key}: ${day.events} event(s), ${day.sessions} session(s), gate pass rate ${day.gatePassRate}%, fail rate ${day.failRate}%, avg duration ${formatDuration(day.avgDurationMs)}`);
  }
  lines.push('');
  lines.push('## Gate-level breakdown');
  lines.push('');
  if (!metrics.gates.length) lines.push('- No gate activity recorded.');
  for (const gate of metrics.gates) {
    lines.push(`- \`${gate.key}\`: ${gate.events} event(s), ${gate.gatesPassed}/${gate.gatesRun} gates passed (${gate.gatePassRate}%), ${gate.fail} fail event(s), avg duration ${formatDuration(gate.avgDurationMs)}`);
  }
  lines.push('');
  lines.push('## Model-level comparison');
  lines.push('');
  if (!metrics.models.length) lines.push('- No model/profile data recorded.');
  for (const model of metrics.models) {
    lines.push(`- \`${model.key}\`: ${model.sessions} session(s), ${model.events} event(s), gate pass rate ${model.gatePassRate}%, fail rate ${model.failRate}%, avg duration ${formatDuration(model.avgDurationMs)}`);
  }
  lines.push('');
  lines.push('## Task-type breakdown');
  lines.push('');
  if (!metrics.taskTypes.length) lines.push('- No task type data recorded.');
  for (const task of metrics.taskTypes) {
    lines.push(`- ${task.key}: ${task.events} event(s), gate pass rate ${task.gatePassRate}%, avg duration ${formatDuration(task.avgDurationMs)}`);
  }
  lines.push('');
  lines.push('## Insights and recommended follow-up');
  lines.push('');
  for (const insight of insightLines(metrics)) lines.push(insight);
  if (metrics.warnings.length) {
    lines.push('');
    lines.push('## Warnings');
    lines.push('');
    for (const warning of metrics.warnings) lines.push(`- ${warning}`);
  }
  lines.push('');
  return lines.join('\n');
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  const metrics = aggregateTelemetry(args);
  if (args.json) {
    console.log(JSON.stringify(metrics, null, 2));
    return;
  }

  const markdown = generateMarkdown(metrics);
  if (args.stdout) {
    console.log(markdown);
    return;
  }

  const outPath = args.output || join(args.outputDir, `quality-telemetry-trend-${new Date().toISOString().replace(/[:.]/g, '-')}.md`);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, `${markdown}\n`, 'utf8');
  console.log(`Wrote quality telemetry trend report: ${outPath}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(`Quality telemetry report failed: ${error.message}`);
    process.exit(1);
  });
}
