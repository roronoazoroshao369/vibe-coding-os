#!/usr/bin/env node
// fix-dashboard-trend.js — Quick script to re-add trend section to DASHBOARD.md
import { readFileSync, writeFileSync } from 'node:fs';

const text = readFileSync('docs/DASHBOARD.md', 'utf8');
const safetyEnd = text.indexOf('| Injection scan | ✅ Passed |');
if (safetyEnd < 0) { console.error('Section not found'); process.exit(1); }

const rest = text.slice(safetyEnd);
const endOfLine = rest.indexOf('\n');
const afterSafety = safetyEnd + endOfLine;

const trendSection = `\n\n## Quality Trend Dashboard\n\n| Metric | Value |\n|---|---|\n| Trend data source | \`docs/metrics/quality-telemetry-events.ndjson\` |\n| Daily data points | See \`docs/reports/quality-trend/dashboard.md\` |\n| Weekly data points | See \`docs/reports/quality-trend/dashboard.md\` |\n| Gates tracked | See \`docs/reports/quality-trend/dashboard.md\` |\n\nThe **Quality Trend Dashboard** provides time-series visualization of quality metrics across validation runs.\n\n- **Dashboard JSON** (for charting): \`docs/reports/quality-trend/dashboard.json\`\n- **Dashboard report**: \`docs/reports/quality-trend/dashboard.md\`\n- **Generator**: \`scripts/validate-property-tests.mjs (replaced quality-trend v2.17)\`\n- **Guide**: \`docs/quality-trend-dashboard.md\`\n\n\`\`\`bash\n# Regenerate trend dashboard\nnpm run dashboard:trend\n\`\`\`\n\nKey features:\n- **Daily/weekly/monthly pass-rate trends** — spot regressions and improvements\n- **Per-gate breakdown** — identify consistently problematic gates\n- **Sparkline-ready data** — \`dailyRates\` arrays per gate for charting\n- **Recommendations** — auto-generated based on trend analysis\n\n`;

writeFileSync('docs/DASHBOARD.md', text.slice(0, afterSafety + 1) + trendSection + text.slice(afterSafety + 1), 'utf8');
console.log('Treand section added successfully');
