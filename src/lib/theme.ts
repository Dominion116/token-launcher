// src/lib/theme.ts
const STORAGE_KEY = 'theme'; // 'light' | 'dark'

export function initTheme() {
  const stored = (localStorage.getItem(STORAGE_KEY) || '').toLowerCase();
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const effective = stored === 'light' || stored === 'dark' ? stored : (prefersDark ? 'dark' : 'light');
  setTheme(effective);
  return effective;
}

export function setTheme(mode: 'light'|'dark') {
  const el = document.documentElement;
  if (mode === 'dark') el.classList.add('dark');
  else el.classList.remove('dark');
  localStorage.setItem(STORAGE_KEY, mode);
}

export function toggleTheme() {
  const isDark = document.documentElement.classList.contains('dark');
  setTheme(isDark ? 'light' : 'dark');
  return isDark ? 'light' : 'dark';
}
