// src/tests/acceptance/core/qa-summary.ts

type TestResult = {
  passed: boolean;
};

type QaSummary = {
  total: number;
  passed: number;
  failed: number;
};

/**
 * Calculates a summary of test results from a simple array of pass/fail objects.
 */
export function buildQaSummary(results: TestResult[]): QaSummary {
  const total = results.length;
  const passed = results.filter(r => r.passed).length;
  const failed = total - passed;

  return {
    total,
    passed,
    failed,
  };
}
