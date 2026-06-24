#!/usr/bin/env node
// validate-all.mjs — compatibility wrapper.
//
// Source of truth: package.json:scripts.validate:all.
// Keep this file as a stable entrypoint for older docs/tools, but do not maintain
// a second hard-coded checks array here.

import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const pkg = JSON.parse(readFileSync(resolve(ROOT, 'package.json'), 'utf8'));
const validateAll = pkg.scripts?.['validate:all'];

if (!validateAll || typeof validateAll !== 'string') {
  console.error('❌ package.json does not define scripts.validate:all');
  process.exit(1);
}

console.log('=== Vibe Coding OS Full Validation Gate ===');
console.log('Source of truth: package.json:scripts.validate:all');
console.log(`Command: ${validateAll}`);
console.log('');

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const child = spawn(npmCommand, ['run', 'validate:all'], {
  cwd: ROOT,
  stdio: 'inherit'
});

child.on('close', (status) => {
  process.exit(status ?? 1);
});
