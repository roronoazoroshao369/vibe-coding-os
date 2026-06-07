// Opt-in MCP server adapter for the Vibe Coding OS runtime.
//
// Exposes a small, read/write surface over the existing JSON stores
// (tasks, memory, checkpoints) as Model Context Protocol tools over stdio.
//
// The @modelcontextprotocol/sdk dependency is loaded lazily via dynamic
// import so this module (and the CLI that wraps it) stays importable and
// `--help`-able even when the SDK is not installed.

import { createStore } from '../core/fs-store.mjs';
import { listTasks, nextReadyTask, updateTaskStatus } from '../tasks/task-store.mjs';
import { ingestMemory } from '../memory/memory-store.mjs';
import { searchMemory } from '../memory/retrieval.mjs';
import { createCheckpoint } from '../checkpoints/checkpoint-engine.mjs';

export const SDK_PACKAGE = '@modelcontextprotocol/sdk';
export const SERVER_NAME = 'vibe-coding-os-runtime';
export const SERVER_VERSION = '0.1.0';

export const INSTALL_INSTRUCTIONS = [
  `The MCP server adapter needs the ${SDK_PACKAGE} package, which is not installed.`,
  '',
  'To enable it (opt-in):',
  `  1. Ask the maintainer to add a pinned ${SDK_PACKAGE} dependency to package.json.`,
  `  2. Install dependencies:  npm install`,
  '  3. Start the server:      node scripts/runtime-mcp.mjs',
  '',
  'See docs/workflows/runtime-mcp-server.md for .mcp.json registration.',
].join('\n');

/**
 * Tool definitions. Each entry pairs a JSON Schema (consumed directly by the
 * SDK's low-level Server API, so no Zod dependency is required here) with a
 * thin handler that delegates to an existing runtime store function.
 */
export function buildTools(store) {
  return [
    {
      name: 'task.list',
      description: 'List all runtime tasks with status and dependencies.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      handler: async () => listTasks(store),
    },
    {
      name: 'task.next',
      description: 'Return the next ready task (pending with all dependencies completed), or null.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      handler: async () => nextReadyTask(store),
    },
    {
      name: 'task.update',
      description: 'Update a task status (pending|in_progress|blocked|completed|cancelled).',
      inputSchema: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Task id.' },
          status: { type: 'string', description: 'New status.' },
        },
        required: ['id', 'status'],
        additionalProperties: false,
      },
      handler: async (args) => updateTaskStatus(store, args.id, args.status),
    },
    {
      name: 'memory.search',
      description: 'Search runtime memory by content/tag substring. Returns matching records.',
      inputSchema: {
        type: 'object',
        properties: { query: { type: 'string', description: 'Search query.' } },
        required: ['query'],
        additionalProperties: false,
      },
      handler: async (args) => searchMemory(store, args.query),
    },
    {
      name: 'memory.ingest',
      description: 'Ingest a memory record. Content is privacy-redacted before storage.',
      inputSchema: {
        type: 'object',
        properties: {
          content: { type: 'string', description: 'Memory content.' },
          scope: { type: 'string', description: 'Scope (default: project).' },
          source: { type: 'string', description: 'Source label (default: runtime-mcp).' },
          tags: { type: 'array', items: { type: 'string' }, description: 'Optional tags.' },
        },
        required: ['content'],
        additionalProperties: false,
      },
      handler: async (args) =>
        ingestMemory(store, {
          content: args.content,
          scope: args.scope,
          source: args.source || 'runtime-mcp',
          tags: args.tags || [],
        }),
    },
    {
      name: 'checkpoint.create',
      description: 'Record a checkpoint evidence entry (e.g. readiness/done gates).',
      inputSchema: {
        type: 'object',
        properties: {
          type: { type: 'string', description: 'Checkpoint type.' },
          result: { type: 'string', description: 'Result (e.g. pass|fail).' },
          subject: { type: 'string', description: 'Optional subject.' },
          notes: { type: 'string', description: 'Optional notes.' },
        },
        required: ['type', 'result'],
        additionalProperties: false,
      },
      handler: async (args) =>
        createCheckpoint(store, {
          type: args.type,
          result: args.result,
          subject: args.subject,
          notes: args.notes,
        }),
    },
  ];
}

/**
 * Attempt to load the MCP SDK. Returns the pieces we need, or null if the
 * package is not installed (so callers can print install instructions and
 * exit cleanly instead of crashing).
 */
export async function loadSdk() {
  try {
    const [{ Server }, { StdioServerTransport }, types] = await Promise.all([
      import(`${SDK_PACKAGE}/server/index.js`),
      import(`${SDK_PACKAGE}/server/stdio.js`),
      import(`${SDK_PACKAGE}/types.js`),
    ]);
    return {
      Server,
      StdioServerTransport,
      ListToolsRequestSchema: types.ListToolsRequestSchema,
      CallToolRequestSchema: types.CallToolRequestSchema,
    };
  } catch (err) {
    if (err && (err.code === 'ERR_MODULE_NOT_FOUND' || err.code === 'MODULE_NOT_FOUND')) {
      return null;
    }
    throw err;
  }
}

/**
 * Build and start the stdio MCP server. Resolves once the transport is
 * connected. Returns { ok: false, reason: 'sdk-missing' } if the SDK is not
 * installed so the caller can decide how to report it.
 */
export async function startServer({ root = process.cwd() } = {}) {
  const sdk = await loadSdk();
  if (!sdk) return { ok: false, reason: 'sdk-missing' };

  const { Server, StdioServerTransport, ListToolsRequestSchema, CallToolRequestSchema } = sdk;
  const store = createStore(root);
  const tools = buildTools(store);
  const byName = new Map(tools.map((t) => [t.name, t]));

  const server = new Server(
    { name: SERVER_NAME, version: SERVER_VERSION },
    { capabilities: { tools: {} } },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: tools.map(({ name, description, inputSchema }) => ({ name, description, inputSchema })),
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const tool = byName.get(request.params.name);
    if (!tool) {
      return {
        isError: true,
        content: [{ type: 'text', text: `Unknown tool: ${request.params.name}` }],
      };
    }
    try {
      const result = await tool.handler(request.params.arguments || {});
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    } catch (err) {
      return {
        isError: true,
        content: [{ type: 'text', text: `Error: ${err && err.message ? err.message : String(err)}` }],
      };
    }
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
  return { ok: true, server, transport, tools };
}
