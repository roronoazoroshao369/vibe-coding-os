#!/usr/bin/env node
// scripts/validate-mcp-tool-drift.mjs
// Checks for drift between MCP server registered tools and the tool-contract allowlist.
//
// Drift types:
//   - UNIMPLEMENTED: tool in allowlist but NOT registered in server → allowlist has dead entry
//   - UNDECLARED: tool registered in server but NOT in allowlist → tool will be blocked at runtime
//
// Both are warnings (non-blocking), since external plugins may add tools dynamically.
//
// Exit 0 always (advisory gate). Exit 1 only on unexpected error.

import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

async function readJson(filePath) {
  const raw = await readFile(filePath, 'utf8');
  return JSON.parse(raw);
}

function extractServerToolNames(serverCode) {
  // Match: name: 'tool.name' or name: "tool.name" or name: `tool.name` (registered tools)
  const regex = /name:\s*['"`]([^'"`]+)['"`]/g;
  const tools = new Set();
  let m;
  while ((m = regex.exec(serverCode)) !== null) {
    if (m[1].includes('.') || m[1].startsWith('_')) {
      tools.add(m[1]);
    }
  }
  // Also detect inline handlers: toolName === 'tool.name' or case 'tool.name':
  const inlineRegex = /(?:toolName|request\.params\.name)\s*===\s*['"`]([^'"`]+)['"`]/g;
  while ((m = inlineRegex.exec(serverCode)) !== null) {
    tools.add(m[1]);
  }
  return tools;
}

function extractContractToolNames(contracts) {
  const tools = new Set();
  for (const [, names] of Object.entries(contracts)) {
    if (Array.isArray(names)) {
      for (const n of names) tools.add(n);
    }
  }
  return tools;
}

async function main() {
  try {
    // Read server source to find registered tool names
    const serverCode = await readFile(resolve(ROOT, 'runtime/mcp/server.mjs'), 'utf8');
    const commandCode = await readFile(resolve(ROOT, 'runtime/mcp/command-tools.mjs'), 'utf8');
    const autopilotCode = await readFile(resolve(ROOT, 'runtime/mcp/autopilot-tools.mjs'), 'utf8');
    const fullServerCode = serverCode + commandCode + autopilotCode;

    const registeredTools = extractServerToolNames(fullServerCode);

    // Read contract allowlist
    const { defaultContracts } = await import(resolve(ROOT, 'runtime/core/tool-contract.mjs'));
    const contractTools = extractContractToolNames(defaultContracts);

    // Find drift
    const undeclared = []; // in server but NOT in contract
    const unimplemented = []; // in contract but NOT in server

    for (const t of registeredTools) {
      if (!contractTools.has(t)) undeclared.push(t);
    }
    for (const t of contractTools) {
      if (!registeredTools.has(t)) unimplemented.push(t);
    }

    // Report
    console.log(`MCP tool-drift check: ${registeredTools.size} registered, ${contractTools.size} in allowlist`);

    if (undeclared.length === 0 && unimplemented.length === 0) {
      console.log('No tool drift detected.');
      return;
    }

    if (undeclared.length > 0) {
      console.log('');
      console.log(`⚠ ${undeclared.length} tool(s) in server but NOT in allowlist (will be blocked at runtime):`);
      for (const t of undeclared.sort()) console.log(`  - ${t}`);
    }
    if (unimplemented.length > 0) {
      console.log('');
      console.log(`⚠ ${unimplemented.length} tool(s) in allowlist but NOT implemented in server (dead entry):`);
      for (const t of unimplemented.sort()) console.log(`  - ${t}`);
    }
    console.log('');
    console.log('Update runtime/core/tool-contract.mjs or runtime/mcp/*.mjs to resolve.');
  } catch (err) {
    console.error(`MCP tool-drift check failed: ${err.message}`);
    process.exit(1);
  }
}

main();
