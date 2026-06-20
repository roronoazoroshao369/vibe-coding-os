---
title: Memory Compression Template
type: template
name: memory-compression-template
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: memory
tags:
  - template
  - memory
status: stable
---

# Memory Compression Template

> Do not store secrets in compressed entries. All inputs must have passed privacy filtering before compression. Compressed entries inherit the privacy_status of their sources.

## Vietnamese usage note

Ghi chú tiếng Việt: Mẫu này dùng để tạo mục nén từ các quan sát phiên. Luôn gán confidence, staleness_risk và privacy_status cho mỗi mục. Không nén dữ liệu chưa qua lọc quyền riêng tư.

## Purpose

Structure compressed memory entries produced by transforming noisy session observations into concise, durable, machine-parseable facts with provenance, confidence scoring, and lifecycle metadata.

## Source field reference

- `{compressed_entries}` — list of compressed entry objects
- `{summary}` — one-to-two-sentence durable fact
- `{source_ids}` — list of observation IDs, file paths, session IDs, or timestamps
- `{confidence}` — high | medium | low
- `{staleness_risk}` — fresh | moderate | stale
- `{privacy_status}` — public | internal | sensitive | secret-redacted
- `{compression}` — semantic-summarization | noise-reduction | citation-preservation
- `{supersedes}` — optional list of entry IDs this entry replaces
- `{superseded_by}` — optional list of entry IDs that replace this entry
- `{compression_report}` — analysis metadata for the compression run

## Schema

```yaml
compression_report:
  input_count: {number_of_raw_inputs}
  output_count: {number_of_compressed_entries}
  strategy_used: "{strategy}"
  privacy_actions: "{none | redacted-count:N | rejected:N}"
  created: "{ISO-8601-timestamp}"

compressed_entries:
  - summary: "{concise durable fact}"
    source_ids:
      - "{source-id-1}"
      - "{source-id-2}"
    confidence: "high|medium|low"
    staleness_risk: "fresh|moderate|stale"
    privacy_status: "public|internal|sensitive|secret-redacted"
    compression: "semantic-summarization|noise-reduction|citation-preservation"
    supersedes:
      - "{optional-previous-entry-id}"
    superseded_by:
      - "{optional-newer-entry-id}"

  - summary: "{next concise durable fact}"
    source_ids:
      - "{source-id-3}"
    confidence: "medium"
    staleness_risk: "fresh"
    privacy_status: "internal"
    compression: "noise-reduction"
```

## Compression quality checklist

- [ ] Each summary is one to two sentences, actionable, and free of conversational framing.
- [ ] source_ids are present and traceable (observation IDs, file paths, or session IDs).
- [ ] confidence reflects source reliability and corroboration.
- [ ] staleness_risk reflects the oldest source timestamp and fact volatility.
- [ ] privacy_status is consistent with source entries and privacy filtering.
- [ ] supersedes / superseded_by links maintained when replacing entries.
- [ ] compression_report captures input/output counts and strategy used.
- [ ] No secrets, credentials, tokens, or unnecessary personal data.

## Ghi chú tiếng Việt

Mỗi mục nén phải có summary, source_ids, confidence, staleness_risk, privacy_status và compression tag. Báo cáo nén phải ghi số đầu vào, số đầu ra và chiến lược đã dùng.
