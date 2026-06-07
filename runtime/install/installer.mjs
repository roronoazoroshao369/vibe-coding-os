import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { createStore, ensureRuntime, writeJsonAtomic, emptyCollection } from '../core/fs-store.mjs';
import { appendEvent } from '../core/events.mjs';

export const RUNTIME_COLLECTIONS = ['tasks', 'memory', 'checkpoints', 'teams', 'sessions'];
export const DEFAULT_MCP_NAME = 'vibe-runtime';
export const RUNTIME_MCP_SERVER = path.join('runtime', 'mcp', 'server.mjs');

// Default MCP stdio entry written into .mcp.json. Points at the conventional
// local runtime MCP server path; harmless to register before that server exists.
export function defaultMcpEntry(root = process.cwd()) {
  return {
    command: 'node',
    args: [path.join(root, RUNTIME_MCP_SERVER)],
    env: {}
  };
}

// Merge a single server entry into an existing .mcp.json document without
// clobbering other servers. Returns { config, action } where action is one of
// 'add' | 'skip' | 'overwrite'.
export function mergeMcpEntry(existing, name, entry, { force = false } = {}) {
  const config = existing && typeof existing === 'object' ? { ...existing } : {};
  const servers = config.mcpServers && typeof config.mcpServers === 'object' ? { ...config.mcpServers } : {};
  let action;
  if (Object.prototype.hasOwnProperty.call(servers, name)) {
    if (!force) {
      return { config: { ...config, mcpServers: servers }, action: 'skip' };
    }
    action = 'overwrite';
  } else {
    action = 'add';
  }
  servers[name] = entry;
  config.mcpServers = servers;
  return { config, action };
}

async function readJsonFile(file) {
  return JSON.parse(await readFile(file, 'utf8'));
}

// Plan the install as a list of steps without performing IO. Each step has a
// `kind`, a human `summary`, and an `apply()` thunk used outside dry-run.
export async function planInstall(root, options = {}) {
  const { force = false, withMcp = false, mcpName = DEFAULT_MCP_NAME } = options;
  const store = createStore(root);
  const steps = [];

  // Runtime directory.
  steps.push({
    kind: 'mkdir',
    summary: existsSync(store.runtimeDir)
      ? `runtime dir exists: ${path.relative(root, store.runtimeDir)}`
      : `create runtime dir: ${path.relative(root, store.runtimeDir)}`,
    apply: () => ensureRuntime(store)
  });

  // Config from template.
  const template = path.join(root, 'templates', 'runtime-config-template.json');
  const configTarget = path.join(store.runtimeDir, 'config.json');
  const configExists = existsSync(configTarget);
  if (!existsSync(template)) {
    steps.push({ kind: 'config', summary: 'skip config: template missing', apply: async () => {} });
  } else if (configExists && !force) {
    steps.push({ kind: 'config', summary: 'skip config: already exists (use --force)', apply: async () => {} });
  } else {
    steps.push({
      kind: 'config',
      summary: `${configExists ? 'overwrite' : 'write'} config: ${path.relative(root, configTarget)}`,
      apply: async () => writeFile(configTarget, await readFile(template, 'utf8'), 'utf8')
    });
  }

  // Empty collections.
  for (const kind of RUNTIME_COLLECTIONS) {
    const file = `${kind}.json`;
    const exists = existsSync(path.join(store.runtimeDir, file));
    if (exists && !force) {
      steps.push({ kind: 'collection', summary: `skip ${file}: already exists`, apply: async () => {} });
    } else {
      steps.push({
        kind: 'collection',
        summary: `${exists ? 'reset' : 'create'} ${file}`,
        apply: () => writeJsonAtomic(store, file, emptyCollection(kind))
      });
    }
  }

  // Optional MCP registration.
  if (withMcp) {
    const mcpPath = path.join(root, '.mcp.json');
    const existing = existsSync(mcpPath) ? await readJsonFile(mcpPath) : null;
    const { config, action } = mergeMcpEntry(existing, mcpName, defaultMcpEntry(root), { force });
    const summaries = {
      add: `register MCP server "${mcpName}" in .mcp.json`,
      overwrite: `overwrite MCP server "${mcpName}" in .mcp.json`,
      skip: `skip MCP server "${mcpName}": already registered (use --force)`
    };
    steps.push({
      kind: 'mcp',
      summary: summaries[action],
      apply: action === 'skip' ? async () => {} : () => writeFile(mcpPath, `${JSON.stringify(config, null, 2)}\n`, 'utf8')
    });
  }

  return { store, steps, options: { force, withMcp, mcpName } };
}

// Execute the planned steps. When dryRun is true, nothing is written.
export async function runInstall(root, options = {}) {
  const { dryRun = false } = options;
  const plan = await planInstall(root, options);
  if (!dryRun) {
    for (const step of plan.steps) {
      await step.apply();
    }
    await appendEvent(plan.store, 'runtime.install', {
      force: Boolean(options.force),
      withMcp: Boolean(options.withMcp)
    });
  }
  return plan;
}

export function nextSteps({ withMcp = false } = {}) {
  const lines = [
    'Next steps:',
    '  1. Validate the runtime:        npm run runtime:validate',
    '  2. Create your first task:      npm run runtime:task -- create --title "First task"',
    '  3. List ready work:             npm run runtime:task -- next'
  ];
  if (withMcp) {
    lines.push('  4. Restart your MCP client to pick up the new .mcp.json server entry.');
  }
  return lines.join('\n');
}
