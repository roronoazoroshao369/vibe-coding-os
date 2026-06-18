#!/usr/bin/env node
// orchestrate-workflow.mjs — dependency-free workflow runner for Vibe Coding OS v2.5.
//
// Usage:
//   node scripts/orchestrate-workflow.mjs --workflow templates/workflow-simple-feature.json
//   node scripts/orchestrate-workflow.mjs --workflow templates/workflow-bugfix.json --dry-run
//   node scripts/orchestrate-workflow.mjs --workflow templates/workflow-security-audit.json --output-json

import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const MANIFEST_PATH = resolve(ROOT, 'templates/quality-gate-manifest.json');

function parseArgs(argv) {
  const args = { workflow: null, dryRun: false, outputJson: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--workflow') args.workflow = argv[++i];
    else if (arg.startsWith('--workflow=')) args.workflow = arg.slice('--workflow='.length);
    else if (arg === '--dry-run') args.dryRun = true;
    else if (arg === '--output-json') args.outputJson = true;
    else if (arg === '--help' || arg === '-h') args.help = true;
  }
  return args;
}

function usage() {
  return `Usage: node scripts/orchestrate-workflow.mjs --workflow <path> [--dry-run] [--output-json]\n\nRuns a stage-gated orchestration workflow and writes a markdown summary to docs/reports/orchestration/.`;
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function loadManifest() {
  if (!existsSync(MANIFEST_PATH)) return new Map();
  const manifest = readJson(MANIFEST_PATH);
  return new Map((manifest.gates || []).map((gate) => [gate.id, gate]));
}

function gateCommand(gateId, manifestGate) {
  if (gateId === 'validate-all') return { command: 'npm', args: ['run', 'validate', '--silent'] };
  if (gateId === 'quality-engine') return { command: 'node', args: ['scripts/quality-engine.mjs', '--profile=standard', '--output-json'] };
  if (manifestGate?.command) return { command: manifestGate.command, args: manifestGate.args || [] };
  if (manifestGate?.script) return { command: 'node', args: [manifestGate.script] };
  return null;
}

function runGate(gateRef, manifest, dryRun) {
  const manifestGate = manifest.get(gateRef.gateId);
  const commandSpec = gateCommand(gateRef.gateId, manifestGate);
  if (!commandSpec) {
    return {
      gateId: gateRef.gateId,
      level: gateRef.level,
      requiredForAdvance: gateRef.requiredForAdvance,
      status: gateRef.requiredForAdvance ? 'fail' : 'warn',
      exitCode: null,
      message: 'Gate is not known in quality-gate-manifest.json and has no built-in runner.'
    };
  }
  if (dryRun) {
    return {
      gateId: gateRef.gateId,
      level: gateRef.level,
      requiredForAdvance: gateRef.requiredForAdvance,
      status: 'skipped',
      exitCode: null,
      command: `${commandSpec.command} ${commandSpec.args.join(' ')}`.trim(),
      message: 'Dry run: gate command was not executed.'
    };
  }

  const startedAt = new Date().toISOString();
  const result = spawnSync(commandSpec.command, commandSpec.args, {
    cwd: ROOT,
    encoding: 'utf8',
    timeout: Number(manifestGate?.timeout || 120) * 1000
  });
  const status = result.status === 0 ? 'pass' : 'fail';
  return {
    gateId: gateRef.gateId,
    level: gateRef.level,
    requiredForAdvance: gateRef.requiredForAdvance,
    status,
    exitCode: result.status,
    command: `${commandSpec.command} ${commandSpec.args.join(' ')}`.trim(),
    startedAt,
    completedAt: new Date().toISOString(),
    message: status === 'pass' ? 'Gate passed.' : 'Gate failed.',
    stdout: (result.stdout || '').trim().slice(-4000),
    stderr: (result.stderr || '').trim().slice(-4000)
  };
}

function runStage(stage, manifest, dryRun) {
  const gates = Array.isArray(stage.gates) ? stage.gates : [];
  if (stage.optional && dryRun) {
    return { stageId: stage.stageId, name: stage.name, type: stage.type, agentRole: stage.agentRole, status: 'skipped', gates: [], message: 'Optional stage would be considered for execution.' };
  }
  const gateResults = gates.map((gate) => runGate(gate, manifest, dryRun));
  const blockingFailures = gateResults.filter((gate) => gate.requiredForAdvance && gate.status === 'fail');
  const status = dryRun ? 'skipped' : blockingFailures.length ? 'blocked' : 'pass';
  return {
    stageId: stage.stageId,
    name: stage.name,
    type: stage.type,
    agentRole: stage.agentRole,
    inputs: stage.inputs || [],
    outputs: stage.outputs || [],
    status,
    gates: gateResults,
    message: blockingFailures.length ? `Blocked by required gate(s): ${blockingFailures.map((g) => g.gateId).join(', ')}` : (dryRun ? 'Dry run: stage not executed.' : 'Stage completed.')
  };
}

function markdownReport(workflow, summary) {
  const lines = [];
  lines.push(`# Orchestration Report: ${workflow.name}`);
  lines.push('');
  lines.push(`- Workflow ID: \`${workflow.workflowId}\``);
  lines.push(`- Status: **${summary.status}**`);
  lines.push(`- Started: ${summary.startedAt}`);
  lines.push(`- Completed: ${summary.completedAt}`);
  lines.push(`- Dry run: ${summary.dryRun ? 'yes' : 'no'}`);
  lines.push('');
  lines.push('## Stage results');
  for (const stage of summary.stages) {
    lines.push('');
    lines.push(`### ${stage.name} (\`${stage.stageId}\`)`);
    lines.push(`- Type: ${stage.type}`);
    lines.push(`- Agent role: ${stage.agentRole}`);
    lines.push(`- Status: **${stage.status}**`);
    lines.push(`- Message: ${stage.message}`);
    if (stage.gates.length) {
      lines.push('- Gates:');
      for (const gate of stage.gates) {
        lines.push(`  - \`${gate.gateId}\`: ${gate.status} (${gate.level}, required: ${gate.requiredForAdvance ? 'yes' : 'no'})`);
      }
    } else {
      lines.push('- Gates: none');
    }
  }
  lines.push('');
  lines.push('## Handoff');
  lines.push(summary.status === 'blocked' ? 'Workflow stopped before completion. Resolve blocking gates and rerun.' : 'Workflow completed all planned stages. Review stage outputs before final handoff.');
  lines.push('');
  return lines.join('\n');
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || !args.workflow) {
    console.log(usage());
    process.exit(args.help ? 0 : 1);
  }

  const workflowPath = resolve(process.cwd(), args.workflow);
  const workflow = readJson(workflowPath);
  const manifest = loadManifest();
  const summary = {
    workflowId: workflow.workflowId,
    name: workflow.name,
    dryRun: args.dryRun,
    startedAt: new Date().toISOString(),
    stages: []
  };

  console.error(`Starting workflow ${workflow.workflowId}: ${workflow.name}`);
  for (const stage of workflow.stages || []) {
    console.error(`Starting stage ${stage.stageId} (${stage.agentRole})`);
    const stageResult = runStage(stage, manifest, args.dryRun);
    summary.stages.push(stageResult);
    console.error(`Stage ${stage.stageId}: ${stageResult.status}`);
    if (stageResult.status === 'blocked') break;
  }

  summary.completedAt = new Date().toISOString();
  summary.status = summary.stages.some((stage) => stage.status === 'blocked') ? 'blocked' : (args.dryRun ? 'dry-run' : 'pass');

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outDir = resolve(ROOT, 'docs/reports/orchestration');
  mkdirSync(outDir, { recursive: true });
  const reportPath = resolve(outDir, `${workflow.workflowId}-${timestamp}.md`);
  writeFileSync(reportPath, markdownReport(workflow, summary));
  summary.reportPath = reportPath;

  if (args.outputJson) console.log(JSON.stringify(summary, null, 2));
  else console.log(`Workflow ${summary.status}. Report: ${reportPath}`);
  process.exit(summary.status === 'blocked' ? 1 : 0);
}

main();
