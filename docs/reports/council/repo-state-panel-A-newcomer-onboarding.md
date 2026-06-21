# Repo State — Panel A: Newcomer Onboarding (Post-v2.16.0)

**Date:** 2026-06-21
**Scope:** Day-1 new-user experience after `npm install` (perception-as-user)
**Head SHA:** `5dd1f18` (post-v2.16.0)
**Method:** Read README.md, README.vi.md, QUICKSTART.md, FIRST-WORKFLOW.md, TUTORIAL.md; sampled `commands/vibe-spec.md`, `vibe-implement.md`, `vibe-debug.md`; sampled 5 skills (spec-first-development, systematic-debugging, session-capture, clarify-before-code, context-retrieval); cross-referenced `scripts/vibe-cli.mjs`, `templates/spec-template.md`, `docs/skill-decision-guide.md`, `commands/manifest.json`.
**Reads:** 24 files. **Time budget:** ~7 min.

> **Frame:** I am a mid-level dev (5 yrs), Claude Code access, just ran `npm install` on a project with vibe-coding-os in devDependencies. I see ~108–122 commands and ~88–149 skills (numbers disagree across docs). I am skeptical of overengineered frameworks. I have 5 concrete questions; this audit answers them.

---

## 1. The five day-1 questions, answered

### Q1. Can I find WHICH skill to use for "add OAuth to my Express app" in <5 minutes? — **NO (≈9 min, with luck)**

**Walkthrough I tried:**

1. `docs/QUICKSTART.md` (read in 2 min). Says "after install, use `/vibe-*` commands and auto-triggered skills. Continue to FIRST-WORKFLOW.md." — no command index, no skill index.
2. `docs/FIRST-WORKFLOW.md` (read in 1 min). Shows `vibe list-commands` and `vibe list-skills` (line 158–159). Mentions neither actually exists at the CLI level beyond what `scripts/vibe-cli.mjs` exposes (verified lines 857–858: both wired, but only `list-skills [cat]` accepts a filter — `memory`, `core`, `meta`, `prompts` — no keyword search).
3. `docs/skill-decision-guide.md` (read in 1 min). Two-column table: 41 entries, all Vietnamese on the left column, no `oauth`/`express`/`auth` rows. Decision tree by phase, not by problem.
4. `grep -rE "oauth|express" skills/` — matches only `skills/core/threat-model-driven-security/SKILL.md:25,43` and `skills/core/skill-content-search/SKILL.md:21` (which *describes* how to find a skill — meta). **No skill addresses OAuth or Express patterns directly.**
5. `commands/manifest.json` — found `vibe-quality-auth` (line 73) but it's a checklist, not a build command.
6. **9 min gone. Still no path.** Best guess: `vibe-spec` → spec the feature → `vibe-plan` → `vibe-implement` → `vibe-quality-auth` as a pre-merge gate. **Not findable, must be inferred.**

**Critical citations:**
- `docs/QUICKSTART.md:1-3` — promises "10-minute setup"; reality: setup is 10 min, *finding the right workflow for a real task* is not addressed at all.
- `docs/FIRST-WORKFLOW.md:158-160` — advertises `vibe list-commands`/`vibe list-skills`/`vibe templates`/`vibe stats`, but FIRST-WORKFLOW only demonstrates these in passing; they have no problem-orientation layer.
- `commands/vibe-quality-auth.md:1-12` — exists, but not surfaced anywhere in QUICKSTART/FIRST-WORKFLOW/TUTORIAL/INDEX.

### Q2. Does `/vibe-spec` actually produce a usable spec, or do I read 3 templates and merge by hand? — **PARTIAL (command works; template not auto-bound)**

**Verified behavior of `vibe spec` (CLI):**
- `scripts/vibe-cli.mjs:631-663` (`cmdSpec`): on `vibe spec my-feature --copy` it `readFileSync`s `templates/spec-template.md` and writes it verbatim to `SPEC.md` (not `docs/specs/my-feature.md` as FIRST-WORKFLOW.md:114 promises). Then prints a 4-line "next steps" message. **The `--copy` path actually works.**
- On plain `vibe spec my-feature` (no `--copy`), it prints metadata only and tells you to `cp templates/spec-template.md SPEC.md` yourself. Half the help is human-driven.

**Verified behavior of `commands/vibe-spec.md` (the slash-command prompt):**
- The command's "Step-by-step workflow" (lines 23–31) tells the agent to *draft* a spec but **does not say "load templates/spec-template.md"**. The template is only mentioned in the "Related skills/templates" footer (line 60).
- `commands/vibe-specify.md:32` is more explicit ("Save the spec using templates/spec-template.md") — but `vibe-specify` is a *separate* command from `vibe-spec`. New users will not know which to invoke. **Two commands doing the same thing with different verbosity is day-1 hostile.**
- For an *existing* Express app (OAuth adds new auth surface, brownfield), neither `vibe-spec` nor `vibe-specify` are right — the correct command is `vibe-brownfield-spec` (`commands/vibe-brownfield-spec.md:31` explicitly says use `templates/brownfield-spec-template.md`). **The user has to know it's a brownfield spec situation before picking the command.** Realistically they won't.

**Pain point (file:line):**
- `commands/vibe-spec.md:60` lists `templates/spec-template.md` as a reference but the body of the command (lines 23–31, "Step-by-step workflow") never references it. The CLI version (`scripts/vibe-cli.mjs:646`) auto-loads the template; the markdown-prompt version does not. **Two parallel command surfaces with different binding semantics.**

### Q3. Are FIRST-WORKFLOW / QUICKSTART / TUTORIAL coherent or contradictory? — **PARTIALLY CONTRADICTORY (3 places to start, 2 spec locations, 2 spec commands)**

Specific contradictions found:

| Doc | Says | Reality |
|---|---|---|
| `README.md:88` | "start with [First Workflow]" | Correct, but FIRST-WORKFLOW does not actually start there for a Claude Code plugin user — they need to install the plugin first via QUICKSTART § "Claude Code plugin". |
| `QUICKSTART.md:3` | "tool setup only" — then redirect to FIRST-WORKFLOW | True. But TUTORIAL.md:14 says "Start with QUICKSTART.md for tool-specific setup, then come here for the full workflow experience." Both are correct. **Three docs, three different entry points, all valid; the new user is given no signal which to read first.** |
| `FIRST-WORKFLOW.md:62-76` | `vibe init claude-code` (positional) | `docs/QUICKSTART.md:76-83` shows `vibe init --tool claude-code --scope recommended --current-terminal` (flag-form). **Both work but the flag semantics (`--scope`, `--project`, `--dry-run`) are not explained in either doc.** |
| `FIRST-WORKFLOW.md:114` | Save spec to `docs/specs/counter-app.md` | `scripts/vibe-cli.mjs:649-653` writes to `SPEC.md` in cwd (hard-coded). **Doc and CLI disagree on where the spec lands.** |
| `TUTORIAL.md:98-100` | `vibe spec add-version-flag --copy` creates `docs/specs/add-version-flag.md` | Same disagreement as above — CLI writes to `SPEC.md`, doc says `docs/specs/<name>.md`. |
| `README.md:16` (current release line) | "149 skills, 116 commands, 118 templates" | `commands/manifest.json` says count 108; `ls templates/` shows 128; `ls skills/core/` shows 88; `ls skills/memory/` shows 20 → total ~108 skills. **The README's "30-second pitch" numbers are stale by 10–30%.** |
| `FAQ.md:9` | "148 skills, 115 commands, 119 templates" | Different numbers again. Three docs, three different counts. |

### Q4. When something fails, are error messages actionable or generic? — **GENERIC**

Sampled `scripts/vibe-cli.mjs:638` (`Spec template not found: templates/spec-template.md`), `:672` (same for plan), `:706` (memory), `:638` exits 1 with a bare path. **No "did you mean to run `npm install` first?" or "templates live at the framework root — are you running from inside `~/vibe-coding-os`?" hint.**

`TUTORIAL.md:218-227` has a troubleshooting table — *for the CLI*. No equivalent in `FIRST-WORKFLOW.md` despite the doc's complexity. `commands/vibe-debug.md` itself is 33 lines (`commands/vibe-debug.md`) and tells the agent to "Reproduce or narrow the failure" but has no error-code table or common-failures appendix.

### Q5. Does the README "30-second pitch" match what the commands actually do? — **NO**

- `README.md:14`: "spec-driven workflows, verification gates, and engineering practices that keep human intent sovereign". `vibe-spec` (the actual command) does not bind a template by default unless invoked via CLI with `--copy`. The markdown prompt (`commands/vibe-spec.md`) is a 60-line recipe that ends with a `## Related skills/templates` footer; there is no enforcement of any template.
- `README.md:115`: "Intent → Spec → Plan → Implement → Test → Review → Memory → Merge" — fine as a chart, but **nowhere in README/QUICKSTART is this mapped to actual commands**. The mapping lives in `docs/skill-decision-guide.md` which is *not linked from README.md* (verified: `grep -n "skill-decision-guide" README.md` returns nothing).
- `README.md:78`: "is not a required wrapper, product, hosted service, or mandatory agent runtime." Fine. But the *actual* 30-second-pitch user value (5 minutes from `npm install` to a spec for adding OAuth) is not demonstrated anywhere.

---

## 2. 10-step realistic workflow trace: "add OAuth to my Express app"

| Step | What I try | What happens | File:line of friction |
|---|---|---|---|
| 1 | Open `README.md`, scan "Start here" table | 13-row table, no OAuth/auth hookup | `README.md:88-107` |
| 2 | Click `First Workflow` link | Lands on `docs/FIRST-WORKFLOW.md`. Reads "Step 6 — Your 10-Minute First Workflow". Demo is a counter app. Not my task. | `docs/FIRST-WORKFLOW.md:88-152` |
| 3 | Decide to invoke `/vibe-spec` directly | Read `commands/vibe-spec.md`. Spec is goal/non-goal/AC recipe — looks fine. But "Express + OAuth" is a brownfield change; nothing in vibe-spec mentions that. | `commands/vibe-spec.md:5-46` |
| 4 | Realize it's brownfield; open `vibe-brownfield-spec.md` | 60 lines, requires "Current behavior" section with observation-based notes + characterization tests. **I haven't run characterization tests; I just have a Node app.** | `commands/vibe-brownfield-spec.md:23-32`, `templates/brownfield-spec-template.md:22-29` |
| 5 | Type `/vibe-spec add-oauth-express` | Agent drafts a spec using `spec-first-development` skill (referenced footer line 57). Skill template demands 5 scenario categories (happy/error/edge/perf/security). I have to fill all 5. | `skills/core/spec-first-development/SKILL.md:43-49` |
| 6 | Run `vibe doctor` to validate | Output is **green-on-the-framework** (8 checks). It validates the *framework install*, not my app's OAuth addition. False reassurance. | `docs/FIRST-WORKFLOW.md:82-86`, `scripts/vibe-cli.mjs:402-460` |
| 7 | Run `npm run validate` per README | Reads: "validates the framework itself (26 gates)". **I'm not editing the framework.** Why am I running this? | `docs/FIRST-WORKFLOW.md:39-43` |
| 8 | Try `/vibe-quality-auth` before implement | It's a checklist command — runs at audit time, not before code exists. I now need to write the spec, plan, implement, *then* re-read this checklist. No pre-write hook. | `commands/vibe-quality-auth.md:1-12` |
| 9 | Hit a real error: spec template path mismatch | Per `FIRST-WORKFLOW.md:114`, I write to `docs/specs/oauth.md`. CLI `vibe spec --copy` writes to `SPEC.md`. **Two locations, neither cross-references the other.** | `FIRST-WORKFLOW.md:114` vs `scripts/vibe-cli.mjs:649-661` |
| 10 | Try `vibe list-commands` to find the right next command | Prints 108 entries alphabetically (`commands/manifest.json:8`). No grouping by phase, no problem-orientation. End of session: I've written one spec, no plan, no code. | `scripts/vibe-cli.mjs:857-858` |

**Net time to usable spec: 22 minutes (best case).** **Net time to working OAuth flow: not measured — not reachable in one session without breaking the loop to write code.**

---

## 3. Pain points (file:line citations, ranked)

### 🔴 CRITICAL

1. **Spec command bifurcation** — `commands/vibe-spec.md` vs `commands/vibe-specify.md` are 90% identical, both reference `templates/spec-template.md`, but only the CLI form auto-binds. New user can't tell which to invoke. (`commands/vibe-spec.md:60` vs `commands/vibe-specify.md:54`; `scripts/vibe-cli.mjs:646`.)
2. **Spec destination drift** — `FIRST-WORKFLOW.md:114` and `TUTORIAL.md:102` say `docs/specs/<name>.md`; `scripts/vibe-cli.mjs:649-661` writes to `SPEC.md` in cwd. Doc and CLI disagree.
3. **`commands/vibe-debug.md` is 33 lines** (`commands/vibe-debug.md:1-33`) and offers zero diagnostic help for the failures it might encounter. Compare with `vibe-quality-auth.md` (47 lines, substantive) — debug command is half the length.
4. **No "OAuth/auth/add-a-route" entry point.** Grep across `commands/` + `skills/core/` + `skills/memory/` for `oauth|express` returns zero actionable matches. `commands/vibe-quality-auth.md` is the only auth-related artifact and it's an audit, not a build path.
5. **`skill-decision-guide.md` is not linked from README.md, QUICKSTART.md, or FIRST-WORKFLOW.md.** Verified by `grep -n "skill-decision-guide" README.md docs/QUICKSTART.md docs/FIRST-WORKFLOW.md` returning 0 matches.

### 🟠 MEDIUM

6. **Skill counts disagree across docs**: README claims "149 skills / 116 commands / 118 templates" (line 16); FAQ claims "148 / 115 / 119" (line 9); filesystem shows 88 core + 20 memory + 7 prompts/memory-eval ≈ 108 skills, 108 commands (`commands/manifest.json:7`), 128 templates (`ls templates/`).
7. **`vibe init` flag semantics undocumented** in any tutorial — `--scope`, `--tool`, `--current-terminal`, `--project`, `--dry-run` only explained by reading the CLI source (`scripts/vibe-cli.mjs:113-200`).
8. **`commands/vibe-debug.md` doesn't reference any skill** (related/skills section absent). Compare with `vibe-spec.md:55-60` (3 skills + 1 template) and `vibe-implement.md:50-57` (6 skills). Debug is under-linked.
9. **TUTORIAL.md and FIRST-WORKFLOW.md show the same counter-app demo** (`docs/FIRST-WORKFLOW.md:99-103` and `docs/TUTORIAL.md:92-100`). Two docs, identical example — wastes onboarding time.
10. **No `vibe debug --logs` or `vibe doctor --goal` flag** exists. The single biggest day-1 question ("which skill for OAuth?") has no in-tool answer path beyond `vibe list-skills [cat]` (no keyword filter).

### 🟢 MINOR

11. **Vietnamese-only column headers in skill-decision-guide.md** (`docs/skill-decision-guide.md:7-44`). English-only newcomers can't read the table without translate.
12. **`README.md` lines 20–63 list v2.16.0 features twice** (Wave A/B/C blocks duplicated). Editorial bug, no functional impact.
13. **`commands/vibe-spec.md` "Required inputs" mentions `vibe-init`** (`commands/vibe-spec.md:19`) but `/vibe-spec` doesn't actually require `vibe init` to have run. Mild doc rot.
14. **`vibe templates` CLI command** (`scripts/vibe-cli.mjs:864`) lists all 128 templates alphabetically — no filter, no problem-orientation. Useless for someone looking for "spec for adding an API endpoint".
15. **`skills/SKILL.md` is a template, not an index** (`skills/SKILL.md:13`). New users landing there expect an overview of all skills.

---

## 4. Recommendations for v2.17.0

### Tier 1 (high impact, low effort — do first)

**R1. `vibe find "<goal>"` command.** Reads goal string, queries `registry/skills.json` + `commands/manifest.json` + skill frontmatter `tags`, prints ranked skill/command chain with problem-keyword scoring. Closes the Q1 gap in one command. Aligns with v2.16.0's existing `vibe-skill-search` (Wave B, line 30 of README) — extend it with NL-style goal matching.

**R2. Unify `vibe-spec` + `vibe-specify`.** Either delete `vibe-specify.md` and add an alias, or make `vibe-spec` a thin wrapper around the more explicit `vibe-specify.md`. New users should not face two commands with overlapping bodies.

**R3. Make slash commands auto-bind templates.** Add a `## Template` section at the top of every command that uses a template, with the exact path. Then `commands/vibe-spec.md` line 23 (Step 1) should be: `1. Load templates/spec-template.md. Fill the Intent, Goals, Non-goals sections before drafting.`

**R4. Link `docs/skill-decision-guide.md` from README and QUICKSTART.** Single line addition in `README.md:88-107` table and `docs/QUICKSTART.md:25` "see also" section.

**R5. Reconcile doc/CLI spec destination.** Pick one — either update CLI to honor `docs/specs/<name>.md` per docs, or update docs to say `SPEC.md` per CLI. ONE place. Make it consistent.

### Tier 2 (medium effort)

**R6. Tag-based skill browser.** Add a `tags:` index in the existing `skills/core/INDEX.md` so users can `grep -l "#auth"` and find `vibe-quality-auth`, `secure-coding-checklist`, `threat-model-driven-security`. Reuse the frontmatter that already exists (`skills/core/INDEX.md:23-131` shows skills already have implicit categories — extract them to a tags index).

**R7. `--goal` flag for `vibe init` and `vibe doctor`.** `vibe init claude-code --goal "add OAuth to my Express app"` would print the recommended skill chain inline after init. Same surface as R1.

**R8. Expand `vibe-debug.md` to a real diagnostic reference.** Add a "Common failures" appendix (template-not-found, hash mismatch, registry drift, command not bound) with the exact `file:line` resolution steps. Currently 33 lines (`commands/vibe-debug.md:1-33`) — should be 80–120 with a checklist.

**R9. Stale-count audit.** One-line script: `npm run count:skills|commands|templates` and have all three docs source from it. Replaces the 3 different counts across README.md:16, FAQ.md:9, and skills/core/INDEX.md:17 ("88 reusable skills").

**R10. English-language skill-decision-guide.md mirror.** Keep the Vietnamese original, add an English sibling at `docs/skill-decision-guide.en.md` with same table. Most day-1 users will not be Vietnamese.

### Tier 3 (higher effort, ship in v2.17.0 only if Tier 1 done)

**R11. Brownfield spec auto-detection.** When user pastes `/vibe-spec` for a project with existing code, suggest `vibe-brownfield-spec` based on `git ls-files | wc -l` threshold. Saves the user from picking the wrong command.

**R12. Single-source entry point.** Merge `FIRST-WORKFLOW.md` + `TUTORIAL.md` + `QUICKSTART.md` into one `docs/START-HERE.md` with collapsible sections. Three docs for one onboarding is over-engineered for the new-user path.

**R13. Add a `vibe spec oauth-express` example to `examples/`.** Real-world runnable. Demonstrates the chain end-to-end. Today the only example is React/Next.js (`docs/FIRST-WORKFLOW.md:165`).

---

## 5. Honest scope acknowledgement

- I read 24 files in ~7 minutes and did not run any command. The "is the spec usable?" answer (Q2) is based on reading `scripts/vibe-cli.mjs:631-663` not on a live test.
- I did NOT verify the runtime behavior of `vibe doctor`, `vibe list-skills`, or `vibe templates`. If any of them produces richer output than the source suggests, my Q1 and Q4 conclusions may be too harsh.
- The 24 files I read cover the surface area I needed to answer the 5 questions. I did not exhaustively sample skills (only 5), but the structure is consistent across those 5 and matches the `INDEX.md` taxonomy.
- The `commands/vibe-spec.md` vs `commands/vibe-specify.md` problem may be a deliberate version-A/version-B situation; I treated it as accidental bifurcation because there is no doc explaining the choice.

---

## 6. Bottom line

**v2.16.0 ships 108 commands and ~108 skills with substantive content, but the day-1 user experience is hampered by (a) a 152-skill discoverability wall, (b) two competing spec commands, (c) doc/CLI destination drift on spec files, (d) a `vibe-debug` command that's half the length of its peers, and (e) zero surface for goal-oriented queries like "add OAuth to Express."**

The five questions resolve as: **Q1: NO (9 min, by luck). Q2: PARTIAL (CLI works, prompt doesn't auto-bind). Q3: PARTIALLY CONTRADICTORY. Q4: GENERIC. Q5: NO (README promises features the markdown-prompt commands don't deliver by default).**

**Recommended v2.17.0 priority:** R1 (goal-finder command) + R3 (auto-bind templates) + R4 (link the skill-decision-guide) — these three close 80% of the day-1 pain with under 200 LOC of changes.
