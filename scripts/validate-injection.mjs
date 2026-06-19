#!/usr/bin/env node
import { readdir, readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { INJECTION_PATTERNS } from '../runtime/core/injection-patterns.mjs';

// -----------------------------------------------------------------------------
// Vibe Coding OS prompt-injection / skill-poisoning scanner
//
// This is the enforcement half of docs/workflows/prompt-injection-handling.md:
// that doc tells humans/agents how to BEHAVE; this gate scans the artifacts the
// repo SHIPS for other agents to load and flags embedded payloads before they
// propagate on plugin install.
//
// It mirrors validate-secrets.mjs in spirit (portable, no deps, patterns live in
// runtime/core/) but scans files ON DISK rather than the staged diff: a poisoned
// SKILL.md that was committed last week is still dangerous today.
//
// Severities (see injection-patterns.mjs):
//   - 'error' findings BLOCK (exit 1).
//   - 'warn'  findings report only (exit 0). Avoids the false confidence the
//     panel warned about — a passing scan never means "definitely clean".
//
// Allowlisting (necessary — this very repo documents injection phrases as
// examples, e.g. prompt-injection-handling.md):
//   - File-level: a path listed in ALLOWLIST_FILES is skipped entirely. Use for
//     docs whose JOB is to quote payloads.
//   - Inline:    a line containing the marker `injection-allow:<label>` suppresses
//     that label's finding on that line only. Narrow, auditable, greppable.
//
// Scope: text artifacts under SCAN_DIRS plus .mcp.json manifests, EXCLUDING
// references/upstreams/ (vendored clones we don't own). Never mutates anything.
// -----------------------------------------------------------------------------

// Directories whose text bodies are scanned line-by-line (scope: 'text').
const SCAN_DIRS = ['skills', 'commands', 'templates', 'docs'];

// Root-level guidance files also scanned as text.
const SCAN_ROOT_FILES = ['README.md', 'README.vi.md', 'CLAUDE.md', 'AGENTS.md'];

// Any path containing one of these segments is never scanned.
const EXCLUDE_SEGMENTS = ['references/upstreams/', 'node_modules/', '.git/'];

// File-level allowlist: paths whose job is to quote injection payloads.
// Keep this list SHORT and justify each entry — every entry is a blind spot.
const ALLOWLIST_FILES = new Set([
  // Documents the core rule by quoting the payloads it warns against.
  'docs/workflows/prompt-injection-handling.md',
  // The pattern source itself contains regex literals that match payloads.
  'runtime/core/injection-patterns.mjs',
  // Guard bypass protocol — skill and command intentionally quote bypass patterns.
  'skills/core/guard-bypass-protocol/SKILL.md',
  'commands/vibe-bypass.md'
]);

// Inline suppression marker: `injection-allow:<label>` on the offending line.
const INLINE_ALLOW_RE = /injection-allow:([a-z0-9-]+|\*)/gi;

const errors = [];
const warnings = [];

function normalizePath(file) {
  return file.split(path.sep).join('/');
}

function isExcluded(file) {
  const norm = normalizePath(file);
  return EXCLUDE_SEGMENTS.some((seg) => norm.includes(seg));
}

async function walkFiles(dir, predicate) {
  if (!existsSync(dir)) return [];
  const found = [];
  async function walk(current) {
    const entries = await readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (isExcluded(full)) continue;
      if (entry.isDirectory()) {
        await walk(full);
      } else if (entry.isFile() && predicate(entry.name, full)) {
        found.push(normalizePath(full));
      }
    }
  }
  await walk(dir);
  return found.sort();
}

// Labels suppressed on a given line via inline marker. '*' suppresses all.
function inlineAllowed(line) {
  const labels = new Set();
  INLINE_ALLOW_RE.lastIndex = 0;
  let match;
  while ((match = INLINE_ALLOW_RE.exec(line)) !== null) {
    labels.add(match[1].toLowerCase());
  }
  return labels;
}

function record(severity, file, lineNo, label) {
  const entry = `${file}:${lineNo} — ${label} (${severity})`;
  if (severity === 'error') errors.push(entry);
  else warnings.push(entry);
}

// Apply patterns of the given scope to one line of text.
function scanLine(file, lineNo, content, scope) {
  const allowed = inlineAllowed(content);
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.scope !== scope) continue;
    if (allowed.has('*') || allowed.has(pattern.label)) continue;
    pattern.re.lastIndex = 0;
    if (pattern.re.test(content)) {
      record(pattern.severity, file, lineNo, pattern.label);
    }
  }
}

// --- Text artifacts ----------------------------------------------------------

async function collectTextFiles() {
  const files = new Set();
  for (const dir of SCAN_DIRS) {
    const found = await walkFiles(
      dir,
      (name) => name.endsWith('.md') || name.endsWith('.mjs')
    );
    for (const file of found) files.add(file);
  }
  for (const file of SCAN_ROOT_FILES) {
    if (existsSync(file) && !isExcluded(file)) files.add(normalizePath(file));
  }
  return [...files].sort();
}

const textFiles = await collectTextFiles();

for (const file of textFiles) {
  if (ALLOWLIST_FILES.has(file)) continue;
  const info = await stat(file);
  if (info.size === 0) continue;
  const content = await readFile(file, 'utf8');
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i += 1) {
    scanLine(file, i + 1, lines[i], 'text');
  }
}

// --- MCP manifests -----------------------------------------------------------

// Collect command/args strings from a parsed .mcp.json so 'mcp'-scope patterns
// only ever see launch commands, not prose. Returns [{ value }] flat list.
function collectMcpStrings(json) {
  const out = [];
  const servers = json && json.mcpServers;
  if (!servers || typeof servers !== 'object') return out;
  for (const cfg of Object.values(servers)) {
    if (!cfg || typeof cfg !== 'object') continue;
    if (typeof cfg.command === 'string') out.push(cfg.command);
    if (Array.isArray(cfg.args)) {
      for (const arg of cfg.args) {
        if (typeof arg === 'string') out.push(arg);
      }
    }
  }
  return out;
}

const mcpFiles = await walkFiles('.', (name) => name === '.mcp.json');
// walkFiles('.') would re-walk everything; restrict to repo-root + known dirs.
const rootMcp = existsSync('.mcp.json') ? ['.mcp.json'] : [];
const scannedMcp = [...new Set([...rootMcp, ...mcpFiles.filter((f) => !isExcluded(f))])];

for (const file of scannedMcp) {
  if (ALLOWLIST_FILES.has(file)) continue;
  let json;
  try {
    json = JSON.parse(await readFile(file, 'utf8'));
  } catch (error) {
    errors.push(`${file}:1 — invalid JSON, cannot scan (${error.message})`);
    continue;
  }
  const strings = collectMcpStrings(json);
  for (const value of strings) {
    // Manifest strings are single-line; report at line 1 (JSON has no line map).
    scanLine(file, 1, value, 'mcp');
  }
}

// --- Report ------------------------------------------------------------------

if (warnings.length > 0) {
  console.warn('Injection scan warnings (review, non-blocking):');
  for (const w of warnings) console.warn(`- ${w}`);
}

if (errors.length > 0) {
  console.error('Injection scan FAILED: blocking payloads detected:');
  for (const e of errors) console.error(`- ${e}`);
  console.error(
    'If a finding is an intentional example, add the file to ALLOWLIST_FILES ' +
      'or append `injection-allow:<label>` to the line.'
  );
  process.exit(1);
}

console.log(
  `Injection scan passed: ${textFiles.length} text files + ${scannedMcp.length} ` +
    `MCP manifest(s) scanned, 0 blocking findings, ${warnings.length} warning(s). ` +
    'Best-effort only — see docs/workflows/prompt-injection-handling.md.'
);
