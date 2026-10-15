import { create } from 'zustand'
import type { Locale } from './types'

export const LOCALE_STORAGE_KEY = 'ww2-atlas-lang'

function prefersZhHant(tag: string): boolean {
  const t = tag.trim().toLowerCase()
  return (
    t === 'zh-hant' ||
    t.startsWith('zh-hant-') ||
    t === 'zh-tw' ||
    t.startsWith('zh-tw-') ||
    t === 'zh-hk' ||
    t.startsWith('zh-hk-')
  )
}

function normalizeLang(raw: string | null | undefined): Locale | null {
  if (!raw) return null
  if (prefersZhHant(raw)) return 'zh-Hant'
  const t = raw.trim().toLowerCase()
  if (t === 'en' || t.startsWith('en-')) return 'en'
  return null
}

/** `?lang=` → localStorage → navigator.language, else en. */
export function detectLocale(): Locale {
  if (typeof window === 'undefined') return 'en'
  const fromQuery = normalizeLang(new URLSearchParams(window.location.search).get('lang'))
  if (fromQuery) return fromQuery
  try {
    const stored = normalizeLang(localStorage.getItem(LOCALE_STORAGE_KEY))
    if (stored) return stored
  } catch {
    /* private mode */
  }
  const tags = [navigator.language, ...(navigator.languages ?? [])]
  for (const tag of tags) {
    if (prefersZhHant(tag)) return 'zh-Hant'
  }
  return 'en'
}

function applyHtmlLang(locale: Locale) {
  if (typeof document === 'undefined') return
  document.documentElement.lang = locale === 'zh-Hant' ? 'zh-Hant' : 'en'
}

interface LocaleState {
  locale: Locale
  setLocale: (locale: Locale) => void
}

const initial = detectLocale()
applyHtmlLang(initial)

export const useLocale = create<LocaleState>((set) => ({
  locale: initial,
  setLocale: (locale) => {
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale)
    } catch {
      /* ignore */
    }
    applyHtmlLang(locale)
    set({ locale })
  },
}))
