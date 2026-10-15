export type Locale = 'en' | 'zh-Hant'

/** User-facing copy. Omit `zhHant` to keep the English original (do not machine-translate historical paragraphs). */
export interface LocalizedText {
  en: string
  zhHant?: string
  zhHantReviewed?: boolean
}
