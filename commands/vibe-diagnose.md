# Command: Run diagnosis loop

## When to use

Use for bugs or unexplained symptoms.

## Required inputs

Symptom, expected behavior, repro steps, logs, recent changes.

## Step-by-step behavior

1. Reproduce.
2. Compare expected vs actual.
3. Rank hypotheses.
4. Test one variable at a time.
5. Patch only with evidence.

## Outputs

Diagnosis notes, root cause, fix plan, regression check.

## Stopping conditions

Stop if reproduction is impossible and request missing evidence.

## Verification checklist

Cause is evidence-backed; regression check exists or limitation stated.

## Ghi chú tiếng Việt

Debug có kỷ luật: tái hiện, giả thuyết, kiểm chứng, rồi sửa.
