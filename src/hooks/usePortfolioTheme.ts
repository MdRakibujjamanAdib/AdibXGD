import { useEffect, useState } from 'react';

// Keep the same preference when moving between the homepage and inner pages.
export function usePortfolioTheme() {
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem('vb-theme') !== 'light'; }
    catch { return true; }
  });

  useEffect(() => {
    const theme = dark ? 'dark' : 'light';
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.classList.toggle('dark', dark);
    document.body.classList.toggle('dark', dark);
    document.body.dataset.theme = theme;
    root.style.colorScheme = theme;
    document.body.style.backgroundColor = dark ? '#000000' : '#ffffff';
    document.body.style.color = dark ? '#ffffff' : '#0e1011';
    try { localStorage.setItem('vb-theme', theme); } catch { /* Storage can be disabled. */ }
  }, [dark]);

  return [dark, setDark] as const;
}
