#!/usr/bin/env node
// validate-quality-diff.mjs — scan git diff for quality anti-patterns
//
// Usage:
//   node scripts/validate-quality-diff.mjs            # diff HEAD vs working tree
//   node scripts/validate-quality-diff.mjs file.diff  # scan a diff file

import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

// ---------------------------------------------------------------------------
// Anti-pattern definitions
// ---------------------------------------------------------------------------

const CATEGORIES = {
  PLACEHOLDER:  { label: 'TODO / FIXME / HACK placeholder', severity: 'WARNING' },
  SILENT_CATCH: { label: 'Silent catch block',             severity: 'BLOCK' },
  FORMAT_CHURN: { label: 'Formatting churn (whitespace-only)', severity: 'WARNING' },
  LARGE_FUNC:   { label: 'Large code block addition (50+ lines)', severity: 'WARNING' },
  CRED_LEAK:    { label: 'Hardcoded credential pattern',    severity: 'BLOCK' },
};

/**
 * Each detector returns { category, file, line, detail }[] for a single added line.
 */
const detectors = [
  // --- Placeholder TODO/FIXME/HACK/XXX with no meaningful explanation ---
  function detectPlaceholder(_currentFile, lineNo, content) {
    const placeholderRe = /\b(TODO|FIXME|HACK|XXX)\b/i;
    if (!placeholderRe.test(content)) return [];
    // Heuristic: if the line after the keyword is basically empty / punctuation-only
    const after = content.slice(content.search(placeholderRe)).replace(/.*?(TODO|FIXME|HACK|XXX)\b/i, '').trim();
    // Allow if the explanation is >= 3 chars (e.g. "TODO: refactor this")
    if (after.length >= 3 && after !== '!!!' && after !== '...') return [];
    return [{ category: 'PLACEHOLDER', file: _currentFile, line: lineNo, detail: content.trim() }];
  },

  // --- Silent catch blocks ---
  function detectSilentCatch(_currentFile, lineNo, content) {
    const patterns = [
      /catch\s*\(\s*\w*\s*\)\s*\{\s*\}/,
      /catch\s*\{\s*\}/,
      /except\s*:\s*pass\b/i,
    ];
    for (const re of patterns) {
      if (re.test(content)) {
        return [{ category: 'SILENT_CATCH', file: _currentFile, line: lineNo, detail: content.trim() }];
      }
    }
    return [];
  },

  // --- Formatting churn: lines that only add/remove trailing whitespace ---
  function detectFormatChurn(_currentFile, lineNo, content, context) {
    if (!context.prevLine) return [];
    const prevRaw = context.prevLine;
    const currContent = content.startsWith('+') ? content.slice(1) : '';
    const prevContent = prevRaw.startsWith('-') ? prevRaw.slice(1) : prevRaw;
    if (currContent.trimEnd() === prevContent.trimEnd() && currContent !== prevContent) {
      return [{ category: 'FORMAT_CHURN', file: _currentFile, line: lineNo, detail: 'trailing whitespace change' }];
    }
    return [];
  },
];

// ---------------------------------------------------------------------------
// Diff parsing
// ---------------------------------------------------------------------------

function getDiff(source) {
  if (source) {
    try {
      return readFileSync(source, 'utf8');
    } catch (err) {
      console.error(`Failed to read diff file: ${source} — ${err.message}`);
      process.exit(1);
    }
  }
  try {
    return execSync('git diff HEAD', { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
  } catch {
    return '';
  }
}

function parseDiff(diffText) {
  const lines = diffText.split('\n');
  const findings = [];
  let currentFile = '<unknown>';
  let addedLineCount = 0;          // consecutive non-blank added lines (for LARGE_FUNC)
  let addedLinesStart = 0;         // line number in the file where the block started
  let newLineNo = 0;               // tracks the + side line number in the new file
  let prevDiffLine = '';

  function flushLargeBlock() {
    if (addedLineCount >= 50) {
      findings.push({
        category: 'LARGE_FUNC', file: currentFile, line: addedLinesStart,
        detail: `${addedLineCount} consecutive non-blank lines added`,
      });
    }
  }

  for (const raw of lines) {
    // Track which file we are in
    const fileMatch = raw.match(/^diff --git a\/(.+?) b\/(.+)/);
    if (fileMatch) {
      flushLargeBlock();
      addedLineCount = 0;
      currentFile = fileMatch[2];
      prevDiffLine = '';
      continue;
    }

    // Hunk header — resets line counter for the new file
    const hunkMatch = raw.match(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
    if (hunkMatch) {
      flushLargeBlock();
      addedLineCount = 0;
      newLineNo = Number(hunkMatch[1]);
      prevDiffLine = '';
      continue;
    }

    // Skip +++ line
    if (raw.startsWith('+++ ')) {
      prevDiffLine = '';
      continue;
    }

    // Context line (unchanged, starts with ' ')
    if (raw.startsWith(' ')) {
      flushLargeBlock();
      addedLineCount = 0;
      newLineNo++;
      prevDiffLine = raw;
      continue;
    }

    // Removed line (starts with '-')
    if (raw.startsWith('-')) {
      prevDiffLine = raw;
      continue;
    }

    // Added line (starts with '+')
    if (raw.startsWith('+')) {
      const content = raw.slice(1); // strip leading '+'
      const currentLineNo = newLineNo || 1;

      // Track consecutive non-blank additions
      if (content.trim().length > 0) {
        if (addedLineCount === 0) addedLinesStart = currentLineNo;
        addedLineCount++;
      } else {
        flushLargeBlock();
        addedLineCount = 0;
      }

      // Run detectors
      for (const detect of detectors) {
        const results = detect(currentFile, currentLineNo, raw, {
          prevLine: prevDiffLine,
        });
        findings.push(...results);
      }

      // Secret detection (in-line)
      const secretRe = /\b(api[_-]?key|password|secret|token)\s*=\s*['"].*['"]/i;
      if (secretRe.test(content)) {
        findings.push({
          category: 'CRED_LEAK', file: currentFile, line: currentLineNo,
          detail: content.trim(),
        });
      }

      newLineNo++;
    }
  }

  // Flush trailing large block
  flushLargeBlock();

  return findings;
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

function report(findings) {
  if (findings.length === 0) {
    console.log('No diff to audit.');
    process.exit(0);
  }

  const blocks = findings.filter((f) => CATEGORIES[f.category].severity === 'BLOCK');
  const warnings = findings.filter((f) => CATEGORIES[f.category].severity === 'WARNING');

  // Group by category
  const byCategory = {};
  for (const f of findings) {
    if (!byCategory[f.category]) byCategory[f.category] = [];
    byCategory[f.category].push(f);
  }

  console.log('=== Quality Diff Audit Report ===');
  console.log(`Total findings: ${findings.length}\n`);

  for (const [cat, items] of Object.entries(byCategory)) {
    const { label, severity } = CATEGORIES[cat];
    console.log(`[${severity}] ${label} (${items.length})`);
    for (const item of items) {
      console.log(`  ${item.file}:${item.line} — ${item.detail}`);
    }
    console.log('');
  }

  console.log(`Summary: ${blocks.length} blocker(s), ${warnings.length} warning(s)`);

  if (blocks.length > 0) {
    console.error('\nQuality diff audit FAILED — blockers found.');
    process.exit(1);
  }

  console.log('\nQuality diff audit PASSED (warnings only).');
  process.exit(0);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const diffSource = process.argv[2] || null;
const diffText = getDiff(diffSource);

if (!diffText || diffText.trim().length === 0) {
  console.log('No diff to audit.');
  process.exit(0);
}

const findings = parseDiff(diffText);
report(findings);
