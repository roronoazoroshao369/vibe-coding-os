// memory-server.mjs — opt-in stdio MCP server exposing the local memory store.
// Degrades cleanly if @modelcontextprotocol/sdk is absent (prints tools as JSON).
import { createStore } from '../memory-local/store.mjs';
import { search, contextPack } from '../memory-local/retrieve.mjs';
import { ingestRepo, ingestSessionSummaries, ingestRecords, refreshStaleness } from '../memory-local/ingest.mjs';

export const SERVER_NAME = 'vibe-memory';
export const SERVER_VERSION = '0.1.0';

export function buildTools(root) {
  const store = createStore(root);
  return [
    { name: 'memory_status', description: 'Report local memory store stats.',
      inputSchema: { type: 'object', properties: {} },
      handler: () => store.status() },
    { name: 'memory_ingest_repo', description: 'Index code + docs from the repo into local memory.',
      inputSchema: { type: 'object', properties: { path: { type: 'string' } } },
      handler: (a) => ingestRepo(store, a.path || root) },
    { name: 'memory_ingest_sessions', description: 'Index session summary markdown files.',
      inputSchema: { type: 'object', properties: { dir: { type: 'string' } }, required: ['dir'] },
      handler: (a) => ingestSessionSummaries(store, a.dir) },
    { name: 'memory_ingest_records', description: 'Index arbitrary records (transcripts, logs, issues, PRs).',
      inputSchema: { type: 'object', properties: { records: { type: 'array' }, scope: { type: 'string' } }, required: ['records'] },
      handler: (a) => ingestRecords(store, a.records, { scope: a.scope || 'doc' }) },
    { name: 'memory_search', description: 'Hybrid search the local memory store.',
      inputSchema: { type: 'object', properties: { query: { type: 'string' }, scope: { type: 'string' }, k: { type: 'number' } }, required: ['query'] },
      handler: (a) => search(store, a.query, { scope: a.scope || 'all', k: a.k || 8 }) },
    { name: 'memory_context_pack', description: 'Build a compact cited context pack within a char budget.',
      inputSchema: { type: 'object', properties: { query: { type: 'string' }, budget: { type: 'number' }, minRelevance: { type: 'string' } }, required: ['query'] },
      handler: (a) => contextPack(store, a.query, { budget: a.budget || 4000, minRelevance: a.minRelevance || 'low' }) },
    { name: 'memory_refresh', description: 'Mark memory stale when its source file changed.',
      inputSchema: { type: 'object', properties: { path: { type: 'string' } } },
      handler: (a) => refreshStaleness(store, a.path || root) },
    { name: 'memory_forget', description: 'Delete memory entries by source prefix or older-than days.',
      inputSchema: { type: 'object', properties: { sourcePrefix: { type: 'string' }, olderThanDays: { type: 'number' } } },
      handler: (a) => {
        const cutoff = a.olderThanDays ? Date.now() - a.olderThanDays * 86400000 : null;
        const removed = store.forget((e) =>
          (a.sourcePrefix ? e.source.startsWith(a.sourcePrefix) : false) ||
          (cutoff ? new Date(e.created).getTime() < cutoff : false));
        return { removed };
      } },
  ];
}

export async function startServer({ root = process.cwd() } = {}) {
  let sdk;
  try { sdk = await import('@modelcontextprotocol/sdk/server/index.js'); }
  catch { return { ok: false, reason: 'sdk-missing' }; }
  const { Server } = sdk;
  const { StdioServerTransport } = await import('@modelcontextprotocol/sdk/server/stdio.js');
  const tools = buildTools(root);
  const server = new Server({ name: SERVER_NAME, version: SERVER_VERSION }, { capabilities: { tools: {} } });
  const { ListToolsRequestSchema, CallToolRequestSchema } = await import('@modelcontextprotocol/sdk/types.js');
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: tools.map(({ name, description, inputSchema }) => ({ name, description, inputSchema })),
  }));
  server.setRequestHandler(CallToolRequestSchema, async (req) => {
    const tool = tools.find((t) => t.name === req.params.name);
    if (!tool) throw new Error(`Unknown tool: ${req.params.name}`);
    const result = await tool.handler(req.params.arguments || {});
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
  });
  await server.connect(new StdioServerTransport());
  return { ok: true, tools };
}

// CLI entry: --tools prints the tool surface; default tries to start.
const isMain = process.argv[1] && process.argv[1].endsWith('memory-server.mjs');
if (isMain) {
  const root = process.cwd();
  if (process.argv.includes('--tools')) {
    console.log(JSON.stringify(buildTools(root).map(({ name, description }) => ({ name, description })), null, 2));
    process.exit(0);
  }
  const res = await startServer({ root });
  if (!res.ok) { console.error('MCP SDK not installed. Install @modelcontextprotocol/sdk to run the server.'); process.exit(0); }
  console.error(`${SERVER_NAME} v${SERVER_VERSION} listening on stdio (${res.tools.length} tools).`);
}
