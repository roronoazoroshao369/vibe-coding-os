/**
 * runtime/core/task-state-machine.mjs — Formal task state machine
 *
 * Defines the valid state transitions for tasks, guards, and the
 * transition function that enforces the transition table.
 *
 * States:
 *   pending → in_progress | cancelled
 *   in_progress → blocked | completed | cancelled | pending
 *   blocked → in_progress | cancelled | pending
 *   completed → (terminal — no outgoing transitions)
 *   cancelled → (terminal — no outgoing transitions)
 *
 * Usage:
 *   import { canTransition, getAllowedTransitions, transitionTask } from './task-state-machine.mjs';
 *
 *   canTransition('pending', 'in_progress') → true
 *   canTransition('completed', 'pending') → false
 *   getAllowedTransitions('pending') → ['in_progress', 'cancelled']
 *   const updated = transitionTask(task, 'in_progress', { actor: 'cli' });
 */

import { nowIso } from './ids.mjs';

/**
 * Formal transition table.
 * Key = current state, Value = array of allowed target states.
 * Terminal states (completed, cancelled) have empty arrays.
 */
const TRANSITIONS = {
  pending: ['in_progress', 'cancelled'],
  in_progress: ['blocked', 'completed', 'cancelled', 'pending'],
  blocked: ['in_progress', 'cancelled', 'pending'],
  completed: [],
  cancelled: [],
};

/**
 * Guard functions for specific transitions.
 * Each guard receives (task, options) and returns { ok: boolean, reason?: string }.
 */
const GUARDS = {
  // Can only block if a reason is provided
  'in_progress→blocked': (task, options) => {
    if (!options.blockedReason) {
      return { ok: false, reason: 'blockedReason is required when blocking a task' };
    }
    return { ok: true };
  },

  // Completion is allowed even when subtasks exist; subtasks are tracked independently.
  'in_progress→completed': () => ({ ok: true }),

  // Moving back to pending clears the claim
  'in_progress→pending': () => {
    return { ok: true };
  },

  // Blocked can unblock back to in_progress with claim refresh
  'blocked→in_progress': () => {
    return { ok: true };
  },
};

/**
 * Check if a state transition is valid.
 *
 * @param {string} from - Current state
 * @param {string} to - Target state
 * @returns {boolean}
 */
export function canTransition(from, to) {
  const allowed = TRANSITIONS[from];
  if (!allowed) return false;
  return allowed.includes(to);
}

/**
 * Get all allowed transitions from a given state.
 *
 * @param {string} state - Current state
 * @returns {string[]} List of valid target states
 */
export function getAllowedTransitions(state) {
  return TRANSITIONS[state] || [];
}

/**
 * Get the transition guard result for a specific transition.
 *
 * @param {string} from - Current state
 * @param {string} to - Target state
 * @param {object} task - The task object
 * @param {object} options - Transition options
 * @returns {{ ok: boolean, reason?: string }}
 */
export function checkGuard(from, to, task, options = {}) {
  const key = `${from}→${to}`;
  const guard = GUARDS[key];
  if (guard) return guard(task, options);
  return { ok: true };
}

/**
 * Perform a state transition on a task object.
 * Returns the updated task or throws on invalid transition.
 *
 * @param {object} task - Task object (will be mutated)
 * @param {string} newStatus - Target state
 * @param {object} options - Transition options
 * @param {string} options.actor - Who initiated the transition
 * @param {string} [options.blockedReason] - Required when transitioning to 'blocked'
 * @param {number} [options.ttl] - Claim TTL in seconds (for in_progress)
 * @returns {object} Updated task
 */
export function transitionTask(task, newStatus, options = {}) {
  const from = task.status;
  const to = newStatus;

  if (!canTransition(from, to)) {
    throw new Error(
      `Invalid transition: ${from} → ${to}. Allowed: ${getAllowedTransitions(from).join(', ') || '(none — terminal state)'}`
    );
  }

  // Check guard
  const guard = checkGuard(from, to, task, options);
  if (!guard.ok) {
    throw new Error(`Transition ${from} → ${to} blocked: ${guard.reason}`);
  }

  const now = nowIso();
  const actor = options.actor || 'cli';

  // Update status
  task.status = to;
  task.updatedAt = now;

  // Append history entry
  if (!Array.isArray(task.history)) task.history = [];
  task.history.push({
    event: 'status.changed',
    from,
    to,
    actor,
    timestamp: now,
  });

  // Handle specific transition side-effects
  switch (to) {
    case 'blocked':
      task.blockedReason = options.blockedReason || null;
      break;

    case 'in_progress': {
      // Auto-claim when entering in_progress
      const ttl = options.ttl || 300;
      task.claim = {
        claimedBy: actor,
        claimedAt: now,
        expiresAt: new Date(Date.now() + ttl * 1000).toISOString(),
        ttl,
      };
      task.blockedReason = null;
      break;
    }

    case 'pending':
      // Clear claim when reverting to pending
      task.claim = null;
      task.blockedReason = null;
      break;

    case 'completed':
      // Record verification timestamp
      task.verification = {
        completedAt: now,
        completedBy: actor,
      };
      break;

    case 'cancelled':
      task.claim = null;
      task.blockedReason = null;
      break;
  }

  return task;
}

/**
 * Get a summary of the state machine (for diagnostics/doctor).
 */
export function getStateMachineSummary() {
  return {
    states: Object.keys(TRANSITIONS),
    terminalStates: Object.entries(TRANSITIONS)
      .filter(([, targets]) => targets.length === 0)
      .map(([state]) => state),
    transitions: Object.entries(TRANSITIONS).map(([from, tos]) => ({
      from,
      to: tos,
    })),
    guardCount: Object.keys(GUARDS).length,
  };
}

export { TRANSITIONS, GUARDS };
