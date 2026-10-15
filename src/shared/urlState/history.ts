export type HistoryMode = 'replace' | 'push'

export function currentSearch(): string {
  if (typeof window === 'undefined') return ''
  return window.location.search
}

export function applySearch(search: string, mode: HistoryMode) {
  if (typeof window === 'undefined') return
  const next = `${window.location.pathname}${search}${window.location.hash}`
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`
  if (next === current) return
  try {
    if (mode === 'push') window.history.pushState(null, '', next)
    else window.history.replaceState(null, '', next)
  } catch (err) {
    console.warn('history write failed', err)
  }
}

export function onPopState(listener: () => void): () => void {
  window.addEventListener('popstate', listener)
  return () => window.removeEventListener('popstate', listener)
}

export async function copyCurrentLink(): Promise<boolean> {
  const url = window.location.href
  try {
    await navigator.clipboard.writeText(url)
    return true
  } catch {
    return false
  }
}
