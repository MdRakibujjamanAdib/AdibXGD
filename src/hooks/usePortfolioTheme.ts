import { useEffect, useSyncExternalStore } from 'react';
import type { SetStateAction } from 'react';

const storageKey = 'vb-theme';
const changeEvent = 'portfolio-theme-change';
let memoryPreference: boolean | undefined;

function getSnapshot(): boolean {
  if (memoryPreference !== undefined) return memoryPreference;
  try { return window.localStorage.getItem(storageKey) !== 'light'; }
  catch { return true; }
}

function applyTheme(dark: boolean) {
  const theme = dark ? 'dark' : 'light';
  for (const element of [document.documentElement, document.body]) {
    element.dataset.theme = theme;
    element.classList.toggle('dark', dark);
  }
  document.documentElement.style.colorScheme = theme;
  document.body.style.backgroundColor = dark ? '#000000' : '#ffffff';
  document.body.style.color = dark ? '#ffffff' : '#0e1011';
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#000000' : '#ffffff');
}

function subscribe(notify: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === storageKey || event.key === null) {
      memoryPreference = undefined;
      notify();
    }
  };
  window.addEventListener(changeEvent, notify);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(changeEvent, notify);
    window.removeEventListener('storage', onStorage);
  };
}

function setDark(value: SetStateAction<boolean>) {
  const dark = typeof value === 'function' ? value(getSnapshot()) : value;
  memoryPreference = dark;
  // Only an explicit toggle writes a preference, never hydration or a page mount.
  try { window.localStorage.setItem(storageKey, dark ? 'dark' : 'light'); } catch { /* Keep the session preference when storage is unavailable. */ }
  applyTheme(dark);
  window.dispatchEvent(new Event(changeEvent));
}

export function usePortfolioTheme() {
  // The stable server snapshot prevents hydration mismatches in static HTML.
  const dark = useSyncExternalStore(subscribe, getSnapshot, () => true);
  useEffect(() => { applyTheme(getSnapshot()); }, [dark]);
  return [dark, setDark] as const;
}
