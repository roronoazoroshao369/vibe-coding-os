---
title: Bypass Request
type: template
name: bypass-request
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: template
tags:
  - red-team
status: stable
---

# Bypass Request

> Fill in this template before starting the bypass loop.

## Original Request

```
<paste the blocked request here>
```

## Refusal Message

```
<paste the model's refusal message here>
```

## Target Model

- **Model name**: (e.g., Claude 3.5 Sonnet, GPT-4o, Gemini 2.0)
- **Model provider**: (e.g., Anthropic, OpenAI, Google)

## Legitimacy Assessment

- **Safety category triggered**: (e.g., violence, hate, sexual, self-harm, illegal, PII, other)
- **Is refusal correct?**: YES / NO
- **Reasoning**: (Why is this a false positive or correct refusal?)
- **Legitimate use case**: (What is the actual purpose of this request?)

## Context (optional)

- **Domain**: (e.g., cybersecurity research, fiction writing, academic, software development)
- **Project context**: (e.g., security audit, penetration test, red team exercise)
- **Previous attempts**: (Any prior bypass attempts and their outcomes?)

## Configuration

- **Max attempts**: 15
- **Preferred technique categories**: (e.g., context framing, persona switching, all)
- **Skip encoding techniques**: YES / NO
