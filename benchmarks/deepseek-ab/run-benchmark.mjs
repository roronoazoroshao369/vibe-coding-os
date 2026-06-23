#!/usr/bin/env node
/**
 * run-benchmark.mjs — DeepSeek A/B quality benchmark orchestrator.
 *
 * For each task x arm x run:
 *   1. Build the system prompt (control vs framework).
 *   2. Build the user message (prompt.md + any context files).
 *   3. Call the model (OpenAI-compatible /chat/completions).
 *   4. Extract the code block, run it through the scorers.
 *   5. Persist a per-run JSON under results/raw/.
 *
 * --dry-run  : skip API calls; emit a stub completion so wiring + scorers
 *              can be validated offline.
 * --runs N   : override runsPerArm.
 * --task ID  : limit to one task id.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, cpSync, rmSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { scoreFirstTry } from './score-firsttry.mjs';
import { scoreHallucination } from './score-hallucination.mjs';
import { scoreRubric } from './score-rubric.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const flag = (n) => argv.includes(n);
const opt = (n, d) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : d; };

const DRY = flag('--dry-run');
const ONLY_TASK = opt('--task', null);

const cfgPath = join(HERE, 'config.json');
const cfg = existsSync(cfgPath)
  ? JSON.parse(readFileSync(cfgPath, 'utf8'))
  : JSON.parse(readFileSync(join(HERE, 'config.example.json'), 'utf8'));

const RUNS = parseInt(opt('--runs', cfg.run.runsPerArm), 10);
const TASKS_DIR = resolve(HERE, '..', '..', cfg.run.tasksDir.replace(/^benchmarks\//, 'benchmarks/'));
const RESULTS_DIR = resolve(HERE, 'results');
const RAW_DIR = join(RESULTS_DIR, 'raw');
mkdirSync(RAW_DIR, { recursive: true });

const SYS = {
  control: readFileSync(join(HERE, 'prompts', 'arm-a-control.md'), 'utf8'),
  framework: readFileSync(join(HERE, 'prompts', 'arm-b-framework.md'), 'utf8'),
};

function listTasks() {
  return readdirSync(TASKS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((name) => existsSync(join(TASKS_DIR, name, 'task.json')))
    .filter((name) => !ONLY_TASK || JSON.parse(readFileSync(join(TASKS_DIR, name, 'task.json'), 'utf8')).id === ONLY_TASK);
}

function buildUserMessage(taskDir, task) {
  let msg = readFileSync(join(taskDir, 'prompt.md'), 'utf8');
  const ctxFiles = task.contextFiles || [];
  if (ctxFiles.length) {
    msg += '\n\n## Context files (read-only)\n';
    for (const rel of ctxFiles) {
      const p = join(taskDir, rel);
      if (existsSync(p)) {
        msg += `\n### ${rel}\n\`\`\`\n${readFileSync(p, 'utf8')}\n\`\`\`\n`;
      }
    }
  }
  return msg;
}

async function callModel(system, user) {
  if (DRY) {
    return { content: '```python\n# dry-run stub\ndef _stub():\n    return None\n```', tokens: { prompt: 100, completion: 20, total: 120 } };
  }
  const key = process.env[cfg.model.apiKeyEnv];
  if (!key) throw new Error(`Missing API key env: ${cfg.model.apiKeyEnv}`);
  const res = await fetch(`${cfg.model.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: cfg.model.id,
      temperature: cfg.model.temperature,
      max_tokens: cfg.model.maxTokens,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const u = data.usage || {};
  return {
    content: data.choices?.[0]?.message?.content || '',
    tokens: { prompt: u.prompt_tokens || 0, completion: u.completion_tokens || 0, total: u.total_tokens || 0 },
  };
}

function extractCode(text) {
  const m = text.match(/```[a-zA-Z0-9]*\n([\s\S]*?)```/);
  return m ? m[1] : text;
}

function loc(code) {
  return code.split('\n').filter((l) => l.trim() && !l.trim().startsWith('#')).length;
}

async function runOne(taskName, arm, runIdx) {
  const taskDir = join(TASKS_DIR, taskName);
  const task = JSON.parse(readFileSync(join(taskDir, 'task.json'), 'utf8'));
  const user = buildUserMessage(taskDir, task);

  const { content, tokens } = await callModel(SYS[arm], user);
  const code = extractCode(content);

  // Materialize a sandbox dir: context + tests + model output.
  const sandbox = join(RAW_DIR, '_sandbox', `${task.id}-${arm}-${runIdx}`);
  rmSync(sandbox, { recursive: true, force: true });
  mkdirSync(sandbox, { recursive: true });
  if (existsSync(join(taskDir, 'context'))) cpSync(join(taskDir, 'context'), sandbox, { recursive: true });
  if (existsSync(join(taskDir, 'tests'))) cpSync(join(taskDir, 'tests'), join(sandbox, 'tests'), { recursive: true });
  writeFileSync(join(sandbox, task.entrypoint), code);

  const firstTry = cfg.scoring.firstTry ? scoreFirstTry({ sandbox, task }) : null;
  const halluc = cfg.scoring.hallucination ? scoreHallucination({ code, task }) : null;
  const rubric = cfg.scoring.rubric ? scoreRubric({ code, task }) : null;

  const record = {
    taskId: task.id, language: task.language, arm, runIdx,
    tokens,
    metrics: {
      firstTryPass: firstTry?.pass ?? null,
      hallucinationCount: halluc?.count ?? null,
      hallucinationSymbols: halluc?.symbols ?? [],
      tokensTotal: tokens.total,
      loc: loc(code),
      locDelta: task.referenceLoc ? loc(code) - task.referenceLoc : null,
      rubricScore: rubric?.score ?? null,
    },
    rubricBreakdown: rubric?.breakdown ?? null,
    rawContentLength: content.length,
  };
  writeFileSync(join(RAW_DIR, `${task.id}__${arm}__${runIdx}.json`), JSON.stringify(record, null, 2));
  rmSync(sandbox, { recursive: true, force: true });
  return record;
}

async function main() {
  const tasks = listTasks();
  if (!tasks.length) { console.error('No tasks found in', TASKS_DIR); process.exit(1); }
  console.log(`Tasks: ${tasks.length} | arms: ${cfg.run.arms.join(', ')} | runs/arm: ${RUNS} | mode: ${DRY ? 'DRY' : 'LIVE'}`);

  for (const t of tasks) {
    for (const arm of cfg.run.arms) {
      for (let r = 0; r < RUNS; r++) {
        process.stdout.write(`  ${t} [${arm}] run ${r + 1}/${RUNS} ... `);
        try {
          const rec = await runOne(t, arm, r);
          console.log(`pass=${rec.metrics.firstTryPass} halluc=${rec.metrics.hallucinationCount} tok=${rec.metrics.tokensTotal} rubric=${rec.metrics.rubricScore}`);
        } catch (e) {
          console.log('ERROR:', e.message);
        }
      }
    }
  }
  console.log('\nDone. Raw results in results/raw/. Now run: node benchmarks/deepseek-ab/aggregate.mjs');
}

main();
