#!/usr/bin/env node
/**
 * test-quality-engine.mjs — Integration test for Vibe Coding OS Quality Engine v2.0
 *
 * Runs the quality engine with lean, standard, and heavy profiles.
 * Validates:
 *   - Engine exits successfully (exit code 0/1 handled gracefully)
 *   - Output JSON structure matches expected schema
 *   - Each profile produces the expected gate count range
 *   - No critical errors during execution
 *   - Results have required fields (id, name, passed, durationMs, status, command)
 *
 * Usage:
 *   node scripts/test-quality-engine.mjs          # Run all profiles
 *   node scripts/test-quality-engine.mjs --lean    # Run lean only
 *   node scripts/test-quality-engine.mjs --standard # Run standard only
 *   node scripts/test-quality-engine.mjs --heavy   # Run heavy only
 *   node scripts/test-quality-engine.mjs --verbose  # Detailed output
 */

import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// ---------------------------------------------------------------------------
// Expected output schema (structural validation without full JSON Schema lib)
// ---------------------------------------------------------------------------
const REQUIRED_OUTPUT_FIELDS = [
  'engine', 'version', 'profile', 'startedAt', 'finishedAt',
  'durationMs', 'totalTimeoutMs', 'passed', 'summary', 'results'
];

const REQUIRED_GATE_RESULT_FIELDS = [
  'id', 'name', 'critical', 'category', 'auto_fixable',
  'passed', 'durationMs', 'status', 'command'
];

const REQUIRED_SUMMARY_FIELDS = [
  'total', 'passed', 'failed', 'criticalFailures', 'advisoryFailures'
];

// ---------------------------------------------------------------------------
// Expected gate counts per profile (approximate range)
// ---------------------------------------------------------------------------
const PROFILE_EXPECTATIONS = {
  lean: {
    label: 'lean',
    minGates: 2,
    maxGates: 8,
    description: 'Small, low-risk changes — fast subset of critical gates'
  },
  standard: {
    label: 'standard',
    minGates: 4,
    maxGates: 14,
    description: 'Normal implementation work — balanced coverage'
  },
  heavy: {
    label: 'heavy',
    minGates: 6,
    maxGates: 25,
    description: 'High-risk changes — deep inspection'
  }
};

// ---------------------------------------------------------------------------
// Results tracking
// ---------------------------------------------------------------------------
const testResults = {
  passed: 0,
  failed: 0,
  skipped: 0,
  details: []
};

function pass(message) {
  testResults.passed++;
  testResults.details.push({ status: 'PASS', message });
}

function fail(message) {
  testResults.failed++;
  testResults.details.push({ status: 'FAIL', message });
}

function skip(message) {
  testResults.skipped++;
  testResults.details.push({ status: 'SKIP', message });
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function typeOf(value) {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

function validateRequiredFields(obj, fields, label) {
  const errors = [];
  for (const field of fields) {
    if (!(field in obj)) {
      errors.push(`${label}: missing required field "${field}"`);
    }
  }
  return errors;
}

function validateFieldTypes(obj, fieldTypes, label) {
  const errors = [];
  for (const [field, expectedType] of Object.entries(fieldTypes)) {
    if (field in obj) {
      const actual = typeOf(obj[field]);
      if (actual !== expectedType) {
        errors.push(`${label}: field "${field}" expected ${expectedType}, got ${actual}`);
      }
    }
  }
  return errors;
}

// ---------------------------------------------------------------------------
// Run engine for a profile
// ---------------------------------------------------------------------------
function runEngine(profile) {
  return new Promise((resolvePromise) => {
    const started = Date.now();
    const child = spawn('node', [
      'scripts/quality-engine.mjs',
      `--profile=${profile}`,
      '--output-json',
      '--timeout-ms=120000'
    ], {
      cwd: ROOT,
      stdio: ['ignore', 'pipe', 'pipe']
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => { stdout += chunk.toString(); });
    child.stderr.on('data', (chunk) => { stderr += chunk.toString(); });
    child.on('error', (error) => { stderr += `${error.message}\n`; });
    child.on('close', (code) => {
      const durationMs = Date.now() - started;
      resolvePromise({
        profile,
        exitCode: code,
        stdout: stdout.trim(),
        stderr: stderr.trim(),
        durationMs
      });
    });
  });
}

// ---------------------------------------------------------------------------
// Validate output structure
// ---------------------------------------------------------------------------
function validateOutputStructure(output, profileName) {
  const errors = [];

  // 1. Top-level required fields
  errors.push(...validateRequiredFields(output, REQUIRED_OUTPUT_FIELDS, `[${profileName}] output`));

  // 2. Type checks
  errors.push(...validateFieldTypes(output, {
    engine: 'string',
    version: 'number',
    profile: 'string',
    startedAt: 'string',
    finishedAt: 'string',
    durationMs: 'number',
    totalTimeoutMs: 'number',
    passed: 'boolean',
    summary: 'object',
    results: 'array'
  }, `[${profileName}] output`));

  // 3. Engine name and version
  if (output.engine && output.engine !== 'quality-engine') {
    errors.push(`[${profileName}] engine name should be "quality-engine", got "${output.engine}"`);
  }

  // 4. Profile name matches
  if (output.profile && output.profile !== profileName) {
    errors.push(`[${profileName}] profile mismatch: expected "${profileName}", got "${output.profile}"`);
  }

  // 5. Summary validation
  if (output.summary) {
    errors.push(...validateRequiredFields(output.summary, REQUIRED_SUMMARY_FIELDS, `[${profileName}] summary`));
    errors.push(...validateFieldTypes(output.summary, {
      total: 'number',
      passed: 'number',
      failed: 'number',
      criticalFailures: 'number',
      advisoryFailures: 'number'
    }, `[${profileName}] summary`));

    // Check totals are consistent
    if (output.summary.total !== output.summary.passed + output.summary.failed) {
      errors.push(`[${profileName}] summary total (${output.summary.total}) !== passed (${output.summary.passed}) + failed (${output.summary.failed})`);
    }
  }

  // 6. Results validation
  if (Array.isArray(output.results)) {
    if (output.results.length === 0) {
      errors.push(`[${profileName}] results array is empty`);
    }

    for (let i = 0; i < output.results.length; i++) {
      const r = output.results[i];
      const label = `[${profileName}] results[${i}] (${r.id || 'unknown'})`;

      errors.push(...validateRequiredFields(r, REQUIRED_GATE_RESULT_FIELDS, label));
      errors.push(...validateFieldTypes(r, {
        id: 'string',
        name: 'string',
        critical: 'boolean',
        category: 'string',
        auto_fixable: 'boolean',
        passed: 'boolean',
        durationMs: 'number',
        status: 'number',
        command: 'string'
      }, label));

      // Duration should be positive
      if (typeof r.durationMs === 'number' && r.durationMs < 0) {
        errors.push(`${label}: durationMs is negative (${r.durationMs})`);
      }
    }
  }

  return errors;
}

// ---------------------------------------------------------------------------
// Validate profile-specific expectations
// ---------------------------------------------------------------------------
function validateProfileExpectations(output, profileName) {
  const errors = [];
  const expectations = PROFILE_EXPECTATIONS[profileName];
  if (!expectations) return errors;

  const gateCount = Array.isArray(output.results) ? output.results.length : 0;

  if (gateCount < expectations.minGates) {
    errors.push(`[${profileName}] gate count (${gateCount}) is below minimum (${expectations.minGates})`);
  }
  if (gateCount > expectations.maxGates) {
    errors.push(`[${profileName}] gate count (${gateCount}) exceeds maximum (${expectations.maxGates})`);
  }

  return errors;
}

// ---------------------------------------------------------------------------
// Main test runner
// ---------------------------------------------------------------------------
async function main() {
  const args = process.argv.slice(2);
  const runLean = !args.length || args.includes('--lean');
  const runStandard = !args.length || args.includes('--standard');
  const runHeavy = !args.length || args.includes('--heavy');
  const verbose = args.includes('--verbose');

  console.log('=== Quality Engine Integration Tests ===\n');

  const profilesToRun = [];
  if (runLean) profilesToRun.push('lean');
  if (runStandard) profilesToRun.push('standard');
  if (runHeavy) profilesToRun.push('heavy');

  if (profilesToRun.length === 0) {
    console.log('No profiles selected. Use --lean, --standard, --heavy, or no flags to run all.\n');
    process.exit(0);
  }

  console.log(`Profiles to test: ${profilesToRun.join(', ')}\n`);

  for (const profile of profilesToRun) {
    console.log(`--- Running ${profile} profile ---`);
    const result = await runEngine(profile);

    console.log(`  Exit code: ${result.exitCode}`);
    console.log(`  Duration: ${result.durationMs}ms`);
    if (result.stderr) {
      const stderrLines = result.stderr.split('\n').filter(Boolean);
      console.log(`  Stderr: ${stderrLines.length} line(s)`);
    }

    console.log('');

    // Parse output
    let output;
    if (!result.stdout) {
      fail(`[${profile}] engine produced no stdout output`);
      if (result.stderr) {
        console.log(`  stderr output:\n${result.stderr}\n`);
      }
      continue;
    }

    try {
      output = JSON.parse(result.stdout);
    } catch (err) {
      fail(`[${profile}] failed to parse engine output as JSON: ${err.message}`);
      if (verbose) {
        console.log(`  Raw output (first 500 chars):\n${result.stdout.slice(0, 500)}\n`);
      }
      continue;
    }

    // Structural validation
    const structErrors = validateOutputStructure(output, profile);
    if (structErrors.length === 0) {
      pass(`[${profile}] output structure is valid`);
    } else {
      for (const err of structErrors) {
        fail(err);
      }
    }

    // Profile expectations
    const expectErrors = validateProfileExpectations(output, profile);
    if (expectErrors.length === 0) {
      pass(`[${profile}] gate count (${output.results?.length || 0}) within expected range`);
    } else {
      for (const err of expectErrors) {
        fail(err);
      }
    }

    // Check for engine errors
    if (result.exitCode !== 0 && !result.stderr.includes('Timed out')) {
      // Non-zero exit is expected when critical gates fail, not an integration test failure
      // But we note it
      if (output.summary?.criticalFailures > 0) {
        pass(`[${profile}] engine exited non-zero (${result.exitCode}) due to ${output.summary.criticalFailures} critical gate failure(s) — expected behavior`);
      } else {
        fail(`[${profile}] engine exited non-zero (${result.exitCode}) with no critical failures`);
      }
    } else if (result.exitCode === 0) {
      pass(`[${profile}] engine exited successfully (code 0)`);
    }

    // Summary check
    if (output.summary) {
      const total = output.summary.total || 0;
      const passedGates = output.summary.passed || 0;
      const failedGates = output.summary.failed || 0;
      const criticalFailures = output.summary.criticalFailures || 0;
      console.log(`  Gates: ${passedGates}/${total} passed, ${failedGates} failed (${criticalFailures} critical)`);
    }

    console.log('');
  }

  // -------------------------------------------------------------------------
  // Summary
  // -------------------------------------------------------------------------
  const total = testResults.passed + testResults.failed + testResults.skipped;
  console.log('='.repeat(50));
  console.log('Test Summary');
  console.log('='.repeat(50));
  console.log(`  Total:  ${total}`);
  console.log(`  Passed: ${testResults.passed}`);
  console.log(`  Failed: ${testResults.failed}`);
  console.log(`  Skipped: ${testResults.skipped}`);
  console.log('');

  if (testResults.failed > 0 && verbose) {
    console.log('Failure details:');
    for (const detail of testResults.details) {
      if (detail.status === 'FAIL') {
        console.log(`  ❌ ${detail.message}`);
      }
    }
    console.log('');
  }

  // Exit with error code if any tests failed
  process.exit(testResults.failed > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error(`Test runner failed: ${error.message}`);
  process.exit(1);
});
