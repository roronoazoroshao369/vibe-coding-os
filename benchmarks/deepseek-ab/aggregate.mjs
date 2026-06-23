#!/usr/bin/env node
/**
 * aggregate.mjs — combine results/raw/*.json into:
 *   results/report.json   (machine)
 *   results/report.md     (human: A vs B deltas across the 5 metrics)
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const RAW = join(HERE, 'results', 'raw');
if (!existsSync(RAW)) { console.error('No raw results. Run run-benchmark.mjs first.'); process.exit(1); }

const records = readdirSync(RAW)
  .filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(readFileSync(join(RAW, f), 'utf8')));

const arms = [...new Set(records.map((r) => r.arm))];
const mean = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
const rate = (xs) => (xs.length ? xs.filter(Boolean).length / xs.length : 0);

function armStats(arm) {
  const rs = records.filter((r) => r.arm === arm);
  return {
    n: rs.length,
    firstTryPassRate: rate(rs.map((r) => r.metrics.firstTryPass)),
    hallucinationAvg: mean(rs.map((r) => r.metrics.hallucinationCount || 0)),
    tokensAvg: mean(rs.map((r) => r.metrics.tokensTotal || 0)),
    locDeltaAvg: mean(rs.map((r) => r.metrics.locDelta || 0)),
    rubricAvg: mean(rs.map((r) => r.metrics.rubricScore || 0)),
  };
}

const stats = Object.fromEntries(arms.map((a) => [a, armStats(a)]));
const a = stats.control, b = stats.framework;

function pct(from, to) {
  if (from === 0) return to === 0 ? '0%' : 'n/a';
  return `${(((to - from) / Math.abs(from)) * 100).toFixed(0)}%`;
}

const report = { generatedAt: new Date().toISOString(), totalRuns: records.length, arms: stats };
writeFileSync(join(HERE, 'results', 'report.json'), JSON.stringify(report, null, 2));

let md = `# DeepSeek A/B Benchmark Results

Generated: ${report.generatedAt}
Total runs: ${report.totalRuns}

## Summary — Control (A) vs Framework (B)

| Metric | A (control) | B (framework) | Delta | Better? |
|--------|-------------|---------------|-------|---------|
`;

if (a && b) {
  const row = (name, av, bv, betterHigher, fmt = (x) => x.toFixed(2)) => {
    const better = betterHigher ? bv > av : bv < av;
    return `| ${name} | ${fmt(av)} | ${fmt(bv)} | ${pct(av, bv)} | ${better ? '✅ B' : (av === bv ? '— tie' : '❌ A')} |\n`;
  };
  md += row('First-try pass rate', a.firstTryPassRate, b.firstTryPassRate, true, (x) => `${(x * 100).toFixed(0)}%`);
  md += row('Hallucinations / task', a.hallucinationAvg, b.hallucinationAvg, false);
  md += row('Tokens / task', a.tokensAvg, b.tokensAvg, false, (x) => x.toFixed(0));
  md += row('LOC delta vs ref', a.locDeltaAvg, b.locDeltaAvg, false);
  md += row('Rubric (0-5)', a.rubricAvg, b.rubricAvg, true);
} else {
  md += `| _need both 'control' and 'framework' arms_ | | | | |\n`;
}

md += `
## Interpretation

- **B should win first-try pass, hallucinations, and rubric.** If it wins
  those but costs more tokens, that's an expected and usually acceptable
  trade — state the trade explicitly.
- **If B does NOT clearly beat A**, the framework is not earning its
  context cost on these tasks. That's the signal to cut skills, not add.

## Per-task detail

| Task | Arm | pass% | halluc | tokens | rubric |
|------|-----|-------|--------|--------|--------|
`;

const byTask = {};
for (const r of records) {
  const k = `${r.taskId}|${r.arm}`;
  (byTask[k] ||= []).push(r);
}
for (const k of Object.keys(byTask).sort()) {
  const rs = byTask[k];
  const [taskId, arm] = k.split('|');
  md += `| ${taskId} | ${arm} | ${(rate(rs.map((x) => x.metrics.firstTryPass)) * 100).toFixed(0)}% | ${mean(rs.map((x) => x.metrics.hallucinationCount || 0)).toFixed(1)} | ${mean(rs.map((x) => x.metrics.tokensTotal || 0)).toFixed(0)} | ${mean(rs.map((x) => x.metrics.rubricScore || 0)).toFixed(1)} |\n`;
}

writeFileSync(join(HERE, 'results', 'report.md'), md);
console.log('Wrote results/report.md and results/report.json');
console.log(md);
