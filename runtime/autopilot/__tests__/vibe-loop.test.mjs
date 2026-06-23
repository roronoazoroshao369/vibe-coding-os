/**
 * Unit tests for runtime/autopilot/vibe-loop.mjs (the loop engineer)
 *
 * Run: node --test runtime/autopilot/__tests__/vibe-loop.test.mjs
 *
 * These tests prove the behaviours that distinguish a loop engineer from a
 * one-shot prompt: it loops until objective Done, it never claims done while a
 * gate fails, and it stops itself on no-progress / iteration limits.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

let runVibeLoop, STOP_REASON, policyForMode;
try {
  ({ runVibeLoop, STOP_REASON, policyForMode } = await import('../vibe-loop.mjs'));
} catch (e) {
  console.error('Cannot load vibe-loop module:', e.message);
  process.exit(1);
}

// A fake verifier whose pass/fail is scripted per round so tests are deterministic.
function scriptedVerify(sequence) {
  let i = 0;
  return async () => {
    const failureCount = sequence[Math.min(i, sequence.length - 1)];
    i += 1;
    return {
      passed: failureCount === 0,
      failureCount,
      failures: Array.from({ length: failureCount }, (_, n) => `fail-${n}`),
      gates: [],
    };
  };
}

describe('runVibeLoop — Done detection', () => {
  it('keeps looping until all gates pass, then reports DONE', async () => {
    const verifyFn = scriptedVerify([3, 2, 1, 0]); // improves then passes
    const result = await runVibeLoop({
      spec: { goal: 'x' },
      implementStep: async () => ({ action: 'file.write' }),
      verifyFn,
      maxIterations: 10,
    });
    assert.equal(result.status, 'done');
    assert.equal(result.reason, STOP_REASON.DONE);
    assert.equal(result.iterations, 4);
    assert.equal(result.lastVerify.passed, true);
  });

  it('never reports done while a gate is failing', async () => {
    const verifyFn = scriptedVerify([2, 2, 2]); // never improves
    const result = await runVibeLoop({
      spec: {},
      implementStep: async () => ({ action: 'file.write' }),
      verifyFn,
      maxIterations: 10,
      stagnationLimit: 2,
    });
    assert.notEqual(result.status, 'done');
    assert.equal(result.lastVerify.passed, false);
  });
});

describe('runVibeLoop — stop conditions', () => {
  it('stops with NO_PROGRESS when failures stop improving', async () => {
    const verifyFn = scriptedVerify([5, 5, 5]);
    const result = await runVibeLoop({
      spec: {},
      implementStep: async () => ({ action: 'file.write' }),
      verifyFn,
      stagnationLimit: 2,
      maxIterations: 20,
    });
    assert.equal(result.reason, STOP_REASON.NO_PROGRESS);
  });

  it('stops at MAX_ITERATIONS even if still improving slowly', async () => {
    const verifyFn = scriptedVerify([9, 8, 7, 6, 5, 4]);
    const result = await runVibeLoop({
      spec: {},
      implementStep: async () => ({ action: 'file.write' }),
      verifyFn,
      maxIterations: 3,
    });
    assert.equal(result.reason, STOP_REASON.MAX_ITERATIONS);
    assert.equal(result.iterations, 3);
  });

  it('stops at BUDGET when cost exceeds the budget', async () => {
    const verifyFn = scriptedVerify([4, 3, 2, 1]);
    let spent = 0;
    const result = await runVibeLoop({
      spec: {},
      implementStep: async () => { spent += 100; return { action: 'file.write' }; },
      verifyFn,
      budget: 150,
      costOf: () => spent,
      maxIterations: 10,
    });
    assert.equal(result.reason, STOP_REASON.BUDGET);
  });
});

describe('policyForMode', () => {
  it('strict mode blocks shell.command', () => {
    const p = policyForMode('strict');
    assert.equal(p.allows('shell.command'), false);
  });

  it('lean mode allows file.write without approval', () => {
    const p = policyForMode('lean');
    assert.equal(p.allows('file.write'), true);
    assert.equal(p.requiresApproval('file.write'), false);
  });

  it('falls back to standard for unknown mode', () => {
    const p = policyForMode('nonsense');
    assert.equal(p.requiresApproval('shell.command'), true);
  });
});

describe('runVibeLoop — guard rails', () => {
  it('throws if implementStep is missing', async () => {
    await assert.rejects(() => runVibeLoop({ spec: {} }), /implementStep/);
  });

  it('emits one verify event per round', async () => {
    const verifyFn = scriptedVerify([2, 1, 0]);
    const result = await runVibeLoop({
      spec: {},
      implementStep: async () => ({ action: 'file.write' }),
      verifyFn,
    });
    const verifyEvents = result.events.filter((e) => e.kind === 'verify');
    assert.equal(verifyEvents.length, 3);
  });
});
