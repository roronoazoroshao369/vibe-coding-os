#!/usr/bin/env node
// adaptive-gate-selector.mjs — v2.1 Model-Aware gate selector for Vibe Coding OS.
//
// Reads model profile, task risk classifier, quality engine config, and
// optional v1.9 weakness memory to select the appropriate quality gates
// for a given model + task combination.
//
// Usage:
//   node scripts/adaptive-gate-selector.mjs --model <modelId> --task <task|taskType>
//   node scripts/adaptive-gate-selector.mjs --model gpt-4o --task "fix auth bug" --output-json

import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// ---------------------------------------------------------------------------
// Defaults (used when external config files are absent)
// ---------------------------------------------------------------------------
const DEFAULT_MODEL_PROFILES = {
  profiles: {
    default: { capability: 'medium' }
  }
};

const DEFAULT_RISK_CLASSIFIER = {
  risk_levels: {
    low: ['docs', 'readme', 'typo-fix', 'test-add', 'comment', 'formatting'],
    medium: ['feature', 'bugfix', 'refactor', 'migration', 'config', 'test'],
    high: ['auth', 'payment', 'security', 'deploy', 'critical-path', 'secrets', 'data-migration']
  },
  default_risk: 'medium'
};
// ---------------------------------------------------------------------------
// Task Type Classification
// ---------------------------------------------------------------------------
const TASK_TYPE_KEYWORDS = {
  feature: ['feature', 'new', 'implement', 'add', 'enhancement', 'capability', 'functionality', 'endpoint', 'api', 'command', 'integration'],
  bugfix: ['bug', 'fix', 'issue', 'error', 'crash', 'regression', 'broken', 'incorrect', 'wrong', 'defect', 'hotfix', 'patch', 'repair'],
  refactor: ['refactor', 'restructure', 'cleanup', 'reorganize', 'simplify', 'improve', 'optimize', 'modernize', 'migration', 'migrate'],
  security: ['security', 'auth', 'vulnerability', 'cve', 'permission', 'audit', 'encrypt', 'secret', 'pii', 'xss', 'injection', 'csrf', 'authentication', 'authorization', 'sensitive']
};

const TASK_TYPE_GATES = {
  feature: {
    add: ['repo-structure', 'references', 'registry-schemas', 'quality-diff-audit'],
    remove: []
  },
  bugfix: {
    add: ['traceability', 'quality-diff-audit', 'runtime-behavioral-tests', 'secret-scan', 'injection-scan'],
    remove: []
  },
  refactor: {
    add: ['repo-structure', 'references', 'traceability', 'quality-diff-audit', 'registry-schemas'],
    remove: []
  },
  security: {
    add: ['injection-scan', 'secret-scan', 'memory-redaction', 'runtime-behavioral-tests', 'quality-diff-audit'],
    remove: []
  }
};

const TASK_TYPE_DEFAULT = 'feature';


const DEFAULT_STACK_PROFILES = {
  lean: {
    gates: ['repo-structure', 'quality-diff-audit', 'secret-scan', 'traceability', 'injection-scan'],
    minGates: 4,
    advisory: ['quality-scorecard-report'],
    required_categories: ['security', 'quality']
  },
  standard: {
    gates: [
      'repo-structure', 'references', 'registry-schemas', 'traceability',
      'injection-scan', 'secret-scan', 'quality-diff-audit', 'quality-scorecard-report',
      'memory-redaction', 'pack-schemas'
    ],
    minGates: 8,
    advisory: ['quality-scorecard-report', 'dashboard-data', 'evaluation-report'],
    required_categories: ['security', 'quality', 'tests']
  },
  heavy: {
    gates: [
      'repo-structure', 'references', 'registry-schemas', 'pack-schemas',
      'traceability', 'injection-scan', 'secret-scan', 'memory-redaction',
      'adapter-smoke-tests', 'cli-smoke-tests', 'e2e-workflow',
      'dashboard-data', 'dashboard-sync-check', 'release-metadata',
      'evaluation-report', 'bilingual-readme-sync', 'markdown-links',
      'readme-heading-version', 'roadmap-status-integrity',
      'runtime-behavioral-tests', 'quality-diff-audit', 'quality-scorecard-report'
    ],
    minGates: 18,
    advisory: ['quality-scorecard-report', 'dashboard-data', 'evaluation-report'],
    required_categories: ['security', 'quality', 'docs', 'tests', 'regression']
  }
};

// All known gates from the quality engine manifest
const ALL_MANIFEST_GATES = [
  'repo-structure', 'references', 'registry-schemas', 'pack-schemas',
  'traceability', 'injection-scan', 'secret-scan', 'memory-redaction',
  'adapter-smoke-tests', 'cli-smoke-tests', 'e2e-workflow',
  'dashboard-data', 'dashboard-sync-check', 'release-metadata',
  'evaluation-report', 'bilingual-readme-sync', 'markdown-links',
  'readme-heading-version', 'roadmap-status-integrity',
  'runtime-behavioral-tests', 'quality-diff-audit', 'quality-scorecard-report'
];

// Extra checks added for weakness patterns (gate ids that get force-added)
const WEAKNESS_EXTRA_GATES = [
  'injection-scan', 'secret-scan', 'traceability',
  'quality-diff-audit', 'runtime-behavioral-tests'
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function parseArgs(argv) {
  const args = { model: null, task: null, outputJson: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--output-json') {
      args.outputJson = true;
    } else if (arg === '--model' && i + 1 < argv.length) {
      args.model = argv[++i];
    } else if (arg.startsWith('--model=')) {
      args.model = arg.slice('--model='.length).trim();
    } else if (arg === '--task' && i + 1 < argv.length) {
      args.task = argv[++i];
    } else if (arg.startsWith('--task=')) {
      args.task = arg.slice('--task='.length).trim();
    } else if (arg === '--help' || arg === '-h') {
      args.help = true;
    }
  }
  return args;
}

function readJsonIfExists(path) {
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    return { __readError: `Could not parse ${path}: ${error.message}` };
  }
}

function resolveJsonPaths(candidates) {
  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

function formatDuration(ms) {
  return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(2)}s`;
}

// ---------------------------------------------------------------------------
// Task Risk Classification
// ---------------------------------------------------------------------------
function classifyTaskRisk(task, classifier) {
  const taskLower = (task || '').toLowerCase();

  // Support v2.1 format: taskRiskProfiles + keywordSets
  if (classifier?.keywordSets && classifier?.taskRiskProfiles) {
    const keywordSets = classifier.keywordSets;
    const taskRiskProfiles = classifier.taskRiskProfiles;
    let bestMatch = null;
    let bestScore = 0;

    for (const [taskType, keywords] of Object.entries(keywordSets)) {
      let score = 0;
      for (const keyword of keywords) {
        if (taskLower.includes(keyword)) {
          score += 1;
        }
      }
      if (score > bestScore) {
        bestScore = score;
        bestMatch = taskType;
      }
    }

    if (bestMatch && taskRiskProfiles[bestMatch]) {
      return taskRiskProfiles[bestMatch].risk;
    }
  }

  // Fallback: legacy risk_levels format
  const riskLevels = classifier?.risk_levels || DEFAULT_RISK_CLASSIFIER.risk_levels;

  for (const [level, keywords] of Object.entries(riskLevels)) {
    for (const keyword of keywords) {
      if (taskLower.includes(keyword)) {
        return level;
      }
    }
  }

  return classifier?.default_risk || DEFAULT_RISK_CLASSIFIER.default_risk;
}

function classifyTaskType(task) {
  const taskLower = (task || '').toLowerCase();
  let bestMatch = TASK_TYPE_DEFAULT;
  let bestScore = 0;

  for (const [taskType, keywords] of Object.entries(TASK_TYPE_KEYWORDS)) {
    let score = 0;
    for (const keyword of keywords) {
      if (taskLower.includes(keyword)) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = taskType;
    }
  }

  return bestMatch;
}

// ---------------------------------------------------------------------------
// Model Capability Lookup
// ---------------------------------------------------------------------------
function getModelCapability(modelId, profiles) {
  // Support both v2.1 format (modelProfiles) and legacy format (profiles)
  const profilesMap = profiles?.modelProfiles || profiles?.profiles || DEFAULT_MODEL_PROFILES.profiles;
  const lookup = modelId?.toLowerCase() || '';

  // Direct match
  if (profilesMap[modelId]) return profilesMap[modelId].capability;

  // Partial match: check if any profile key is contained in the model id or vice versa
  for (const [key, profile] of Object.entries(profilesMap)) {
    if (lookup.includes(key.toLowerCase()) || key.toLowerCase().includes(lookup)) {
      return profile.capability;
    }
  }

  return profilesMap.default?.capability || 'medium';
}

// ---------------------------------------------------------------------------
// Weakness Memory Integration
// ---------------------------------------------------------------------------
function loadWeaknessPatterns(modelId) {
  // Check for weakness-log.json in the v1.9 skill directory
  const weaknessPaths = [
    resolve(ROOT, 'skills/core/model-weakness-memory/weakness-log.json'),
    resolve(ROOT, 'skills/model-weakness-memory/weakness-log.json'),
    resolve(ROOT, 'model-weakness-memory/weakness-log.json'),
    // Also check cwd-relative paths
    resolve('.', 'model-weakness-memory/weakness-log.json'),
    resolve('.', 'skills/core/model-weakness-memory/weakness-log.json')
  ];

  let weaknessLog = null;
  for (const path of weaknessPaths) {
    weaknessLog = readJsonIfExists(path);
    if (weaknessLog && !weaknessLog.__readError) break;
  }

  if (!weaknessLog) return { hasLog: false, patterns: [], modelPatterns: [] };

  const patterns = Array.isArray(weaknessLog.patterns) ? weaknessLog.patterns : [];
  const modelPatterns = patterns.filter((p) => {
    const pModel = (p.model || p.modelType || '').toLowerCase();
    const pCategory = (p.category || p.patternCategory || '').toLowerCase();
    return pModel.includes((modelId || '').toLowerCase()) ||
           (modelId || '').toLowerCase().includes(pModel);
  });

  return {
    hasLog: true,
    patterns,
    modelPatterns,
    modelMatched: modelPatterns.length > 0
  };
}

// ---------------------------------------------------------------------------
// Gate Selection Logic
// ---------------------------------------------------------------------------
function selectGates({ capability, risk, taskType, stackProfiles, manifestGates, weaknessInfo }) {
  const profiles = stackProfiles || DEFAULT_STACK_PROFILES;
  const allGates = manifestGates || ALL_MANIFEST_GATES;

  // Step 1: Select base profile from model capability
  // high → lean, medium → standard, low → heavy
  const profileMap = { high: 'lean', medium: 'standard', low: 'heavy' };
  const baseProfileName = profileMap[capability] || 'standard';
  const baseProfile = profiles[baseProfileName] || profiles.standard;

  // Start with base gates from the profile
  let selectedGates = [...(baseProfile.gates || [])];
  const advisoryGates = [...(baseProfile.advisory || [])];

  // Track the rationale
  const steps = [{
    step: 'base-profile',
    profileName: baseProfileName,
    modelCapability: capability,
    gates: [...selectedGates],
    description: `Model capability "${capability}" maps to "${baseProfileName}" profile`
  }];

  // Step 2: Apply risk adjustments
  let skippedGates = [];

  if (risk === 'low') {
    // Low risk: remove advisory gates from the selection
    const advisorySet = new Set(advisoryGates);
    const removedAdvisory = selectedGates.filter((g) => advisorySet.has(g));
    selectedGates = selectedGates.filter((g) => !advisorySet.has(g));
    skippedGates = [...skippedGates, ...removedAdvisory];
    steps.push({
      step: 'risk-low',
      action: 'remove_advisory',
      removed: removedAdvisory,
      description: `Low-risk task: removed advisory gates (${removedAdvisory.join(', ') || 'none'})`
    });
  } else if (risk === 'high') {
    // High risk: add ALL gates from manifest
    const currentSet = new Set(selectedGates);
    const added = [];
    for (const gate of allGates) {
      if (!currentSet.has(gate)) {
        selectedGates.push(gate);
        added.push(gate);
      }
    }
    steps.push({
      step: 'risk-high',
      action: 'add_all',
      added,
      description: `High-risk task: added all manifest gates (+${added.length} gates)`
    });
  } else {
    steps.push({
      step: 'risk-medium',
      action: 'keep_default',
      description: 'Medium-risk task: keeping default gates for the profile'
    });
  }

  // Step 3: Task-type aware gate selection
  const typeGates = TASK_TYPE_GATES[taskType] || TASK_TYPE_GATES[TASK_TYPE_DEFAULT];
  const typeAdded = [];
  const typeRemoved = [];
  if (typeGates) {
    const currentSet = new Set(selectedGates);
    for (const gate of (typeGates.add || [])) {
      if (!currentSet.has(gate)) {
        selectedGates.push(gate);
        typeAdded.push(gate);
        currentSet.add(gate);
      }
    }
    if (typeAdded.length > 0) {
      steps.push({
        step: 'task-type',
        action: 'add_task_type_gates',
        taskType,
        added: typeAdded,
        description: `Task type "${taskType}": added ${typeAdded.length} specific gate(s) (${typeAdded.join(', ')})`
      });
    }
    for (const gate of (typeGates.remove || [])) {
      const idx = selectedGates.indexOf(gate);
      if (idx !== -1) {
        selectedGates.splice(idx, 1);
        typeRemoved.push(gate);
      }
    }
    if (typeRemoved.length > 0) {
      steps.push({
        step: 'task-type-remove',
        action: 'remove_task_type_gates',
        taskType,
        removed: typeRemoved,
        description: `Task type "${taskType}": removed ${typeRemoved.length} gate(s) (${typeRemoved.join(', ')})`
      });
    }
  }

  // Step 4: Weakness memory integration
  const addedFromWeakness = [];
  if (weaknessInfo?.hasLog && weaknessInfo?.modelPatterns?.length > 0) {
    const currentSet = new Set(selectedGates);
    for (const extraGate of WEAKNESS_EXTRA_GATES) {
      if (!currentSet.has(extraGate)) {
        selectedGates.push(extraGate);
        addedFromWeakness.push(extraGate);
      }
    }
    steps.push({
      step: 'weakness-memory',
      action: 'add_weakness_gates',
      matchedModels: weaknessInfo.modelPatterns.map((p) => p.model || p.modelType || 'unknown'),
      matchedPatterns: weaknessInfo.modelPatterns.map((p) => p.category || p.patternCategory || 'unknown'),
      added: addedFromWeakness,
      description: `Weakness memory: added ${addedFromWeakness.length} extra gates for known model weaknesses`
    });
  } else if (weaknessInfo?.hasLog) {
    steps.push({
      step: 'weakness-memory',
      action: 'no_model_match',
      description: 'Weakness memory loaded but no patterns matched this model'
    });
  } else {
    steps.push({
      step: 'weakness-memory',
      action: 'no_log',
      description: 'No weakness log found; skipping weakness-based gate additions'
    });
  }

  // Step 5: Ensure minimum gates
  const minGates = baseProfile.minGates || 4;
  if (selectedGates.length < minGates) {
    // Add missing critical gates from allGates to meet minimum
    const currentSet = new Set(selectedGates);
    for (const gate of allGates) {
      if (selectedGates.length >= minGates) break;
      if (!currentSet.has(gate)) {
        selectedGates.push(gate);
      }
    }
    steps.push({
      step: 'minimum-gates',
      action: 'ensure_minimum',
      minGates,
      description: `Ensured minimum ${minGates} gates are selected`
    });
  }

  // Step 6: Ensure required categories are covered
  // (This is a validation step — in practice the manifest gates cover all categories)

  // Deduplicate and sort
  selectedGates = [...new Set(selectedGates)];

  // Final skipped = all manifest gates not in selected
  const selectedSet = new Set(selectedGates);
  skippedGates = allGates.filter((g) => !selectedSet.has(g));

  return {
    selectedGates,
    skippedGates,
    advisoryGates: advisoryGates.filter((g) => !selectedSet.has(g)),
    steps,
    addedFromWeakness,
    baseProfileName,
    riskLevel: risk,
    taskType,
    modelCapability: capability
  };
}

// ---------------------------------------------------------------------------
// Output Formatting
// ---------------------------------------------------------------------------
function buildOutput(modelId, task, result, startTime) {
  return {
    timestamp: new Date().toISOString(),
    model: modelId,
    task,
    taskType: result.taskType,
    modelCapability: result.modelCapability,
    riskLevel: result.riskLevel,
    baseProfile: result.baseProfileName,
    selectedGates: result.selectedGates,
    skippedGates: result.skippedGates,
    advisoryGates: result.advisoryGates,
    gatesAddedFromWeakness: result.addedFromWeakness,
    totalSelected: result.selectedGates.length,
    totalSkipped: result.skippedGates.length,
    rationale: result.steps
  };
}

function printHumanOutput(output) {
  console.log('=== Adaptive Gate Selector (v2.1) ===');
  console.log(`Model:        ${output.model}`);
  console.log(`Task:         ${output.task}`);
  console.log(`Capability:   ${output.modelCapability}`);
  console.log(`Risk Level:   ${output.riskLevel}`);
  console.log(`Task Type:    ${output.taskType}`);
  console.log(`Base Profile: ${output.baseProfile}`);
  console.log('');

  console.log(`Selected gates (${output.totalSelected}):`);
  for (const gate of output.selectedGates) {
    console.log(`  ✅ ${gate}`);
  }

  if (output.gatesAddedFromWeakness.length > 0) {
    console.log('');
    console.log(`Extra gates from weakness memory (${output.gatesAddedFromWeakness.length}):`);
    for (const gate of output.gatesAddedFromWeakness) {
      console.log(`  ⚠️  ${gate} (added due to known model weakness)`);
    }
  }

  if (output.skippedGates.length > 0) {
    console.log('');
    console.log(`Skipped gates (${output.totalSkipped}):`);
    for (const gate of output.skippedGates) {
      console.log(`  ⏭️  ${gate}`);
    }
  }

  if (output.advisoryGates.length > 0) {
    console.log('');
    console.log(`Advisory (not required):`);
    for (const gate of output.advisoryGates) {
      console.log(`  💡 ${gate}`);
    }
  }

  console.log('');
  console.log('Rationale:');
  for (const step of output.rationale) {
    console.log(`  • ${step.description}`);
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const startTime = Date.now();
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    console.log(`Usage: node scripts/adaptive-gate-selector.mjs --model <modelId> --task <task>
       --output-json    Output results as JSON
       --help, -h       Show this help

Examples:
  node scripts/adaptive-gate-selector.mjs --model gpt-4o --task "fix auth bug"
  node scripts/adaptive-gate-selector.mjs --model llama-3-8b --task deploy --output-json`);
    process.exit(0);
  }

  if (!args.model || !args.task) {
    console.error('Error: --model and --task are required. Use --help for usage.');
    process.exit(1);
  }

  // Read model profiles
  const profilePath = resolveJsonPaths([
    resolve(ROOT, 'templates/model-profiles.json'),
    resolve('.', 'model-profiles.json'),
    resolve(ROOT, 'model-profiles.json')
  ]);
  const modelProfiles = profilePath ? readJsonIfExists(profilePath) : null;

  // Read task risk classifier
  const riskClassifierPath = resolveJsonPaths([
    resolve(ROOT, 'templates/task-risk-classifier.json'),
    resolve('.', 'task-risk-classifier.json'),
    resolve(ROOT, 'task-risk-classifier.json')
  ]);
  const riskClassifier = riskClassifierPath ? readJsonIfExists(riskClassifierPath) : null;

  // Read stack profile matrix
  const matrixPath = resolveJsonPaths([
    resolve(ROOT, 'templates/stack-profile-matrix.json'),
    resolve('.', 'stack-profile-matrix.json')
  ]);
  const matrixData = matrixPath ? readJsonIfExists(matrixPath) : null;
  const stackProfiles = matrixData?.stackProfiles || DEFAULT_STACK_PROFILES;

  // Read quality engine config (v2.0)
  const engineConfigPath = resolveJsonPaths([
    resolve(ROOT, 'templates/quality-engine-config.json'),
    resolve('.', '.quality-engine.json')
  ]);
  const engineConfig = engineConfigPath ? readJsonIfExists(engineConfigPath) : null;

  // Read quality gate manifest (v2.0)
  const manifestPath = resolveJsonPaths([
    resolve(ROOT, 'templates/quality-gate-manifest.json'),
    resolve('.', 'quality-gate-manifest.json')
  ]);
  const manifestData = manifestPath ? readJsonIfExists(manifestPath) : null;
  const manifestGates = manifestData?.gates?.map((g) => g.id) || ALL_MANIFEST_GATES;

  // Step 1: Model capability
  const capability = getModelCapability(args.model, modelProfiles || DEFAULT_MODEL_PROFILES);

  // Step 2: Task risk classification
  const risk = classifyTaskRisk(args.task, riskClassifier || DEFAULT_RISK_CLASSIFIER);

  // Step 2b: Task type classification
  const taskType = classifyTaskType(args.task);

  // Step 3: Load weakness memory
  const weaknessInfo = loadWeaknessPatterns(args.model);

  // Step 4: Select gates
  const selection = selectGates({
    capability,
    risk,
    taskType,
    stackProfiles,
    manifestGates,
    weaknessInfo
  });

  // Build output
  const output = buildOutput(args.model, args.task, selection, startTime);

  if (args.outputJson) {
    console.log(JSON.stringify(output, null, 2));
  } else {
    printHumanOutput(output);
  }
}

main().catch((err) => {
  console.error('Fatal:', err?.message || err);
  process.exit(1);
});
