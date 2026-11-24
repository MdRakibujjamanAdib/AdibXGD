import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';

interface SuiteInfo {
  file: string;
  testCount: number;
}

interface SuiteResult {
  file: string;
  testCount: number;
  passed: boolean;
  duration: number;
}

const PREFERRED_ORDER = [
  'tests/search-typo-tolerance.test.ts',
  'tests/tier1-feature-coverage.test.ts',
  'tests/tier2-boundary-corner.test.ts',
  'tests/tier3-cross-feature.test.ts',
  'tests/tier4-application-scenarios.test.ts',
  'tests/tier5-adversarial.test.ts',
];

function discoverTestSuites(): string[] {
  const testsDir = path.join(process.cwd(), 'tests');
  if (!fs.existsSync(testsDir)) {
    return [];
  }

  const found = fs
    .readdirSync(testsDir)
    .filter((name) => name.endsWith('.test.ts'))
    .map((name) => `tests/${name}`);

  const ordered: string[] = [];
  for (const preferred of PREFERRED_ORDER) {
    if (found.includes(preferred)) {
      ordered.push(preferred);
    }
  }
  for (const remaining of found.sort()) {
    if (!ordered.includes(remaining)) {
      ordered.push(remaining);
    }
  }
  return ordered;
}

function countTestsInFile(relPath: string): number {
  const absPath = path.join(process.cwd(), relPath);
  if (!fs.existsSync(absPath)) return 0;
  const content = fs.readFileSync(absPath, 'utf-8');

  const itMatches = content.match(/(?:^|\n)\s*it\s*\(/g) || [];
  const subtestMatches = content.match(/(?:^|\n)\s*(?:await\s+)?t\.test\s*\(/g) || [];
  if (itMatches.length > 0 || subtestMatches.length > 0) {
    return itMatches.length + subtestMatches.length;
  }

  const topTestMatches = content.match(/(?:^|\n)\s*(?:await\s+)?test\s*\(/g) || [];
  return topTestMatches.length;
}

const args = new Set(process.argv.slice(2));
const skipLint = args.has('--skip-lint');
const includeAdversarial = args.has('--adversarial');

const suites: SuiteInfo[] = discoverTestSuites().map((file) => ({
  file,
  testCount: countTestsInFile(file),
}));

const totalDiscoveredTests = suites.reduce((sum, s) => sum + s.testCount, 0);

console.log('====================================================');
console.log(`Running Complete Verification Test Suite (${totalDiscoveredTests} Tests across ${suites.length} Suites)`);
console.log('====================================================\n');

let allPassed = true;
const results: SuiteResult[] = [];

if (!skipLint) {
  console.log('▶ Running TypeScript Type Check (npx tsc --noEmit)...');
  const lintStart = Date.now();
  const lintRes = spawnSync('npx', ['tsc', '--noEmit'], {
    stdio: 'inherit',
    shell: true,
  });
  const lintDuration = Date.now() - lintStart;
  const lintPassed = lintRes.status === 0;
  results.push({
    file: 'TypeScript Check (tsc --noEmit)',
    testCount: 1,
    passed: lintPassed,
    duration: lintDuration,
  });

  if (!lintPassed) {
    allPassed = false;
    console.error(`✖ TypeScript Check FAILED (exit code ${lintRes.status})\n`);
  } else {
    console.log(`✔ TypeScript Check PASSED in ${(lintDuration / 1000).toFixed(1)}s\n`);
  }
}

for (const suite of suites) {
  console.log(`▶ Running ${suite.file} (${suite.testCount} tests)...`);
  const start = Date.now();
  const res = spawnSync('npx', ['tsx', '--test', suite.file], {
    stdio: 'inherit',
    shell: true,
  });
  const duration = Date.now() - start;
  const passed = res.status === 0;
  results.push({ file: suite.file, testCount: suite.testCount, passed, duration });

  if (!passed) {
    allPassed = false;
    console.error(`✖ ${suite.file} FAILED (exit code ${res.status})\n`);
  } else {
    console.log(`✔ ${suite.file} PASSED in ${(duration / 1000).toFixed(1)}s\n`);
  }
}

if (includeAdversarial) {
  const advScript = 'scripts/adversarial-suite.mjs';
  console.log(`▶ Running ${advScript}...`);
  const start = Date.now();
  const res = spawnSync('node', [advScript], {
    stdio: 'inherit',
    shell: true,
  });
  const duration = Date.now() - start;
  const passed = res.status === 0;
  results.push({ file: advScript, testCount: 1, passed, duration });
  if (!passed) {
    allPassed = false;
    console.error(`✖ ${advScript} FAILED (exit code ${res.status})\n`);
  } else {
    console.log(`✔ ${advScript} PASSED in ${(duration / 1000).toFixed(1)}s\n`);
  }
}

const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);

console.log('====================================================');
console.log(`Test Summary (${totalDiscoveredTests} tests, ${(totalDuration / 1000).toFixed(1)}s total):`);
results.forEach((r) => {
  console.log(
    `  ${r.passed ? '✔ PASS' : '✖ FAIL'} - ${r.file} [${r.testCount}] (${(r.duration / 1000).toFixed(1)}s)`
  );
});
console.log('====================================================');

if (!allPassed) {
  process.exit(1);
} else {
  console.log('ALL TEST SUITES PASSED CLEANLY (100% SUCCESS RATE)!');
}
