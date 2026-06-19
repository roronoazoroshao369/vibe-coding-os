// MCP command tools — expose vibe commands as MCP tools.
//
// Each tool reads a command markdown file + related skills and templates,
// returning the content as structured context (the caller applies it).
// Tools do NOT execute commands; they surface the command definition,
// required inputs, workflow steps, and related knowledge for the agent to use.

import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const COMMANDS_DIR = 'commands';
const SKILLS_DIR = 'skills';
const TEMPLATES_DIR = 'templates';

/**
 * Read a file relative to root, returning content or a missing-file note.
 */
async function readRelative(root, relPath) {
  const full = path.join(root, relPath);
  try {
    return await readFile(full, 'utf8');
  } catch {
    return `[File not found: ${relPath}]`;
  }
}

/**
 * Read multiple related files and collect their content keyed by label.
 */
async function readRelated(root, specs) {
  const entries = {};
  for (const { label, file } of specs) {
    entries[label] = await readRelative(root, file);
  }
  return entries;
}

/**
 * Build the 5 vibe command tools.
 *
 * Each tool has:
 *   name        – dotted name (e.g. vibe.spec)
 *   description – short description
 *   risk        – low-risk (read-only), safe
 *   inputSchema – JSON Schema describing expected arguments
 *   handler     – async (args) => { ... } that reads files and returns context
 */
export function buildCommandTools(root) {
  const base = root || process.cwd();

  return [
    // ── vibe.spec ──────────────────────────────────────────────────────────
    {
      name: 'vibe.spec',
      description:
        'Read the vibe-spec command and return structured context for drafting ' +
        'or updating an implementation spec with goals, non-goals, behavior, ' +
        'edge cases, acceptance criteria, and verification strategy.',
      risk: { level: 'safe' },
      inputSchema: {
        type: 'object',
        properties: {
          request: {
            type: 'string',
            description:
              'User request or product requirement — the core intent to spec out.',
          },
          specPath: {
            type: 'string',
            description:
              'Path to an existing spec file when updating rather than creating from scratch.',
          },
        },
        required: ['request'],
        additionalProperties: false,
      },
      handler: async (args) => {
        const command = await readRelative(base, path.join(COMMANDS_DIR, 'vibe-spec.md'));
        const related = await readRelated(base, [
          { label: 'skill.spec-first-development', file: path.join(SKILLS_DIR, 'core', 'spec-first-development', 'SKILL.md') },
          { label: 'skill.clarify-before-code',    file: path.join(SKILLS_DIR, 'core', 'clarify-before-code', 'SKILL.md') },
          { label: 'skill.ask-when-confused',       file: path.join(SKILLS_DIR, 'prompts', 'ask-when-confused', 'SKILL.md') },
          { label: 'template.spec',                file: path.join(TEMPLATES_DIR, 'spec-template.md') },
        ]);

        return {
          tool: 'vibe.spec',
          command: 'vibe-spec',
          commandContent: command,
          userRequest: args.request,
          existingSpecPath: args.specPath || null,
          relatedSkills: related,
          instruction:
            'Use the command definition above to draft or update an implementation ' +
            'spec. Read the related skills for detailed workflow guidance and the ' +
            'template for the expected output format. Return the completed spec.',
        };
      },
    },

    // ── vibe.plan ──────────────────────────────────────────────────────────
    {
      name: 'vibe.plan',
      description:
        'Read the vibe-plan command and return structured context for converting ' +
        'an accepted spec into ordered implementation steps, target files, risks, ' +
        'rollback points, and validation commands.',
      risk: { level: 'safe' },
      inputSchema: {
        type: 'object',
        properties: {
          spec: {
            type: 'string',
            description:
              'Accepted spec or clear requirement summary to plan from.',
          },
          request: {
            type: 'string',
            description:
              'Original user request or context that led to the spec (optional).',
          },
        },
        required: ['spec'],
        additionalProperties: false,
      },
      handler: async (args) => {
        const command = await readRelative(base, path.join(COMMANDS_DIR, 'vibe-plan.md'));
        const related = await readRelated(base, [
          { label: 'skill.plan-driven-execution', file: path.join(SKILLS_DIR, 'core', 'plan-driven-execution', 'SKILL.md') },
          { label: 'skill.spec-first-development', file: path.join(SKILLS_DIR, 'core', 'spec-first-development', 'SKILL.md') },
          { label: 'skill.anti-overengineering',   file: path.join(SKILLS_DIR, 'prompts', 'anti-overengineering', 'SKILL.md') },
          { label: 'template.plan',                file: path.join(TEMPLATES_DIR, 'plan-template.md') },
          { label: 'template.task',                file: path.join(TEMPLATES_DIR, 'task-template.md') },
        ]);

        return {
          tool: 'vibe.plan',
          command: 'vibe-plan',
          commandContent: command,
          spec: args.spec,
          userRequest: args.request || null,
          relatedSkills: related,
          instruction:
            'Use the command definition above to create an execution plan from ' +
            'the provided spec. Read the related skills for workflow guidance and ' +
            'the templates for expected output formats. Return the completed plan.',
        };
      },
    },

    // ── vibe.review ────────────────────────────────────────────────────────
    {
      name: 'vibe.review',
      description:
        'Read the vibe-review command and return structured context for reviewing ' +
        'the current diff against the spec and plan, prioritizing blockers, missing ' +
        'tests, security, attribution, and scope control.',
      risk: { level: 'safe' },
      inputSchema: {
        type: 'object',
        properties: {
          diff: {
            type: 'string',
            description: 'The current diff or branch name to review.',
          },
          spec: {
            type: 'string',
            description:
              'Spec, plan, acceptance criteria, or explicit scope statement to review against.',
          },
          validationResults: {
            type: 'string',
            description:
              'Validation results already run, including failures and limitations (optional).',
          },
        },
        required: ['diff', 'spec'],
        additionalProperties: false,
      },
      handler: async (args) => {
        const command = await readRelative(base, path.join(COMMANDS_DIR, 'vibe-review.md'));
        const related = await readRelated(base, [
          { label: 'skill.reviewer-agent',          file: path.join(SKILLS_DIR, 'agents', 'reviewer-agent', 'SKILL.md') },
          { label: 'skill.review-before-merge',     file: path.join(SKILLS_DIR, 'core', 'review-before-merge', 'SKILL.md') },
          { label: 'skill.verification-before-done', file: path.join(SKILLS_DIR, 'core', 'verification-before-done', 'SKILL.md') },
          { label: 'skill.privacy-filter',          file: path.join(SKILLS_DIR, 'memory', 'privacy-filter', 'SKILL.md') },
          { label: 'template.review',               file: path.join(TEMPLATES_DIR, 'review-template.md') },
        ]);

        return {
          tool: 'vibe.review',
          command: 'vibe-review',
          commandContent: command,
          diff: args.diff,
          spec: args.spec,
          validationResults: args.validationResults || null,
          relatedSkills: related,
          instruction:
            'Use the command definition above to review the provided diff against ' +
            'the spec/acceptance criteria. Read the related skills for detailed ' +
            'review guidance and the template for the expected output format. ' +
            'Return findings sorted as: Blockers, Suggestions, Nits, Verification notes.',
        };
      },
    },

    // ── vibe.memory ────────────────────────────────────────────────────────
    {
      name: 'vibe.memory',
      description:
        'Read the vibe-memory-ingest command and return structured context for ' +
        'creating a privacy-filtered durable memory entry using structured ' +
        'ingestion phases (classify → capture → filter → extract → format → store).',
      risk: { level: 'safe' },
      inputSchema: {
        type: 'object',
        properties: {
          content: {
            type: 'string',
            description:
              'Candidate memory content or facts to ingest.',
          },
          source: {
            type: 'string',
            enum: ['session', 'decision', 'review', 'debug'],
            description:
              'Source type flag. Defaults to "session" if omitted.',
          },
          scope: {
            type: 'string',
            description:
              'Memory scope (session, worktree, project). Inferred from source if omitted.',
          },
        },
        required: ['content'],
        additionalProperties: false,
      },
      handler: async (args) => {
        const command = await readRelative(base, path.join(COMMANDS_DIR, 'vibe-memory-ingest.md'));
        const related = await readRelated(base, [
          { label: 'skill.memory-ingestion',     file: path.join(SKILLS_DIR, 'memory', 'memory-ingestion', 'SKILL.md') },
          { label: 'skill.privacy-filter',        file: path.join(SKILLS_DIR, 'memory', 'privacy-filter', 'SKILL.md') },
          { label: 'skill.local-first-memory',    file: path.join(SKILLS_DIR, 'memory', 'local-first-memory', 'SKILL.md') },
          { label: 'skill.memory-retrieval',      file: path.join(SKILLS_DIR, 'memory', 'memory-retrieval', 'SKILL.md') },
        ]);

        return {
          tool: 'vibe.memory',
          command: 'vibe-memory-ingest',
          commandContent: command,
          content: args.content,
          source: args.source || 'session',
          scope: args.scope || null,
          relatedSkills: related,
          instruction:
            'Use the command definition above to create a privacy-filtered memory ' +
            'entry. Follow the ingestion phases: classify → capture → filter → ' +
            'extract → format → store. Read the related skills for detailed ' +
            'guidance on each phase. Return the structured memory entry.',
        };
      },
    },

    // ── vibe.merge ─────────────────────────────────────────────────────────
    {
      name: 'vibe.merge',
      description:
        'Read the vibe-merge command and return structured context for assessing ' +
        'merge readiness by checking scope, acceptance criteria, validation, ' +
        'attribution, security, and follow-ups.',
      risk: { level: 'safe' },
      inputSchema: {
        type: 'object',
        properties: {
          spec: {
            type: 'string',
            description:
              'Spec, plan, acceptance criteria, or explicit scope statement.',
          },
          branch: {
            type: 'string',
            description:
              'Current branch name or git status summary.',
          },
          reviewFindings: {
            type: 'string',
            description:
              'Review findings and their resolution status (optional).',
          },
          validationResults: {
            type: 'string',
            description:
              'Validation commands and their results (optional).',
          },
        },
        required: ['spec', 'branch'],
        additionalProperties: false,
      },
      handler: async (args) => {
        const command = await readRelative(base, path.join(COMMANDS_DIR, 'vibe-merge.md'));
        const related = await readRelated(base, [
          { label: 'skill.review-before-merge',      file: path.join(SKILLS_DIR, 'core', 'review-before-merge', 'SKILL.md') },
          { label: 'skill.verification-before-done',  file: path.join(SKILLS_DIR, 'core', 'verification-before-done', 'SKILL.md') },
          { label: 'skill.privacy-filter',           file: path.join(SKILLS_DIR, 'memory', 'privacy-filter', 'SKILL.md') },
          { label: 'template.review',                file: path.join(TEMPLATES_DIR, 'review-template.md') },
        ]);

        return {
          tool: 'vibe.merge',
          command: 'vibe-merge',
          commandContent: command,
          spec: args.spec,
          branch: args.branch,
          reviewFindings: args.reviewFindings || null,
          validationResults: args.validationResults || null,
          relatedSkills: related,
          instruction:
            'Use the command definition above to produce a merge-readiness report. ' +
            'Read the related skills for detailed guidance. Return the report with: ' +
            'Readiness, Scope check, Acceptance criteria status, Validation status, ' +
            'Attribution/security check, Open follow-ups, Recommended next action.',
        };
      },
    },
  ];
}
