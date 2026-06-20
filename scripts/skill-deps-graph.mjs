#!/usr/bin/env node
// scripts/skill-deps-graph.mjs
// Wave B1 Move 4 — Build a dependency graph for skills based on cross-references.
// Outputs JSON graph or Mermaid diagram.

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = process.cwd();
const SKILLS_DIR = join(ROOT, 'skills');

// Find all SKILL.md files
function findSkillFiles(dir) {
  const results = [];
  if (!existsSync(dir)) return results;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      results.push(...findSkillFiles(full));
    } else if (entry === 'SKILL.md') {
      results.push(full);
    }
  }
  return results;
}

// Extract skill name from YAML frontmatter
function getSkillName(content) {
  const match = content.match(/^---\s*\nname:\s*([^\n]+)/);
  return match ? match[1].trim() : null;
}

// Extract cross-reference paths from content
function extractRefs(content) {
  const refs = [];
  // Pattern: skills/<category>/<name>/SKILL.md
  const skillRefs = content.matchAll(/(?:skills|templates|commands|docs)\/[a-z0-9_-]+(?:\/[a-z0-9_-]+)*(?:\/SKILL\.md|\.md)?/gi);
  for (const m of skillRefs) {
    refs.push(m[0].replace(/\.md$|\/SKILL\.md$/, ''));
  }
  return [...new Set(refs)];
}

// Build the dependency graph
function buildGraph() {
  const files = findSkillFiles(SKILLS_DIR);
  const nodes = [];
  const edges = [];
  const skillByName = new Map();

  // First pass: index skills by name
  for (const file of files) {
    const content = readFileSync(file, 'utf8');
    const name = getSkillName(content);
    if (!name) continue;
    const relPath = relative(ROOT, file);
    skillByName.set(name, relPath);
    nodes.push({
      id: name,
      path: relPath,
      category: relative(SKILLS_DIR, file).split('/')[0]
    });
  }

  // Second pass: extract refs and build edges
  for (const file of files) {
    const content = readFileSync(file, 'utf8');
    const name = getSkillName(content);
    if (!name) continue;

    const refs = extractRefs(content);
    for (const ref of refs) {
      // Try to map ref to a known skill
      const refName = ref.split('/').pop().replace(/-/g, '-');
      // Match by path pattern
      for (const [sName, sPath] of skillByName.entries()) {
        if (sPath.includes(ref) || ref.includes(sPath.replace('/SKILL.md', ''))) {
          if (sName !== name) {
            edges.push({ from: name, to: sName, via: ref });
          }
          break;
        }
      }
    }
  }

  // Deduplicate edges
  const seen = new Set();
  const dedupEdges = edges.filter(e => {
    const key = `${e.from}->${e.to}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return { nodes, edges: dedupEdges };
}

const format = process.argv[2] || 'json';

const graph = buildGraph();

if (format === 'json') {
  console.log(JSON.stringify(graph, null, 2));
} else if (format === 'mermaid') {
  console.log('```mermaid');
  console.log('graph TD');
  for (const node of graph.nodes) {
    console.log(`  ${node.id}["${node.id}"]`);
  }
  for (const edge of graph.edges) {
    console.log(`  ${edge.from} --> ${edge.to}`);
  }
  console.log('```');
} else if (format === 'stats') {
  console.log(`Nodes: ${graph.nodes.length}`);
  console.log(`Edges: ${graph.edges.length}`);
  // Find most-referenced skills
  const inDegree = new Map();
  for (const edge of graph.edges) {
    inDegree.set(edge.to, (inDegree.get(edge.to) || 0) + 1);
  }
  console.log('\nMost referenced skills:');
  [...inDegree.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10).forEach(([k, v]) => {
    console.log(`  ${k}: ${v} incoming refs`);
  });
  // Find orphans
  const referenced = new Set(graph.edges.map(e => e.to));
  const orphans = graph.nodes.filter(n => !referenced.has(n.id));
  console.log(`\nOrphan skills (no incoming refs): ${orphans.length}`);
  for (const o of orphans.slice(0, 10)) {
    console.log(`  ${o.id} (${o.path})`);
  }
} else {
  console.error(`Unknown format: ${format}. Use json, mermaid, or stats.`);
  process.exit(1);
}
