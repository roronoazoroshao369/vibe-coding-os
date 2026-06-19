# Skill: Memory Compression

## Purpose

Transform noisy session observations into concise, durable facts. Compression reduces redundancy, elevates signal, and produces machine-parseable entries suitable for long-term memory storage.

## When to use

Use after a session capture, before storing raw observations, when consolidating multiple related memory entries, or before a context handoff to reduce token overhead. Also use when periodic digests produce more observations than durable facts.

## Inputs

- Raw observations from session capture or conversation turns.
- Multiple related memory entries to merge/deduplicate.
- Session notes, command outputs, or decision logs.
- Existing memory entries with overlapping scope.

## Three Compression Strategies

Compression follows one of three strategies depending on the input characteristics:

### 1. Semantic Summarization

Condense verbose observations into their essential meaning while preserving actionable intent.

- Drop conversational framing ("I think", "it seems like", "maybe we could").
- Preserve decisions, constraints, file paths, commands run, and outcomes.
- Merge equivalent observations from different turns into a single fact.
- Tag with `compression: semantic-summarization`.

### 2. Noise Reduction

Filter out transient, speculative, or low-confidence material that does not warrant durable storage.

- Remove coordination chatter ("let's circle back", "I'll check later").
- Suppress observations with confidence below a configurable threshold (default: low).
- Eliminate duplicate facts that differ only in wording.
- Tag with `compression: noise-reduction`.

### 3. Citation Preservation

When compressing, retain source provenance even as detail is stripped.

- Attach source IDs (observation IDs, session IDs, file paths, timestamps) to each compressed fact.
- Preserve the earliest and latest source timestamps for staleness calculation.
- Link to superseded entries via `supersedes` or `superseded_by` fields.
- Tag with `compression: citation-preservation`.

## Compression Lifecycle

The compression process follows four explicit phases:

1. **Analyze** — Examine the input material for signal density, duplication, confidence distribution, and privacy risk. Classify each observation's durability (durable, transient, speculative). Determine which compression strategy (or combination) is appropriate.

2. **Compress** — Apply the chosen strategy. For semantic summarization: condense each durable fact to one or two sentences. For noise reduction: remove observations below the durability threshold. For citation preservation: map each output fact back to its source IDs.

3. **Score** — Assign each compressed entry:
   - **Confidence score**: low | medium | high — reflecting how certain the fact is based on source reliability and corroboration.
   - **Staleness risk**: fresh | moderate | stale — based on oldest source timestamp and the nature of the fact.
   - **Privacy status**: public | internal | sensitive | secret-redacted — carried forward from privacy filtering.

4. **Output** — Structure the result as a list of compressed entries conforming to the memory-compression template. Each entry includes source_ids, confidence, staleness_risk, privacy_status, and the compressed summary.

## Template Structure

Each compressed entry follows this schema:

```yaml
compressed_entries:
  - summary: "<one-to-two-sentence durable fact>"
    source_ids:
      - "<observation-id-or-file-path>"
    confidence: "high|medium|low"
    staleness_risk: "fresh|moderate|stale"
    privacy_status: "public|internal|sensitive|secret-redacted"
    compression: "semantic-summarization|noise-reduction|citation-preservation"
    supersedes:
      - "<optional-id-of-superseded-entry>"
    superseded_by:
      - "<optional-id-of-replacement-entry>"
```

## Privacy-Filter Integration

Compression is not a substitute for privacy filtering. Every input observation should already have passed the privacy filter before reaching the compressor. However, the compression phase re-checks:

- **Before compress**: verify that input observations are free of secrets. Flag any material that bypassed the privacy gate.
- **During compress**: redact any residual sensitive patterns using the project's privacy exclusion list.
- **Before output**: final integrity check — all compressed entries must carry a privacy_status. Entries with unresolved sensitive data are rejected.

## Workflow

1. Classify each input observation as durable, transient, or speculative.
2. Select the appropriate compression strategy (or combination):
   - High noise + low signal → noise reduction first.
   - Verbose but factual → semantic summarization.
   - Multiple related entries → citation preservation (merge with provenance).
3. Run compression lifecycle: analyze → compress → score → output.
4. Apply privacy re-check at each phase gate.
5. Assign confidence, staleness risk, and privacy status to each compressed entry.
6. Record supersession links when compressing replaces or merges existing entries.
7. Store only compressed entries that pass quality and privacy checks.

## Outputs

- List of compressed memory entries with: summary, source_ids, confidence, staleness_risk, privacy_status, compression strategy tag.
- Supersession map linking new compressed entries to the entries they replace.
- Compression report: input count → output count, strategy used, privacy actions taken.

## Failure modes

- Over-compressing: losing important nuance or context.
- Under-compressing: retaining noise that wastes storage and retrieval budget.
- Breaking citation chains: losing provenance when merging entries.
- Forgetting privacy re-check: allowing sensitive data through the compression gate.
- Mis-scoring confidence: assigning high confidence to speculative material.
- Applying wrong strategy (e.g., summarization when noise reduction was needed).

## Verification checklist

- [ ] Each input observation classified (durable / transient / speculative).
- [ ] Compression strategy selected and documented.
- [ ] Compression lifecycle followed: analyze → compress → score → output.
- [ ] Privacy re-check performed at each phase gate.
- [ ] Confidence, staleness_risk, and privacy_status assigned to each compressed entry.
- [ ] Supersession links recorded when replacing existing entries.
- [ ] Output is concise, actionable, and traceable to source IDs.
- [ ] Compression report generated with input count, output count, and strategy.

## Ghi chú tiếng Việt

Kỹ năng này nén các quan sát phiên làm việc thành sự kiện bền vững. Luôn phân loại độ bền (durable/transient/speculative), chọn chiến lược nén phù hợp, và gán confidence, staleness_risk, privacy_status cho mỗi mục nén. Không nén khi dữ liệu đầu vào chưa qua bộ lọc quyền riêng tư.
