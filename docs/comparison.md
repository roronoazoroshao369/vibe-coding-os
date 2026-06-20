# Vibe Coding OS vs Alternatives

A pragmatic comparison for teams choosing an AI coding assistant platform.

## TL;DR

Vibe Coding OS is **prompt-only middleware** for AI coding tools. It does not replace your model, your editor, or your CI. It sits **on top** of any AI CLI/agent (Claude Code, Codex, Cursor, Gemini) and provides a curated library of skills, commands, templates, and validation gates — all in markdown.

If you want a **chatbot framework** (LangChain), a **Python agent SDK** (Semantic Kernel), or a **full IDE** (Cursor Pro), those solve different problems. Vibe Coding OS solves: "I have an AI tool — how do I make it consistently good at quality, security, and workflow?"

## Comparison table

| Dimension | Vibe Coding OS | LangChain | Semantic Kernel | Microsoft Prompts | Cursor Pro | GitHub Copilot |
|-----------|---------------|-----------|-----------------|-------------------|-----------|----------------|
| **What it is** | Prompt + skill library | Python LLM framework | .NET agent SDK | Eval library | IDE with AI | IDE extension |
| **Primary artifact** | Markdown files (skills/commands/templates) | Python code | C# code | JSON config | VS Code fork | VS Code extension |
| **Language** | Markdown + JSON | Python | C# / Python | Python | TypeScript | TypeScript |
| **Runtime required** | None (markdown is the runtime) | Python | .NET | Python | Electron app | VS Code |
| **Vendor lock-in** | None — markdown is portable | LangChain API | Microsoft | OpenAI-leaning | Cursor | GitHub |
| **Model-agnostic** | Yes (5 adapters: Claude, Codex, Cursor, Gemini, Memory) | Yes (any API) | Yes (any API) | Partial | Limited | Limited |
| **Skill library size** | 148 skills, 115 commands, 119 templates | None | None | None | None | None |
| **Validation gates** | 33 automated gates | None | None | Manual | None | None |
| **Self-hosted** | Yes (clone repo, copy files) | Yes | Yes | Yes | No (SaaS) | No (SaaS) |
| **Audit trail** | Yes (ADR + deprecation tracker + bypass log) | App-level | App-level | Eval runs | None | None |
| **Cost** | Free, MIT | Free, MIT | Free, MIT | Free, MIT | $20/mo | $10-39/mo |
| **License** | MIT | MIT | MIT | MIT | Proprietary | Proprietary |
| **Contributors** | Open source | Open source | Open source | Open source | Closed | Closed |

## When to use what

### Choose **Vibe Coding OS** if you:

- Already use an AI coding tool (Claude Code, Codex, Cursor, Gemini)
- Want a consistent quality bar across all AI-generated code
- Need a portable prompt library that doesn't tie you to a vendor
- Want to audit every prompt before it ships (markdown is diffable)
- Prefer markdown over Python/C# for AI orchestration
- Run multiple AI tools and want one source of truth for prompts

### Choose **LangChain** if you:

- Building a Python LLM application (chatbot, RAG, agent)
- Need chains, agents, retrievers, memory as Python primitives
- Want a large ecosystem of integrations (VectorDBs, loaders, etc.)
- Don't mind code-level configuration

### Choose **Semantic Kernel** if you:

- Building on .NET / C# stack
- Want first-class Microsoft support
- Need enterprise features (Azure integration)

### Choose **Cursor Pro** if you:

- Want a full IDE with AI built-in
- Don't need portable prompts (work only in Cursor)
- Budget allows $20/mo

### Choose **GitHub Copilot** if you:

- Already use VS Code and GitHub heavily
- Want inline suggestions, not full workflows
- Don't need portable prompts

## What Vibe Coding OS does NOT do

- **Run a model** — you bring your own (Claude, GPT, Gemini, etc.)
- **Provide an IDE** — use any editor with an AI tool
- **Generate code autonomously** — that is the AI tool's job, not ours
- **Train models** — we ship prompts, not weights
- **Manage secrets** — we provide redactor; storage is your problem

## What Vibe Coding OS DOES do

- **Curate 148 skills** that cover common coding workflows (debug, refactor, ship, security, docs, tests)
- **Provide 115 commands** (slash-style) for direct AI invocation
- **Ship 119 templates** for predictable output (contracts, scorecards, ADRs)
- **Run 33 automated validation gates** before any release (CI-friendly)
- **Track decisions** via ADRs (Architecture Decision Records)
- **Warn on deprecations** with grace periods (no surprise removals)
- **Enable cross-tool portability** — same skills work in Claude Code, Codex, Cursor, Gemini

## Migration story

### From LangChain → Vibe Coding OS

LangChain: `chain.run(input)`
Vibe: `@skill: brainstorm` (in Claude Code) or `/vibe-brainstorm` (in Cursor)

Migration effort: low. You keep your Python app; you replace chain invocation with prompt invocation. Skills become part of your system prompt.

### From Cursor-only → Vibe + multi-tool

Cursor: paste prompt into chat
Vibe: install adapter, use same skill across all tools

Migration effort: medium. You set up the adapter once, then your prompts work everywhere.

### From ad-hoc prompting → Vibe

Currently: typing prompts into a chatbot
Vibe: install skills, use commands, validate output

Migration effort: low. Start with one workflow (e.g. bug-fix), expand as needed.

## See also

- [`docs/quality-shield.md`](quality-shield.md) — the workflow Vibe enables
- [`docs/adapters/`](adapters/) — supported AI tools
- [`docs/SKILL-PACKS.md`](SKILL-PACKS.md) — how skills are organized
- [`README.md`](../README.md) — installation
- [`docs/QUICKSTART.md`](QUICKSTART.md) — 5-minute tutorial

## Contributing

Spotted a missing comparison? See [`docs/CONTRIBUTING-SKILLS.md`](CONTRIBUTING-SKILLS.md) for the docs authoring convention. Run `node scripts/docs-author` for the section template.
