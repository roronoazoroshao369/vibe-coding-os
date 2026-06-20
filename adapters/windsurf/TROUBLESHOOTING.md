# Windsurf Cascade Troubleshooting

> Common failure modes when running Vibe Coding OS inside Windsurf Cascade,
> and the canonical fix for each. Pair this with the `.windsurfrules`
> template and the Windsurf adapter README.

## Symptom → diagnosis → fix

### Symptom: Cascade ignores `.windsurfrules` entirely

**Diagnosis:** `.windsurfrules` is in the wrong location or has the wrong permissions.

**Fix:**

1. Confirm file is at workspace root: `ls -la .windsurfrules`.
2. Confirm it is readable: `cat .windsurfrules | head`.
3. Restart Cascade (`⌘⇧P` → `Windsurf: Restart Cascade`).
4. If still ignored, check that the project does not also have a
   `.codeiumignore` or `.cascadeignore` that excludes the rule file.

### Symptom: Cascade writes into `.claude/` or `.windsurf/` (protected paths)

**Diagnosis:** The model has drifted past the protected-paths contract in
`AGENTS.md`. Cascade does not have a hard block; it relies on the rule.

**Fix:**

1. Update `.windsurfrules` to add the protected-paths list explicitly:
   ```
   ## Protected paths
   Do NOT edit files under `.claude/`, `.windsurf/`, `.git/`, `runtime/`,
   or any path under `registry/` without an explicit user instruction in
   the current turn.
   ```
2. Revert the accidental edits: `git checkout -- .claude/ .windsurf/`.
3. Re-run `npm run validate:all` to confirm no structural damage.

### Symptom: Cascade skips the spec step

**Diagnosis:** Cascade interpreted the user's first message as a
"small change" and skipped the spec → plan → review loop.

**Fix:**

1. Reply with: "Follow Vibe Coding OS. Paste `commands/vibe-spec.md` first."
2. Add an explicit rule to `.windsurfrules`:
   ```
   ## No-small-change rule
   If the user describes a code change (even "just one line"), the spec
   step is required unless the user explicitly says "skip the spec".
   ```

### Symptom: Flow fails partway through a multi-step chain

**Diagnosis:** Cascade ran the spec step but lost context between Flow steps.

**Fix:**

1. Re-run the Flow with `Continue from step <N>` instead of restarting.
2. If state is fully lost, restart the Flow but paste the spec/plan output
   from the previous run as the first message of the new session.
3. Long-term fix: reduce Flow to 4 steps max (Cascade's effective context
   window shrinks with each step).

### Symptom: Cascade generates files outside the plan

**Diagnosis:** Cascade is doing "helpful extras" the plan did not ask for.

**Fix:**

1. Update `.windsurfrules` with the anti-overengineering rule:
   ```
   ## Anti-overengineering rule
   Implement only what the plan specifies. If you think an extra is
   needed, list it under "Followups" in the plan and stop. Do NOT add
   the extra unless the user explicitly approves it.
   ```
2. Revert the extras: `git checkout -- <files>`.

### Symptom: Supercomplete suggests an invalid file path

**Diagnosis:** Supercomplete's training data drifts; it sometimes invents
paths that do not exist.

**Fix:**

1. Always verify the suggested path with `ls` or `find` before accepting.
2. If the path is repeated nonsense, disable Supercomplete for that file
   type via the Windsurf settings UI.

### Symptom: `npm run validate:all` fails after Cascade finishes

**Diagnosis:** Cascade's edit broke a structural invariant (missing
section in a SKILL.md, broken markdown link, etc.).

**Fix:**

1. Read the validator output; find the failing gate.
2. Apply the smallest diff that fixes the failure.
3. Re-run `npm run validate:all` until it exits 0.
4. Commit the fix with `AI-Generated: yes` and `Tested-By: ci` trailers.

## Cascade-specific performance notes

- **Deep Context scan** is O(repo size). On a >50k LOC repo, the first
  Cascade invocation in a session takes 5–10s longer than subsequent ones.
- **Flows** are linear; parallel Flows are not supported in Cascade yet.
- **Supercomplete** is incremental; the first completion in a file is the
  slowest, subsequent completions in the same file are fast.

## When to escalate

If a Cascade failure cannot be fixed by editing `.windsurfrules` or by
restarting the Flow, open an issue at
https://github.com/roronoazoroshao369/vibe-coding-os/issues with:

1. Windsurf version (Help → About Windsurf).
2. Cascade version (visible in the Cascade panel header).
3. The exact `.windsurfrules` content (sanitize secrets first).
4. The failing command and its full output.
5. The steps you already tried from this troubleshooting guide.
