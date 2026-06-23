/**
 * score-rubric.mjs — deterministic clean-code rubric (0..5).
 *
 * Five binary checks, 1 point each. Intentionally simple and explainable
 * so the score is reproducible without a judge model. A judge model can
 * be layered on later via config.scoring.judgeModel.
 */

export function scoreRubric({ code, task }) {
  const lines = code.split('\n');
  const nonEmpty = lines.filter((l) => l.trim());
  const breakdown = {};

  // 1. Has a definition (not just a stub / not empty).
  breakdown.hasImplementation =
    /\b(def|function|func)\b/.test(code) && nonEmpty.length >= 3;

  // 2. No obvious dead code / leftover debug prints.
  breakdown.noDebugCruft =
    !/console\.log\(|print\((['"]?(debug|todo|xxx)|.*#\s*debug)/i.test(code) &&
    !/TODO|FIXME|XXX/.test(code);

  // 3. Some error / edge handling present (try/except, if-guard, validation).
  breakdown.handlesEdges =
    /\b(try|except|catch|raise|throw|if\s+not|if\s+.*==|return\s+\[\])/.test(code);

  // 4. Reasonable size — not wildly larger than the reference solution.
  breakdown.concise =
    task.referenceLoc
      ? nonEmpty.length <= task.referenceLoc * 3
      : nonEmpty.length <= 60;

  // 5. Naming: no single-letter public names for the entrypoint function.
  breakdown.naming =
    !/\b(def|function|func)\s+[a-z]\b/.test(code);

  const score = Object.values(breakdown).filter(Boolean).length;
  return { score, breakdown };
}
