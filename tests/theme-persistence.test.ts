import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function loadTheme(saved = 'light', blocked = false) {
  const values = new Map([['vb-theme', saved]]);
  let writes = 0;
  let hydrating = false;
  const element = () => ({ dataset: {} as Record<string, string>, style: {}, classList: { toggle() {} } });
  const root = element();
  const body = element();
  const exports: any = {};
  const context = {
    exports,
    require: () => ({
      useEffect: (effect: () => void) => effect(),
      useSyncExternalStore: (_subscribe: unknown, snapshot: () => boolean, serverSnapshot: () => boolean) => hydrating ? serverSnapshot() : snapshot(),
    }),
    document: { documentElement: root, body, querySelector: () => null },
    window: {
      localStorage: {
        getItem: (key: string) => { if (blocked) throw Error('Storage disabled'); return values.get(key); },
        setItem: (key: string, value: string) => { writes++; if (blocked) throw Error('Storage disabled'); values.set(key, value); },
      },
      dispatchEvent() {}, addEventListener() {}, removeEventListener() {},
    },
    Event: class {},
  };
  const code = ts.transpileModule(readFileSync('src/hooks/usePortfolioTheme.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  vm.runInNewContext(code, context);
  return { useTheme: exports.usePortfolioTheme, root, body, values, writes: () => writes, hydrate: (value: boolean) => { hydrating = value; } };
}

test('hydration never overwrites saved light mode with the server default', () => {
  const theme = loadTheme();
  theme.hydrate(true);
  assert.equal(theme.useTheme()[0], true);
  assert.equal(theme.root.dataset.theme, 'light');
  assert.equal(theme.writes(), 0);
  theme.hydrate(false);
  assert.equal(theme.useTheme()[0], false);
  assert.equal(theme.values.get('vb-theme'), 'light');
});

test('explicit toggles persist across page mounts and fresh loads', () => {
  const theme = loadTheme();
  theme.useTheme()[1]((dark: boolean) => !dark);
  assert.equal(theme.values.get('vb-theme'), 'dark');
  assert.equal(theme.useTheme()[0], true);
  theme.useTheme()[1](false);
  assert.equal(theme.useTheme()[0], false);
  assert.equal(theme.writes(), 2);
  assert.equal(loadTheme(theme.values.get('vb-theme')).useTheme()[0], false);
});

test('blocked storage keeps the explicit preference during page navigation', () => {
  const theme = loadTheme('dark', true);
  theme.useTheme()[1](false);
  assert.equal(theme.useTheme()[0], false);
  assert.equal(theme.body.dataset.theme, 'light');
});
