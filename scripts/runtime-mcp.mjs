#!/usr/bin/env node
// Opt-in stdio MCP server exposing runtime task/memory/checkpoint operations.
//
// Usage:
//   node scripts/runtime-mcp.mjs            Start the MCP server on stdio.
//   node scripts/runtime-mcp.mjs --help     Show usage and tool surface.
//   node scripts/runtime-mcp.mjs --tools    Print the tool list as JSON.
//
// If @modelcontextprotocol/sdk is not installed, the server start path prints
// install instructions and exits cleanly (exit code 0) rather than crashing.

import { createStore } from '../runtime/core/fs-store.mjs';
import {
  buildTools,
  startServer,
  INSTALL_INSTRUCTIONS,
  SERVER_NAME,
  SERVER_VERSION,
} from '../runtime/mcp/server.mjs';

const args = process.argv.slice(2);

function printHelp() {
  const tools = buildTools(createStore(process.cwd()));
  const lines = [
    `${SERVER_NAME} v${SERVER_VERSION} — opt-in MCP server (stdio)`,
    '',
    'Usage:',
    '  node scripts/runtime-mcp.mjs            Start the MCP server on stdio.',
    '  node scripts/runtime-mcp.mjs --help     Show this help.',
    '  node scripts/runtime-mcp.mjs --tools    Print the tool list as JSON.',
    '',
    'Tools:',
    ...tools.map((t) => `  ${t.name.padEnd(20)} ${t.description}`),
    '',
    'Registration: see docs/workflows/runtime-mcp-server.md',
  ];
  console.log(lines.join('\n'));
}

if (args.includes('--help') || args.includes('-h')) {
  printHelp();
  process.exit(0);
}

if (args.includes('--tools')) {
  const tools = buildTools(createStore(process.cwd()));
  console.log(JSON.stringify(tools.map(({ name, description, inputSchema }) => ({ name, description, inputSchema })), null, 2));
  process.exit(0);
}

const result = await startServer({ root: process.cwd() });
if (!result.ok && result.reason === 'sdk-missing') {
  console.error(INSTALL_INSTRUCTIONS);
  process.exit(0);
}
// Server connected; keep the process alive on the stdio transport.
console.error(`${SERVER_NAME} v${SERVER_VERSION} listening on stdio (${result.tools.length} tools).`);
