import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

export const SETUP_TOOLS = {
  'claude-code': { file: 'CLAUDE.md', src: 'CLAUDE.md', manifestTool: 'claude-code' },
  claude: { file: 'CLAUDE.md', src: 'CLAUDE.md', manifestTool: 'claude-code' },
  codex: { file: 'AGENTS.md', src: 'AGENTS.md', manifestTool: 'codex' },
  cursor: { file: '.cursorrules', src: 'AGENTS.md', manifestTool: 'cursor' },
  gemini: { file: 'GEMINI.md', src: 'AGENTS.md', manifestTool: 'gemini' },
};

export const SETUP_SCOPES = {
  minimal: {
    description: 'Adapter instruction file only; no optional runtime assumptions.',
    features: ['adapter-instructions'],
    runtime: false,
    team: false,
  },
  recommended: {
    description: 'Adapter instruction file plus project-local setup manifest.',
    features: ['adapter-instructions', 'setup-manifest'],
    runtime: false,
    team: false,
  },
  full: {
    description: 'Project-local manifest advertises all Vibe OS core workflows; runtime remains opt-in.',
    features: ['adapter-instructions', 'setup-manifest', 'skills', 'commands', 'templates', 'optional-runtime'],
    runtime: false,
    team: false,
  },
  runtime: {
    description: 'Project-local manifest marks optional runtime intent; does not install global settings or start daemons.',
    features: ['adapter-instructions', 'setup-manifest', 'optional-runtime'],
    runtime: true,
    team: false,
  },
  team: {
    description: 'Project-local manifest marks team workflow intent; runtime/team state is still explicitly opt-in.',
    features: ['adapter-instructions', 'setup-manifest', 'team-workflows', 'optional-runtime'],
    runtime: true,
    team: true,
  },
};

export function parseSetupProjectArgs(args = []) {
  const options = {
    tool: null,
    scope: 'recommended',
    dryRun: false,
    force: false,
    currentTerminal: false,
    projectDir: process.cwd(),
  };

  const readValue = (argsList, index, flag) => {
    const value = argsList[index + 1];
    if (value == null || value === '' || value.startsWith('--')) {
      throw new Error(`Missing value for ${flag}`);
    }
    return value;
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg == null || arg === '') continue;
    if (arg === '--dry-run') options.dryRun = true;
    else if (arg === '--force') options.force = true;
    else if (arg === '--current-terminal') options.currentTerminal = true;
    else if (arg === '--scope') options.scope = readValue(args, i++, '--scope');
    else if (arg.startsWith('--scope=')) options.scope = arg.slice('--scope='.length);
    else if (arg === '--tool') options.tool = readValue(args, i++, '--tool');
    else if (arg.startsWith('--tool=')) options.tool = arg.slice('--tool='.length);
    else if (arg === '--project') options.projectDir = readValue(args, i++, '--project');
    else if (arg.startsWith('--project=')) options.projectDir = arg.slice('--project='.length);
    else if (arg.startsWith('--')) throw new Error(`Unknown flag: ${arg}`);
    else if (!options.tool) options.tool = arg;
    else throw new Error(`Unexpected argument: ${arg}`);
  }

  options.tool ||= 'claude-code';
  return options;
}

export function planProjectSetup({ rootDir, projectDir = process.cwd(), tool = 'claude-code', scope = 'recommended', force = false, dryRun = false, currentTerminal = false } = {}) {
  if (!rootDir) throw new Error('rootDir is required');
  const adapter = SETUP_TOOLS[tool];
  if (!adapter) throw new Error(`Unknown tool: ${tool}. Valid: ${Object.keys(SETUP_TOOLS).filter((t) => t !== 'claude').join(', ')} (alias: claude)`);
  const scopeDef = SETUP_SCOPES[scope];
  if (!scopeDef) throw new Error(`Unknown scope: ${scope}. Valid: ${Object.keys(SETUP_SCOPES).join(', ')}`);

  const targetDir = resolve(projectDir);
  const instructionPath = join(targetDir, adapter.file);
  const manifestPath = join(targetDir, '.vibe', 'setup.json');
  const sourcePath = join(rootDir, adapter.src);
  const generatedAt = new Date().toISOString();
  const manifest = {
    schemaVersion: 1,
    tool: adapter.manifestTool,
    adapterFile: adapter.file,
    source: 'vibe-coding-os',
    scope,
    scopeDescription: scopeDef.description,
    features: scopeDef.features,
    optionalRuntime: scopeDef.runtime,
    teamWorkflows: scopeDef.team,
    currentTerminal: Boolean(currentTerminal),
    projectLocal: true,
    globalSettingsModified: false,
    generatedAt,
  };

  const actions = [
    {
      type: 'write',
      path: instructionPath,
      displayPath: adapter.file,
      sourcePath,
      skip: existsSync(instructionPath) && !force,
      reason: existsSync(instructionPath) && !force ? 'exists (use --force to overwrite)' : null,
      content: () => readFileSync(sourcePath, 'utf8'),
    },
    {
      type: 'write',
      path: manifestPath,
      displayPath: '.vibe/setup.json',
      skip: existsSync(manifestPath) && !force,
      reason: existsSync(manifestPath) && !force ? 'exists (use --force to overwrite)' : null,
      content: () => `${JSON.stringify(manifest, null, 2)}\n`,
    },
  ];

  return { tool: adapter.manifestTool, requestedTool: tool, scope, targetDir, dryRun, force, currentTerminal, manifest, actions };
}

export function applyProjectSetup(plan) {
  const results = [];
  for (const action of plan.actions) {
    if (action.skip) {
      results.push({ ...action, status: 'skipped' });
      continue;
    }
    if (plan.dryRun) {
      results.push({ ...action, status: 'planned' });
      continue;
    }
    mkdirSync(dirname(action.path), { recursive: true });
    writeFileSync(action.path, action.content(), 'utf8');
    results.push({ ...action, status: 'written' });
  }
  return { ...plan, results };
}

export function setupProject(options) {
  const plan = planProjectSetup(options);
  return applyProjectSetup(plan);
}
