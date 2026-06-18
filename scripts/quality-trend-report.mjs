#!/usr/bin/env node
// quality-trend-report.mjs — generate markdown quality trend report from quality telemetry events.
// Reads events via session-metrics-collector or JSON, then writes a timestamped markdown report.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const REPORTS_DIR = join(ROOT, 'docs', 'reports', 'quality-telemetry');
const DEFAULT_EVENTS_PATH = join(ROOT, 'docs', 'metrics', 'quality-events.ndjson');

function parseArgs(argv) {
  const args = { since: null, eventsPath: DEFAULT_EVENTS_PATH, metricsPath: null, outputDir: REPORTS_DIR };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--since' && argv[i + 1]) args.since = argv[++i];
    else if (arg.startsWith('--since=')) args.since = arg.slice('--since='.length);
    else if (arg === '--events' && argv[i + 1]) args.eventsPath = resolve(ROOT, argv[++i]);
    else if (arg.startsWith('--events=')) args.eventsPath = resolve(ROOT, arg.slice('--events='.length));
    else if (arg === '--metrics' && argv[i + 1]) args.metricsPath = resolve(ROOT, argv[++i]);
    else if (arg.startsWith('--metrics=')) args.metricsPath = resolve(ROOT, arg.slice('--metrics='.length));
    else if (arg === '--output-dir' && argv[i + 1]) args.outputDir = resolve(ROOT, argv[++i]);
    else if (arg.startsWith('--output-dir=')) args.outputDir = resolve(ROOT, arg.slice('--output-dir='.length));
  }
  return args;
}

async function loadMetrics(options) {
  if (options.metricsPath && existsSync(options.metricsPath)) {
    return JSON.parse(readFileSync(options.metricsPath, 'utf8'));
  }

  if (options.eventsPath && existsSync(options.eventsPath)) {
    const { collectMetrics } = await import('./session-metrics-collector.mjs');
    return collectMetrics({ eventsPath: options.eventsPath, since: options.since, model: options.model });
  }

  return null;
}

function percentage(value) {
  return Math.round(value * 10000) / 100;
}

function formatDuration(ms) {
  return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(2)}s`;
}

function dateKey(timestamp) {
  if (!timestamp) return 'unknown';
  const date = new Date(timestamp);
  return Number.isNaN(date.getTime()) ? 'unknown' : date.toISOString().slice(0, 10);
}

function weekKey(timestamp) {
  if (!timestamp) return 'unknown';
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return 'unknown';
  const firstDay = new Date(date);
  firstDay.setHours(0, 0, 0, 0);
  firstDay.setDate(firstDay.getDate() - firstDay.getDay());
  return firstDay.toISOString().slice(0, 10);
}

function groupByTimePeriod(sessions, periodKeyFn) {
  const groups = new Map();
  for (const session of sessions) {
    const key = periodKeyFn(session.startedAt || session.finishedAt);
    if (!groups.has(key)) groups.set(key, { key, sessions: [], gatePasses: 0, gateRuns: 0 });
    const group = groups.get(key);
    group.sessions.push(session);
    group.gatePasses += session.gatesPassed;
    group.gateRuns += session.gatesRun;
  }
  return [...groups.values()]
    .sort((a, b) => a.key.localeCompare(b.key))
    .map((group) => ({ ...group, passRate: group.gateRuns ? percentage(group.gatePasses / group.gateRuns) : 0 }));
}

function worstGates(gates, count = 3) {
  return gates
    .filter((gate) => gate.totalRuns > 0 && gate.totalFailures > 0)
    .sort((a, b) => a.passRate - b.passRate || b.totalFailures - a.totalFailures)
    .slice(0, count);
}

function buildRecommendations(metrics) {
  const lines = [];
  const worst = worstGates(metrics.gates, 5);
  for (const gate of worst) {
    if (gate.totalFailures === 0) continue;
    const failingModels = metrics.models
      .map((model) => {
        const entry = model.commonlyFailedGates.find((entry) => entry.gate === gate.gateId);
        return entry ? { modelId: model.modelId, count: entry.count } : null;
      })
      .filter(Boolean)
      .sort((a, b) => b.count - a.count);

    if (failingModels.length) {
      lines.push(`- Gate \`${gate.gateId}\` fails ${percentage(1 - gate.passRate / 100)}% of the time; frequently on ${failingModels.map((m) => m.modelId).join(', ')}. Consider adjusting configuration or training guidance.`);
    } else {
      lines.push(`- Gate \`${gate.gateId}\` fails ${percentage(1 - gate.passRate / 100)}% of the time. Review gate logic or related documentation for improvement opportunities.`);
    }
  }

  const lowSessionModels = metrics.models.filter((m) => m.avgPassRate < 75 && m.totalSessions > 0);
  for (const model of lowSessionModels) {
    lines.push(`- Model \`${model.modelId}\` averages a ${model.avgPassRate}% pass rate across ${model.totalSessions} session(s). Prioritize model-specific coaching or gate tuning.`);
  }

  if (!lines.length) {
    lines.push('- Quality signal is healthy across all observed sessions and models. Keep monitoring for regression.');
  }
  return lines;
}

function generateMarkdown(metrics) {
  const lines = [];
  lines.push('# Quality Telemetry Trend Report');
  lines.push('');
  lines.push(`Generated: ${metrics.generatedAt}`);
  if (metrics.filters?.since) lines.push(`Filtered since: ${metrics.filters.since}`);
  lines.push('');
  lines.push('## Overall quality');
  lines.push('');
  lines.push(`- Sessions: ${metrics.summary.totalSessions}`);
  lines.push(`- Total gate runs: ${metrics.summary.totalGateRuns}`);
  lines.push(`- Passes: ${metrics.summary.totalGatePasses}`);
  lines.push(`- Failures: ${metrics.summary.totalGateFailures}`);
  lines.push(`- Overall pass rate: ${metrics.summary.overallPassRate}%`);
  lines.push('');

  lines.push('## Per-model comparison');
  lines.push('');
  if (!metrics.models.length) {
    lines.push('- No model sessions recorded.');
  } else {
    lines.push('| Model | Sessions | Avg pass rate | Most failed gate |');
    lines.push('|---|---:|---:|---|');
    for (const model of metrics.models) {
      lines.push(`| ${model.modelId} | ${model.totalSessions} | ${model.avgPassRate}% | ${model.commonlyFailedGates[0]?.gate || 'none'} |`);
    }
  }
  lines.push('');

  lines.push('## Per-gate reliability');
  lines.push('');
  if (!metrics.gates.length) {
    lines.push('- No gate activity recorded.');
  } else {
    lines.push('| Gate | Runs | Pass rate | Avg duration |');
    lines.push('|---|---:|---:|---:|');
    for (const gate of metrics.gates) {
      lines.push(`| ${gate.gateId} | ${gate.totalRuns} | ${gate.passRate}% | ${formatDuration(gate.avgDurationMs)} |`);
    }
  }
  lines.push('');

  const dailyGroups = groupByTimePeriod(metrics.sessions, dateKey);
  const weeklyGroups = groupByTimePeriod(metrics.sessions, weekKey);
  lines.push('## Trend over time');
  lines.push('');
  lines.push('### Daily');
  lines.push('');
  if (dailyGroups.length <= 1) {
    lines.push('- Trend tracking requires multiple daily groups. Currently only a single day is observed.');
  } else {
    for (const group of dailyGroups) {
      lines.push(`- ${group.key} — ${group.sessions.length} session(s), pass rate ${group.passRate}%`);
    }
  }
  lines.push('');
  lines.push('### Weekly');
  lines.push('');
  if (weeklyGroups.length <= 1) {
    lines.push('- Trend tracking requires multiple weekly groups. Currently only a single week is observed.');
  } else {
    for (const group of weeklyGroups) {
      lines.push(`- Week of ${group.key} — ${group.sessions.length} session(s), pass rate ${group.passRate}%`);
    }
  }
  lines.push('');

  lines.push('## Worst-performing gates');
  lines.push('');
  const worst = worstGates(metrics.gates, 3);
  if (!worst.length) {
    lines.push('- No failing gates detected.');
  } else {
    for (const gate of worst) {
      lines.push(`- \`${gate.gateId}\` — ${gate.totalFailures} failure(s) across ${gate.totalRuns} run(s) (${gate.passRate}% pass rate)`);
    }
  }
  lines.push('');

  lines.push('## Recommendations');
  lines.push('');
  for (const recommendation of buildRecommendations(metrics)) {
    lines.push(recommendation);
  }
  lines.push('');

  return lines.join('\n');
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const metrics = await loadMetrics(args);
  if (!metrics) {
    console.error('No metrics source found. Provide --metrics path or ensure docs/metrics/quality-events.ndjson exists.');
    process.exit(1);
  }

  mkdirSync(args.outputDir, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outPath = join(args.outputDir, `trend-${timestamp}.md`);
  writeFileSync(outPath, `${generateMarkdown(metrics)}\n`, 'utf8');
  console.log(`Wrote trend report: ${outPath}`);
}

main().catch((error) => {
  console.error(`Quality trend report generation failed: ${error.message}`);
  process.exit(1);
});
