# Show HN Kit

A copy-ready template for posting Vibe Coding OS on Hacker News (Show HN).

## Post body

Copy-paste this into the HN "Show HN" text field:

---

**Show HN: Vibe Coding OS — Prompt library that makes any AI coding tool 10× better**

https://github.com/roronoazoroshao369/vibe-coding-os

**Vibe Coding OS** is a portable library of 148 skills, 115 commands, and 119 templates that turn your AI coding assistant into a quality machine.

**What it is:**
- 148 markdown skills covering debug, refactor, ship, security, docs, tests
- 115 slash commands for direct invocation in Claude Code, Codex, Cursor, or Gemini
- 119 templates for predictable output (contracts, scorecards, ADRs)
- 33 automated validation gates run before every release

**What it's not:**
- Not a runtime or agent framework (you bring your own AI tool)
- Not a chatbot wrapper
- Not a VS Code fork

**How it works:**
1. Clone the repo (or `npm install -g vibe-coding-os`)
2. Run the adapter for your tool: `npx vibe-adapter install claude`
3. Use skills: `@skill: quality-execution-contract` (Claude Code) or `/vibe-quality-gate` (Cursor)
4. Every change goes through validation before it ships

**Why it matters:**
AI coding tools are powerful but inconsistent. Vibe Coding OS gives every tool the same quality baseline — so "good enough" prompts become deterministic workflows.

MIT licensed. 148 skills. 33 gates. Zero vendor lock-in.

---

## Image suggestions (for screenshot/embed)

Since HN supports image uploads or link-based previews, create and attach:

1. **Hero image** (1200×630) — repo logo + tagline + skill count
2. **Skill map visualization** — screenshot of Mermaid dependency graph (`node scripts/skill-deps-graph.mjs mermaid`)
3. **Gate dashboard screenshot** — screenshot of `npm run validate:all` output (33/33 PASS)
4. **Before/after comparison** — code diff showing quality-shield vs raw prompting

**Recommended filename convention:**
- `assets/show-hn-hero.png` (1200×630)
- `assets/show-hn-skill-map.png` (1200×800)
- `assets/show-hn-gates.png` (1000×600)

## One-pager (for link previews and social)

A markdown one-pager that can be used as a README for the Show HN comment thread or linked as a GitHub README.md section:

---

## One-pager

> **Vibe Coding OS** — A prompt library that makes AI coding tools consistently good.

| Dimension | Status |
|-----------|--------|
| Skills | 148 |
| Commands | 115 |
| Templates | 119 |
| Validation gates | 33 |
| License | MIT |
| AI tools supported | Claude Code, Codex, Cursor, Gemini |

**Start in 60 seconds:**
```bash
git clone https://github.com/roronoazoroshao369/vibe-coding-os.git
cd vibe-coding-os
node scripts/install-skill.mjs quality-execution-contract --dry-run  # legacy: replaced by `vibe-setup-skills` in v2.17
node scripts/install-skill.mjs docs-author  # legacy: replaced by `vibe-setup-skills` in v2.17
```

**For AI tool adapters:**
```bash
npm install -g vibe-coding-os
npx vibe-adapter install claude   # or codex, cursor, gemini
```

**The quality promise:** Every skill ships with a SKILL.md that includes Purpose, When to use, Workflow, Outputs, and Failure modes — no mystery prompts, no black boxes.

---

## HN post tips

1. **Title matters** — "Show HN: Vibe Coding OS — Prompt library that makes any AI coding tool better" is strong; consider "10× better" if you can substantiate
2. **Link is primary** — HN prefers a single URL; put the full pitch in the link text
3. **Reply to first 5 comments** — HN engagement is proportional to early replies
4. **Be ready for "why not just X"** — have comparison.md ready: [`docs/comparison.md`](comparison.md)
5. **Screenshot helps** — attach a before/after showing quality difference

## Social media variants (Twitter/X, LinkedIn)

**Twitter (280 chars):**
> Vibe Coding OS: 148 skills, 115 commands, 119 templates for any AI coding tool (Claude Code, Codex, Cursor, Gemini). MIT. Zero vendor lock-in. 33 validation gates. GitHub: roronoazoroshao369/vibe-coding-os

**LinkedIn:**
> Excited to share Vibe Coding OS — an open-source prompt library that makes AI coding tools consistently good. It ships 148 skills, 115 commands, and 119 templates across Claude Code, Codex, Cursor, and Gemini, with 33 automated validation gates. MIT licensed, zero runtime, zero vendor lock-in. #AI #OpenSource #DevTools #CodingAssistant

## Submitting

1. Create the images (use `assets/show-hn-*.png` naming)
2. Upload to [HN image host](https://i.imgur.com/) or attach to the post
3. Post: https://news.ycombinator.com/submitlink?u=https://github.com/roronoazoroshao369/vibe-coding-os&t=Show+HN:+Vibe+Coding+OS+—+Prompt+library+that+makes+any+AI+coding+tool+10×+better
4. Cross-post on Twitter/X with the same content
5. Check back in 1 hour to reply to comments
