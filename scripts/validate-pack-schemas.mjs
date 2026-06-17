#!/usr/bin/env node
// validate-pack-schemas.mjs — validate all pack.json manifests

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PACKS_DIR = join(__dirname, '..', 'packs');
const SKILLS_DIR = join(__dirname, '..', 'skills');

const NAME_RE = /^[a-z0-9][a-z0-9-]*$/;

function validatePackJson(packDir) {
  const filePath = join(packDir, 'pack.json');
  if (!existsSync(filePath)) return { ok: false, errors: ['pack.json not found'] };
  
  let data;
  try {
    data = JSON.parse(readFileSync(filePath, 'utf8'));
  } catch (e) {
    return { ok: false, errors: [`Invalid JSON: ${e.message}`] };
  }
  
  const errors = [];
  
  // Required fields
  if (!data.name || typeof data.name !== 'string') errors.push('Missing or invalid "name"');
  if (!data.description || typeof data.description !== 'string') errors.push('Missing or invalid "description"');
  if (!Array.isArray(data.skills)) errors.push('Missing or invalid "skills" array');
  if (data.skills && data.skills.length === 0) errors.push('"skills" array is empty');
  if (data.commands && !Array.isArray(data.commands)) errors.push('"commands" must be an array');
  
  // Name validation
  if (data.name && !NAME_RE.test(data.name)) {
    errors.push(`Invalid pack name "${data.name}": must match ${NAME_RE}`);
  }
  
  // Skill name validation
  if (data.skills) {
    for (const skill of data.skills) {
      if (!skill.name || !NAME_RE.test(skill.name)) {
        errors.push(`Invalid skill name "${skill?.name}": must match ${NAME_RE}`);
      }
      if (!skill.source || typeof skill.source !== 'string') {
        errors.push(`Missing "source" for skill "${skill?.name}"`);
      }
      // Check source file exists
      if (skill.source) {
        const srcPath = join(SKILLS_DIR, skill.source);
        if (!existsSync(srcPath)) {
          errors.push(`Missing skill source file: ${skill.source}`);
        }
      }
    }
  }
  
  // Check for duplicate skill names
  if (data.skills) {
    const names = data.skills.map(s => s.name);
    const dupes = names.filter((n, i) => names.indexOf(n) !== i);
    if (dupes.length) errors.push(`Duplicate skill names: ${[...new Set(dupes)].join(', ')}`);
  }
  
  // Check commands reference files exist (optional — command files may not exist yet)
  if (data.commands) {
    for (const cmd of data.commands) {
      if (!NAME_RE.test(cmd)) {
        errors.push(`Invalid command name "${cmd}": must match ${NAME_RE}`);
      }
    }
  }
  
  return { ok: errors.length === 0, errors };
}

// Main
if (!existsSync(PACKS_DIR)) {
  console.log('No packs/ directory found, skipping');
  process.exit(0);
}

const packDirs = readdirSync(PACKS_DIR).filter(d => existsSync(join(PACKS_DIR, d, 'pack.json')));
let allOk = true;

for (const dir of packDirs) {
  const result = validatePackJson(join(PACKS_DIR, dir));
  if (!result.ok) {
    allOk = false;
    console.error(`FAIL ${dir}: ${result.errors.join('; ')}`);
  } else {
    console.log(`OK   ${dir}`);
  }
}

process.exit(allOk ? 0 : 1);
