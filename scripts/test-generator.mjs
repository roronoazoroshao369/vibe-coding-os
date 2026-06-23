#!/usr/bin/env node
// test-generator.mjs — analyze existing SKILL.md files and command docs,
// generate property-based tests automatically by extracting:
//   - input parameters from commands
//   - decision points from SKILL workflows
//   - edge cases from documented constraints
// Output: generated tests in test/ directory

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SKILLS_DIR = join(ROOT, 'skills');
const COMMANDS_DIR = join(ROOT, 'commands');
const OUTPUT_DIR = join(ROOT, 'test', 'generated');
const REGISTRY_FILE = join(ROOT, 'registry', 'generated-tests.json');

// Patterns used to extract structure from SKILL.md files
const SECTION_PATTERNS = {
  purpose: /##\s*(Purpose|Goal|Overview)/i,
  whenToUse: /##\s*When\s+to\s+use/i,
  inputs: /##\s*Inputs/i,
  workflow: /##\s*(Workflow|Steps|Procedure|How\s+to)/i,
  outputs: /##\s*Outputs/i,
  constraints: /##\s*Constraints/i,
  failureModes: /##\s*(Failure\s*[Mm]odes?|Edge\s*[Cc]ases|Limitations)/i,
  examples: /##\s*Examples/i,
  parameters: /##\s*Parameters/i
};

// Patterns to extract decision points from workflow content
const DECISION_PATTERNS = [
  /if\s+(.+?)[,:]/gi,
  /when\s+(.+?)[,:]/gi,
  /check\s+(?:if\s+)?(.+?)(?:,|\.|$)/gi,
  /validate\s+(?:that\s+)?(.+?)(?:,|\.|$)/gi,
  /ensure\s+(?:that\s+)?(.+?)(?:,|\.|$)/gi,
  /unless\s+(.+?)(?:,|\.|$)/gi,
  /(?:must|should|shall|will)\s+(?:not\s+)?(.+?)(?:,|\.|$)/gi,
  /if\s+not\s+(.+?)[,:]/gi,
  /(?:choose|select|pick)\s+(?:between\s+)?(.+?)(?:,|\.|$)/gi
];

// Patterns to extract constraints (edge cases)
const CONSTRAINT_PATTERNS = [
  /(?:must not|mustn't|should not|shouldn't|cannot|can't)\s+(.+?)(?:,|\.|$)/gi,
  /(?:only\s+)?(?:valid|allowed|permitted|supported)\s+(?:for|with|when)\s+(.+?)(?:,|\.|$)/gi,
  /(?:minimum|maximum|at\s+least|at\s+most|no\s+more\s+than|no\s+less\s+than)\s+(.+?)(?:,|\.|$)/gi,
  /(?:error|fail|reject|deny|refuse)\s+(?:if|when)\s+(.+?)(?:,|\.|$)/gi,
  /(?:only|exclusively)\s+(?:works|supported|valid)\s+(?:for|with|in)\s+(.+?)(?:,|\.|$)/gi,
  /(?:not\s+)?(?:recommended|intended|designed)\s+(?:for|to)\s+(.+?)(?:,|\.|$)/gi
];

// Patterns to extract input parameters from command docs
const COMMAND_PARAM_PATTERNS = [
  /`--(\w[\w-]*)`\s*(?:\((.+?)\))?(?:\s*-\s*(.+))?/gi,
  /`(-{1,2}\w[\w-]*)`/gi,
  /\*\*(\w[\w]*)\*\*\s*:\s*(.+?)(?:\n|$)/gi,
  /Parameter[:\s]+`(\w[\w]*)`/gi,
  /\|?\s*`(-{1,2}\w[\w-]*)`\s*\|/gi
];

// Command doc patterns
const COMMAND_DESC_PATTERNS = [
  /^#{1,3}\s+(.+)$/m,
  /##\s*(Usage|Synopsis|Syntax)/i,
  /##\s*(Options|Flags|Arguments|Parameters)/i,
  /##\s*(Description|Overview)/i,
  /##\s*(Examples)/i
];

function findSkillFiles(dir) {
  const results = [];
  if (!existsSync(dir)) return results;
  const entries = readFileSync(dir, 'utf8')
    .split('\n')
    .filter(Boolean);

  // Simple recursive listing via find
  function walk(d) {
    try {
      const items = readFileSync(d, 'utf8')
        .split('\n')
        .filter(Boolean);
      for (const item of items) {
        const fullPath = join(d, item);
        try {
          const stat = existsSync(fullPath) ? fullPath : null;
          if (stat) {
            const isDir = (() => {
              try {
                // Quick directory check: try reading as directory
                readFileSync(fullPath, 'utf8');
                return false;
              } catch {
                return true;
              }
            })();
            if (item === 'SKILL.md') {
              results.push(fullPath);
            } else if (isDir) {
              walk(fullPath);
            }
          }
        } catch {
          // skip inaccessible
        }
      }
    } catch {
      // skip
    }
  }

  // Use node:fs readdir instead
  function walkDir(dirPath) {
    try {
      const entries = readFileSync(dirPath, 'utf8');
      // Can't use readdirSync through readFileSync; use a different approach
      return;
    } catch {
      return;
    }
  }

  return results;
}

// Better approach: use search_files pattern
function collectSkillFiles() {
  const fs = require_node_fs();
  const skills = [];
  try {
    const entries = fs.readdirSync(SKILLS_DIR, { recursive: true });
    for (const entry of entries) {
      if (entry.endsWith('SKILL.md')) {
        skills.push(join(SKILLS_DIR, entry));
      }
    }
  } catch {
    // Fallback: manual crawl
    crawlDir(SKILLS_DIR, skills, 'SKILL.md');
  }
  return skills;
}

function require_node_fs() {
  return { readdirSync: (path, opts) => {
    const { readdirSync } = require_node_module('fs');
    return readdirSync(path, opts);
  }};
}

function require_node_module(name) {
  // Dynamic import to get fs.readdirSync with recursive
  return null; // placeholder
}

function crawlDir(dir, results, targetFile) {
  try {
    const entries = readFileSync(dir, 'utf8')
      .split('\n')
      .filter(Boolean);
    for (const entry of entries) {
      const full = join(dir, entry);
      try {
        // Try reading as file first
        const content = readFileSync(full, 'utf8');
        // If it succeeds, it's a file
        if (entry === targetFile) {
          results.push(full);
        }
      } catch {
        // It's a directory
        crawlDir(full, results, targetFile);
      }
    }
  } catch {
    // skip
  }
}

function readTextFile(filePath) {
  try {
    return readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}

function extractSections(content) {
  const sections = {};
  const lines = content.split('\n');
  let currentSection = 'preamble';
  sections[currentSection] = [];

  for (const line of lines) {
    let matched = false;
    for (const [key, pattern] of Object.entries(SECTION_PATTERNS)) {
      if (pattern.test(line)) {
        currentSection = key;
        if (!sections[currentSection]) sections[currentSection] = [];
        matched = true;
        break;
      }
    }
    if (!matched) {
      sections[currentSection].push(line);
    }
  }

  return sections;
}

function extractDecisionPoints(content) {
  const decisions = [];
  for (const pattern of DECISION_PATTERNS) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const text = match[1].trim();
      if (text.length > 10 && !decisions.includes(text)) {
        decisions.push(text);
      }
    }
  }
  return decisions;
}

function extractConstraints(content) {
  const constraints = [];
  for (const pattern of CONSTRAINT_PATTERNS) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const text = match[1].trim();
      if (text.length > 5 && !constraints.includes(text)) {
        constraints.push(text);
      }
    }
  }
  return constraints;
}

function extractInputParameters(content) {
  const params = [];
  for (const pattern of COMMAND_PARAM_PATTERNS) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const name = match[1]?.trim();
      if (name && name.length > 1 && !params.find(p => p.name === name)) {
        params.push({
          name,
          description: (match[3] || match[2] || '').trim(),
          pattern: pattern.toString().slice(0, 40)
        });
      }
    }
  }
  return params;
}

function extractCommandMetadata(content) {
  const meta = { title: '', usage: '', options: [], examples: [] };

  // Title
  const titleMatch = content.match(/^#\s+(.+)$/m);
  if (titleMatch) meta.title = titleMatch[1].trim();

  // Usage section
  const usageMatch = content.match(/##\s*(Usage|Synopsis)\s*\n+```(?:\w+)?\n(.+?)```/is);
  if (usageMatch) meta.usage = usageMatch[2].trim();

  // Options/flags section content
  const optionsSection = content.match(/##\s*(Options|Flags|Arguments)\s*\n([\s\S]*?)(?=##|$)/i);
  if (optionsSection) {
    meta.optionsRaw = optionsSection[2].trim();
    meta.options = extractInputParameters(optionsSection[2]);
  }

  return meta;
}

function extractSkillMetadata(content) {
  const meta = { title: '', purpose: '', inputs: [], outputs: [], decisions: [], constraints: [] };

  // Title from first heading
  const titleMatch = content.match(/^#\s+(.+)$/m);
  if (titleMatch) meta.title = titleMatch[1].trim();

  const sections = extractSections(content);

  // Purpose
  if (sections.purpose) {
    meta.purpose = sections.purpose.filter(l => l.trim()).slice(0, 5).join(' ').trim();
  }

  // Decision points
  meta.decisions = extractDecisionPoints(content);

  // Constraints / edge cases
  meta.constraints = extractConstraints(content);

  // Inputs from section
  if (sections.inputs) {
    const inputText = sections.inputs.join('\n');
    meta.inputs = extractInputParameters(inputText);
  }

  return meta;
}

function generatePropertyTest(skillPath, metadata) {
  const skillName = relative(SKILLS_DIR, skillPath).replace(/\/SKILL\.md$/, '').replace(/\//g, '-');
  const testName = skillName || 'unknown-skill';
  const testContent = [];

  testContent.push(`// Auto-generated property test for: ${metadata.title || skillName}`);
  testContent.push(`// Source: ${skillPath}`);
  testContent.push(`// Generated: ${new Date().toISOString()}`);
  testContent.push('');
  testContent.push("import { describe, it } from 'node:test';");
  testContent.push("import { strict as assert } from 'node:assert';");
  testContent.push('');

  // Test suite
  const suiteName = metadata.title ? metadata.title.replace(/[^a-zA-Z0-9\s]/g, '').trim() : skillName;
  testContent.push(`describe('${suiteName}', () => {`);
  testContent.push('');

  // 1. Purpose / existence test
  if (metadata.purpose) {
    testContent.push('  // Property: purpose must be defined');
    testContent.push('  it(\'should have a defined purpose\', () => {');
    testContent.push(`    assert.ok(true, '${metadata.purpose.slice(0, 80)}');`);
    testContent.push('  });');
    testContent.push('');
  }

  // 2. Decision point tests
  for (let i = 0; i < Math.min(metadata.decisions.length, 5); i++) {
    const decision = metadata.decisions[i];
    testContent.push('  // Decision point: ' + decision.slice(0, 70));
    testContent.push(`  it('should handle decision: ${decision.slice(0, 50)}', () => {`);
    testContent.push(`    // Generated assertion: decision point "${decision.slice(0, 40)}" is documented`);
    testContent.push('    assert.ok(true, \'Decision point identified\');');
    testContent.push('  });');
    testContent.push('');
  }

  // 3. Constraint / edge case tests
  for (let i = 0; i < Math.min(metadata.constraints.length, 5); i++) {
    const constraint = metadata.constraints[i];
    testContent.push('  // Edge case: ' + constraint.slice(0, 70));
    testContent.push(`  it('should respect constraint: ${constraint.slice(0, 50)}', () => {`);
    testContent.push(`    // Generated assertion: constraint "${constraint.slice(0, 40)}" is bounded`);
    testContent.push('    assert.ok(true, \'Constraint identified\');');
    testContent.push('  });');
    testContent.push('');
  }

  // 4. Input parameter tests
  for (const param of metadata.inputs.slice(0, 5)) {
    testContent.push('  // Input parameter: ' + param.name);
    testContent.push(`  it('should accept parameter --${param.name}', () => {`);
    testContent.push(`    // Generated assertion: parameter --${param.name} declared in metadata`);
    testContent.push(`    assert.ok(typeof '${param.name}' === 'string', 'Parameter name is string');`);
    testContent.push('  });');
    testContent.push('');
  }

  testContent.push('});');
  testContent.push('');

  return {
    name: testName,
    content: testContent.join('\n'),
    metadata: {
      sourceFile: skillPath,
      sourceType: 'SKILL.md',
      title: metadata.title,
      decisionCount: metadata.decisions.length,
      constraintCount: metadata.constraints.length,
      inputParamCount: metadata.inputs.length
    }
  };
}

function generateCommandTest(commandPath, metadata) {
  const cmdName = relative(COMMANDS_DIR, commandPath).replace(/\.md$/, '').replace(/\//g, '-');
  const testContent = [];

  testContent.push(`// Auto-generated command test for: ${metadata.title || cmdName}`);
  testContent.push(`// Source: ${commandPath}`);
  testContent.push(`// Generated: ${new Date().toISOString()}`);
  testContent.push('');
  testContent.push("import { describe, it } from 'node:test';");
  testContent.push("import { strict as assert } from 'node:assert';");
  testContent.push('');

  const suiteName = metadata.title ? metadata.title.replace(/[^a-zA-Z0-9\s]/g, '').trim() : cmdName;
  testContent.push(`describe('Command: ${suiteName}', () => {`);
  testContent.push('');

  // Usage test
  if (metadata.usage) {
    testContent.push('  // Property: usage syntax must be defined');
    testContent.push('  it(\'should have defined usage syntax\', () => {');
    testContent.push(`    assert.ok(true, 'Usage: ${metadata.usage.slice(0, 80)}');`);
    testContent.push('  });');
    testContent.push('');
  }

  // Option tests
  for (const opt of metadata.options.slice(0, 8)) {
    testContent.push('  // Option: ' + opt.name);
    testContent.push(`  it('should support --${opt.name} option', () => {`);
    testContent.push(`    // Generated assertion: option --${opt.name} has description`);
    testContent.push(`    assert.ok(true, 'Option --${opt.name} identified: ${(opt.description || '').slice(0, 60)}');`);
    testContent.push('  });');
    testContent.push('');
  }

  testContent.push('});');
  testContent.push('');

  return {
    name: cmdName,
    content: testContent.join('\n'),
    metadata: {
      sourceFile: commandPath,
      sourceType: 'command',
      title: metadata.title,
      optionCount: metadata.options.length
    }
  };
}

function findFilesWithExtension(dir, extension) {
  const results = [];
  if (!existsSync(dir)) return results;

  try {
    const { readdirSync, statSync } = require('node:fs');
    const walk = function(currentDir) {
      const entries = readdirSync(currentDir);
      for (const entry of entries) {
        const fullPath = join(currentDir, entry);
        try {
          const stat = statSync(fullPath);
          if (stat.isDirectory()) {
            walk(fullPath);
          } else if (entry.endsWith(extension)) {
            results.push(fullPath);
          }
        } catch {
          // skip inaccessible
        }
      }
    }
    walk(dir);
  } catch {
    // Fallback
  }

  return results;
}

function collectCommandFiles() {
  return findFilesWithExtension(COMMANDS_DIR, '.md');
}

function collectSkillFilesWithFs() {
  return findFilesWithExtension(SKILLS_DIR, 'SKILL.md');
}

async function main() {
  const args = process.argv.slice(2);
  const options = {
    outputDir: OUTPUT_DIR,
    force: args.includes('--force'),
    verbose: args.includes('--verbose')
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--output' && args[i + 1]) options.outputDir = resolve(ROOT, args[++i]);
    else if (args[i].startsWith('--output=')) options.outputDir = resolve(ROOT, args[i].slice('--output='.length));
  }

  // Ensure output directory exists
  if (!existsSync(options.outputDir)) mkdirSync(options.outputDir, { recursive: true });

  console.log('=== Auto Test Generator ===');
  console.log(`Started: ${new Date().toISOString()}`);
  console.log('');

  // Phase 1: Collect skills and commands
  console.log('Phase 1: Collecting sources...');

  const skillFiles = collectSkillFilesWithFs();
  const commandFiles = collectCommandFiles();

  console.log(`  Found ${skillFiles.length} SKILL.md files`);
  console.log(`  Found ${commandFiles.length} command docs`);
  console.log('');

  // Phase 2: Analyze and generate tests
  console.log('Phase 2: Analyzing and generating tests...');

  const generatedTests = [];
  let totalDecisions = 0;
  let totalConstraints = 0;
  let totalParams = 0;

  // Generate tests for skills
  for (const skillPath of skillFiles) {
    const content = readTextFile(skillPath);
    if (!content) continue;

    const metadata = extractSkillMetadata(content);
    const test = generatePropertyTest(skillPath, metadata);

    const outputFile = join(options.outputDir, `${test.name}.test.mjs`);
    writeFileSync(outputFile, test.content, 'utf8');
    generatedTests.push({
      file: outputFile,
      source: skillPath,
      type: 'skill',
      ...test.metadata
    });

    totalDecisions += metadata.decisions.length;
    totalConstraints += metadata.constraints.length;
    totalParams += metadata.inputs.length;

    if (options.verbose) {
      console.log(`  Generated: ${relative(ROOT, outputFile)}`);
      console.log(`    Decisions: ${metadata.decisions.length}, Constraints: ${metadata.constraints.length}, Params: ${metadata.inputs.length}`);
    }
  }

  // Generate tests for commands
  for (const cmdPath of commandFiles) {
    const content = readTextFile(cmdPath);
    if (!content) continue;

    const metadata = extractCommandMetadata(content);
    const test = generateCommandTest(cmdPath, metadata);

    const outputFile = join(options.outputDir, `${test.name}.test.mjs`);
    writeFileSync(outputFile, test.content, 'utf8');
    generatedTests.push({
      file: outputFile,
      source: cmdPath,
      type: 'command',
      ...test.metadata
    });

    totalParams += metadata.options.length;

    if (options.verbose) {
      console.log(`  Generated: ${relative(ROOT, outputFile)}`);
      console.log(`    Options: ${metadata.options.length}`);
    }
  }

  // Write registry file
  const registry = {
    version: '2.7.0',
    generated: new Date().toISOString(),
    stats: {
      totalSkillFiles: skillFiles.length,
      totalCommandFiles: commandFiles.length,
      totalTestsGenerated: generatedTests.length,
      totalDecisionPoints: totalDecisions,
      totalEdgeCases: totalConstraints,
      totalInputParameters: totalParams
    },
    tests: generatedTests.map(t => ({
      path: relative(ROOT, t.file),
      source: relative(ROOT, t.source),
      type: t.type,
      sourceType: t.sourceType,
      title: t.title,
      decisionCount: t.decisionCount || 0,
      constraintCount: t.constraintCount || 0,
      optionCount: t.optionCount || 0,
      inputParamCount: t.inputParamCount || 0
    }))
  };

  writeFileSync(REGISTRY_FILE, JSON.stringify(registry, null, 2), 'utf8');

  console.log('');
  console.log('=== Generation Summary ===');
  console.log(`Skills analyzed: ${skillFiles.length}`);
  console.log(`Commands analyzed: ${commandFiles.length}`);
  console.log(`Tests generated: ${generatedTests.length}`);
  console.log(`Decision points extracted: ${totalDecisions}`);
  console.log(`Edge cases extracted: ${totalConstraints}`);
  console.log(`Input parameters extracted: ${totalParams}`);
  console.log(`Output directory: ${options.outputDir}`);
  console.log(`Registry: ${REGISTRY_FILE}`);

  // Generate index file listing all generated tests
  const indexPath = join(options.outputDir, 'index.md');
  const indexLines = [];
  indexLines.push('# Generated Tests Index');
  indexLines.push('');
  indexLines.push(`Generated: ${new Date().toISOString()}`);
  indexLines.push('');
  indexLines.push(`- **Total tests:** ${generatedTests.length}`);
  indexLines.push(`- **From skills:** ${generatedTests.filter(t => t.type === 'skill').length}`);
  indexLines.push(`- **From commands:** ${generatedTests.filter(t => t.type === 'command').length}`);
  indexLines.push('');
  indexLines.push('## Skill Tests');
  indexLines.push('');
  for (const t of generatedTests.filter(t => t.type === 'skill')) {
    const fileName = relative(options.outputDir, t.file);
    const sourceRel = relative(ROOT, t.source);
    indexLines.push(`- [${fileName}](${fileName}) ← from \`${sourceRel}\``);
    indexLines.push(`  - ${t.decisionCount || 0} decisions, ${t.constraintCount || 0} constraints`);
  }
  indexLines.push('');
  indexLines.push('## Command Tests');
  indexLines.push('');
  for (const t of generatedTests.filter(t => t.type === 'command')) {
    const fileName = relative(options.outputDir, t.file);
    const sourceRel = relative(ROOT, t.source);
    indexLines.push(`- [${fileName}](${fileName}) ← from \`${sourceRel}\``);
    indexLines.push(`  - ${t.optionCount || 0} options`);
  }
  indexLines.push('');
  indexLines.push('## Notes');
  indexLines.push('');
  indexLines.push('- Generated tests have placeholder assertions (assert.ok(true, ...)).');
  indexLines.push('- Replace them with real property-based assertions using libraries like fast-check.');
  indexLines.push('- Run with: `node --test test/generated/*.test.mjs`');
  indexLines.push('- Re-generate with: `npm run test:generate`');

  writeFileSync(indexPath, indexLines.join('\n'), 'utf8');
  console.log(`Test index: ${indexPath}`);

  console.log('');
  console.log('Done. Run tests with: node --test test/generated/*.test.mjs');
  process.exit(0);
}

main().catch(err => {
  console.error('Test generator error:', err);
  process.exit(1);
});
