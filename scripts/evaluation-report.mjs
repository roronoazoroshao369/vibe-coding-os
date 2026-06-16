#!/usr/bin/env node
// evaluation-report.mjs — Unified evaluation report for Vibe Coding OS

import { execSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const checks = [
  {
    name: 'Repo Validation',
    command: 'npm run validate',
    summary: (output) => summarizeRepoValidation(output)
  },
  {
    name: 'Secret Scanning',
    command: 'node scripts/validate-secrets.mjs',
    summary: (output) => summarizeSecretScanning(output)
  },
  {
    name: 'Memory Redaction',
    command: 'node scripts/verify-memory-redaction.mjs',
    summary: (output) => summarizeMemoryRedaction(output)
  },
  {
    name: 'Adapter Smoke Tests',
    command: 'node scripts/smoke-test-adapters.mjs',
    summary: (output) => summarizeAdapterSmokeTests(output)
  }
];

function runCheck(check) {
  const started = Date.now();

  try {
    const output = execSync(check.command, {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      maxBuffer: 50 * 1024 * 1024
    });

    return {
      ...check,
      passed: true,
      exitCode: 0,
      output: normalizeOutput(output),
      durationMs: Date.now() - started
    };
  } catch (error) {
    const stdout = error.stdout ? String(error.stdout) : '';
    const stderr = error.stderr ? String(error.stderr) : '';

    return {
      ...check,
      passed: false,
      exitCode: typeof error.status === 'number' ? error.status : 1,
      output: normalizeOutput(`${stdout}\n${stderr}`),
      durationMs: Date.now() - started
    };
  }
}

function normalizeOutput(output) {
  return output.replace(/\r\n/g, '\n').trim();
}

function lastLines(output, count = 10) {
  if (!output) return ['(no output)'];
  return output.split('\n').filter((line) => line.trim().length > 0).slice(-count);
}

function formatDuration(ms) {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

function summarizeRepoValidation(output) {
  const lines = output.split('\n');
  const narrativeLine = lines.find((line) => /narrative files/i.test(line));
  const brokenLine = lines.find((line) => /broken refs|broken references/i.test(line));
  const narrativeCount = narrativeLine?.match(/(\d+)\s+narrative files/i)?.[1];
  const brokenCount = brokenLine?.match(/(\d+)\s+broken (?:refs|references)/i)?.[1];

  if (narrativeCount || brokenCount) {
    return [
      narrativeCount ? `${narrativeCount} narrative files` : null,
      brokenCount ? `${brokenCount} broken refs` : null
    ].filter(Boolean).join(', ');
  }

  return compactSuccessSummary(output, 'validation passed');
}

function summarizeSecretScanning(output) {
  const found = output.match(/(\d+)\s+secrets? found/i)?.[1]
    ?? output.match(/secrets?:\s*(\d+)/i)?.[1];
  if (found) return `${found} secrets found`;
  if (/no secrets|passed|clean/i.test(output)) return '0 secrets found';
  return compactSuccessSummary(output, 'secret scan completed');
}

function summarizeMemoryRedaction(output) {
  const tests = output.match(/(\d+)\s*\/\s*(\d+)\s+(?:tests?|cases?)/i);
  if (tests) return `${tests[1]}/${tests[2]} tests`;
  const passed = output.match(/(\d+)\s+(?:tests?|cases?)\s+passed/i)?.[1];
  if (passed) return `${passed}/${passed} tests`;
  return compactSuccessSummary(output, 'redaction tests passed');
}

function summarizeAdapterSmokeTests(output) {
  const adapters = output.match(/(\d+)\s*\/\s*(\d+)\s+adapters?/i);
  if (adapters) return `${adapters[1]}/${adapters[2]} adapters`;
  const passed = output.match(/(\d+)\s+adapters?\s+passed/i)?.[1];
  if (passed) return `${passed}/${passed} adapters`;
  return compactSuccessSummary(output, 'adapter checks passed');
}

function compactSuccessSummary(output, fallback) {
  const meaningful = lastLines(output, 10)
    .map((line) => line.replace(/^\s*[✅✔]\s*/, '').trim())
    .findLast((line) => /pass|passed|success|ok|valid/i.test(line));
  return meaningful || fallback;
}

function renderConsoleReport(results) {
  const date = new Date().toISOString().slice(0, 10);
  const passed = results.filter((result) => result.passed).length;
  const lines = [
    '=== Vibe Coding OS Evaluation Report ===',
    `Date: ${date}`,
    ''
  ];

  for (const result of results) {
    if (result.passed) {
      lines.push(`✅ ${result.name}: PASS (${result.summary(result.output)})`);
    } else {
      lines.push(`❌ ${result.name}: FAIL`);
      lines.push('   Last 5 lines of output:');
      for (const line of lastLines(result.output, 5)) {
        lines.push(`   ${line}`);
      }
    }
  }

  lines.push('');
  lines.push(`Overall: ${passed}/${results.length} checks passed`);

  return lines.join('\n');
}

function renderMarkdownReport(results) {
  const date = new Date().toISOString().slice(0, 10);
  const passed = results.filter((result) => result.passed).length;
  const lines = [
    '# Vibe Coding OS Evaluation Report',
    '',
    `Date: ${date}`,
    '',
    `Overall: **${passed}/${results.length} checks passed**`,
    '',
    '## Summary',
    ''
  ];

  for (const result of results) {
    const status = result.passed ? 'PASS' : 'FAIL';
    const icon = result.passed ? '✅' : '❌';
    lines.push(`- ${icon} **${result.name}**: ${status} (${result.summary(result.output)}) — ${formatDuration(result.durationMs)}`);
  }

  lines.push('', '## Details', '');

  for (const result of results) {
    lines.push(`### ${result.name}`);
    lines.push('');
    lines.push(`- Command: \`${result.command}\``);
    lines.push(`- Status: ${result.passed ? 'PASS' : 'FAIL'}`);
    lines.push(`- Exit code: ${result.exitCode}`);
    lines.push(`- Duration: ${formatDuration(result.durationMs)}`);
    lines.push('- Last 10 lines of output:');
    lines.push('');
    lines.push('```text');
    lines.push(...lastLines(result.output, 10));
    lines.push('```', '');
  }

  return lines.join('\n');
}

const results = checks.map(runCheck);
const consoleReport = renderConsoleReport(results);
const markdownReport = renderMarkdownReport(results);
const reportPath = resolve(ROOT, 'docs/reports/evaluation-report.md');

mkdirSync(dirname(reportPath), { recursive: true });
writeFileSync(reportPath, `${markdownReport}\n`);

console.log(consoleReport);
console.log(`\nMarkdown report written to ${reportPath}`);

if (results.some((result) => !result.passed)) {
  process.exit(1);
}
