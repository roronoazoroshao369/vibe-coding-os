/**
 * runtime/autopilot/loop.mjs — Autopilot execution loop
 *
 * The core execution loop that distinguishes autopilot mode from manual mode.
 * Takes a Policy and an execute callback, then iteratively:
 *   1. Checks the policy for the next action
 *   2. Executes the callback (which should call back to the caller with the
 *      next action to evaluate)
 *   3. Checks if approval is needed
 *   4. Continues until policy blocks or all actions consumed
 *
 * v1.0.0 — Initial autopilot integration
 */

import { Policy } from './policy.mjs';

/**
 * @typedef {object} AutopilotStats
 * @property {number} totalActions - Total actions attempted
 * @property {number} approved - Actions approved for execution
 * @property {number} denied - Actions denied by policy
 * @property {number} errors - Actions that threw errors
 * @property {number} requiresApproval - Actions that need human approval
 * @property {string|null} lastError - Last error message, if any
 */

/**
 * Run the autopilot loop.
 *
 * The onExecute callback is called with an object { action, context } and must
 * return an object with the shape:
 *   { action: string, allowed: boolean, executed: boolean, error?: string }
 *
 * The loop will keep calling onExecute until:
 *   - Policy denies the action (allows() returns false)
 *   - Action requires approval and none is given
 *   - The callback signals completion (returns null for action)
 *   - An unhandled error occurs
 *
 * @param {Policy} policy           - The policy to enforce
 * @param {Function} onExecute      - Callback: ({ action, context }) => result
 * @param {object} [options]
 * @param {number} [options.maxIterations=100] - Safety cap on loop iterations
 * @param {boolean} [options.autoApprove=false] - Auto-approve all actions
 * @returns {Promise<AutopilotStats>}
 */
export async function runLoop(policy, onExecute, options = {}) {
  const { maxIterations = 100, autoApprove = false } = options;

  /** @type {AutopilotStats} */
  const stats = {
    totalActions: 0,
    approved: 0,
    denied: 0,
    errors: 0,
    requiresApproval: 0,
    lastError: null,
  };

  for (let i = 0; i < maxIterations; i++) {
    // 1. Ask the caller what to do next
    let nextAction;
    try {
      nextAction = await onExecute({ phase: 'next', stats });
    } catch (err) {
      stats.errors++;
      stats.lastError = `onExecute (next) threw: ${err.message}`;
      break;
    }

    // Null / undefined signals "no more work"
    if (!nextAction || !nextAction.action) {
      break;
    }

    const { action, context = {} } = nextAction;
    stats.totalActions++;

    // 2. Check policy allow/deny
    if (!policy.allows(action, context)) {
      stats.denied++;
      try {
        await onExecute({ phase: 'denied', action, context, stats });
      } catch {
        // Best-effort notification
      }
      continue;
    }

    // 3. Check if approval is required
    if (policy.requiresApproval(action, context) && !autoApprove) {
      stats.requiresApproval++;
      // Notify the caller that approval is needed. The caller may provide it
      // or skip. If they skip, we treat it as denied.
      let approvalResult;
      try {
        approvalResult = await onExecute({ phase: 'approval', action, context, stats });
      } catch (err) {
        stats.errors++;
        stats.lastError = `onExecute (approval) threw: ${err.message}`;
        break;
      }

      if (!approvalResult || approvalResult.approved !== true) {
        // Approval denied or deferred
        stats.denied++;
        try {
          await onExecute({ phase: 'denied', action, context, reason: 'approval_required', stats });
        } catch {
          // Best-effort
        }
        continue;
      }
    }

    // 4. Execute the action
    try {
      const execResult = await onExecute({ phase: 'execute', action, context, stats });
      policy.recordCall(action);

      if (execResult && execResult.error) {
        stats.errors++;
        stats.lastError = execResult.error;
      } else {
        stats.approved++;
      }
    } catch (err) {
      stats.errors++;
      stats.lastError = `Execution error for ${action}: ${err.message}`;
      // Do NOT break — allow loop to continue unless policy blocks
    }
  }

  return stats;
}
