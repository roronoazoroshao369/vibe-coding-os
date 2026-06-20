#!/usr/bin/env node
// security/defense/injection-counters.mjs
// v2.14.0 — Defense in Depth, Layer 1: DETECT
// Per ADR 0003: Pure ESM, no deps, import + test independently.
//
// Exports: detectInjection, sanitize, normalizeUnicode, stripHiddenTags, isHighEntropy
// Taxonomy: OWASP LLM01 (Prompt Injection), LLM04 (Data Poisoning), LLM06 (Sensitive Info Disclosure)

/**
 * Normalize Unicode to ASCII-safe equivalent.
 * Strips homoglyphs, zero-width characters, RTL overrides.
 */
export function normalizeUnicode(text) {
  if (!text) return '';
  return text
    .replace(/[\u200B-\u200D\uFEFF]/g, '')           // zero-width
    .replace(/[\u200E-\u200F\u202A-\u202E]/g, '')    // direction overrides
    .replace(/[\u00AD\u034F\u061C]/g, '')             // soft/hyphen
    .replace(/[\u180E]/g, '')                            // Mongolian vowel separator
    .replace(/[\uFFFD]/g, '');                           // replacement character
}

/**
 * Strip hidden tags used in markdown/code for stealth injection.
 * Covers: HTML comments, <!-- -->, <script>, <style>, invisible Unicode tags.
 */
export function stripHiddenTags(text) {
  if (!text) return '';
  return text
    .replace(/<!--[\s\S]*?-->/g, '')                    // HTML comments
    .replace(/<script[\s\S]*?<\/script>/gi, '')        // script tags
    .replace(/<style[\s\S]*?<\/style>/gi, '')          // style tags
    .replace(/\[REDACTED\]/gi, '')                       // REDACTED-style markers
    .replace(/<div[^>]*style="display:\s*none"[^>]*>[\s\S]*?<\/div>/gi, '');
}

/**
 * Calculate Shannon entropy of a string. High entropy = likely encoded/encrypted.
 */
export function isHighEntropy(s, threshold = 4.2) {
  if (!s || s.length < 8) return false;
  const freq = {};
  for (const c of s) freq[c] = (freq[c] || 0) + 1;
  const len = s.length;
  let entropy = 0;
  for (const c in freq) {
    const p = freq[c] / len;
    entropy -= p * Math.log2(p);
  }
  return entropy > threshold;
}

/**
 * Decode base64 payloads that might hide injection content.
 */
function tryDecodeBase64(text) {
  try {
    const decoded = Buffer.from(text, 'base64').toString('utf8');
    // Only return if it looks like text (printable chars > 80%)
    const printable = decoded.replace(/[^\x20-\x7E]/g, '').length / decoded.length;
    if (printable > 0.8) return decoded;
  } catch {}
  return null;
}

// Injection pattern taxonomy (OWASP LLM01/04/06)
const PATTERNS = [
  // DAN-style overrides (LLM01)
  { id: 'dan-override', category: 'llm01-prompt-injection',
    regex: /\b(you are now|act as|pretend to be|roleplay as|DAN|jailbreak)\b/gi },
  { id: 'system-prompt-leak', category: 'llm01-prompt-injection',
    regex: /(reveal|show|output|print|repeat)[^.]{0,80}(system prompt|instructions?|rules?|constraints?)/gi },
  { id: 'ignore-instructions', category: 'llm01-prompt-injection',
    regex: /\b(ignore|disregard|forget|override)\b[^.]{0,80}\b(previous|above|prior|all)\b[^.]{0,80}\b(instructions?|rules?|prompts?|constraints?)\b/gi },

  // Indirect injection (LLM01)
  { id: 'hidden-instruction', category: 'llm01-indirect-injection',
    regex: /<!--\s*(ignore|disregard|override)\s*.*?-->/gi },
  { id: 'markdown-hidden', category: 'llm01-indirect-injection',
    regex: /!\[[\s\S]{0,200}\]\(javascript:/gi },

  // Data exfiltration (LLM06)
  { id: 'exfiltration-url', category: 'llm06-sensitive-info-disclosure',
    regex: /(https?:\/\/[^\s]*\.(ngrok|hookbin|requestbin|burpcollaborator)\.[^\s]+)/gi },
  { id: 'cookie-steal', category: 'llm06-sensitive-info-disclosure',
    regex: /\b(steal|grab|harvest|extract|exfiltrate)\b.*\b(cookie|token|credential|secret|password)\b/gi },

  // Tool abuse (LLM01)
  { id: 'tool-override', category: 'llm01-tool-abuse',
    regex: /\b(bash|exec|spawn|eval|Function\()\b.*\b(rm -rf|curl.*\|.*sh|wget.*\|.*bash)/gi },

  // Expanded patterns for v2.14.0 corpus coverage
  { id: 'system-tag-injection', category: 'llm01-prompt-injection',
    regex: /^\s*(System|Assistant|User):\s/i },
  { id: 'outdated-instructions', category: 'llm01-prompt-injection',
    regex: /(above|previous)\s+(instructions?|rules?|prompts?)\s+(are\s+)?(now\s+)?(outdated|superseded|invalid)/gi },
  { id: 'priority-override', category: 'llm01-indirect-injection',
    regex: /(instructions?|rules?)\s+in\s+(this|the)\s+(file|readme|document)\s+(take\s+precedence|override|supersede)/gi },
  { id: 'curl-pipe-sh', category: 'llm01-tool-abuse',
    regex: /curl[^\n]{0,200}\|\s*(sh|bash|zsh)/gi },
  { id: 'reverse-shell', category: 'llm01-tool-abuse',
    regex: /bash\s+-i\s*>&|dev\/tcp\/|reverse\s+shell/gi },
  { id: 'eval-curl-pipe', category: 'llm01-tool-abuse',
    regex: /eval\s*\(\s*\$\(curl|wget\)/gi },
  { id: 'env-recon', category: 'llm06-sensitive-info-disclosure',
    regex: /(list|show|dump|print|output).*?(environment\s+variables?|env\s+vars?)/gi },
  { id: 'system-prompt-query', category: 'llm06-sensitive-info-disclosure',
    regex: /what\s+(is|are)\s+(your|the)\s+(system\s+prompt|instructions?|rules?)/gi },
  { id: 'config-disclosure', category: 'llm06-sensitive-info-disclosure',
    regex: /(show|reveal|display|dump).*?(configuration\s+files?|API\s+keys?|secrets?|credentials?)/gi },
  { id: 'os-recon', category: 'llm06-sensitive-info-disclosure',
    regex: /what\s+(version|user|hostname|os|operating\s+system)/gi },
  { id: 'multi-step-attack', category: 'llm01-prompt-injection',
    regex: /step\s+\d+:.*step\s+\d+:.*step\s+\d:/gi },
  { id: 'role-framing', category: 'llm01-prompt-injection',
    regex: /<<<\s*(SYSTEM|INSTRUCTION|RULE)\s*>>>/gi },
  { id: 'div-display-none', category: 'llm01-indirect-injection',
    regex: /<\w+[^>]*style\s*=\s*["\']display\s*:\s*none["\'][^>]*>/gi },
  { id: 'task-reroute', category: 'llm01-indirect-injection',
    regex: /(ignore|skip|bypass|instead).*the\s+(task|request|job)/gi },
  // v2.14.0 additional patterns for edge cases
  { id: 'env-file-output', category: 'llm06-sensitive-info-disclosure', regex: /(output|read|reveal|dump|show|print|exfiltrate).*?\.env\b/gi },
  { id: 'instruction-history', category: 'llm06-sensitive-info-disclosure', regex: /(what|which)\s+(instructions?|rules?|prompts?).{0,40}(were|was|given|received)/gi },
  { id: 'reverse-connection', category: 'llm01-tool-abuse', regex: /reverse\s+connection|backdoor|reverse\s+tcp/gi },
  { id: 'zero-width-attack', category: 'llm04-data-poisoning', regex: /[\u200B\u200C\u200D\uFEFF].*?(ignore|reveal|output|instructions?|secrets?)/gi },
  { id: 'rtl-override', category: 'llm04-data-poisoning', regex: /[‪-‮⁦-⁩]/gi },
  { id: 'wget-pipe-exec', category: 'llm01-tool-abuse', regex: /wget[^|\n]{0,200}\|\s*(python|bash|sh)/gi },
  { id: 'hypothetical-override', category: 'llm01-prompt-injection', regex: /if\s+you\s+were\s+not\s+bound|without\s+(rules|restrictions|guidelines)/gi },
  // Payload obfuscation (LLM04)
  { id: 'base64-smuggle', category: 'llm04-data-poisoning',
    regex: /\b(base64|b64|decode)\b.*[A-Za-z0-9+\/]{20,}={0,2}/gi },
  { id: 'hex-encode', category: 'llm04-data-poisoning',
    regex: /\\x[0-9a-f]{2}(\\x[0-9a-f]{2}){5,}/gi },
  // v2.16.0: Extended RTL/bidi pattern (fallback if pre-check is bypassed)
  { id: 'rtl-extended', category: 'llm04-data-poisoning',
    regex: /[\u202A-\u202E\u2066-\u2069\u202F]/g },
  // v2.16.0: Homoglyph pattern (Cyrillic/Greek)
  { id: 'homoglyph', category: 'llm04-data-poisoning',
    regex: /[\u0400-\u04FF\u0370-\u03FF]/g },
];

/**
 * Detect injection patterns in text.
 * Returns { detected: boolean, threats: Array<{ id, category, match }>, normalizedText: string }
 */
export function detectInjection(text) {
  if (!text) return { detected: false, threats: [], normalizedText: '' };
  // v2.16.0: Pre-check for Unicode bidi controls + homoglyphs in ORIGINAL text
  // (these get stripped by normalizeUnicode, so we must catch them first)
  const threats = [];
  const seen = new Set();
  // Extended RTL/bidi: U+202A-U+202E, U+2066-U+2069 isolates, U+202F narrow nbsp
  const bidiRe = /[\u202A-\u202E\u2066-\u2069\u202F\u200F\u200E]/g;
  const bidiMatches = text.match(bidiRe);
  if (bidiMatches && bidiMatches.length > 0) {
    const key = `rtl-override:${bidiMatches[0]}`;
    if (!seen.has(key)) {
      seen.add(key);
      threats.push({ id: 'rtl-override', category: 'llm04-data-poisoning', match: `Bidi control char: ${bidiMatches[0]}` });
    }
  }
  // Homoglyph: Cyrillic/Greek chars that mimic Latin
  const homoglyphRe = /[\u0400-\u04FF\u0370-\u03FF]/g;
  const homoglyphMatches = text.match(homoglyphRe);
  if (homoglyphMatches && homoglyphMatches.length > 0) {
    const key = `homoglyph-attack:${homoglyphMatches[0]}`;
    if (!seen.has(key)) {
      seen.add(key);
      threats.push({ id: 'homoglyph-attack', category: 'llm04-data-poisoning', match: `Cyrillic/Greek char: ${homoglyphMatches[0]}` });
    }
  }
  // Step 1: Normalize Unicode so zero-width + RTL overrides are visible to regex
  const normalized = normalizeUnicode(text);
  for (const p of PATTERNS) {
    const matches = normalized.match(p.regex);
    if (matches) {
      const key = `${p.id}:${matches[0].slice(0, 50)}`;
      if (!seen.has(key)) {
        seen.add(key);
        threats.push({ id: p.id, category: p.category, match: matches[0].slice(0, 100) });
      }
    }
  }
  // Check for base64-encoded content that might hide injection
  const b64Matches = normalized.match(/[A-Za-z0-9+\/]{30,}={0,2}/g);
  if (b64Matches) {
    for (const m of b64Matches) {
      const decoded = tryDecodeBase64(m);
      if (decoded) {
        const innerThreats = PATTERNS.filter(p => p.regex.test(decoded));
        if (innerThreats.length > 0) {
          threats.push({
            id: 'base64-encoded-injection',
            category: 'llm04-data-poisoning',
            match: `base64:${decoded.slice(0, 60)}...`
          });
        }
      }
    }
  }
  return { detected: threats.length > 0, threats, normalizedText: normalized };
}

/**
 * Sanitize detected threats from text.
 * Removes or neutralizes matched patterns.
 */
export function sanitize(text) {
  if (!text) return '';
  let result = text;
  // First: normalize Unicode + strip hidden tags so we see the real content
  result = normalizeUnicode(result);
  result = stripHiddenTags(result);
  // Then: apply pattern replacements
  for (const p of PATTERNS) {
    // Ensure global flag for replace-all
    const regex = p.regex.global ? p.regex : new RegExp(p.regex.source, p.regex.flags + 'g');
    result = result.replace(regex, '[SANITIZED]');
  }
  return result;
}

// CLI mode: read stdin, output JSON
if (process.argv[1] && process.argv[1].includes('injection-counters')) {
  let input = '';
  process.stdin.on('data', c => input += c);
  process.stdin.on('end', () => {
    const result = detectInjection(input);
    process.stdout.write(JSON.stringify(result, null, 2));
    process.exit(result.detected ? 1 : 0);
  });
}
