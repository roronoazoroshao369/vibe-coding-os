#!/usr/bin/env node
// analyze-benchmark-trends.mjs — analyze benchmark reports across runs,
// detect regression (>20% slowness), generate trend report.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BENCH_DIR = join(ROOT, 'docs', 'reports', 'benchmarks');
const HISTORY_DIR = join(BENCH_DIR, 'history');
const DEFAULT_OUTPUT = join(BENCH_DIR, 'trend-report.json');
const REGRESSION_THRESHOLD = 0.20; // 20% slowness = regression

function parseArgs(argv) {
  const args = { baseline: null, candidates: [], output: DEFAULT_OUTPUT, threshold: REGRESSION_THRESHOLD, markdown: true };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--baseline' && argv[i + 1]) args.baseline = resolve(ROOT, argv[++i]);
    else if (a.startsWith('--baseline=')) args.baseline = resolve(ROOT, a.slice('--baseline='.length));
    else if (a === '--compare' && argv[i + 1]) args.candidates.push(resolve(ROOT, argv[++i]));
    else if (a.startsWith('--compare=')) args.candidates.push(resolve(ROOT, a.slice('--compare='.length)));
    else if (a === '--output' && argv[i + 1]) args.output = resolve(ROOT, argv[++i]);
    else if (a.startsWith('--output=')) args.output = resolve(ROOT, a.slice('--output='.length));
    else if (a === '--threshold' && argv[i + 1]) args.threshold = parseFloat(argv[++i]);
    else if (a.startsWith('--threshold=')) args.threshold = parseFloat(a.slice('--threshold='.length));
    else if (a === '--no-markdown') args.markdown = false;
    else if (a === '--markdown') args.markdown = true;
  }
  return args;
}

function loadReport(filePath) {
  if (!existsSync(filePath)) {
    console.error(`Report not found: ${filePath}`);
    return null;
  }
  try {
    return JSON.parse(readFileSync(filePath, 'utf8'));
  } catch (err) {
    console.error(`Invalid JSON in ${filePath}:`, err.message);
    return null;
  }
}

function findHistoryFiles() {
  if (!existsSync(HISTORY_DIR)) return [];
  return readFileSync(HISTORY_DIR, 'utf8')
    .split('\n')
    .filter(f => f.endsWith('.json'))
    .map(f => join(HISTORY_DIR, f))
    .sort();
}

function latestReport() {
  const latest = join(BENCH_DIR, 'benchmark-report.json');
  if (existsSync(latest)) return loadReport(latest);
  const history = findHistoryFiles();
  if (history.length > 0) return loadReport(history[history.length - 1]);
  return null;
}

function buildGateMap(report) {
  const map = {};
  if (!report || !report.gates) return map;
  for (const gate of report.gates) {
    map[gate.name] = gate;
  }
  return map;
}

function percentage(value) {
  return Math.round(value * 10000) / 100;
}

function formatDuration(ms) {
  return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(2)}s`;
}

function analyzeRegressions(baselineGates, candidateGates, threshold) {
  const regressions = [];
  const improvements = [];
  const stable = [];

  for (const [name, candidate] of Object.entries(candidateGates)) {
    const baseline = baselineGates[name];
    if (!baseline) {
      stable.push({ name, status: 'new', candidateDuration: candidate.duration, note: 'No baseline data' });
      continue;
    }

    const baselineDuration = baseline.duration || baseline.durationMs || 0;
    const candidateDuration = candidate.duration || candidate.durationMs || 0;

    if (baselineDuration === 0) {
      stable.push({ name, status: 'unknown', baselineDuration, candidateDuration });
      continue;
    }

    const change = (candidateDuration - baselineDuration) / baselineDuration;

    const entry = {
      name,
      baselineDuration,
      candidateDuration,
      change,
      changePercent: percentage(change),
      baselinePassed: baseline.passed,
      candidatePassed: candidate.passed
    };

    if (change > threshold) {
      regressions.push({ ...entry, severity: change > 0.5 ? 'critical' : 'warning' });
    } else if (change < -threshold) {
      improvements.push({ ...entry, severity: 'improvement' });
    } else {
      stable.push({ ...entry, status: 'stable' });
    }
  }

  // Gates in candidate but not in baseline
  for (const [name, candidate] of Object.entries(candidateGates)) {
    if (!baselineGates[name]) {
      if (!stable.find(s => s.name === name)) {
        stable.push({ name, status: 'new', candidateDuration: candidate.duration, note: 'No baseline data' });
      }
    }
  }

  return { regressions, improvements, stable };
}

function generateMarkdownReport(report, baselineLabel, candidateLabel) {
  const lines = [];
  lines.push('# Benchmark Trend Report');
  lines.push('');
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push(`Baseline: ${baselineLabel}`);
  lines.push(`Candidate: ${candidateLabel}`);
  lines.push(`Regression threshold: ${percentage(report.threshold)}%`);
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`- **Total regressions:** ${report.regressions.length}`);
  lines.push(`- **Total improvements:** ${report.improvements.length}`);
  lines.push(`- **Stable / unchanged:** ${report.stable.length}`);
  lines.push(`- **Baseline total duration:** ${formatDuration(report.baselineTotalMs)}`);
  lines.push(`- **Candidate total duration:** ${formatDuration(report.candidateTotalMs)}`);
  lines.push(`- **Overall change:** ${report.overallChangePercent > 0 ? '+' : ''}${report.overallChangePercent}%`);
  lines.push('');

  if (report.regressions.length > 0) {
    lines.push('## Regressions (slowness detected)');
    lines.push('');
    for (const r of report.regressions.sort((a, b) => b.change - a.change)) {
      const icon = r.severity === 'critical' ? '🔴' : '⚠️';
      lines.push(`- ${icon} **${r.name}**: ${formatDuration(r.baselineDuration)} → ${formatDuration(r.candidateDuration)} (+${r.changePercent}%)`);
    }
    lines.push('');
  }

  if (report.improvements.length > 0) {
    lines.push('## Improvements (speed-ups detected)');
    lines.push('');
    for (const r of report.improvements.sort((a, b) => a.change - b.change)) {
      lines.push(`- ✅ **${r.name}**: ${formatDuration(r.baselineDuration)} → ${formatDuration(r.candidateDuration)} (${r.changePercent}%)`);
    }
    lines.push('');
  }

  lines.push('## Per-Gate Details');
  lines.push('');
  lines.push('| Gate | Baseline | Candidate | Change | Status |');
  lines.push('| --- | --- | --- | --- | --- |');

  const allEntries = [
    ...report.regressions.map(r => ({ ...r, status: r.severity === 'critical' ? '🔴 Critical' : '⚠️ Regression' })),
    ...report.improvements.map(r => ({ ...r, status: '✅ Improvement' })),
    ...report.stable.map(r => ({ ...r, status: r.status === 'new' ? '🆕 New' : '✓ Stable' }))
  ].sort((a, b) => a.name.localeCompare(b.name));

  for (const e of allEntries) {
    const bDur = e.baselineDuration ? formatDuration(e.baselineDuration) : '—';
    const cDur = e.candidateDuration ? formatDuration(e.candidateDuration) : '—';
    const change = e.changePercent !== undefined ? `${e.changePercent > 0 ? '+' : ''}${e.changePercent}%` : '—';
    lines.push(`| ${e.name} | ${bDur} | ${cDur} | ${change} | ${e.status} |`);
  }

  lines.push('');
  lines.push('## Methodology');
  lines.push('');
  lines.push('Each gate is run as a separate `node` subprocess. Duration is wall-clock time in milliseconds.');
  lines.push(`A regression is flagged when candidate duration exceeds baseline by more than ${percentage(report.threshold)}%.`);
  lines.push('Critical severity means >50% slowness. Results may vary due to system load, caching, and I/O.');

  return lines.join('\n');
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  // Auto-select baseline and candidate
  let baselineReport;
  let candidateReport;
  let baselineLabel = 'unknown';
  let candidateLabel = 'unknown';

  if (options.baseline) {
    baselineReport = loadReport(options.baseline);
    baselineLabel = options.baseline;
  } else {
    // Find second-latest as baseline
    const history = findHistoryFiles();
    if (history.length >= 2) {
      baselineReport = loadReport(history[history.length - 2]);
      baselineLabel = history[history.length - 2];
    } else {
      console.error('Not enough history for trend analysis. Need at least 2 benchmark runs.');
      console.error('Run benchmark-validation-gates.mjs first to generate reports.');
      process.exit(1);
    }
  }

  if (options.candidates.length > 0) {
    candidateReport = loadReport(options.candidates[0]);
    candidateLabel = options.candidates[0];
  } else {
    candidateReport = latestReport();
    candidateLabel = 'latest (benchmark-report.json)';
  }

  if (!baselineReport || !candidateReport) {
    console.error('Failed to load benchmark reports.');
    process.exit(1);
  }

  const baselineGates = buildGateMap(baselineReport);
  const candidateGates = buildGateMap(candidateReport);
  const { regressions, improvements, stable } = analyzeRegressions(baselineGates, candidateGates, options.threshold);

  const baselineTotalMs = baselineReport.meta?.totalDurationMs ||
    baselineReport.gates.reduce((s, g) => s + (g.duration || g.durationMs || 0), 0);
  const candidateTotalMs = candidateReport.meta?.totalDurationMs ||
    candidateReport.gates.reduce((s, g) => s + (g.duration || g.durationMs || 0), 0);
  const overallChange = baselineTotalMs > 0 ? (candidateTotalMs - baselineTotalMs) / baselineTotalMs : 0;

  const report = {
    meta: {
      version: '2.7.0',
      tool: 'analyze-benchmark-trends',
      generated: new Date().toISOString(),
      baseline: baselineLabel,
      candidate: candidateLabel,
      threshold: options.threshold,
      baselineTimestamp: baselineReport.meta?.timestamp || 'unknown',
      candidateTimestamp: candidateReport.meta?.timestamp || 'unknown'
    },
    summary: {
      totalGates: candidateReport.gates?.length || 0,
      regressions: regressions.length,
      improvements: improvements.length,
      stable: stable.length,
      baselineTotalMs,
      candidateTotalMs,
      overallChangePercent: percentage(overallChange)
    },
    threshold: options.threshold,
    regressions,
    improvements,
    stable,
    baselineTotalMs,
    candidateTotalMs,
    overallChangePercent: percentage(overallChange)
  };

  // Ensure output directory
  const outputDir = dirname(options.output);
  if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });

  writeFileSync(options.output, JSON.stringify(report, null, 2), 'utf8');
  console.log(`Trend report written to: ${options.output}`);

  // Also generate markdown report alongside
  if (options.markdown) {
    const mdPath = options.output.replace(/\.json$/, '.md');
    const md = generateMarkdownReport(report, baselineLabel, candidateLabel);
    writeFileSync(mdPath, md, 'utf8');
    console.log(`Markdown trend report written to: ${mdPath}`);
  }

  // Console summary
  console.log('');
  console.log('=== Trend Analysis Summary ===');
  console.log(`Baseline: ${baselineLabel}`);
  console.log(`Candidate: ${candidateLabel}`);
  console.log(`Regressions (>${percentage(options.threshold)}%): ${regressions.length}`);
  console.log(`Improvements (>${percentage(options.threshold)}%): ${improvements.length}`);
  console.log(`Stable: ${stable.length}`);
  console.log(`Overall change: ${overallChange > 0 ? '+' : ''}${percentage(overallChange)}%`);

  if (regressions.length > 0) {
    console.log('');
    console.log('⚠️  Regressions detected:');
    for (const r of regressions) {
      const icon = r.severity === 'critical' ? '🔴' : '⚠️';
      console.log(`  ${icon} ${r.name}: ${formatDuration(r.baselineDuration)} → ${formatDuration(r.candidateDuration)} (+${r.changePercent}%)`);
    }
  }

  if (improvements.length > 0) {
    console.log('');
    console.log('✅ Improvements:');
    for (const r of improvements) {
      console.log(`  ✅ ${r.name}: ${formatDuration(r.baselineDuration)} → ${formatDuration(r.candidateDuration)} (${r.changePercent}%)`);
    }
  }

  // Exit code: non-zero if critical regressions found
  const critical = regressions.filter(r => r.severity === 'critical');
  if (critical.length > 0) {
    console.log(`\n🔴 ${critical.length} critical regression(s) found.`);
    process.exit(2);
  }

  process.exit(0);
}

main().catch(err => {
  console.error('Trend analysis error:', err);
  process.exit(1);
});
