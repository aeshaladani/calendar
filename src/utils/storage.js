const PREFIX = 'wc2:'

export function load(key, fallback = null) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw !== null ? JSON.parse(raw) : fallback
  } catch { return fallback }
}

export function save(key, value) {
  try { localStorage.setItem(PREFIX + key, JSON.stringify(value)) } catch {}
}
