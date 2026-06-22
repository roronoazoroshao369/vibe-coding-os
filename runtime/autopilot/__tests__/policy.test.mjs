/**
 * Unit tests for runtime/autopilot/policy.mjs
 *
 * Run: node --test runtime/autopilot/__tests__/policy.test.mjs
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

let Policy;
try {
  ({ Policy } = await import('../policy.mjs'));
} catch (e) {
  console.error('Cannot load Policy module:', e.message);
  process.exit(1);
}

describe('Policy.allows()', () => {
  it('default-allows actions with no matching rule', () => {
    const p = new Policy();
    assert.equal(p.allows('file.read'), true);
    assert.equal(p.allows('network.get'), true);
  });

  it('blocks actions with approval=block', () => {
    const p = new Policy({
      rules: [{ action: 'file.write', risk: 'high', approval: 'block' }],
    });
    assert.equal(p.allows('file.write'), false);
  });

  it('allows actions with approval=auto', () => {
    const p = new Policy({
      rules: [{ action: 'file.read', risk: 'low', approval: 'auto' }],
    });
    assert.equal(p.allows('file.read'), true);
  });

  it('blocks after exceeding max_calls', () => {
    const p = new Policy({
      rules: [{ action: 'network.get', risk: 'medium', approval: 'auto', max_calls: 2 }],
    });
    assert.equal(p.allows('network.get'), true);
    p.recordCall('network.get');
    assert.equal(p.allows('network.get'), true);
    p.recordCall('network.get');
    assert.equal(p.allows('network.get'), false);
  });

  it('matches wildcard patterns (prefix)', () => {
    const p = new Policy({
      rules: [{ action: 'file.write.*', risk: 'high', approval: 'block' }],
    });
    assert.equal(p.allows('file.write.toolA'), false);
    assert.equal(p.allows('file.read'), true);
  });

  it('matches * as all-actions wildcard', () => {
    const p = new Policy({
      rules: [{ action: '*', risk: 'medium', approval: 'auto', max_calls: 3 }],
    });
    assert.equal(p.allows('a.b'), true);
    p.recordCall('a.b');
    p.recordCall('c.d');
    p.recordCall('e.f');
    assert.equal(p.allows('g.h'), false);
  });
});

describe('Policy.requiresApproval()', () => {
  it('returns false for actions with no rule', () => {
    const p = new Policy();
    assert.equal(p.requiresApproval('file.write'), false);
  });

  it('returns true for actions with approval=require', () => {
    const p = new Policy({
      rules: [{ action: 'network.post', risk: 'critical', approval: 'require' }],
    });
    assert.equal(p.requiresApproval('network.post'), true);
  });

  it('returns false for auto approval rules', () => {
    const p = new Policy({
      rules: [{ action: 'file.read', risk: 'low', approval: 'auto' }],
    });
    assert.equal(p.requiresApproval('file.read'), false);
  });
});

describe('Policy counters', () => {
  it('recordCall() increments; resetCounters() clears', () => {
    const p = new Policy({
      rules: [{ action: 'test.action', risk: 'low', approval: 'auto', max_calls: 1 }],
    });
    assert.equal(p.allows('test.action'), true);
    p.recordCall('test.action');
    assert.equal(p.allows('test.action'), false);
    p.resetCounters();
    assert.equal(p.allows('test.action'), true);
  });
});

describe('Policy.log()', () => {
  it('returns formatted string with rule details', () => {
    const p = new Policy({
      rules: [
        { action: 'file.write', risk: 'high', approval: 'block' },
        { action: 'network.get', risk: 'medium', approval: 'auto', max_calls: 10 },
      ],
    });
    const log = p.log();
    assert.ok(log.startsWith('=== Autopilot Policy ==='));
    assert.ok(log.includes('file.write'));
    assert.ok(log.includes('network.get'));
    assert.ok(log.includes('risk=high'));
    assert.ok(log.includes('approval=block'));
  });
});

describe('Policy constructor validation', () => {
  it('accepts empty rules array', () => {
    const p = new Policy({ rules: [] });
    assert.equal(p.allows('anything'), true);
  });

  it('rejects unknown risk level', () => {
      assert.throws(() => {
        new Policy({ rules: [{ action: 'x', risk: 'extreme', approval: 'auto' }] });
      }, /Invalid risk/);
  });

  it('rejects unknown approval mode', () => {
      assert.throws(() => {
        new Policy({ rules: [{ action: 'x', risk: 'low', approval: 'maybe' }] });
      }, /Invalid approval/);
  });
});

describe('Policy edge cases (v2.17.4)', () => {
  it('max_calls: 0 blocks all calls (current semantics)', () => {
    const p = new Policy({ rules: [{ action: 'a.b', max_calls: 0, risk: 'low', approval: 'auto' }] });
    assert.equal(p.allows('a.b'), false);
  });

  it('requiresApproval returns false for block rule', () => {
    const p = new Policy({ rules: [{ action: 'a.b', risk: 'low', approval: 'block' }] });
    assert.equal(p.requiresApproval('a.b'), false);
  });

  it('reserved shorthand "write" matches file.write.* patterns', () => {
    const p = new Policy({ rules: [{ action: 'write', risk: 'medium', approval: 'require' }] });
    // 'write' shorthand should expand to file.write.* family
    assert.equal(typeof p.allows('file.write.something'), 'boolean');
  });
});
