// Opt-in MCP server adapter for the Vibe Coding OS runtime.
//
// Exposes a small, read/write surface over the existing JSON stores
// (tasks, memory, checkpoints) as Model Context Protocol tools over stdio.
//
// The @modelcontextprotocol/sdk dependency is loaded lazily via dynamic
// import so this module (and the CLI that wraps it) stays importable and
// `--help`-able even when the SDK is not installed.
//
// v2.17.6 — added MCP auth handshake + runtime injection scanning on tool args.

import { createStore } from '../core/fs-store.mjs';
import { listTasks, nextReadyTask, updateTaskStatus } from '../tasks/task-store.mjs';
import { ingestMemory } from '../memory/memory-store.mjs';
import { searchMemory } from '../memory/retrieval.mjs';
import { createCheckpoint } from '../checkpoints/checkpoint-engine.mjs';
import { withApprovalGate } from '../core/approval-gate.mjs';
import { assertToolAllowed, defaultContracts } from '../core/tool-contract.mjs';
import { buildCommandTools } from './command-tools.mjs';
import { buildAutopilotTools } from './autopilot-tools.mjs';
import { INJECTION_PATTERNS } from '../core/injection-patterns.mjs';
import { createHash, randomBytes } from 'node:crypto';
import { appendEvent } from '../core/events.mjs';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';

export const SDK_PACKAGE = '@modelcontextprotocol/sdk';
export const SERVER_NAME = 'vibe-coding-os-runtime';
export const SERVER_VERSION = '2.17.7';

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

// ─── Auth ───────────────────────────────────────────────────────────────────
export const AUTH_PATH = join(homedir(), '.vibe', 'mcp-token');
export const AUTH_ENV_VAR = 'MCP_AUTH_TOKEN';

/**
 * Resolve the auth token: from env var, from token file, or auto-generate one.
 * In auto-generate mode the server writes the token to ~/.vibe/mcp-token so the
 * client can read it from there.
 */
export async function resolveAuthToken() {
  // 1. Env var takes precedence
  const fromEnv = process.env[AUTH_ENV_VAR];
  if (fromEnv !== undefined && fromEnv !== null) {
    if (fromEnv === '') {
      console.error(`[mcp-auth] ERROR: ${AUTH_ENV_VAR} is set to empty string — either provide a value or unset it`);
      return { token: null, source: 'env-empty-error' };
    }
    return { token: fromEnv, source: 'env' };
  }

  // 2. Token file
  try {
    const fromFile = (await readFile(AUTH_PATH, 'utf8')).trim();
    if (fromFile) return { token: fromFile, source: 'file' };
  } catch { /* file doesn't exist — generate */ }

  // 3. Auto-generate and persist
  const token = randomBytes(24).toString('hex');
  try {
    await mkdir(join(homedir(), '.vibe'), { recursive: true });
    await writeFile(AUTH_PATH, token, { mode: 0o600 });
    console.error(`[mcp-auth] No ${AUTH_ENV_VAR} set — auto-generated token written to ${AUTH_PATH}`);
  } catch (err) {
    console.error(`[mcp-auth] Could not write token file: ${err.message}`);
  }
  return { token, source: 'generated' };
}

// ─── Injection Scanner ──────────────────────────────────────────────────────
// Scan tool-call arguments against INJECTION_PATTERNS. Returns blocking errors
// or warning advisories.
function scanArgumentsForInjection(args) {
  if (!args || typeof args !== 'object') return { blocked: null, warnings: [] };
  const text = Object.values(args)
    .filter(v => typeof v === 'string')
    .join('\n');
  if (!text) return { blocked: null, warnings: [] };

  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.severity === 'error' && pattern.scope === 'text') {
      pattern.re.lastIndex = 0;
      if (pattern.re.test(text)) return { blocked: pattern.label, warnings: [] };
    }
  }
  const warnings = [];
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.severity === 'warn' && pattern.scope === 'text') {
      pattern.re.lastIndex = 0;
      if (pattern.re.test(text)) warnings.push(pattern.label);
    }
  }
  return { blocked: null, warnings };
}

// ─── Tool Definitions ───────────────────────────────────────────────────────
export function buildTools(store) {
  return [
    {
      name: 'task.list',
      description: 'List all runtime tasks with status and dependencies.',
      risk: { level: 'safe' },
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      handler: async () => listTasks(store),
    },
    {
      name: 'task.next',
      description: 'Return the next ready task (pending with all dependencies completed), or null.',
      risk: { level: 'safe' },
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      handler: async () => nextReadyTask(store),
    },
    {
      name: 'task.update',
      description: 'Update a task status (pending|in_progress|blocked|completed|cancelled).',
      risk: { level: 'review', approvalRequired: true, reasons: ['updates runtime task state'] },
      inputSchema: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Task id.' },
          status: { type: 'string', description: 'New status.' },
        },
        required: ['id', 'status'],
        additionalProperties: false,
      },
      handler: async (args) => updateTaskStatus(store, args.id, args.status, { actor: args.actor || 'mcp' }),
    },
    {
      name: 'memory.search',
      description: 'Search runtime memory by content/tag substring. Returns matching records.',
      risk: { level: 'safe' },
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
      risk: { level: 'review', approvalRequired: true, reasons: ['writes runtime memory state'] },
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
      risk: { level: 'review', approvalRequired: true, reasons: ['writes runtime checkpoint state'] },
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

// ─── SDK Loader ─────────────────────────────────────────────────────────────
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

// ─── Server Startup ─────────────────────────────────────────────────────────
/**
 * Build and start the stdio MCP server. Resolves once the transport is
 * connected. Returns { ok: false, reason: 'sdk-missing' } if the SDK is not
 * installed so the caller can decide how to report it.
 *
 * Auth modes:
 *   - MCP_AUTH_TOKEN env var set  → required, validated against env value
 *   - ~/.vibe/mcp-token exists     → required, validated against file
 *   - neither                      → auto-generate token, write to file,
 *                                     print warning, still require auth
 *
 * The client must call `_mcp.auth.verify(token)` as its first tool call.
 * All other tools are blocked until auth succeeds.
 */
export async function startServer({ root = process.cwd() } = {}) {
  const sdk = await loadSdk();
  if (!sdk) return { ok: false, reason: 'sdk-missing' };

  const { Server, StdioServerTransport, ListToolsRequestSchema, CallToolRequestSchema } = sdk;
  const store = createStore(root);
  const tools = [
    ...buildTools(store),
    ...buildCommandTools(root),
    ...buildAutopilotTools(root),
  ].map((tool) => ({
    ...tool,
    handler: withApprovalGate(tool.handler, store, tool.name),
  }));
  const byName = new Map(tools.map((t) => [t.name, t]));

  // Auth setup
  const auth = await resolveAuthToken();
  let authenticated = false;
  let modeLabel = 'auto-generated';
  if (auth.source === 'env') modeLabel = 'env-var';
  else if (auth.source === 'file') modeLabel = 'token-file';
  console.error(`[mcp-auth] Mode: ${modeLabel}`);
  console.error(`[mcp-auth] Set MCP_AUTH_TOKEN in the client .mcp.json env to authenticate.`);

  const server = new Server(
    { name: SERVER_NAME, version: SERVER_VERSION },
    { capabilities: { tools: {} } },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: tools.map(({ name, description, inputSchema }) => ({ name, description, inputSchema })),
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const toolName = request.params.name;

    // ── Auth handshake ──────────────────────────────────────────────────
    if (toolName === '_mcp.auth.verify') {
      const candidate = request.params.arguments?.token;
      if (candidate === auth.token) {
        authenticated = true;
        console.error(`[mcp-auth] Client authenticated successfully (source: ${auth.source}).`);
        return {
          content: [{ type: 'text', text: JSON.stringify({ ok: true, message: 'authenticated' }) }],
        };
      }
      return {
        isError: true,
        content: [{ type: 'text', text: JSON.stringify({ ok: false, message: 'invalid token' }) }],
      };
    }

    // ── Auth gate ──────────────────────────────────────────────────────
    if (!authenticated) {
      console.error(`[mcp-auth] BLOCKED: tool "${toolName}" called before auth.`);
      return {
        isError: true,
        content: [{ type: 'text', text: 'Not authenticated. Call _mcp.auth.verify({ token: "..." }) first.' }],
      };
    }

    // ── Injection scan on arguments ─────────────────────────────────────
    const { blocked, warnings } = scanArgumentsForInjection(request.params.arguments);
    if (blocked) {
      console.error(`[mcp-injection] BLOCKED: tool "${toolName}" — pattern "${blocked}" detected in arguments.`);
      try {
        await appendEvent(store, 'mcp.injection.blocked', {
          tool: toolName,
          pattern: blocked,
          timestamp: new Date().toISOString(),
        });
      } catch { /* best-effort audit log */ }
      return {
        isError: true,
        content: [{ type: 'text', text: `Blocked: arguments matched injection pattern "${blocked}".` }],
      };
    }
    if (warnings.length > 0) {
      console.error(`[mcp-injection] WARN: tool "${toolName}" — suspicious patterns: ${warnings.join(', ')}`);
    }

    // ── Tool contract check ─────────────────────────────────────────────
    const tool = byName.get(toolName);
    if (!tool) {
      return {
        isError: true,
        content: [{ type: 'text', text: `Unknown tool: ${toolName}` }],
      };
    }
    try {
      assertToolAllowed(tool.name, 'mcp', defaultContracts);
      const result = await tool.handler({ ...(request.params.arguments || {}), risk: tool.risk, actor: 'mcp' });
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
