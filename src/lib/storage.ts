// Local persistence layer. This is the "local/demo-data fallback" the
// app uses when Supabase environment variables are not configured
// (see src/lib/supabaseClient.ts). Every read/write is wrapped in
// try/catch so a locked-down or private-browsing environment never
// crashes the app — it just behaves like a fresh session.

const PREFIX = 'hirevision:';

export function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveJSON<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Storage unavailable (private mode, quota, etc.) — fail silently.
  }
}

export function clearAll(): void {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => localStorage.removeItem(k));
  } catch {
    // ignore
  }
}

export const STORAGE_KEYS = {
  profile: 'profile',
  employabilityHistory: 'employabilityHistory',
  roadmap: 'roadmap',
  mentorMessages: 'mentorMessages',
  assessmentResults: 'assessmentResults',
  authed: 'authed',
  demoMode: 'demoMode',
} as const;
