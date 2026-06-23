/**
 * score-firsttry.mjs — runs the task's hidden test suite against the
 * model's output in an isolated sandbox dir. Returns { pass, output }.
 *
 * "First-try" = the unedited model output passes the suite. No repair.
 */
import { execSync } from 'node:child_process';

export function scoreFirstTry({ sandbox, task }) {
  const cmd = task.testCmd || 'true';
  try {
    const output = execSync(cmd, {
      cwd: sandbox,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: 60000,
      env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
    });
    return { pass: true, output };
  } catch (e) {
    return { pass: false, output: (e.stdout || '') + (e.stderr || e.message || '') };
  }
}
