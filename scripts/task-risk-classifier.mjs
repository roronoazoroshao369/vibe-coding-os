#!/usr/bin/env node
// task-risk-classifier.mjs — CLI script that classifies a task description by type and
// outputs the corresponding risk level and recommended quality stack for v2.1 Model-Aware Configuration.
//
// Usage:
//   node scripts/task-risk-classifier.mjs --task "Fix null pointer in auth module"
//   echo "Implement new feature: user dashboard" | node scripts/task-risk-classifier.mjs
//   node scripts/task-risk-classifier.mjs --task "Security audit" --output-json

import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// ---------------------------------------------------------------------------
// Default keyword sets (used when template/config file is missing or incomplete)
// ---------------------------------------------------------------------------
const DEFAULT_KEYWORD_SETS = {
  bugfix: ['fix', 'bug', 'patch', 'resolve', 'correct', 'repair', 'hotfix', 'crash', 'error', 'broken', 'regression', 'issue', 'defect', 'typo', 'off-by-one', 'null pointer', 'edge case'],
  refactor: ['refactor', 'restructure', 'reorganize', 'clean up', 'cleanup', 'simplify', 'extract', 'rename', 'move', 'relocate', 'decouple', 'consolidate', 'deduplicate', 'decompose', 'improve structure', 'code smell', 'technical debt', 'reformat'],
  feature: ['feature', 'implement', 'add', 'create', 'build', 'develop', 'new', 'introduce', 'enhance', 'extend', 'support', 'enable', 'provision', 'scaffold', 'generate', 'integrate', 'add support for'],
  security: ['security', 'vulnerability', 'cve', 'exploit', 'auth', 'authentication', 'authorization', 'permission', 'access control', 'encrypt', 'decrypt', 'xss', 'csrf', 'sql injection', 'injection', 'sanitize', 'validate input', 'token', 'secret', 'credential', 'audit', 'compliance', 'secure'],
  migration: ['migration', 'migrate', 'upgrade', 'downgrade', 'backfill', 'convert', 'transform', 'port', 'schema change', 'data migration', 'breaking change', 'deprecation', 'version bump', 'release', 'import data', 'export data', 'legacy', 'transition'],
  init: ['init', 'initialize', 'setup', 'set up', 'scaffold', 'bootstrap', 'new project', 'new module', 'new package', 'new workspace', 'start', 'create from scratch', 'template', 'boilerplate', 'initial commit', 'foundation', 'base', 'skeleton']
};

// ---------------------------------------------------------------------------
// Default risk profiles (used when template is missing)
// ---------------------------------------------------------------------------
const DEFAULT_RISK_PROFILES = {
  bugfix:    { risk: 'low',    minQualityStack: 'standard' },
  refactor:  { risk: 'low',    minQualityStack: 'standard' },
  feature:   { risk: 'medium', minQualityStack: 'standard' },
  security:  { risk: 'high',   minQualityStack: 'heavy'    },
  migration: { risk: 'high',   minQualityStack: 'heavy'    },
  init:      { risk: 'medium', minQualityStack: 'standard' }
};

// ---------------------------------------------------------------------------
// Ordered list of task types (first match wins during classification)
// ---------------------------------------------------------------------------
const TASK_TYPES = ['security', 'migration', 'feature', 'bugfix', 'refactor', 'init'];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function parseArgs(argv) {
  const args = { task: null, outputJson: false };
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--output-json') {
      args.outputJson = true;
    } else if (arg.startsWith('--task=')) {
      args.task = arg.slice('--task='.length);
    } else if (arg === '--task' && argv[i + 1]) {
      args.task = argv[++i];
    }
  }
  return args;
}

function readJsonIfExists(path) {
  if (!existsSync(path)) return null;
  try { return JSON.parse(readFileSync(path, 'utf8')); }
  catch { return null; }
}

function readStdin() {
  return new Promise((resolveData) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => { data += chunk; });
    process.stdin.on('end', () => resolveData(data.trim()));
    // If stdin is not a TTY and nothing arrives quickly, resolve empty
    if (process.stdin.isTTY) {
      // stdin is a TTY (interactive) — just resolve empty
      process.stdin.resume();
      process.stdin.on('end', () => resolveData(''));
      // On some systems the 'end' event may not fire immediately; give it a nudge
      setTimeout(() => {
        process.stdin.destroy();
        resolveData(data.trim());
      }, 100).unref();
    }
  });
}

function normalizeText(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ').trim();
}

function scoreTask(taskText, keywordSets) {
  const text = normalizeText(taskText);
  const scores = {};

  for (const taskType of TASK_TYPES) {
    const keywords = keywordSets[taskType] || [];
    let score = 0;
    for (const keyword of keywords) {
      const normalizedKeyword = keyword.toLowerCase().trim();
      if (text.includes(normalizedKeyword)) {
        score += normalizedKeyword.split(/\s+/).length; // weight by phrase length
      }
    }
    scores[taskType] = score;
  }

  return scores;
}

function classify(scores) {
  let bestType = 'feature'; // default
  let bestScore = 0;

  for (const taskType of TASK_TYPES) {
    const score = scores[taskType] || 0;
    if (score > bestScore) {
      bestScore = score;
      bestType = taskType;
    }
  }

  // Tie-breaking: if security has any match at all, prioritize it (safety first)
  if ((scores.security || 0) > 0 && (scores.security || 0) >= bestScore) {
    bestType = 'security';
  }

  return bestType;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const args = parseArgs(process.argv);

  // Resolve task text
  let taskText = args.task;
  if (!taskText) {
    taskText = await readStdin();
  }
  if (!taskText || taskText.length === 0) {
    console.error('No task provided. Use --task "..." or pipe input to stdin.');
    process.exit(1);
  }

  // Load keyword sets from template (configurable)
  const classifierConfig = readJsonIfExists(resolve(ROOT, 'templates/task-risk-classifier.json'));
  let keywordSets;
  let riskProfiles;

  if (classifierConfig && classifierConfig.keywordSets) {
    keywordSets = classifierConfig.keywordSets;
    riskProfiles = classifierConfig.taskRiskProfiles || DEFAULT_RISK_PROFILES;
  } else {
    keywordSets = DEFAULT_KEYWORD_SETS;
    riskProfiles = DEFAULT_RISK_PROFILES;
  }

  // Classify
  const scores = scoreTask(taskText, keywordSets);
  const taskType = classify(scores);
  const profile = riskProfiles[taskType] || DEFAULT_RISK_PROFILES.feature;
  const riskLevel = profile.risk;
  const recommendedStack = profile.minQualityStack;

  // Gather matched keywords for transparency
  const matchedKeywords = [];
  const normalizedText = normalizeText(taskText);
  for (const [type, keywords] of Object.entries(keywordSets)) {
    for (const keyword of keywords) {
      if (normalizedText.includes(keyword.toLowerCase().trim())) {
        matchedKeywords.push(keyword);
      }
    }
  }

  // Output
  const output = {
    task: taskText,
    taskType,
    risk: riskLevel,
    recommendedQualityStack: recommendedStack,
    matchedKeywords: [...new Set(matchedKeywords)],
    confidence: scores[taskType] > 0 ? 'high' : 'low'
  };

  if (args.outputJson) {
    console.log(JSON.stringify(output, null, 2));
  } else {
    console.log('=== Task Risk Classifier v2.1 ===');
    console.log('');
    console.log(`Task:         ${taskText}`);
    console.log(`Classified:   ${taskType}`);
    console.log(`Risk:         ${riskLevel}`);
    console.log(`QualityStack: ${recommendedStack}`);
    if (matchedKeywords.length > 0) {
      console.log(`Keywords:     ${[...new Set(matchedKeywords)].join(', ')}`);
    }
    console.log(`Confidence:   ${output.confidence}`);
  }

  process.exit(0);
}

main().catch((error) => {
  const fallback = { engine: 'task-risk-classifier', error: error.message };
  if (process.argv.includes('--output-json')) console.log(JSON.stringify(fallback, null, 2));
  else console.error(`Task risk classifier failed: ${error.message}`);
  process.exit(1);
});
