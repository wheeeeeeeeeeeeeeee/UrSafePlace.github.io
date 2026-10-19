export function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function saveJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* Prototype storage can fail if the browser blocks it. The UI still works for the session. */
  }
}

export function loadArray<T>(key: string): T[] {
  const value = loadJson<unknown>(key, [])
  return Array.isArray(value) ? (value as T[]) : []
}

export const STORAGE_KEYS = [
  'ursafe.alias',
  'ursafe.journal',
  'ursafe.posts',
  'ursafe.comments',
  'ursafe.reactions',
  'ursafe.reports',
  'ursafe.registrations',
  'ursafe.eventBookmarks',
  'ursafe.resourceBookmarks',
  'ursafe.moodOptIns',
  'ursafe.includeSampleStats',
] as const
