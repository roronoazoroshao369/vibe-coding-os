/**
 * adapters/hooks/autopilot-hook.mjs — Generic adapter autopilot hook
 *
 * Bridges any adapter's tool-execution model with the autopilot loop.
 * The `installAutopilotHook` function wraps an adapter's execute method
 * so that every tool invocation goes through the Policy object before
 * execution.
 *
 * v1.0.0 — Initial autopilot integration
 */

import { Policy } from '../../runtime/autopilot/policy.mjs';
import { runLoop } from '../../runtime/autopilot/loop.mjs';

/**
 * Install an autopilot hook on a generic adapter.
 *
 * The adapter must expose an `execute(action, args)` method (or similar).
 * This hook wraps that method so all calls are gated by the policy.
 *
 * @param {Policy} policy                     - Policy instance
 * @param {object} adapter                    - Adapter with an execute method
 * @param {Function} adapter.execute          - Adapter's execute(action, args)
 * @param {object} [options]
 * @param {boolean} [options.enabled=true]    - Enable the hook immediately
 * @param {number}  [options.maxIterations=100]
 * @returns {{ wrap: Function, start: Function, stop: Function, stats: object }}
 */
export function installAutopilotHook(policy, adapter, options = {}) {
  const { enabled = true, maxIterations = 100 } = options;
  let active = enabled;

  /** Wrapped execute — gates the call through the policy before forwarding. */
  async function wrappedExecute(action, args, context = {}) {
    if (!active) {
      return adapter.execute(action, args);
    }

    if (!policy.allows(action, context)) {
      return { error: `Autopilot policy denied: "${action}"`, denied: true };
    }

    if (policy.requiresApproval(action, context)) {
      return { error: `Autopilot policy requires approval: "${action}"`, approvalRequired: true };
    }

    try {
      const result = await adapter.execute(action, args);
      policy.recordCall(action);
      return result;
    } catch (err) {
      return { error: err.message };
    }
  }

  /** Start the autopilot loop for the adapter. */
  const loopStats = { started: false, stats: null };

  async function start(onNextAction) {
    if (loopStats.started) {
      return { error: 'Autopilot loop already started' };
    }
    loopStats.started = true;
    active = true;

    loopStats.stats = await runLoop(policy, async (phase) => {
      if (phase.phase === 'execute') {
        const result = await adapter.execute(phase.action, phase.context);
        return result;
      }
      // Delegate next/denied/approval phases to the caller's callback
      if (typeof onNextAction === 'function') {
        return onNextAction(phase);
      }
      return null;
    }, { maxIterations, autoApprove: false });

    loopStats.started = false;
    return loopStats.stats;
  }

  function stop() {
    active = false;
    loopStats.started = false;
  }

  function getStats() {
    return { ...loopStats };
  }

  return { wrap: wrappedExecute, start, stop, stats: getStats };
}
