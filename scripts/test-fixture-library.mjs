#!/usr/bin/env node
// scripts/test-fixture-library.mjs
// Wave B1 Move 3 — Reusable test fixtures for security and validation tests.
// Provides a function to generate test cases for injection counters,
// redactor, and validation gates from a declarative JSON fixture.

import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');

// Load all fixtures from tests/fixtures/
function loadFixtures() {
  const fixturesDir = resolve(REPO_ROOT, 'tests/fixtures');
  if (!existsSync(fixturesDir)) {
    console.error('No fixtures directory found at tests/fixtures/');
    return {};
  }
  const files = readdirSync(fixturesDir).filter(f => f.endsWith('.json'));
  const fixtures = {};
  for (const file of files) {
    const name = file.replace('.json', '');
    const data = JSON.parse(readFileSync(resolve(fixturesDir, file), 'utf8'));
    fixtures[name] = data;
  }
  return fixtures;
}

// Generate injection counter test cases from a fixture
function generateInjectionTests(fixture) {
  const cases = [];
  for (const tc of fixture.cases || []) {
    cases.push({
      id: tc.id,
      input: tc.input,
      expected: {
        detected: tc.should_detect !== false,
        threatLevel: tc.threat_level || 'high'
      }
    });
  }
  return cases;
}

// Generate redactor test cases from a fixture
function generateRedactorTests(fixture) {
  const cases = [];
  for (const tc of fixture.cases || []) {
    cases.push({
      id: tc.id,
      input: tc.input,
      expected: {
        redacted: tc.should_redact !== false,
        mode: tc.mode || 'postTool'
      }
    });
  }
  return cases;
}

const action = process.argv[2];
if (!action || action === '--help') {
  console.log('Usage: node scripts/test-fixture-library.mjs <action>');
  console.log('');
  console.log('Actions:');
  console.log('  list          List all available fixture files');
  console.log('  validate      Check fixture files for schema errors');
  console.log('  inject-tests  Generate injection test cases (JSON)');
  console.log('  redact-tests  Generate redactor test cases (JSON)');
  console.log('');
  process.exit(0);
}

if (action === 'list') {
  const fixturesDir = resolve(REPO_ROOT, 'tests/fixtures');
  if (!existsSync(fixturesDir)) {
    console.log('No fixtures directory found.');
    process.exit(1);
  }
  const files = readdirSync(fixturesDir).filter(f => f.endsWith('.json'));
  if (files.length === 0) {
    console.log('No fixture files found.');
    process.exit(0);
  }
  for (const file of files) {
    const data = JSON.parse(readFileSync(resolve(fixturesDir, file), 'utf8'));
    const caseCount = (data.cases || []).length;
    console.log(`  ${file} (${caseCount} cases)`);
  }
  process.exit(0);
}

if (action === 'validate') {
  const fixtures = loadFixtures();
  const names = Object.keys(fixtures);
  if (names.length === 0) {
    console.log('No fixture files to validate.');
    process.exit(0);
  }
  let errors = 0;
  for (const [name, fixture] of Object.entries(fixtures)) {
    if (!fixture.name) {
      console.error(`  ${name}.json: missing "name" field`);
      errors++;
    }
    if (!Array.isArray(fixture.cases)) {
      console.error(`  ${name}.json: missing "cases" array`);
      errors++;
    } else {
      for (const tc of fixture.cases) {
        if (!tc.id) {
          console.error(`  ${name}.json: case missing "id" field`);
          errors++;
        }
        if (!tc.input && tc.input !== "") {
          console.error(`  ${name}.json: case ${tc.id} missing "input"`);
          errors++;
        }
      }
    }
  }
  if (errors === 0) {
    console.log(`All ${names.length} fixture files valid.`);
    process.exit(0);
  } else {
    console.error(`${errors} error(s) found.`);
    process.exit(1);
  }
}

if (action === 'inject-tests' || action === 'redact-tests') {
  const fixtures = loadFixtures();
  const results = [];
  for (const [name, fixture] of Object.entries(fixtures)) {
    if (action === 'inject-tests' && fixture.type !== 'injection') continue;
    if (action === 'redact-tests' && fixture.type !== 'redactor') continue;
    results.push(...(action === 'inject-tests'
      ? generateInjectionTests(fixture)
      : generateRedactorTests(fixture)));
  }
  console.log(JSON.stringify(results, null, 2));
  process.exit(0);
}

console.error(`Unknown action: ${action}`);
process.exit(1);
