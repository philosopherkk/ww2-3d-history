import type { LocalizedText } from '../shared/i18n/types'

/**
 * Reviewed Traditional Chinese terms supplied for this atlas.
 * Historical paragraphs are not translated here.
 */
export interface GlossaryEntry extends LocalizedText {
  en: string
  zhHant: string
  zhHantReviewed: true
  incidentIds: string[]
}

export const glossaryZhHant: GlossaryEntry[] = [
  {
    en: 'Marco Polo Bridge Incident',
    zhHant: '七七事變/盧溝橋事變',
    zhHantReviewed: true,
    incidentIds: ['marco-polo'],
  },
  {
    en: 'Pearl Harbor attack',
    zhHant: '珍珠港事件',
    zhHantReviewed: true,
    incidentIds: ['pearl-harbor'],
  },
  {
    en: 'Battle of Stalingrad',
    zhHant: '史達林格勒戰役',
    zhHantReviewed: true,
    incidentIds: ['stalingrad'],
  },
  {
    en: 'D-Day (Normandy landings)',
    zhHant: '諾曼第登陸',
    zhHantReviewed: true,
    incidentIds: ['d-day'],
  },
  {
    en: 'Battle of Midway',
    zhHant: '中途島海戰',
    zhHantReviewed: true,
    incidentIds: ['midway'],
  },
]

const byEnglish = new Map(glossaryZhHant.map((entry) => [entry.en, entry]))

export function glossaryForEnglish(en: string): GlossaryEntry | undefined {
  return byEnglish.get(en)
}
