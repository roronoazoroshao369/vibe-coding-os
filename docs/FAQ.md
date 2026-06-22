# Frequently Asked Questions (FAQ)

> Real questions from real users of Vibe Coding OS. Updated based on GitHub issues and Discord discussions.

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is Vibe Coding OS?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Vibe Coding OS is a curated library of 115 skills, 116 commands, and 107 templates that augment any AI coding tool (Claude Code, Codex, Cursor, Gemini). It's prompt-only middleware — markdown files that ship workflows, contracts, and validation gates."
      }
    },
    {
      "@type": "Question",
      "name": "Is Vibe Coding OS a runtime?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. Per ADR 0002, the runtime is frozen. Vibe Coding OS is a prompt and skill library, not an agent framework. You bring your own AI tool; we provide the prompts to use with it."
      }
    },
    {
      "@type": "Question",
      "name": "How is it different from LangChain?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "LangChain is a Python framework for building LLM applications. Vibe Coding OS is a portable prompt library that works with any AI tool. See docs/comparison.md for a full comparison."
      }
    },
    {
      "@type": "Question",
      "name": "Can I use it with [my AI tool]?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Probably. We ship adapters for Claude Code, Codex, Cursor, Gemini, and Memory. For other tools, copy the skill markdown into your tool's prompt. See docs/adapters/ for installation instructions."
      }
    },
    {
      "@type": "Question",
      "name": "What's the license?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "MIT. You can use it commercially, modify it, and redistribute. Attribution appreciated but not required."
      }
    },
    {
      "@type": "Question",
      "name": "How do I install a single skill?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Skills are distributed as plain markdown files. Copy skills/<category>/<skill-name>/SKILL.md directly into your project's skill directory. All skills work with any AI agent that reads markdown."
      }
    },
    {
      "@type": "Question",
      "name": "How are skills validated?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Every release goes through 33 automated validation gates: structure, traceability, injection scan, secret scan, redaction, sandbox marker, runtime freeze, license, roadmap drift, and more. See `npm run validate:all`."
      }
    },
    {
      "@type": "Question",
      "name": "How do I report a security issue?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Open a private security advisory on GitHub: https://github.com/roronoazoroshao369/vibe-coding-os/security/advisories/new. Do not file a public issue for security bugs."
      }
    },
    {
      "@type": "Question",
      "name": "Why markdown instead of code?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Markdown is portable across every AI tool, diffable in git, reviewable by humans, and doesn't require any runtime. Skills are essentially prompt-as-code."
      }
    },
    {
      "@type": "Question",
      "name": "Can I write my own skills?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Use the docs-author skill (skills/core/docs-author/SKILL.md) for the 5-section convention. Add your skill under skills/<category>/, register it in registry/skills.json, run npm run validate:all, and open a PR."
      }
    }
  ]
}
</script>

## Questions

### What is Vibe Coding OS?

A curated library of 115 skills, 116 commands, and 107 templates that augment any AI coding tool (Claude Code, Codex, Cursor, Gemini). It's prompt-only middleware — markdown files that ship workflows, contracts, and validation gates.

### Is Vibe Coding OS a runtime?

No. Per [ADR 0002](adr/0002-runtime-scope-freeze.md), the runtime is frozen. Vibe Coding OS is a prompt and skill library, not an agent framework. You bring your own AI tool; we provide the prompts to use with it.

### How is it different from LangChain?

LangChain is a Python framework for building LLM applications. Vibe Coding OS is a portable prompt library that works with any AI tool. See [`docs/comparison.md`](comparison.md) for a full comparison.

### Can I use it with [my AI tool]?

Probably. We ship adapters for Claude Code, Codex, Cursor, Gemini, and Memory. For other tools, copy the skill markdown into your tool's prompt. See [`docs/adapters/`](adapters/) for installation instructions.

### What's the license?

MIT. You can use it commercially, modify it, and redistribute. Attribution appreciated but not required.

### How do I install a single skill?

Copy the skill's `SKILL.md` file from `skills/<category>/<skill-name>/` into your project. All skills are plain markdown.

### How are skills validated?

Every release goes through 33 automated validation gates: structure, traceability, injection scan, secret scan, redaction, sandbox marker, runtime freeze, license, roadmap drift, and more. See `npm run validate:all`.

### How do I report a security issue?

Open a private security advisory on GitHub: https://github.com/roronoazoroshao369/vibe-coding-os/security/advisories/new. Do not file a public issue for security bugs.

### Why markdown instead of code?

Markdown is portable across every AI tool, diffable in git, reviewable by humans, and doesn't require any runtime. Skills are essentially prompt-as-code.

### Can I write my own skills?

Yes. Use the docs-author skill (`skills/core/docs-author/SKILL.md`) for the 5-section convention. Add your skill under `skills/<category>/`, register it in `registry/skills.json`, run `npm run validate:all`, and open a PR.

## Still have questions?

- Open a [GitHub Discussion](https://github.com/roronoazoroshao369/vibe-coding-os/discussions)
- File an [issue](https://github.com/roronoazoroshao369/vibe-coding-os/issues)
- Read the [main docs](../README.md)

## Contributing to this FAQ

Edit [`docs/FAQ.md`](FAQ.md). Add new Q&A to both the visible section AND the JSON-LD `<script>` block at the top so search engines can index it.
