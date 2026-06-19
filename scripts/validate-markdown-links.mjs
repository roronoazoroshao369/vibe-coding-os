#!/usr/bin/env node
// validate-markdown-links.mjs — validate relative file links in all .md files

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const args = process.argv.slice(2);

if (args.includes('-h') || args.includes('--help')) {
  console.log(`validate-markdown-links — verify relative markdown links resolve

Usage:
  node scripts/validate-markdown-links.mjs

Walks all .md files under the repo root (excluding node_modules), extracts
markdown links [text](url), and verifies that relative file paths exist.

Ignores http/https URLs and anchor-only links (#fragment).

Exit 0 if all links resolve, 1 if any are broken.`);
  process.exit(0);
}

function collectMarkdownFiles(dir) {
  const files = [];
  let entries;
  try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return files; }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'website') continue;
    if (entry.isDirectory()) {
      files.push(...collectMarkdownFiles(full));
    } else if (entry.name.endsWith('.md')) {
      files.push(full);
    }
  }
  return files;
}

// Extract [text](url) links, excluding images ![text](url)
function extractLinks(content) {
  const links = [];
  const lines = content.split('\n');

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];

    // Regex to find [text](url) but NOT ![text](url)
    const linkRe = /(?<!!)\[([^\]]*)\]\(([^)]+)\)/g;
    let match;
    while ((match = linkRe.exec(line)) !== null) {
      links.push({ text: match[1], url: match[2], line: lineIdx + 1 });
    }
  }

  return links;
}

const files = collectMarkdownFiles(ROOT);
let totalChecked = 0;
let totalBroken = 0;
const brokenLinks = [];

for (const filePath of files) {
  const relPath = filePath.replace(ROOT + '/', '');
  const content = readFileSync(filePath, 'utf8');
  const links = extractLinks(content);

  for (const link of links) {
    const url = link.url;

    // Skip http/https, mailto, data URIs
    if (/^(https?|mailto|data):/.test(url)) continue;

    // Strip anchor (#fragment)
    const [pathPart] = url.split('#');
    if (!pathPart) continue; // anchor-only link like #heading

    // Skip empty path
    if (!pathPart.trim()) continue;

    totalChecked++;

    // Decode percent-encoded characters (e.g. %20 -> space)
    let decoded;
    try {
      decoded = decodeURIComponent(pathPart);
    } catch {
      decoded = pathPart;
    }

    // Resolve relative to the directory of the markdown file
    const fileDir = dirname(filePath);
    const resolved = resolve(fileDir, decoded);

    // Check if the path exists (as file or directory)
    let exists = false;
    try {
      const st = statSync(resolved);
      exists = st.isFile() || st.isDirectory();
    } catch {
      exists = false;
    }

    if (!exists) {
      totalBroken++;
      brokenLinks.push(`${relPath}:${link.line}: [${link.text}](${url})`);
    }
  }
}

console.log(`Markdown link check: ${totalChecked} relative links in ${files.length} files`);

if (totalBroken > 0) {
  console.error(`❌ ${totalBroken} broken link(s):`);
  for (const broken of brokenLinks) {
    console.error(`   ${broken}`);
  }
  process.exit(1);
}

console.log('✅ All relative markdown links resolve');
