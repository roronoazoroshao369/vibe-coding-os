/**
 * runtime/autopilot/vibe-loop.mjs — Loop engineer orchestrator (/vibe-loop)
 *
 * Turns the abstract autopilot primitives into a closed-loop engineer:
 *
 *     implement → verify → diagnose → fix → verify → ... → DONE | STOP
 *
 * It reuses the existing building blocks rather than reinventing them:
 *   - Policy (policy.mjs)     — gates which actions may run / need approval
 *   - runLoop (loop.mjs)      — the bounded action loop with stats
 *   - verify  (verifier.mjs)  — objective Done criteria (tests/typecheck/scope)
 *
 * The orchestrator owns the parts loop.mjs deliberately leaves out:
 *   - DONE detection (all gates pass)
 *   - no-progress detection (failure count not improving)
 *   - budget / iteration stop conditions
 *   - spec re-injection each round (prevents drift on long loops)
 *   - structured per-iteration events for observability
 *
 * v1.0.0 — Initial loop-engine integration (/vibe-loop)
 */

import { runLoop } from './loop.mjs';
import { Policy } from './policy.mjs';
import { verify, summarizeVerify } from './verifier.mjs';

/** Reason codes the loop can terminate with. */
export const STOP_REASON = Object.freeze({
  DONE: 'done',
  MAX_ITERATIONS: 'max-iterations',
  BUDGET: 'budget',
  NO_PROGRESS: 'no-progress',
  POLICY_BLOCKED: 'policy-blocked',
  ERROR: 'error',
});

/**
 * Built-in policy presets, mapped to the three quality modes.
 * Mirrors the quality-engine profiles (lean / standard / heavy=strict).
 *
 * @param {'lean'|'standard'|'strict'} mode
 * @returns {Policy}
 */
export function policyForMode(mode = 'standard') {
  const presets = {
    lean: [
      { action: 'file.read', risk: 'low', approval: 'auto' },
      { action: 'file.write', risk: 'medium', approval: 'auto', max_calls: 100 },
      { action: 'shell.command', risk: 'high', approval: 'require' },
      { action: 'network.*', risk: 'high', approval: 'require' },
      { action: 'dangerous', risk: 'critical', approval: 'block' },
    ],
    standard: [
      { action: 'file.read', risk: 'low', approval: 'auto' },
      { action: 'file.write', risk: 'medium', approval: 'auto', max_calls: 60 },
      { action: 'shell.command', risk: 'high', approval: 'require' },
      { action: 'network.*', risk: 'high', approval: 'require' },
      { action: 'dangerous', risk: 'critical', approval: 'block' },
    ],
    strict: [
      { action: 'file.read', risk: 'low', approval: 'auto' },
      { action: 'file.write', risk: 'high', approval: 'require', max_calls: 40 },
      { action: 'shell.command', risk: 'critical', approval: 'block' },
      { action: 'network.*', risk: 'critical', approval: 'block' },
      { action: 'dangerous', risk: 'critical', approval: 'block' },
    ],
  };
  return new Policy({ rules: presets[mode] || presets.standard });
}

/**
 * @typedef {object} LoopResult
 * @property {string} status        - 'done' | 'stopped'
 * @property {string} reason        - one of STOP_REASON
 * @property {number} iterations    - rounds executed
 * @property {VerifyResult|null} lastVerify
 * @property {object[]} events      - per-iteration event log
 * @property {string} summary       - human-readable one-paragraph summary
 */

/**
 * Run the loop engineer until Done or a stop condition fires.
 *
 * `implementStep` is the only adapter the caller must provide. It performs ONE
 * small unit of work (the AI assistant editing files in /vibe-loop) and returns
 * an action descriptor `{ action, context }` for the policy to gate, or null
 * when it believes there is nothing left to attempt.
 *
 * `verifyFn` defaults to the real verifier but is injectable for tests.
 *
 * @param {object} opts
 * @param {object} opts.spec                       - The spec/acceptance criteria (re-injected each round)
 * @param {(round:object) => Promise<{action:string, context?:object}|null>} opts.implementStep
 * @param {'lean'|'standard'|'strict'} [opts.mode='standard']
 * @param {number} [opts.maxIterations=12]
 * @param {number} [opts.budget=Infinity]          - token/cost budget
 * @param {(used:number)=>number} [opts.costOf]    - returns cost spent so far
 * @param {number} [opts.stagnationLimit=2]        - rounds without progress before escalating
 * @param {boolean} [opts.autoApprove=false]
 * @param {Function} [opts.verifyFn=verify]
 * @param {Function} [opts.onEvent]                - called with each event (logging/observability)
 * @returns {Promise<LoopResult>}
 */
export async function runVibeLoop(opts) {
  const {
    spec,
    implementStep,
    mode = 'standard',
    maxIterations = 12,
    budget = Infinity,
    costOf = () => 0,
    stagnationLimit = 2,
    autoApprove = false,
    verifyFn = verify,
    onEvent,
  } = opts;

  if (typeof implementStep !== 'function') {
    throw new Error('runVibeLoop requires an implementStep(round) callback');
  }

  const policy = policyForMode(mode);
  const events = [];
  let iteration = 0;
  let prevFailureCount = Infinity;
  let stagnant = 0;
  let lastVerify = null;
  let reason = STOP_REASON.MAX_ITERATIONS;

  const emit = (event) => {
    const e = { iteration, ts: Date.now(), ...event };
    events.push(e);
    if (onEvent) { try { onEvent(e); } catch { /* best-effort */ } }
  };

  await runLoop(
    policy,
    async ({ phase, action, context }) => {
      // loop.mjs handles deny/approval phases; we only drive 'next' + 'execute'.
      if (phase === 'denied') {
        reason = STOP_REASON.POLICY_BLOCKED;
        emit({ kind: 'blocked', action, context });
        return;
      }
      if (phase === 'approval') {
        // High-risk action reached. In headless mode we defer to autoApprove;
        // interactive callers override via onEvent + their own approval channel.
        emit({ kind: 'approval-required', action, context });
        return { approved: autoApprove === true };
      }
      if (phase === 'execute') {
        return; // execution side-effects already happened inside implementStep
      }

      // phase === 'next' : decide and perform the next unit of work.
      if (iteration >= maxIterations) { reason = STOP_REASON.MAX_ITERATIONS; return null; }
      if (costOf() >= budget) { reason = STOP_REASON.BUDGET; return null; }

      iteration += 1;

      // 1. Re-inject the spec so a long loop cannot drift from intent.
      const round = { iteration, spec, lastVerify, failureCount: prevFailureCount };

      // 2. Do one small unit of work via the caller's adapter.
      let step;
      try {
        step = await implementStep(round);
      } catch (err) {
        reason = STOP_REASON.ERROR;
        emit({ kind: 'error', message: err.message });
        return null;
      }

      // 3. Verify objectively. This is the real "are we done?" check.
      lastVerify = await verifyFn({ spec });
      emit({
        kind: 'verify',
        passed: lastVerify.passed,
        failureCount: lastVerify.failureCount,
        summary: summarizeVerify(lastVerify),
      });

      if (lastVerify.passed) { reason = STOP_REASON.DONE; return null; }

      // 4. No-progress detection: failures must trend down.
      if (lastVerify.failureCount >= prevFailureCount) stagnant += 1;
      else stagnant = 0;
      prevFailureCount = lastVerify.failureCount;

      if (stagnant >= stagnationLimit) {
        reason = STOP_REASON.NO_PROGRESS;
        emit({ kind: 'escalate', failures: lastVerify.failures });
        return null;
      }

      // 5. Still failing but improving → return a gated 'fix' action and continue.
      if (!step || !step.action) {
        return { action: 'file.write', context: { failures: lastVerify.failures } };
      }
      return { action: step.action, context: { ...step.context, failures: lastVerify.failures } };
    },
    { maxIterations: maxIterations + 1, autoApprove }
  );

  const status = reason === STOP_REASON.DONE ? 'done' : 'stopped';
  return {
    status,
    reason,
    iterations: iteration,
    lastVerify,
    events,
    summary: buildSummary({ status, reason, iteration, lastVerify }),
  };
}

/**
 * @returns {string}
 */
function buildSummary({ status, reason, iteration, lastVerify }) {
  if (status === 'done') {
    return `DONE after ${iteration} round(s) — all gates PASS.`;
  }
  const detail = lastVerify
    ? ` Last verify: ${summarizeVerify(lastVerify)}.`
    : '';
  const hints = {
    [STOP_REASON.MAX_ITERATIONS]: 'Hit the iteration cap. Raise --max-iterations or narrow the spec.',
    [STOP_REASON.BUDGET]: 'Hit the cost budget. Raise --budget or split the task.',
    [STOP_REASON.NO_PROGRESS]: 'Failures stopped improving. Human input needed — the loop is not guessing further.',
    [STOP_REASON.POLICY_BLOCKED]: 'A required action was blocked by policy. Approve it or relax --mode.',
    [STOP_REASON.ERROR]: 'An internal error stopped the loop.',
  };
  return `STOPPED (${reason}) after ${iteration} round(s).${detail} ${hints[reason] || ''}`.trim();
}
