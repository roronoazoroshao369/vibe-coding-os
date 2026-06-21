/**
 * adapters/claude-code/autopilot-hook.mjs — Claude Code autopilot hook
 *
 * Adapter-specific autopilot integration for Claude Code.
 * Claude Code uses tool_use / tool_result blocks — this hook intercepts
 * tool calls and gates them through the autopilot Policy before forwarding
 * to the underlying execution engine.
 *
 * v1.0.0 — Initial autopilot integration
 */

import { Policy } from '../../runtime/autopilot/policy.mjs';
import { runLoop } from '../../runtime/autopilot/loop.mjs';

/**
 * Claude Code maps tools to action names as follows:
 *   - Bash tool      → "shell.command"
 *   - FileWrite tool → "file.write"
 *   - FileRead tool  → "file.read"
 *   - WebFetch tool  → "network.request"
 *   - Grep tool      → "file.read"
 *   - Edit tool      → "file.write"
 */
const TOOL_ACTION_MAP = {
  Bash: 'shell.command',
  FileWrite: 'file.write',
  FileRead: 'file.read',
  WebFetch: 'network.request',
  Grep: 'file.read',
  Edit: 'file.write',
};

/**
 * Install an autopilot hook on the Claude Code execution path.
 *
 * Wraps the tool-execution function so every Claude Code tool call is gated
 * through the policy. Blocked calls return a tool_result with an error.
 *
 * @param {Policy} policy                     - Policy instance
 * @param {Function} executeTool              - Claude Code's tool execute fn: (tool_name, args) => result
 * @param {object} [options]
 * @param {boolean} [options.enabled=true]
 * @param {string}  [options.actor='claude-code'] - Actor name for audit
 * @returns {{ wrap: Function, start: Function, stop: Function }}
 */
export function installAutopilotHook(policy, executeTool, options = {}) {
  const { enabled = true, actor = 'claude-code' } = options;
  let active = enabled;
  let interceptCount = 0;
  let blockedCount = 0;

  /**
   * Map a Claude Code tool name to an autopilot action name.
   */
  function resolveAction(toolName) {
    return TOOL_ACTION_MAP[toolName] || toolName.toLowerCase();
  }

  /**
   * Wrapped tool execute — gates through policy.
   *
   * @param {string} toolName - Claude Code tool name (e.g. "Bash", "FileWrite")
   * @param {object} args     - Tool arguments
   * @returns {Promise<object>} Tool result or rejection
   */
  async function wrappedExecute(toolName, args) {
    if (!active) {
      return executeTool(toolName, args);
    }

    const action = resolveAction(toolName);
    interceptCount++;

    // Policy check
    if (!policy.allows(action, { tool: toolName, actor, args })) {
      blockedCount++;
      return {
        type: 'tool_result',
        tool_use_id: args?.tool_use_id || null,
        is_error: true,
        content: `Autopilot policy blocked "${action}" (tool: ${toolName}). ` +
                 `Actor: ${actor}. Max calls reached or action is denied.`,
      };
    }

    // Approval gate
    if (policy.requiresApproval(action, { tool: toolName, actor, args })) {
      blockedCount++;
      return {
        type: 'tool_result',
        tool_use_id: args?.tool_use_id || null,
        is_error: true,
        content: `Autopilot policy requires approval for "${action}" (tool: ${toolName}). ` +
                 `Actor: ${actor}. Enable auto-approve or handle manually.`,
      };
    }

    // Approved — execute
    try {
      const result = await executeTool(toolName, args);
      policy.recordCall(action);
      return result;
    } catch (err) {
      return {
        type: 'tool_result',
        tool_use_id: args?.tool_use_id || null,
        is_error: true,
        content: `Autopilot execution error for "${action}": ${err.message}`,
      };
    }
  }

  function start() {
    active = true;
    return { message: `Autopilot active for Claude Code. Intercepting tool calls.` };
  }

  function stop() {
    active = false;
    return { message: `Autopilot deactivated. Intercepted ${interceptCount}, blocked ${blockedCount}.` };
  }

  function getStats() {
    return {
      active,
      interceptCount,
      blockedCount,
      actor,
      policy: policy.log(),
    };
  }

  return { wrap: wrappedExecute, start, stop, stats: getStats };
}
