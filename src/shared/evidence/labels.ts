import type { BadgeLevel } from './types'

export interface EvidenceLabel {
  icon: string
  short: string
  tooltip: string
}

/** Icon + bilingual short label. Not color-only. */
export const EVIDENCE_LABELS: Record<BadgeLevel, EvidenceLabel> = {
  sourced: {
    icon: '●',
    short: '有出處 / Sourced',
    tooltip: '有出處 / Sourced — cited record or anchor',
  },
  estimated: {
    icon: '◐',
    short: '推估（內插） / Estimated (interpolated)',
    tooltip: '推估（內插） / Estimated (interpolated) — not a measured archive point',
  },
  disputed: {
    icon: '◇',
    short: '數據有爭議 / Disputed',
    tooltip: '數據有爭議 / Disputed — low and high are both shown',
  },
  order_of_magnitude: {
    icon: '≈',
    short: '教學用數量級 / Educational order of magnitude',
    tooltip: '教學用數量級 / Educational order of magnitude',
  },
  unverified: {
    icon: '○',
    short: '待查證 / Unverified',
    tooltip: '待查證 / Unverified — needs a source',
  },
  unsure: {
    icon: '?',
    short: 'unsure',
    tooltip: 'unsure / 資料標記仍為 unsure（不改寫成 disputed 或 unverified）',
  },
}
