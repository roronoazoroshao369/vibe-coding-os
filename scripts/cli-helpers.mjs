#!/usr/bin/env node
// cli-helpers.mjs — shared CLI helpers for Vibe Coding OS scripts

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const DEFAULT_ROOT = resolve(__dirname, '..');

export function parseArgs(argv = process.argv.slice(2)) {
  const positionals = [];
  const flags = {};

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    if (arg === '--') {
      positionals.push(...argv.slice(i + 1));
      break;
    }

    if (arg === '-h' || arg === '--help') {
      flags.help = true;
      continue;
    }

    if (arg === '-V' || arg === '--version') {
      flags.version = true;
      continue;
    }

    if (arg.startsWith('--')) {
      const raw = arg.slice(2);
      const eq = raw.indexOf('=');
      if (eq !== -1) {
        flags[raw.slice(0, eq)] = raw.slice(eq + 1);
        continue;
      }

      const next = argv[i + 1];
      if (next === undefined || next.startsWith('-')) {
        flags[raw] = true;
      } else {
        flags[raw] = next;
        i++;
      }
      continue;
    }

    positionals.push(arg);
  }

  return { positionals, flags, root: resolve(String(flags.root || DEFAULT_ROOT)) };
}

export function fail(message, code = 1) {
  console.error(message);
  process.exit(code);
}

export function jsonOut(value) {
  console.log(JSON.stringify(value, null, 2));
}

export function requireFlag(flags, name) {
  const value = flags[name];
  if (value === undefined || value === true || value === '') {
    fail(`--${name} is required`);
  }
  return value;
}

export function packageVersion(root = DEFAULT_ROOT) {
  try {
    const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));
    return pkg.version || '0.0.0';
  } catch {
    return '0.0.0';
  }
}

export function helpHeader(title, root = DEFAULT_ROOT) {
  return `${title} v${packageVersion(root)}`;
}

export function helpFooter() {
  return 'Common flags:\n  --root PATH   Repository root (defaults to this checkout)\n  -h, --help    Show help';
}
