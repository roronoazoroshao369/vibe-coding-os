/**
 * runtime/autopilot/verifier.mjs — Objective "Done" verification for the loop engine
 *
 * This is the quality feedback half of the loop engineer. Where loop.mjs decides
 * WHETHER an action may run, verifier.mjs decides WHETHER the work is actually done.
 *
 * "Done" is never the assistant's word — it is the conjunction of objective gates:
 *   - tests pass
 *   - typecheck passes
 *   - imports resolve
 *   - the diff stays inside the declared scope
 *
 * Each gate is a small async function returning { name, passed, failures[] }.
 * The verifier runs them, aggregates, and reports a single signal the loop can
 * act on. It NEVER decides to keep looping by itself — it only reports facts.
 *
 * v1.0.0 — Initial loop-engine integration (/vibe-loop)
 */

import { spawn } from 'node:child_process';

/**
 * @typedef {object} GateResult
 * @property {string} name       - Gate identifier, e.g. "typecheck"
 * @property {boolean} passed     - Whether the gate passed
 * @property {string[]} failures  - Human-readable failure lines (empty if passed)
 * @property {boolean} [skipped]  - True if the gate was not applicable / not run
 */

/**
 * @typedef {object} VerifyResult
 * @property {boolean} passed       - True only if every non-skipped gate passed
 * @property {GateResult[]} gates    - Per-gate results
 * @property {string[]} failures     - Flattened failures across all gates
 * @property {number} failureCount   - failures.length (the progress signal)
 */

/**
 * Run a shell command and capture its result.
 * Resolves (never rejects) so a failing gate is data, not an exception.
 *
 * @param {string} cmd
 * @param {string[]} args
 * @param {object} [opts]
 * @param {string} [opts.cwd]
 * @param {number} [opts.timeoutMs=120000]
 * @returns {Promise<{code:number, stdout:string, stderr:string, timedOut:boolean}>}
 */
export function runCommand(cmd, args = [], opts = {}) {
  const { cwd = process.cwd(), timeoutMs = 120000 } = opts;
  return new Promise((resolve) => {
    let stdout = '';
    let stderr = '';
    let timedOut = false;

    const child = spawn(cmd, args, { cwd, shell: false });
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGKILL');
    }, timeoutMs);

    child.stdout?.on('data', (d) => { stdout += d.toString(); });
    child.stderr?.on('data', (d) => { stderr += d.toString(); });
    child.on('error', (err) => {
      clearTimeout(timer);
      resolve({ code: 1, stdout, stderr: stderr + `\nspawn error: ${err.message}`, timedOut });
    });
    child.on('close', (code) => {
      clearTimeout(timer);
      resolve({ code: code ?? 1, stdout, stderr, timedOut });
    });
  });
}

/**
 * Extract concise failure lines from command output.
 * Keeps lines that look like errors/failures, caps the volume so the loop
 * context stays small (P4: avoid context blowup).
 *
 * @param {{stdout:string, stderr:string, timedOut:boolean}} out
 * @param {number} [max=12]
 * @returns {string[]}
 */
function extractFailures(out, max = 12) {
  if (out.timedOut) return ['gate timed out'];
  const text = `${out.stdout}\n${out.stderr}`;
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const errorish = lines.filter((l) =>
    /(\berror\b|\bfail(ed|ure)?\b|✗|✖|✘|not ok|assertionerror|cannot find|unresolved|✕)/i.test(l)
  );
  const chosen = (errorish.length ? errorish : lines.slice(-max));
  return chosen.slice(0, max);
}

/**
 * Build the default gate set. Each gate is { name, run }.
 * `run` returns a GateResult. Gates that are not configured for the project
 * mark themselves skipped rather than failing.
 *
 * @param {object} cfg
 * @param {string} cfg.cwd
 * @param {string[]|null} cfg.testCommand   - e.g. ['npm','test'] or null to skip
 * @param {boolean} cfg.useRepoValidators   - run validate:autopilot bundle
 * @param {number} cfg.timeoutMs
 * @returns {Array<{name:string, run:Function}>}
 */
export function defaultGates(cfg) {
  const { cwd, testCommand, useRepoValidators, timeoutMs } = cfg;
  const gates = [];

  if (useRepoValidators) {
    const validators = [
      ['imports', ['run', 'validate:imports']],
      ['typecheck', ['run', 'validate:typecheck']],
      ['scope-match', ['run', 'validate:scope-match']],
    ];
    for (const [name, npmArgs] of validators) {
      gates.push({
        name,
        async run() {
          const out = await runCommand('npm', npmArgs, { cwd, timeoutMs });
          const passed = out.code === 0 && !out.timedOut;
          return { name, passed, failures: passed ? [] : extractFailures(out) };
        },
      });
    }
  }

  gates.push({
    name: 'tests',
    async run() {
      if (!testCommand || testCommand.length === 0) {
        return { name: 'tests', passed: true, failures: [], skipped: true };
      }
      const [cmd, ...args] = testCommand;
      const out = await runCommand(cmd, args, { cwd, timeoutMs });
      const passed = out.code === 0 && !out.timedOut;
      return { name: 'tests', passed, failures: passed ? [] : extractFailures(out) };
    },
  });

  return gates;
}

/**
 * Verify the current working tree against the Done criteria.
 *
 * @param {object} [options]
 * @param {string} [options.cwd=process.cwd()]
 * @param {string[]|null} [options.testCommand=['npm','test']]
 * @param {boolean} [options.useRepoValidators=true]
 * @param {number} [options.timeoutMs=120000]
 * @param {Array<{name:string, run:Function}>} [options.gates] - Override gate set (for tests)
 * @returns {Promise<VerifyResult>}
 */
export async function verify(options = {}) {
  const {
    cwd = process.cwd(),
    testCommand = ['npm', 'test'],
    useRepoValidators = true,
    timeoutMs = 120000,
    gates,
  } = options;

  const gateSet = gates ?? defaultGates({ cwd, testCommand, useRepoValidators, timeoutMs });
  /** @type {GateResult[]} */
  const results = [];

  for (const gate of gateSet) {
    try {
      results.push(await gate.run());
    } catch (err) {
      results.push({ name: gate.name, passed: false, failures: [`gate threw: ${err.message}`] });
    }
  }

  const failures = results.flatMap((g) =>
    (g.passed || g.skipped) ? [] : g.failures.map((f) => `[${g.name}] ${f}`)
  );

  return {
    passed: results.every((g) => g.passed || g.skipped),
    gates: results,
    failures,
    failureCount: failures.length,
  };
}

/**
 * Render a one-line summary of a VerifyResult for loop logging.
 *
 * @param {VerifyResult} result
 * @returns {string}
 */
export function summarizeVerify(result) {
  if (result.passed) return 'verify: all gates PASS';
  const failed = result.gates.filter((g) => !g.passed && !g.skipped).map((g) => g.name);
  return `verify: ${result.failureCount} issue(s) in [${failed.join(', ')}]`;
}
