import { en, type MessageKey } from './locales/en'
import { zhHant } from './locales/zh-Hant'
import type { Locale } from './types'
import { useLocale } from './useLocale'

export type TranslateVars = Record<string, string | number>

export function translate(locale: Locale, key: MessageKey, vars?: TranslateVars): string {
  const table = locale === 'zh-Hant' ? zhHant : en
  let text = table[key] ?? en[key]
  if (vars) {
    for (const [name, value] of Object.entries(vars)) {
      text = text.replaceAll(`{${name}}`, String(value))
    }
  }
  return text
}

/** Current-locale lookup. Subscribe with `useT()` inside React so the view updates. */
export function t(key: MessageKey, vars?: TranslateVars): string {
  return translate(useLocale.getState().locale, key, vars)
}

export function useT() {
  const locale = useLocale((s) => s.locale)
  return (key: MessageKey, vars?: TranslateVars) => translate(locale, key, vars)
}
