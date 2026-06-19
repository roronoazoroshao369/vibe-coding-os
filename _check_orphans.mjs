import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const tmplDir = 'templates';
const templates = fs.readdirSync(tmplDir).filter(f => fs.statSync(path.join(tmplDir, f)).isFile());
console.log('Templates count:', templates.length);

let orphanCount = 0;
for (const t of templates) {
  const escaped = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  try {
    const result = execSync(`rg -l "${escaped}" docs/ --type md 2>/dev/null || true`, {encoding:'utf8'});
    if (!result.trim()) {
      console.log('ORPHAN: ' + t);
      orphanCount++;
    } else {
      console.log('FOUND: ' + t + ' -> ' + result.trim().split('\n')[0]);
    }
  } catch(e) {
    console.log('ERROR checking ' + t + ': ' + e.message);
  }
}
console.log('Orphan templates:', orphanCount);
