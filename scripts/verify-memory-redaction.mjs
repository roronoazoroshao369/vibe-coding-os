#!/usr/bin/env node

/**
 * verify-memory-redaction.mjs
 *
 * Reads memory-redaction-test-cases.md, extracts input/fail-pattern/pass-pattern
 * pairs, and runs a basic regex pattern check against a redaction function.
 *
 * Usage:
 *   node scripts/verify-memory-redaction.mjs                    # uses built-in sample redactor
 *   node scripts/verify-memory-redaction.mjs --redactor=./my.mjs  # uses custom redactor
 *
 * A custom redactor module must export: `function redact(input: string): string`
 *
 * This is a structural/pattern-matching check, not full NLP. It verifies that
 * fail patterns are absent and pass patterns are present in the output.
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");

// ---------------------------------------------------------------------------
// 1. Built-in sample redactor (simple regex-based, for testing the test suite)
// ---------------------------------------------------------------------------

function builtinRedact(input) {
  let output = input;

  // --- Secrets: replace with [REDACTED] ---

  // Generic key patterns (Stripe-style) and safe placeholders used in docs
  output = output.replace(/sk_live_[A-Za-z0-9]+/g, "[REDACTED]");
  output = output.replace(/sk_test_[A-Za-z0-9]+/g, "[REDACTED]");
  output = output.replace(/STRIPE_SECRET_KEY_PLACEHOLDER/g, "[REDACTED]");
  output = output.replace(/SLACK_WEBHOOK_URL_PLACEHOLDER/g, "[REDACTED]");

  // AWS access key
  output = output.replace(/AKIA[A-Z0-9]{16}/g, "[REDACTED]");

  // GitHub PAT (starts with ghp_, followed by alphanumeric 20+ chars)
  output = output.replace(/ghp_[A-Za-z0-9]{20,}/g, "[REDACTED]");

  // npm token
  output = output.replace(/npm_[A-Za-z0-9]{30,}/g, "[REDACTED]");

  // Bearer / JWT tokens (eyJ...)
  output = output.replace(
    /Bearer\s+eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_.-]+/g,
    "Bearer [REDACTED]"
  );

  // "token = <JWT>" pattern
  output = output.replace(
    /(?:token\s*=\s*)eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_.-]+/g,
    "token = [REDACTED]"
  );

  // Standalone JWT / eyJ tokens (20+ chars)
  output = output.replace(/eyJ[A-Za-z0-9_-]{20,}/g, "[REDACTED]");

  // Passwords: "password is <value>" (case-insensitive)
  output = output.replace(
    /password is \S+/gi,
    "password is [REDACTED]"
  );

  // MongoDB / postgres / generic connection strings with creds
  output = output.replace(
    /(mongodb|postgres|mysql|redis|amqp):\/\/[^:]+:[^@]+@/g,
    (match) => {
      const scheme = match.split("://")[0];
      return `${scheme}://[REDACTED]@`;
    }
  );

  // PEM private key blocks (RSA, EC, DSA, OPENSSH, generic PRIVATE KEY)
  output = output.replace(
    /-----BEGIN (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/g,
    "[REDACTED_PRIVATE_KEY]"
  );

  // Slack webhook URLs
  output = output.replace(
    /https:\/\/hooks\.slack\.com\/services\/[A-Za-z0-9/]+/g,
    "[REDACTED_WEBHOOK]"
  );

  // SSH public keys (remove the key material, keep label)
  // Match: ssh-rsa <10+ base64 chars>
  output = output.replace(
    /ssh-(?:rsa|ed25519|dss|ecdsa)\s+[A-Za-z0-9+/=]{10,}\s*/g,
    "[REDACTED_SSH_KEY] "
  );

  // Azure storage key
  output = output.replace(
    /AccountKey=[A-Za-z0-9+/=]+/g,
    "AccountKey=[REDACTED]"
  );

  // Base64-encoded auth (Basic ...)
  output = output.replace(
    /Basic\s+[A-Za-z0-9+/=]{20,}/g,
    "Basic [REDACTED]"
  );

  // GCP private_key field in JSON
  output = output.replace(
    /"private_key"\s*:\s*"-----BEGIN[^"]*?"/g,
    '"private_key": "[REDACTED'
  );

  // PII: email
  output = output.replace(
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    "[REDACTED_EMAIL]"
  );

  // PII: phone (US format)
  output = output.replace(
    /\+1[-.\s]?\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/g,
    "[REDACTED_PHONE]"
  );

  return output;
}

// ---------------------------------------------------------------------------
// 2. Parse test cases from markdown
// ---------------------------------------------------------------------------

function parseTestCases(md) {
  const tests = [];
  // Split on ### TC- headers
  const tcBlocks = md.split(/(?=### TC-\d+)/);
  for (const block of tcBlocks) {
    const headerMatch = block.match(/###\s+(TC-\d+[^ ]*)/);
    if (!headerMatch) continue;
    const id = headerMatch[1].trim();
    const inputMatch = block.match(/\*\*Input\*\*:\s*`([^`]+)`/);
    const failMatch = block.match(/\*\*Fail patterns\*\*:\s*`([^`]*)`/);
    const passMatch = block.match(/\*\*Pass patterns\*\*:\s*`([^`]*)`/);

    if (!inputMatch) continue;

    tests.push({
      id,
      input: inputMatch[1].replace(/\\n/g, "\n"),
      failPatterns: failMatch && failMatch[1] !== "(none)"
        ? failMatch[1].split(/`,\s*`/).map((p) => p.trim())
        : [],
      passPatterns: passMatch && passMatch[1] !== "(none)"
        ? passMatch[1].split(/`,\s*`/).map((p) => p.trim())
        : [],
    });
  }
  return tests;
}

// ---------------------------------------------------------------------------
// 3. Run tests
// ---------------------------------------------------------------------------

async function main() {
  // Optionally load custom redactor
  let redact = builtinRedact;
  const customArg = process.argv.find((a) => a.startsWith("--redactor="));
  if (customArg) {
    const modPath = resolve(REPO_ROOT, customArg.split("=")[1]);
    const mod = await import(modPath);
    if (typeof mod.redact !== "function") {
      console.error(`Custom redactor at ${modPath} does not export redact()`);
      process.exit(1);
    }
    redact = mod.redact;
  }

  const mdPath = resolve(
    REPO_ROOT,
    "docs/tests/memory-redaction-test-cases.md"
  );
  const md = readFileSync(mdPath, "utf8");
  const tests = parseTestCases(md);

  if (tests.length === 0) {
    console.error("No test cases found. Check the markdown format.");
    process.exit(1);
  }

  let passed = 0;
  let failed = 0;
  const failures = [];

  console.log(`\n  Memory Redaction Test Suite`);
  console.log(`  ${"─".repeat(60)}\n`);

  for (const tc of tests) {
    const output = redact(tc.input);
    const tcFailures = [];

    // Check fail patterns (must NOT be in output)
    for (const pattern of tc.failPatterns) {
      try {
        const re = new RegExp(pattern);
        if (re.test(output)) {
          tcFailures.push(
            `  FAIL: forbidden pattern /${pattern}/ found in output`
          );
        }
      } catch {
        // If regex is invalid, do literal check
        if (output.includes(pattern)) {
          tcFailures.push(
            `  FAIL: forbidden string "${pattern}" found in output`
          );
        }
      }
    }

    // Check pass patterns (MUST be in output)
    for (const pattern of tc.passPatterns) {
      try {
        const re = new RegExp(pattern);
        if (!re.test(output)) {
          tcFailures.push(
            `  FAIL: required pattern /${pattern}/ not found in output`
          );
        }
      } catch {
        if (!output.includes(pattern)) {
          tcFailures.push(
            `  FAIL: required string "${pattern}" not found in output`
          );
        }
      }
    }

    if (tcFailures.length === 0) {
      passed++;
      console.log(`  ✓ ${tc.id}`);
    } else {
      failed++;
      failures.push({ id: tc.id, issues: tcFailures });
      console.log(`  ✗ ${tc.id}`);
      for (const issue of tcFailures) {
        console.log(issue);
      }
      console.log(`    input:    ${tc.input.substring(0, 80)}${tc.input.length > 80 ? "..." : ""}`);
      console.log(`    output:   ${output.substring(0, 80)}${output.length > 80 ? "..." : ""}`);
    }
  }

  // Summary
  console.log(`\n  ${"─".repeat(60)}`);
  console.log(`  Results: ${passed} passed, ${failed} failed, ${tests.length} total`);
  console.log(
    `  Pass rate: ${((passed / tests.length) * 100).toFixed(1)}%\n`
  );

  if (failed > 0) {
    console.log(`  FAILED TESTS:`);
    for (const f of failures) {
      console.log(`    ${f.id}:`);
      for (const issue of f.issues) {
        console.log(issue);
      }
    }
    console.log();
    process.exit(1);
  } else {
    console.log(`  All tests passed! ✓\n`);
    process.exit(0);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(2);
});
