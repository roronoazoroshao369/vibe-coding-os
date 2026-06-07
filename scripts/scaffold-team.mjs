#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const PATTERNS = {
  pipeline: {
    label: 'Pipeline',
    roles: ['intake-lead', 'planner', 'implementer', 'tester', 'reviewer', 'integrator'],
    taskGraph: ['intake-lead -> planner', 'planner -> implementer', 'implementer -> tester', 'tester -> reviewer', 'reviewer -> integrator']
  },
  'fan-out-fan-in': {
    label: 'Fan-out/Fan-in',
    roles: ['coordinator', 'domain-worker-a', 'domain-worker-b', 'domain-worker-c', 'integrator', 'verifier'],
    taskGraph: ['coordinator -> domain workers', 'domain workers -> integrator', 'integrator -> verifier']
  },
  'expert-pool': {
    label: 'Expert Pool',
    roles: ['coordinator', 'architect', 'security-reviewer', 'test-engineer', 'docs-writer', 'integrator'],
    taskGraph: ['coordinator -> experts', 'experts -> integrator']
  },
  'producer-reviewer': {
    label: 'Producer-Reviewer',
    roles: ['producer', 'reviewer', 'verifier', 'integrator'],
    taskGraph: ['producer -> reviewer', 'reviewer -> producer', 'producer -> verifier', 'verifier -> integrator']
  },
  supervisor: {
    label: 'Supervisor',
    roles: ['supervisor', 'worker-a', 'worker-b', 'worker-c', 'reviewer'],
    taskGraph: ['supervisor -> workers', 'workers -> supervisor', 'supervisor -> reviewer']
  },
  'hierarchical-delegation': {
    label: 'Hierarchical Delegation',
    roles: ['lead', 'frontend-lead', 'backend-lead', 'test-lead', 'integrator'],
    taskGraph: ['lead -> sub-leads', 'sub-leads -> integrator', 'integrator -> lead']
  }
};

const DEFAULT_TOOLS = ['Read', 'Grep', 'Glob', 'Bash'];
const WRITE_TOOLS = ['Read', 'Grep', 'Glob', 'Edit', 'Write', 'Bash'];
const VALID_MODELS = new Set(['haiku', 'sonnet', 'opus']);

function usage() {
  return `Usage: node scripts/scaffold-team.mjs <spec.json> [--dry-run] [--force] [--out-dir <dir>] [--routing]

Generates project-local Claude agent definitions and an OMC plan from a team JSON spec.
Does not start agents, daemons, tmux sessions, MCP servers, or runtimes.`;
}

function parseArgs(argv) {
  const args = { dryRun: false, force: false, routing: false, outDir: '.', specPath: null };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--dry-run') args.dryRun = true;
    else if (arg === '--force') args.force = true;
    else if (arg === '--routing') args.routing = true;
    else if (arg === '--out-dir') {
      args.outDir = argv[index + 1];
      index += 1;
      if (!args.outDir) fail('--out-dir requires a value');
    } else if (arg === '--help' || arg === '-h') {
      console.log(usage());
      process.exit(0);
    } else if (!args.specPath) {
      args.specPath = arg;
    } else {
      fail(`Unexpected argument: ${arg}`);
    }
  }
  if (!args.specPath) fail(usage());
  return args;
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

function slug(value, label) {
  const result = String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (!result) fail(`${label} must contain at least one letter or number.`);
  return result;
}

function normalizePattern(value) {
  const key = String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s*\/\s*/g, '-')
    .replace(/\s+/g, '-');
  const aliases = {
    pipeline: 'pipeline',
    'fan-out-fan-in': 'fan-out-fan-in',
    fanout: 'fan-out-fan-in',
    'fanout-fanin': 'fan-out-fan-in',
    'expert-pool': 'expert-pool',
    'producer-reviewer': 'producer-reviewer',
    supervisor: 'supervisor',
    'hierarchical-delegation': 'hierarchical-delegation'
  };
  return aliases[key] || key;
}

async function loadSpec(file) {
  if (!file.endsWith('.json')) fail('Only JSON specs are supported for deterministic parsing. Use templates/team-spec-template.json.');
  let parsed;
  try {
    parsed = JSON.parse(await readFile(file, 'utf8'));
  } catch (error) {
    fail(`Invalid JSON spec: ${error.message}`);
  }
  return parsed;
}

function validateSpec(spec) {
  if (!spec || typeof spec !== 'object' || Array.isArray(spec)) fail('Spec must be a JSON object.');
  if (!spec.name || typeof spec.name !== 'string') fail('Spec requires string field: name.');
  const patternKey = normalizePattern(spec.pattern);
  if (!PATTERNS[patternKey]) fail(`Unsupported pattern: ${spec.pattern}. Expected one of: ${Object.values(PATTERNS).map((p) => p.label).join(', ')}`);

  const team = slug(spec.name, 'name');
  const defaults = PATTERNS[patternKey];
  const roles = (Array.isArray(spec.roles) && spec.roles.length > 0
    ? spec.roles
    : defaults.roles.map((name) => ({ name }))).map((role) => normalizeRole(role));
  const seen = new Set();
  for (const role of roles) {
    if (seen.has(role.name)) fail(`Duplicate role name: ${role.name}`);
    seen.add(role.name);
  }

  return {
    ...spec,
    team,
    patternKey,
    patternLabel: defaults.label,
    roles,
    tasks: Array.isArray(spec.tasks) ? spec.tasks : [],
    taskGraph: Array.isArray(spec.taskGraph) ? spec.taskGraph : defaults.taskGraph,
    watchdog: spec.watchdog && typeof spec.watchdog === 'object' ? spec.watchdog : {},
    validation: Array.isArray(spec.validation) ? spec.validation : []
  };
}

function normalizeRole(role) {
  if (typeof role === 'string') role = { name: role };
  if (!role || typeof role !== 'object') fail('Each role must be a string or object.');
  const name = slug(role.name, 'role.name');
  const tools = Array.isArray(role.allowedTools) ? role.allowedTools : role.writeScope ? WRITE_TOOLS : DEFAULT_TOOLS;
  const model = role.model || 'sonnet';
  if (!VALID_MODELS.has(model)) fail(`Role ${name} model must be haiku, sonnet, or opus.`);
  return {
    name,
    description: role.description || `${name} role for generated team scaffold`,
    model,
    allowedTools: tools,
    mission: role.mission || `Complete the ${name} responsibility with minimal scope and clear evidence.`,
    context: Array.isArray(role.context) ? role.context : ['Spec goal', 'Assigned task', 'Relevant files', 'Validation expectations'],
    writeScope: role.writeScope || 'No writes unless explicitly assigned by the team lead.',
    forbiddenScope: role.forbiddenScope || 'Do not edit outside assigned scope. Do not overwrite user work. Do not run unapproved long-lived runtimes.',
    outputContract: role.outputContract || 'Report Scope, Changes/findings, Decisions, Risks, Verification, Next action.'
  };
}

function frontmatter(role) {
  return ['---', `name: ${role.name}`, `description: ${role.description}`, `tools: ${role.allowedTools.join(', ')}`, `model: ${role.model}`, '---'].join('\n');
}

function renderAgent(role, spec) {
  return `${frontmatter(role)}

# ${role.name}

## Mission

${role.mission}

## Team context

- Team: ${spec.name}
- Pattern: ${spec.patternLabel}
- Goal: ${spec.goal || 'Defined in the team plan.'}

## Context bundle

${role.context.map((item) => `- ${item}`).join('\n')}

## Write scope

${role.writeScope}

## Forbidden scope

${role.forbiddenScope}

## Output contract

${role.outputContract}

## Runtime note

This is a generated Claude Code project-local subagent definition. It does not start a daemon, tmux session, MCP server, or background runtime. Execution still happens through Claude Code native agents/Team, OMC if available, or manual subagent invocation.
`;
}

function renderPlan(spec) {
  const roleRows = spec.roles.map((role) => `| ${role.name} | ${role.mission} | ${role.context.join('; ')} | ${role.writeScope} | ${role.forbiddenScope} | ${role.outputContract} |`).join('\n');
  const taskRows = spec.tasks.length > 0
    ? spec.tasks.map((task) => `| ${task.name || task.task || 'Task'} | ${task.owner || ''} | ${Array.isArray(task.blocks) ? task.blocks.join(', ') : task.blocks || ''} | ${Array.isArray(task.blockedBy) ? task.blockedBy.join(', ') : task.blockedBy || ''} | ${task.parallelSafe === false ? 'No' : 'Yes'} | ${task.doneWhen || ''} |`).join('\n')
    : spec.taskGraph.map((edge) => `| ${edge} | | | | Yes | Handoff complete. |`).join('\n');
  const checks = spec.validation.length > 0
    ? spec.validation.map((check) => `| ${check.name || 'Check'} | ${check.command || check.method || ''} | ${check.owner || 'integrator'} | ${check.expected || 'Pass'} |`).join('\n')
    : '| Dry run | node scripts/scaffold-team.mjs templates/team-spec-template.json --dry-run | integrator | No overwrite; files listed. |';

  return `# Team Architecture: ${spec.name}

## Intent

- Goal: ${spec.goal || ''}
- User-visible outcome: ${spec.outcome || ''}
- Non-goals: ${(spec.nonGoals || ['This scaffold does not run agents or daemons.']).join('; ')}
- Adaptive Flow tier: ${spec.tier || ''}

## Team pattern

- Selected pattern: ${spec.patternLabel}
- Why this pattern fits: ${spec.why || 'Chosen from deterministic team defaults.'}
- Why a simpler solo flow is insufficient: ${spec.soloRisk || ''}
- Downshift condition: ${spec.downshift || 'Use direct implementation when one role can safely complete all work.'}

## Roles

| Role | Mission | Context bundle | Write scope | Forbidden scope | Output |
| --- | --- | --- | --- | --- | --- |
${roleRows}

## Task graph

| Task | Owner | Blocks | Blocked by | Parallel-safe? | Done when |
| --- | --- | --- | --- | --- | --- |
${taskRows}

## Handoff contract

Each role reports Scope, Findings/changes, Decisions, Risks, Verification, and Next action.

## Watchdog rules

- Idle timeout: ${spec.watchdog.idleTimeout || 'Team lead decides per run.'}
- Conflict escalation: ${spec.watchdog.conflictEscalation || 'Pause overlapping edits; integrator resolves.'}
- Shared-file serialization rule: ${spec.watchdog.sharedFileRule || 'One writer per shared file at a time.'}
- Stop condition: ${spec.watchdog.stopCondition || 'Acceptance criteria met and validation evidence recorded.'}
- Worktree/isolation policy: ${spec.watchdog.isolation || 'Use worktrees only when parallel edits would conflict.'}

## Validation plan

### Dry-run validation

- Can every role start with its context bundle?
- Are write scopes disjoint or serialized?
- Does every acceptance criterion have an owner and check?
- Does attribution/reference work have one accountable owner?

### Real checks

| Check | Command / method | Owner | Expected result |
| --- | --- | --- | --- |
${checks}

## Execution note

This file is generated scaffold output. It creates agent definitions and a plan only. It does not run a daemon, tmux session, MCP server, scheduler, or custom runtime. Run the work through Claude Code native Team / OMC when available, or invoke the generated subagents manually.
`;
}

function renderRouting(spec) {
  const routing = Object.fromEntries(spec.roles.map((role) => [role.name, { agent: role.name, model: role.model, tools: role.allowedTools }]));
  return `${JSON.stringify({ roleRouting: routing }, null, 2)}\n`;
}

async function writeOutput(file, content, options, planned) {
  planned.push(file);
  if (options.dryRun) return;
  if (existsSync(file) && !options.force) fail(`Refusing to overwrite existing file without --force: ${file}`);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, content, 'utf8');
}

const options = parseArgs(process.argv.slice(2));
const spec = validateSpec(await loadSpec(options.specPath));
const root = options.outDir;
const planned = [];

for (const role of spec.roles) {
  await writeOutput(path.join(root, '.claude', 'agents', `${role.name}.md`), renderAgent(role, spec), options, planned);
}
await writeOutput(path.join(root, '.omc', 'plans', `${spec.team}.md`), renderPlan(spec), options, planned);
if (options.routing || spec.emitRoleRouting) {
  await writeOutput(path.join(root, '.claude', `${spec.team}-role-routing.json`), renderRouting(spec), options, planned);
}

console.log(`${options.dryRun ? 'Dry run' : 'Generated'} team scaffold for ${spec.name} (${spec.patternLabel}).`);
for (const file of planned) console.log(`- ${file}`);
