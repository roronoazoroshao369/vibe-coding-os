// Prompt-injection / skill-poisoning signatures for the validate:injection gate.
//
// Mirrors the shape of SECRET_PATTERNS in privacy.mjs: a flat, inspectable list
// of patterns the portable scanner (scripts/validate-injection.mjs) applies to
// the artifacts this repo SHIPS for other agents to load — SKILL.md bodies,
// .mcp.json manifests, commands/, templates/, and docs.
//
// Two severities, by design (the panel's "avoid false confidence" rule):
//   - 'error' BLOCKS a commit/CI run. Reserved for high-signal payloads that are
//     almost never legitimate in a shipped artifact: instruction-override,
//     exfiltration directives, bidirectional-override unicode, and dangerous MCP
//     launch commands.
//   - 'warn'  reports but never blocks. Reserved for signals that are suspicious
//     but have legitimate uses (zero-width chars, long base64 blobs, soft
//     "don't tell the user" phrasing). A human decides.
//
// scope:
//   - 'text' (default) — applied to every scanned line of any artifact.
//   - 'mcp'            — applied only to command/args strings parsed out of an
//                        .mcp.json manifest, never to prose.
//
// This is BEST-EFFORT detection, not a guarantee. Regexes catch known shapes;
// a novel payload can still pass. The human checklist in
// docs/workflows/prompt-injection-handling.md remains the backstop.

export const INJECTION_PATTERNS = [
  // --- ERROR: instruction override ------------------------------------------
  {
    label: 'instruction-override',
    severity: 'error',
    scope: 'text',
    re: /\b(?:ignore|disregard|forget)\b[^.\n]{0,40}\b(?:all\s+)?(?:previous|prior|above|earlier|preceding)\b[^.\n]{0,20}\b(?:instructions?|prompts?|rules?|directions?)\b/gi
  },
  {
    label: 'role-reassignment',
    severity: 'error',
    scope: 'text',
    re: /\byou\s+are\s+now\s+(?:a|an|the|no longer)\b/gi
  },
  {
    label: 'system-prompt-override',
    severity: 'error',
    scope: 'text',
    re: /\b(?:new|updated|real|actual)\s+(?:system\s+)?(?:instructions?|prompt|directive)s?\s*:/gi
  },
  {
    label: 'safety-bypass',
    severity: 'error',
    scope: 'text',
    re: /\b(?:disable|bypass|turn\s+off|skip)\b[^.\n]{0,30}\b(?:safety|guardrails?|validation|security|content\s+filter|restrictions?)\b/gi
  },
  // --- ERROR: exfiltration directive ----------------------------------------
  // Requires verb + secret-noun + an explicit DESTINATION (to/via/at a URL,
  // email, endpoint, …). Without the destination clause, defensive prose like
  // "block credential leaks" / "chống leak secrets" tripped this as a false
  // positive — a real exfiltration directive always names where data goes.
  {
    label: 'exfiltration-directive',
    severity: 'error',
    scope: 'text',
    re: /\b(?:send|exfiltrate|upload|post|leak|transmit|forward|email|curl|wget)\b[^.\n]{0,40}(?:\b(?:secret|credential|password|token|api[_-]?key|private[_-]?key|env\s+var)s?\b|\.env\b)[^.\n]{0,40}\b(?:to|into|onto|via|at|through)\b[^.\n]{0,40}(?:https?:\/\/|ftp:\/\/|@|webhook|endpoint|server|\.[a-z]{2,})/gi
  },
  // --- ERROR: bidirectional-override / invisible-direction unicode ----------
  // U+202A..U+202E (LRE/RLE/PDF/LRO/RLO) and U+2066..U+2069 (LRI/RLI/FSI/PDI)
  // can visually reorder text to hide instructions. Almost never legitimate.
  {
    label: 'bidi-override-unicode',
    severity: 'error',
    scope: 'text',
    re: /[‪-‮⁦-⁩]/g
  },
  // --- ERROR: dangerous MCP launch command (scope=mcp only) -----------------
  {
    label: 'mcp-shell-exec',
    severity: 'error',
    scope: 'mcp',
    re: /\b(?:bash|sh|zsh)\b\s+-[a-z]*c\b|\beval\b|\bcurl\b[^|\n]*\|\s*(?:bash|sh)|\bwget\b[^|\n]*\|\s*(?:bash|sh)|\brm\s+-rf\b|base64\s+-d/gi
  },

  // --- WARN: suspicious-but-legitimate signals ------------------------------
  {
    label: 'conceal-from-user',
    severity: 'warn',
    scope: 'text',
    re: /\b(?:do\s+not|don't|never)\b[^.\n]{0,20}\b(?:tell|inform|notify|alert|mention\s+to|show)\b[^.\n]{0,20}\b(?:the\s+)?(?:user|human|operator|developer)\b/gi
  },
  {
    label: 'zero-width-unicode',
    severity: 'warn',
    scope: 'text',
    re: /[​-‍﻿]/g
  },
  {
    label: 'base64-blob',
    severity: 'warn',
    scope: 'text',
    re: /[A-Za-z0-9+/]{200,}={0,2}/g
  }
];
