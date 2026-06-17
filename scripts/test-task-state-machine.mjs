#!/usr/bin/env node
// test-task-state-machine.mjs — Tests for runtime/core/task-state-machine.mjs

import { strict as assert } from 'node:assert';
import {
  canTransition, getAllowedTransitions, checkGuard, transitionTask,
  getStateMachineSummary, TRANSITIONS, GUARDS,
} from '../runtime/core/task-state-machine.mjs';

let passed = 0;
let failed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log(`PASS ${name}`); }
  catch (err) { failed++; console.error(`FAIL ${name}: ${err.message}`); }
}

// --- canTransition ---

test('canTransition: pending → in_progress', () => {
  assert.equal(canTransition('pending', 'in_progress'), true);
});

test('canTransition: pending → cancelled', () => {
  assert.equal(canTransition('pending', 'cancelled'), true);
});

test('canTransition: pending → completed (invalid)', () => {
  assert.equal(canTransition('pending', 'completed'), false);
});

test('canTransition: in_progress → blocked', () => {
  assert.equal(canTransition('in_progress', 'blocked'), true);
});

test('canTransition: in_progress → completed', () => {
  assert.equal(canTransition('in_progress', 'completed'), true);
});

test('canTransition: in_progress → cancelled', () => {
  assert.equal(canTransition('in_progress', 'cancelled'), true);
});

test('canTransition: in_progress → pending', () => {
  assert.equal(canTransition('in_progress', 'pending'), true);
});

test('canTransition: blocked → in_progress', () => {
  assert.equal(canTransition('blocked', 'in_progress'), true);
});

test('canTransition: blocked → pending', () => {
  assert.equal(canTransition('blocked', 'pending'), true);
});

test('canTransition: blocked → completed (invalid)', () => {
  assert.equal(canTransition('blocked', 'completed'), false);
});

test('canTransition: completed is terminal', () => {
  assert.equal(canTransition('completed', 'pending'), false);
  assert.equal(canTransition('completed', 'in_progress'), false);
  assert.equal(canTransition('completed', 'cancelled'), false);
});

test('canTransition: cancelled is terminal', () => {
  assert.equal(canTransition('cancelled', 'pending'), false);
  assert.equal(canTransition('cancelled', 'in_progress'), false);
  assert.equal(canTransition('cancelled', 'completed'), false);
});

test('canTransition: unknown state returns false', () => {
  assert.equal(canTransition('unknown', 'pending'), false);
  assert.equal(canTransition('pending', 'unknown'), false);
});

// --- getAllowedTransitions ---

test('getAllowedTransitions: pending', () => {
  const t = getAllowedTransitions('pending');
  assert.deepEqual(t.sort(), ['in_progress', 'cancelled'].sort());
});

test('getAllowedTransitions: in_progress', () => {
  const t = getAllowedTransitions('in_progress');
  assert.deepEqual(t.sort(), ['blocked', 'completed', 'cancelled', 'pending'].sort());
});

test('getAllowedTransitions: blocked', () => {
  const t = getAllowedTransitions('blocked');
  assert.deepEqual(t.sort(), ['in_progress', 'cancelled', 'pending'].sort());
});

test('getAllowedTransitions: completed is empty', () => {
  assert.deepEqual(getAllowedTransitions('completed'), []);
});

test('getAllowedTransitions: unknown state returns empty', () => {
  assert.deepEqual(getAllowedTransitions('banana'), []);
});

// --- Guards ---

test('Guard: in_progress → blocked requires blockedReason', () => {
  const result = checkGuard('in_progress', 'blocked', { status: 'in_progress' }, {});
  assert.equal(result.ok, false);
  assert.ok(result.reason.includes('blockedReason'));
});

test('Guard: in_progress → blocked passes with reason', () => {
  const result = checkGuard('in_progress', 'blocked', { status: 'in_progress' }, { blockedReason: 'dependency' });
  assert.equal(result.ok, true);
});

test('Guard: all other transitions have no guard', () => {
  assert.equal(checkGuard('pending', 'in_progress', {}, {}).ok, true);
  assert.equal(checkGuard('in_progress', 'completed', {}, {}).ok, true);
  assert.equal(checkGuard('blocked', 'in_progress', {}, {}).ok, true);
});

// --- transitionTask ---

function makeTask(status = 'pending') {
  return {
    id: 'task_test',
    status,
    history: [],
    claim: null,
    blockedReason: null,
    updatedAt: new Date().toISOString(),
  };
}

test('transitionTask: pending → in_progress creates claim', () => {
  const task = makeTask('pending');
  const result = transitionTask(task, 'in_progress', { actor: 'agent-1', ttl: 600 });
  assert.equal(result.status, 'in_progress');
  assert.ok(result.claim);
  assert.equal(result.claim.claimedBy, 'agent-1');
  assert.equal(result.claim.ttl, 600);
  assert.equal(result.history.length, 1);
  assert.equal(result.history[0].from, 'pending');
  assert.equal(result.history[0].to, 'in_progress');
});

test('transitionTask: in_progress → blocked sets blockedReason', () => {
  const task = makeTask('in_progress');
  const result = transitionTask(task, 'blocked', { blockedReason: 'dependency missing' });
  assert.equal(result.status, 'blocked');
  assert.equal(result.blockedReason, 'dependency missing');
});

test('transitionTask: in_progress → completed sets verification', () => {
  const task = makeTask('in_progress');
  const result = transitionTask(task, 'completed', { actor: 'agent-2' });
  assert.equal(result.status, 'completed');
  assert.ok(result.verification);
  assert.equal(result.verification.completedBy, 'agent-2');
});

test('transitionTask: in_progress → pending clears claim', () => {
  const task = makeTask('in_progress');
  task.claim = { claimedBy: 'agent-1' };
  const result = transitionTask(task, 'pending');
  assert.equal(result.status, 'pending');
  assert.equal(result.claim, null);
  assert.equal(result.blockedReason, null);
});

test('transitionTask: blocked → in_progress clears blockedReason', () => {
  const task = makeTask('blocked');
  task.blockedReason = 'was blocked';
  const result = transitionTask(task, 'in_progress', { actor: 'agent-3' });
  assert.equal(result.status, 'in_progress');
  assert.equal(result.blockedReason, null);
  assert.ok(result.claim);
});

test('transitionTask: in_progress → cancelled clears claim', () => {
  const task = makeTask('in_progress');
  task.claim = { claimedBy: 'agent-1' };
  const result = transitionTask(task, 'cancelled');
  assert.equal(result.status, 'cancelled');
  assert.equal(result.claim, null);
});

test('transitionTask: invalid transition throws', () => {
  const task = makeTask('pending');
  assert.throws(() => transitionTask(task, 'completed'), /Invalid transition/);
});

test('transitionTask: blocked without reason throws', () => {
  const task = makeTask('in_progress');
  assert.throws(() => transitionTask(task, 'blocked', {}), /blockedReason is required/);
});

test('transitionTask: history accumulates across transitions', () => {
  const task = makeTask('pending');
  transitionTask(task, 'in_progress', { actor: 'a' });
  transitionTask(task, 'blocked', { blockedReason: 'test' });
  transitionTask(task, 'in_progress', { actor: 'b' });
  assert.equal(task.history.length, 3);
  assert.equal(task.history[0].from, 'pending');
  assert.equal(task.history[1].from, 'in_progress');
  assert.equal(task.history[2].from, 'blocked');
});

// --- State Machine Summary ---

test('getStateMachineSummary returns valid structure', () => {
  const summary = getStateMachineSummary();
  assert.ok(Array.isArray(summary.states));
  assert.equal(summary.states.length, 5);
  assert.ok(Array.isArray(summary.terminalStates));
  assert.deepEqual(summary.terminalStates.sort(), ['cancelled', 'completed']);
  assert.ok(Array.isArray(summary.transitions));
  assert.equal(summary.transitions.length, 5);
  assert.ok(summary.guardCount > 0);
});

console.log(`\nState machine tests: ${passed}/${passed + failed} passed`);
process.exit(failed > 0 ? 1 : 0);
