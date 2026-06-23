// MCP autopilot tools — expose the runtime autopilot stack as MCP tools.
//
// The autopilot runtime (runtime/autopilot/{policy,loop}.mjs) is the in-process
// execution engine that enforces per-action allow/require/block rules. These
// MCP tools let a Claude/Codex client:
//
//   - autopilot.start   → create a session with a Policy (ruleset + budget)
//   - autopilot.status  → inspect a session's stats + policy.log()
//   - autopilot.stop    → close a session (state persists to disk)
//
// Sessions are keyed by an id and persisted to .vibe/runtime/autopilot/<id>.json
// so they survive across tool calls within a Claude conversation.
//
// v2.17.0 — Tier 1 implementation of council recommendation #1.

import { mkdir, readFile, writeFile, unlink, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { Policy } from '../autopilot/policy.mjs';

const STATE_DIR = '.omc/runtime/autopilot';
const AUDIT_LOG = '.omc/runtime/autopilot/audit.log';
const STATE_EXT = '.json';

/**
 * Resolve the per-root state directory and ensure it exists.
 */
function stateDir(root) {
  const dir = path.join(root || process.cwd(), STATE_DIR);
  return dir;
}

async function ensureDir(dir) {
  await mkdir(dir, { recursive: true });
}

/**
 * Append an audit log line (ISO timestamp, operation, session id, extra).
 */
async function auditLog(root, op, id, extra) {
  const dir = stateDir(root);
  await ensureDir(dir);
  const logFile = path.join(dir, 'audit.log');
  const line = `${new Date().toISOString()} | ${op.padEnd(12)} | ${String(id).padEnd(20)} | ${extra || ''}\n`;
  await writeFile(logFile, line, { flag: 'a', encoding: 'utf8' });
}

function sessionPath(root, id) {
  // id is alphanumeric + dash/underscore only
  const safe = String(id).replace(/[^A-Za-z0-9_-]/g, '_');
  return path.join(stateDir(root), safe + STATE_EXT);
}

/**
 * Read a session record, or return null if not found.
 */
export async function readSession(root, id) {
  const file = sessionPath(root, id);
  if (!existsSync(file)) return null;
  try {
    const raw = await readFile(file, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Persist a session record. Replaces any existing file.
 */
export async function writeSession(root, session) {
  await ensureDir(stateDir(root));
  const file = sessionPath(root, session.id);
  await writeFile(file, JSON.stringify(session, null, 2), 'utf8');
  return file;
}

/**
 * Delete a session file. Returns true if a file was removed.
 */
export async function deleteSession(root, id) {
  const file = sessionPath(root, id);
  if (!existsSync(file)) return false;
  await unlink(file);
  return true;
}

/**
 * List all session ids (filenames without .json).
 */
export async function listSessions(root) {
  const dir = stateDir(root);
  if (!existsSync(dir)) return [];
  const entries = await readdir(dir);
  return entries
    .filter((f) => f.endsWith(STATE_EXT))
    .map((f) => f.slice(0, -STATE_EXT.length))
    .sort();
}

/**
 * Garbage collect old session files older than TTL (default 24h).
 * Returns the number of sessions removed.
 */
const DEFAULT_SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function gcSessions(root, ttlMs = DEFAULT_SESSION_TTL_MS) {
  const dir = stateDir(root);
  if (!existsSync(dir)) return 0;
  const entries = await readdir(dir);
  const now = Date.now();
  let removed = 0;
  for (const entry of entries) {
    if (!entry.endsWith(STATE_EXT)) continue;
    const file = path.join(dir, entry);
    try {
      const raw = await readFile(file, 'utf8');
      const session = JSON.parse(raw);
      const ts = session.createdAt;
      const created = ts ? new Date(ts).getTime() : NaN;
      if (isNaN(created) || now - created > ttlMs) {
        await unlink(file);
        removed++;
      }
    } catch {
      // corrupt session file — remove it
      await unlink(file);
      removed++;
    }
  }
  if (removed > 0) {
    await auditLog(root, 'gc', '-', `removed=${removed} ttl=${ttlMs}ms`);
  }
  return removed;
}

/**
 * Build the 3 autopilot MCP tools.
 *
 * Each tool:
 *   name        — dotted name (autopilot.start, etc.)
 *   risk        — review (writes runtime state) for start/stop, safe for status
 *   inputSchema — JSON Schema (consumed by MCP SDK low-level Server API)
 *   handler     — async (args) => result
 */
export function buildAutopilotTools(root) {
  const base = root || process.cwd();

  return [
    // ── autopilot.start ────────────────────────────────────────────────────
    {
      name: 'autopilot.start',
      description:
        'Create a new autopilot session with a policy (rules: array of {action, risk, approval, max_calls?}). ' +
        'Persists session id and ruleset to disk. Returns { id, policyLog }.',
      risk: { level: 'review', approvalRequired: true, reasons: ['writes runtime autopilot state'] },
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description:
              'Session id (alphanumeric, dashes, underscores). If omitted a short random id is generated.',
          },
          rules: {
            type: 'array',
            description: 'Policy rules. Each entry: {action, risk, approval, max_calls?}',
            items: {
              type: 'object',
              properties: {
                action: { type: 'string', description: 'Action name or pattern (e.g. "file.write", "network.*").' },
                risk: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
                approval: { type: 'string', enum: ['auto', 'require', 'block'] },
                max_calls: { type: 'integer', minimum: 1 },
              },
              required: ['action', 'risk', 'approval'],
            },
          },
          autoApprove: {
            type: 'boolean',
            description: 'Auto-approve actions that require approval. Defaults to false.',
          },
          maxIterations: {
            type: 'integer',
            description: 'Safety cap on loop iterations. Defaults to 100.',
            minimum: 1,
          },
        },
        required: ['rules'],
        additionalProperties: false,
      },
      handler: async (args) => {
        const id = args.id || `auto-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
        const session = {
          id,
          createdAt: new Date().toISOString(),
          rules: args.rules,
          autoApprove: args.autoApprove === true,
          maxIterations: Number.isInteger(args.maxIterations) ? args.maxIterations : 100,
          stats: {
            totalActions: 0,
            approved: 0,
            denied: 0,
            errors: 0,
            requiresApproval: 0,
            lastError: null,
          },
        };

        // Validate by constructing the Policy (throws on invalid rules)
        let policy;
        try {
          policy = new Policy({ rules: args.rules });
        } catch (err) {
          return { error: `Invalid policy: ${err.message}`, id: null };
        }

        // Run GC before creating a new session to keep state directory lean
        await gcSessions(base);

        await writeSession(base, session);
        await auditLog(base, 'start', id, `rules=${args.rules.length} autoApprove=${session.autoApprove}`);
        return {
          id,
          createdAt: session.createdAt,
          ruleCount: args.rules.length,
          policyLog: policy.log(),
        };
      },
    },

    // ── autopilot.status ───────────────────────────────────────────────────
    {
      name: 'autopilot.status',
      description:
        'Return the current status of an autopilot session: id, createdAt, rule count, stats, and a human-readable policy log.',
      risk: { level: 'safe' },
      inputSchema: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Session id to inspect.' },
        },
        required: ['id'],
        additionalProperties: false,
      },
      handler: async (args) => {
        const session = await readSession(base, args.id);
        if (!session) {
          await auditLog(base, 'status', args.id, 'NOT_FOUND');
          return { error: `Session not found: ${args.id}` };
        }
        const policy = new Policy({ rules: session.rules });
        return {
          id: session.id,
          createdAt: session.createdAt,
          autoApprove: session.autoApprove,
          maxIterations: session.maxIterations,
          ruleCount: session.rules.length,
          stats: session.stats,
          policyLog: policy.log(),
        };
      },
    },

    // ── autopilot.list ─────────────────────────────────────────────────────
    {
      name: 'autopilot.list',
      description:
        'List all active autopilot session ids persisted on disk for this project.',
      risk: { level: 'safe' },
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      handler: async () => {
        // Run GC before listing to auto‑expire stale sessions
        await gcSessions(base);
        const ids = await listSessions(base);
        return { count: ids.length, ids };
      },
    },

    // ── autopilot.stop ─────────────────────────────────────────────────────
    {
      name: 'autopilot.stop',
      description:
        'Close an autopilot session by id (removes persisted state). Returns { closed: boolean }.',
      risk: { level: 'review', approvalRequired: true, reasons: ['deletes runtime autopilot state'] },
      inputSchema: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Session id to close.' },
        },
        required: ['id'],
        additionalProperties: false,
      },
      handler: async (args) => {
        const closed = await deleteSession(base, args.id);
        if (!closed) {
          return { closed: false, error: `Session not found: ${args.id}` };
        }
        await auditLog(base, 'stop', args.id, 'closed');
        return { closed: true, id: args.id };
      },
    },
  ];
}