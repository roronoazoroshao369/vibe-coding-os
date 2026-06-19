#!/usr/bin/env node
// quality-trend-dashboard.mjs — generate quality score trend dashboard with time-series visualization data.
// Reads telemetry events (NDJSON), aggregates into daily/weekly trends, and produces dashboard.json + md report.
// Dependency-free; uses session-metrics-collector's collectMetrics for aggregation.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DASHBOARD_DIR = join(ROOT, 'docs', 'reports', 'quality-trend');
const DEFAULT_EVENTS_PATH = join(ROOT, 'docs', 'metrics', 'quality-telemetry-events.ndjson');
const FALLBACK_EVENTS_PATH = join(ROOT, 'docs', 'metrics', 'quality-events.ndjson');

function parseArgs(argv) {
  const args = { eventsPath: null, outputDir: DASHBOARD_DIR, since: null, model: null, json: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--events' && argv[i + 1]) args.eventsPath = resolve(ROOT, argv[++i]);
    else if (arg.startsWith('--events=')) args.eventsPath = resolve(ROOT, arg.slice('--events='.length));
    else if (arg === '--output-dir' && argv[i + 1]) args.outputDir = resolve(ROOT, argv[++i]);
    else if (arg.startsWith('--output-dir=')) args.outputDir = resolve(ROOT, arg.slice('--output-dir='.length));
    else if (arg === '--since' && argv[i + 1]) args.since = argv[++i];
    else if (arg.startsWith('--since=')) args.since = arg.slice('--since='.length);
    else if (arg === '--model' && argv[i + 1]) args.model = argv[++i];
    else if (arg.startsWith('--model=')) args.model = arg.slice('--model='.length);
    else if (arg === '--json' || arg === '--stdout') args.json = true;
    else if (arg === '--help' || arg === '-h') args.help = true;
  }
  return args;
}

function printHelp() {
  console.log(`Usage:
  node scripts/quality-trend-dashboard.mjs [options]

Options:
  --events <path>       Events NDJSON path (default: docs/metrics/quality-telemetry-events.ndjson)
  --output-dir <path>   Output directory (default: docs/reports/quality-trend)
  --since <duration>    Filter events since (e.g., "7d", "30d", "2026-01-01")
  --model <model>       Filter by model ID
  --json, --stdout      Output dashboard JSON to stdout only (no file write)
  --help, -h            Show this help

Output:
  - dashboard.json       Time-series trend visualization data
  - dashboard.md         Human-readable trend report
`);
}

function toDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function parseSinceDuration(duration) {
  if (!duration) return null;
  const match = duration.match(/^(\d+)([dhms])$/);
  if (match) {
    const num = Number.parseInt(match[1], 10);
    const unit = match[2];
    const ms = unit === 'd' ? num * 86400000 : unit === 'h' ? num * 3600000 : unit === 'm' ? num * 60000 : num * 1000;
    return new Date(Date.now() - ms);
  }
  return toDate(duration);
}

function readNdjson(path) {
  if (!existsSync(path)) return { events: [], warnings: [`Events file not found: ${path}`] };
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

function percentage(value) {
  return Math.round(value * 10000) / 100;
}

function getDateKey(timestamp) {
  if (!timestamp) return 'unknown';
  const date = new Date(timestamp);
  return Number.isNaN(date.getTime()) ? 'unknown' : date.toISOString().slice(0, 10);
}

function getWeekKey(timestamp) {
  if (!timestamp) return 'unknown';
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return 'unknown';
  const firstDay = new Date(date);
  firstDay.setHours(0, 0, 0, 0);
  firstDay.setDate(firstDay.getDate() - firstDay.getDay());
  return firstDay.toISOString().slice(0, 10);
}

function getMonthKey(timestamp) {
  if (!timestamp) return 'unknown';
  const date = new Date(timestamp);
  return Number.isNaN(date.getTime()) ? 'unknown' : date.toISOString().slice(0, 7);
}

function normalizeStatus(event) {
  const status = String(event.status || event.result || event.outcome || '').toLowerCase();
  if (['pass', 'passed', 'success', 'ok', 'true'].includes(status)) return 'pass';
  if (['fail', 'failed', 'error', 'false'].includes(status)) return 'fail';
  if (['warn', 'warning', 'advisory'].includes(status)) return 'warn';
  if (['skip', 'skipped'].includes(status)) return 'skip';
  if (['timeout'].includes(status)) return 'timeout';
  if (typeof event.passed === 'boolean') return event.passed ? 'pass' : 'fail';
  return 'unknown';
}

function collectRawMetrics(options) {
  const eventsPath = options.eventsPath || (existsSync(DEFAULT_EVENTS_PATH) ? DEFAULT_EVENTS_PATH : existsSync(FALLBACK_EVENTS_PATH) ? FALLBACK_EVENTS_PATH : DEFAULT_EVENTS_PATH);
  const sinceDate = options.since ? parseSinceDuration(options.since) : null;
  const { events: rawEvents, warnings } = readNdjson(eventsPath);

  const filtered = rawEvents.filter((event) => {
    // Apply since filter
    if (sinceDate) {
      const ts = toDate(event.timestamp || event.createdAt || event.startedAt);
      if (!ts || ts.getTime() < sinceDate.getTime()) return false;
    }
    // Apply model filter
    if (options.model && event.model_id !== options.model && event.modelId !== options.model) return false;
    return true;
  });

  // Build gate-level trend data
  const dailyData = new Map();
  const weeklyData = new Map();
  const monthlyData = new Map();
  const gateData = new Map();

  for (const event of filtered) {
    const ts = event.timestamp || event.createdAt || event.startedAt;
    const gate = event.gate_id || event.gateId || 'unknown-gate';
    const status = normalizeStatus(event);
    const durationMs = Number(event.duration_ms || event.durationMs || event.duration || 0);
    const model = event.model_id || event.modelId || 'unknown';
    const profile = event.profile || 'unknown';

    // Daily aggregation
    const dayKey = getDateKey(ts);
    if (dayKey !== 'unknown') {
      if (!dailyData.has(dayKey)) dailyData.set(dayKey, { date: dayKey, totalRuns: 0, totalPasses: 0, totalFailures: 0, totalWarnings: 0, totalSkips: 0, totalTimeouts: 0, totalDurationMs: 0, gates: new Map(), models: new Map() });
      const day = dailyData.get(dayKey);
      day.totalRuns += 1;
      if (status === 'pass') day.totalPasses += 1;
      else if (status === 'fail') day.totalFailures += 1;
      else if (status === 'warn') day.totalWarnings += 1;
      else if (status === 'skip') day.totalSkips += 1;
      else if (status === 'timeout') day.totalTimeouts += 1;
      day.totalDurationMs += durationMs;

      if (!day.gates.has(gate)) day.gates.set(gate, { runs: 0, passes: 0, failures: 0 });
      const g = day.gates.get(gate);
      g.runs += 1;
      if (status === 'pass') g.passes += 1;
      else if (status === 'fail') g.failures += 1;

      if (!day.models.has(model)) day.models.set(model, { runs: 0, passes: 0, failures: 0 });
      const m = day.models.get(model);
      m.runs += 1;
      if (status === 'pass') m.passes += 1;
      else if (status === 'fail') m.failures += 1;
    }

    // Weekly aggregation
    const weekKey = getWeekKey(ts);
    if (weekKey !== 'unknown') {
      if (!weeklyData.has(weekKey)) weeklyData.set(weekKey, { week: weekKey, totalRuns: 0, totalPasses: 0, totalFailures: 0, totalWarnings: 0, totalSkips: 0, totalTimeouts: 0, totalDurationMs: 0, gates: new Map(), models: new Map() });
      const week = weeklyData.get(weekKey);
      week.totalRuns += 1;
      if (status === 'pass') week.totalPasses += 1;
      else if (status === 'fail') week.totalFailures += 1;
      else if (status === 'warn') week.totalWarnings += 1;
      else if (status === 'skip') week.totalSkips += 1;
      else if (status === 'timeout') week.totalTimeouts += 1;
      week.totalDurationMs += durationMs;

      if (!week.gates.has(gate)) week.gates.set(gate, { runs: 0, passes: 0, failures: 0 });
      const gw = week.gates.get(gate);
      gw.runs += 1;
      if (status === 'pass') gw.passes += 1;
      else if (status === 'fail') gw.failures += 1;

      if (!week.models.has(model)) week.models.set(model, { runs: 0, passes: 0, failures: 0 });
      const mw = week.models.get(model);
      mw.runs += 1;
      if (status === 'pass') mw.passes += 1;
      else if (status === 'fail') mw.failures += 1;
    }

    // Monthly aggregation
    const monthKey = getMonthKey(ts);
    if (monthKey !== 'unknown') {
      if (!monthlyData.has(monthKey)) monthlyData.set(monthKey, { month: monthKey, totalRuns: 0, totalPasses: 0, totalFailures: 0, totalWarnings: 0, totalSkips: 0, totalTimeouts: 0, totalDurationMs: 0, gates: new Map(), models: new Map() });
      const month = monthlyData.get(monthKey);
      month.totalRuns += 1;
      if (status === 'pass') month.totalPasses += 1;
      else if (status === 'fail') month.totalFailures += 1;
      else if (status === 'warn') month.totalWarnings += 1;
      else if (status === 'skip') month.totalSkips += 1;
      else if (status === 'timeout') month.totalTimeouts += 1;
      month.totalDurationMs += durationMs;

      if (!month.gates.has(gate)) month.gates.set(gate, { runs: 0, passes: 0, failures: 0 });
      const gm = month.gates.get(gate);
      gm.runs += 1;
      if (status === 'pass') gm.passes += 1;
      else if (status === 'fail') gm.failures += 1;

      if (!month.models.has(model)) month.models.set(model, { runs: 0, passes: 0, failures: 0 });
      const mm = month.models.get(model);
      mm.runs += 1;
      if (status === 'pass') mm.passes += 1;
      else if (status === 'fail') mm.failures += 1;
    }

    // Per-gate aggregate data (for sparkline-like metrics)
    if (!gateData.has(gate)) gateData.set(gate, { gateId: gate, totalRuns: 0, totalPasses: 0, totalFailures: 0, totalWarnings: 0, totalDurationMs: 0, dailyRates: [] });
    const gd = gateData.get(gate);
    gd.totalRuns += 1;
    if (status === 'pass') gd.totalPasses += 1;
    else if (status === 'fail') gd.totalFailures += 1;
    else if (status === 'warn') gd.totalWarnings += 1;
    gd.totalDurationMs += durationMs;
  }

  // Convert Maps to sorted arrays
  function serializeTimeGroup(group, keyName) {
    return [...group.values()]
      .map((entry) => {
        const passRate = entry.totalRuns ? percentage(entry.totalPasses / entry.totalRuns) : 0;
        const avgDurationMs = entry.totalRuns ? Math.round(entry.totalDurationMs / entry.totalRuns) : 0;
        return {
          [keyName]: entry[keyName],
          totalRuns: entry.totalRuns,
          totalPasses: entry.totalPasses,
          totalFailures: entry.totalFailures,
          totalWarnings: entry.totalWarnings,
          totalSkips: entry.totalSkips,
          totalTimeouts: entry.totalTimeouts,
          passRate,
          avgDurationMs,
          totalDurationMs: entry.totalDurationMs,
          gates: [...entry.gates.entries()].map(([gid, g]) => ({
            gateId: gid,
            runs: g.runs,
            passes: g.passes,
            failures: g.failures,
            passRate: g.runs ? percentage(g.passes / g.runs) : 0
          })).sort((a, b) => a.gateId.localeCompare(b.gateId)),
          models: [...entry.models.entries()].map(([mid, m]) => ({
            modelId: mid,
            runs: m.runs,
            passes: m.passes,
            failures: m.failures,
            passRate: m.runs ? percentage(m.passes / m.runs) : 0
          })).sort((a, b) => a.modelId.localeCompare(b.modelId))
        };
      })
      .sort((a, b) => String(a[keyName]).localeCompare(String(b[keyName])));
  }

  const daily = serializeTimeGroup(dailyData, 'date');
  const weekly = serializeTimeGroup(weeklyData, 'week');
  const monthly = serializeTimeGroup(monthlyData, 'month');

  // Compute per-gate daily rates for sparkline data
  for (const [gateId, gd] of gateData) {
    gd.dailyRates = daily.map((d) => {
      const gateEntry = d.gates.find((g) => g.gateId === gateId);
      return {
        date: d.date,
        passRate: gateEntry ? gateEntry.passRate : null,
        runs: gateEntry ? gateEntry.runs : 0
      };
    }).filter((r) => r.runs > 0);
    gd.avgDurationMs = gd.totalRuns ? Math.round(gd.totalDurationMs / gd.totalRuns) : 0;
    gd.passRate = gd.totalRuns ? percentage(gd.totalPasses / gd.totalRuns) : 0;
    delete gd.totalDurationMs;
  }

  // Summary stats
  const totalRuns = filtered.length;
  const totalPasses = filtered.filter((e) => normalizeStatus(e) === 'pass').length;
  const totalFailures = filtered.filter((e) => normalizeStatus(e) === 'fail').length;
  const totalWarnings = filtered.filter((e) => normalizeStatus(e) === 'warn').length;
  const totalSkips = filtered.filter((e) => normalizeStatus(e) === 'skip').length;
  const totalTimeouts = filtered.filter((e) => normalizeStatus(e) === 'timeout').length;

  return {
    schemaVersion: '2.7.0',
    generatedAt: new Date().toISOString(),
    source: eventsPath,
    filters: {
      since: options.since || null,
      model: options.model || null
    },
    summary: {
      totalEvents: totalRuns,
      totalPasses,
      totalFailures,
      totalWarnings,
      totalSkips,
      totalTimeouts,
      overallPassRate: totalRuns ? percentage(totalPasses / totalRuns) : 0
    },
    timeSeries: {
      daily,
      weekly,
      monthly
    },
    gates: [...gateData.values()]
      .sort((a, b) => a.gateId.localeCompare(b.gateId))
      .map((g) => ({
        gateId: g.gateId,
        totalRuns: g.totalRuns,
        totalPasses: g.totalPasses,
        totalFailures: g.totalFailures,
        totalWarnings: g.totalWarnings,
        passRate: g.passRate,
        avgDurationMs: g.avgDurationMs,
        dailyRates: g.dailyRates
      })),
    warnings
  };
}

function generateMarkdown(metrics) {
  const lines = [];

  lines.push('# Quality Score Trend Dashboard');
  lines.push('');
  lines.push(`> **Auto-generated** by \`scripts/quality-trend-dashboard.mjs\``);
  lines.push(`> Generated: ${metrics.generatedAt}`);
  lines.push('');

  if (metrics.filters.since) lines.push(`> Filter: since ${metrics.filters.since}`);
  if (metrics.filters.model) lines.push(`> Filter: model \`${metrics.filters.model}\``);
  lines.push('');

  lines.push('## Summary');
  lines.push('');
  lines.push(`- **Total events:** ${metrics.summary.totalEvents}`);
  lines.push(`- **Passes:** ${metrics.summary.totalPasses}`);
  lines.push(`- **Failures:** ${metrics.summary.totalFailures}`);
  lines.push(`- **Warnings:** ${metrics.summary.totalWarnings}`);
  lines.push(`- **Skips:** ${metrics.summary.totalSkips}`);
  lines.push(`- **Timeouts:** ${metrics.summary.totalTimeouts}`);
  lines.push(`- **Overall pass rate:** ${metrics.summary.overallPassRate}%`);
  lines.push('');

  // Daily trend
  lines.push('## Daily Trend');
  lines.push('');
  if (!metrics.timeSeries.daily.length) {
    lines.push('- No daily data available.');
  } else {
    lines.push('| Date | Runs | Passes | Failures | Pass rate | Avg duration |');
    lines.push('|---|---:|---:|---:|---:|---:|');
    for (const day of metrics.timeSeries.daily) {
      const avgDur = day.avgDurationMs < 1000 ? `${day.avgDurationMs}ms` : `${(day.avgDurationMs / 1000).toFixed(2)}s`;
      lines.push(`| ${day.date} | ${day.totalRuns} | ${day.totalPasses} | ${day.totalFailures} | ${day.passRate}% | ${avgDur} |`);
    }
  }
  lines.push('');

  // Weekly trend
  lines.push('## Weekly Trend');
  lines.push('');
  if (!metrics.timeSeries.weekly.length) {
    lines.push('- No weekly data available.');
  } else {
    lines.push('| Week | Runs | Passes | Failures | Pass rate | Avg duration |');
    lines.push('|---|---:|---:|---:|---:|---:|');
    for (const week of metrics.timeSeries.weekly) {
      const avgDur = week.avgDurationMs < 1000 ? `${week.avgDurationMs}ms` : `${(week.avgDurationMs / 1000).toFixed(2)}s`;
      lines.push(`| ${week.week} | ${week.totalRuns} | ${week.totalPasses} | ${week.totalFailures} | ${week.passRate}% | ${avgDur} |`);
    }
  }
  lines.push('');

  // Monthly trend
  lines.push('## Monthly Trend');
  lines.push('');
  if (!metrics.timeSeries.monthly.length) {
    lines.push('- No monthly data available.');
  } else {
    lines.push('| Month | Runs | Passes | Failures | Pass rate | Avg duration |');
    lines.push('|---|---:|---:|---:|---:|---:|');
    for (const month of metrics.timeSeries.monthly) {
      const avgDur = month.avgDurationMs < 1000 ? `${month.avgDurationMs}ms` : `${(month.avgDurationMs / 1000).toFixed(2)}s`;
      lines.push(`| ${month.month} | ${month.totalRuns} | ${month.totalPasses} | ${month.totalFailures} | ${month.passRate}% | ${avgDur} |`);
    }
  }
  lines.push('');

  // Per-gate breakdown
  lines.push('## Per-Gate Breakdown');
  lines.push('');
  if (!metrics.gates.length) {
    lines.push('- No gate data available.');
  } else {
    lines.push('| Gate | Runs | Pass rate | Avg duration | Failures | Warnings |');
    lines.push('|---|---:|---:|---:|---:|---:|');
    for (const gate of metrics.gates) {
      const avgDur = gate.avgDurationMs < 1000 ? `${gate.avgDurationMs}ms` : `${(gate.avgDurationMs / 1000).toFixed(2)}s`;
      lines.push(`| \`${gate.gateId}\` | ${gate.totalRuns} | ${gate.passRate}% | ${avgDur} | ${gate.totalFailures} | ${gate.totalWarnings} |`);
    }
  }
  lines.push('');

  // Worst-performing gates
  const worstGates = metrics.gates
    .filter((g) => g.totalFailures > 0)
    .sort((a, b) => b.totalFailures - a.totalFailures || a.passRate - b.passRate)
    .slice(0, 5);

  lines.push('## Worst-Performing Gates');
  lines.push('');
  if (!worstGates.length) {
    lines.push('- No failing gates detected.');
  } else {
    for (const gate of worstGates) {
      lines.push(`- \`${gate.gateId}\` — ${gate.totalFailures} failures across ${gate.totalRuns} runs (${gate.passRate}% pass rate)`);
    }
  }
  lines.push('');

  // Recommendations
  lines.push('## Recommendations');
  lines.push('');

  const recommendations = [];
  for (const gate of worstGates.slice(0, 3)) {
    if (gate.totalFailures > 0 && gate.passRate < 80) {
      recommendations.push(`- **${gate.gateId}** has a ${gate.passRate}% pass rate with ${gate.totalFailures} failures. Investigate gate logic or configuration.`);
    }
  }

  // Check for declining trend
  const dailySorted = [...metrics.timeSeries.daily].sort((a, b) => a.date.localeCompare(b.date));
  if (dailySorted.length >= 3) {
    const recent = dailySorted.slice(-3);
    const rates = recent.map((d) => d.passRate);
    if (rates[0] > rates[1] && rates[1] > rates[2]) {
      recommendations.push(`- **Pass rate declining** over the last 3 days (${rates.join('% → ')}%). Review recent changes.`);
    } else if (rates[0] < rates[1] && rates[1] < rates[2]) {
      recommendations.push(`- **Pass rate improving** over the last 3 days (${rates.join('% → ')}%). Keep monitoring.`);
    }
  }

  if (!recommendations.length) {
    recommendations.push('- Quality signal is healthy. Keep monitoring for regression.');
  }

  for (const rec of recommendations) {
    lines.push(rec);
  }
  lines.push('');

  // Notes
  lines.push('## Notes');
  lines.push('');
  lines.push('- This dashboard is auto-generated from telemetry events in the NDJSON event store.');
  lines.push('- Trend data spans the available date range in the events file.');
  lines.push('- Use `npm run dashboard:trend` to regenerate.');
  lines.push('- For visualization, the `dashboard.json` file contains structured data suitable for charting libraries.');
  lines.push('');

  if (metrics.warnings.length) {
    lines.push('### Warnings');
    lines.push('');
    for (const w of metrics.warnings) {
      lines.push(`- ${w}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    process.exit(0);
  }

  const metrics = collectRawMetrics(args);

  if (args.json) {
    console.log(JSON.stringify(metrics, null, 2));
    process.exit(0);
  }

  // Write dashboard.json
  mkdirSync(args.outputDir, { recursive: true });

  const jsonPath = join(args.outputDir, 'dashboard.json');
  writeFileSync(jsonPath, JSON.stringify(metrics, null, 2), 'utf8');
  console.log(`✅ Dashboard JSON written to ${jsonPath}`);

  // Write dashboard.md
  const mdPath = join(args.outputDir, 'dashboard.md');
  const markdown = generateMarkdown(metrics);
  writeFileSync(mdPath, `${markdown}\n`, 'utf8');
  console.log(`✅ Dashboard markdown written to ${mdPath}`);

  console.log(`\n📊 Quality Trend Dashboard Summary:`);
  console.log(`   Total events: ${metrics.summary.totalEvents}`);
  console.log(`   Pass rate: ${metrics.summary.overallPassRate}%`);
  console.log(`   Daily data points: ${metrics.timeSeries.daily.length}`);
  console.log(`   Weekly data points: ${metrics.timeSeries.weekly.length}`);
  console.log(`   Monthly data points: ${metrics.timeSeries.monthly.length}`);
  console.log(`   Gates tracked: ${metrics.gates.length}`);
}

main();
