import type { Locale, LocalizedText } from './types'

export interface PickedText {
  text: string
  /** zh-Hant was requested and this string has no zhHant. */
  fallback: boolean
}

export function asLocalized(value: LocalizedText | string): LocalizedText {
  return typeof value === 'string' ? { en: value } : value
}

export function enOf(value: LocalizedText | string | undefined | null): string {
  if (value == null) return ''
  return typeof value === 'string' ? value : value.en
}

/**
 * Pick a display string. Missing zh-Hant returns the English original and `fallback: true`
 * (the UI shows a small 「英文原文」 and a dev warning). Does not invent a translation.
 */
export function pickText(value: LocalizedText | string, locale: Locale): PickedText {
  const text = asLocalized(value)
  if (locale === 'zh-Hant') {
    if (text.zhHant) return { text: text.zhHant, fallback: false }
    return { text: text.en, fallback: true }
  }
  return { text: text.en, fallback: false }
}
