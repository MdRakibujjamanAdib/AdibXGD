import { spawn, spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';

interface SuiteInfo {
  file: string;
  testCount: number;
}

interface SuiteResult {
  file: string;
  testCount: number;
  passCount: number;
  failCount: number;
  passed: boolean;
  duration: number;
}

const PREFERRED_ORDER = [
  'tests/search-typo-tolerance.test.ts',
  'tests/theme-persistence.test.ts',
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

function runSuiteLive(file: string, fallbackCount: number): Promise<{
  status: number;
  testCount: number;
  passCount: number;
  failCount: number;
}> {
  return new Promise((resolve) => {
    const child = spawn('npx', ['tsx', '--test', file], {
      cwd: process.cwd(),
      shell: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let combined = '';
    child.stdout?.on('data', (chunk) => {
      const text = chunk.toString();
      combined += text;
      process.stdout.write(text);
    });
    child.stderr?.on('data', (chunk) => {
      const text = chunk.toString();
      combined += text;
      process.stderr.write(text);
    });

    child.on('close', (code) => {
      const clean = combined.replace(/\x1b\[[0-9;]*m/g, '');
      const testsMatch = clean.match(/[ℹi#]\s*tests\s+(\d+)/i);
      const passMatch = clean.match(/[ℹi#]\s*pass\s+(\d+)/i);
      const failMatch = clean.match(/[ℹi#]\s*fail\s+(\d+)/i);

      const testCount = testsMatch ? parseInt(testsMatch[1], 10) : fallbackCount;
      const passCount = passMatch ? parseInt(passMatch[1], 10) : (code === 0 ? testCount : 0);
      const failCount = failMatch ? parseInt(failMatch[1], 10) : (code === 0 ? 0 : Math.max(1, testCount - passCount));

      resolve({
        status: code ?? 1,
        testCount,
        passCount,
        failCount,
      });
    });
  });
}

async function main() {
  const args = new Set(process.argv.slice(2));
  const skipLint = args.has('--skip-lint');
  const includeAdversarial = args.has('--adversarial');

  const suites: SuiteInfo[] = discoverTestSuites().map((file) => ({
    file,
    testCount: countTestsInFile(file),
  }));

  const totalDiscoveredTests = suites.reduce((sum, s) => sum + s.testCount, 0);

  console.log('====================================================');
  console.log(`Running Complete Verification Test Suite (${totalDiscoveredTests}+ Tests across ${suites.length} Suites)`);
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
      passCount: lintPassed ? 1 : 0,
      failCount: lintPassed ? 0 : 1,
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
    console.log(`▶ Running ${suite.file} (discovered ${suite.testCount})...`);
    const start = Date.now();
    const res = await runSuiteLive(suite.file, suite.testCount);
    const duration = Date.now() - start;
    const passed = res.status === 0 && res.failCount === 0;
    results.push({
      file: suite.file,
      testCount: res.testCount,
      passCount: res.passCount,
      failCount: res.failCount,
      passed,
      duration,
    });

    if (!passed) {
      allPassed = false;
      console.error(`✖ ${suite.file} FAILED (${res.passCount}/${res.testCount} passed, ${res.failCount} failed, exit code ${res.status})\n`);
    } else {
      console.log(`✔ ${suite.file} PASSED (${res.passCount}/${res.testCount} passed in ${(duration / 1000).toFixed(1)}s)\n`);
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
    results.push({
      file: advScript,
      testCount: 1,
      passCount: passed ? 1 : 0,
      failCount: passed ? 0 : 1,
      passed,
      duration,
    });
    if (!passed) {
      allPassed = false;
      console.error(`✖ ${advScript} FAILED (exit code ${res.status})\n`);
    } else {
      console.log(`✔ ${advScript} PASSED in ${(duration / 1000).toFixed(1)}s\n`);
    }
  }

  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);
  const totalExecuted = results.filter((r) => r.file.startsWith('tests/')).reduce((sum, r) => sum + r.testCount, 0);
  const totalPass = results.filter((r) => r.file.startsWith('tests/')).reduce((sum, r) => sum + r.passCount, 0);
  const totalFail = results.filter((r) => r.file.startsWith('tests/')).reduce((sum, r) => sum + r.failCount, 0);

  console.log('====================================================');
  console.log(`Test Summary (${totalPass}/${totalExecuted} tests passed, ${totalFail} failed, ${(totalDuration / 1000).toFixed(1)}s total):`);
  results.forEach((r) => {
    console.log(
      `  ${r.passed ? '✔ PASS' : '✖ FAIL'} - ${r.file} [${r.passCount}/${r.testCount} passed] (${(r.duration / 1000).toFixed(1)}s)`
    );
  });
  console.log('====================================================');

  if (!allPassed) {
    process.exit(1);
  } else {
    console.log('ALL TEST SUITES PASSED CLEANLY (100% SUCCESS RATE)!');
  }
}

main().catch((err) => {
  console.error('Fatal runner error:', err);
  process.exit(1);
});
