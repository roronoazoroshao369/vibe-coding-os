/**
 * Default tool contracts by adapter (P1.8).
 * Each adapter lists the tool names it is permitted to call.
 * A missing adapter key means "no tools allowed" (fail-closed).
 */
export const defaultContracts = {
  native: [],
  mcp: [
    'task.list',
    'task.next',
    'task.update',
    'memory.search',
    'memory.ingest',
    'checkpoint.create',
  ],
  tmux: [],
  daemon: [],
  hermes: [
    'task.list',
    'task.next',
    'task.update',
    'memory.search',
    'memory.ingest',
    'checkpoint.create',
  ],
  'ai-assistant': [
    'task.list',
    'task.next',
    'task.update',
    'memory.search',
    'memory.ingest',
    'checkpoint.create',
  ],
};

/**
 * Get the list of allowed tool IDs for a given adapter.
 *
 * @param {string} adapterId - Adapter identifier (mcp, tmux, daemon, …).
 * @param {object} [contracts] - Optional contracts map; defaults to defaultContracts.
 * @returns {string[]} Allowed tool IDs (empty array if adapter not registered).
 */
export function getAllowedTools(adapterId, contracts = defaultContracts) {
  const entry = contracts?.[adapterId];
  return Array.isArray(entry) ? entry : [];
}

/**
 * Assert that a tool is allowed for the given adapter.
 * Throws if the tool is not in the allowlist.
 *
 * @param {string} toolId - Tool identifier to call.
 * @param {string} adapterId - Adapter making the call.
 * @param {object} [contracts] - Optional contracts map.
 */
export function assertToolAllowed(toolId, adapterId, contracts = defaultContracts) {
  const allowed = getAllowedTools(adapterId, contracts);
  if (!allowed.includes(toolId)) {
    throw new Error(
      `Tool "${toolId}" is not allowed for adapter "${adapterId}". Allowed: [${allowed.join(', ')}]`
    );
  }
}
