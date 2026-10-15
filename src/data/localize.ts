import { pickText, type PickedText } from '../shared/i18n/pickText'
import type { Locale, LocalizedText } from '../shared/i18n/types'
import { glossaryForEnglish } from './glossary.zh-Hant'

const warned = new Set<string>()

export interface ResolvedText extends PickedText {
  /** Dev-only: zh-Hant missing or present but not reviewed. */
  warn: boolean
}

/**
 * Display helper. Reviewed glossary terms fill zh-Hant without editing stored paragraphs.
 * Otherwise missing zh-Hant falls back to English.
 */
export function resolveLocalized(value: LocalizedText | string, locale: Locale): ResolvedText {
  const obj: LocalizedText = typeof value === 'string' ? { en: value } : value
  if (locale === 'zh-Hant' && !obj.zhHant) {
    const glossary = glossaryForEnglish(obj.en)
    if (glossary?.zhHantReviewed) {
      return { text: glossary.zhHant, fallback: false, warn: false }
    }
  }
  const picked = pickText(obj, locale)
  const warn = locale === 'zh-Hant' && (picked.fallback || obj.zhHantReviewed !== true)
  return { ...picked, warn }
}

export function warnMissingZh(english: string) {
  if (!import.meta.env.DEV) return
  if (warned.has(english)) return
  warned.add(english)
  console.warn(`[i18n] missing or unreviewed zh-Hant; showing English original: ${english.slice(0, 140)}`)
}
