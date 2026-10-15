/** Display levels. Stored `unsure` is separate and is not renamed. */
export type EvidenceLevel =
  | 'sourced'
  | 'estimated'
  | 'disputed'
  | 'order_of_magnitude'
  | 'unverified'

export type BadgeLevel = EvidenceLevel | 'unsure'

/** Display shape for a figure. Numbers stay whatever the caller measured. */
export interface Measured {
  value?: number
  unit?: string
  level: BadgeLevel
  low?: number
  high?: number
  method?: string
  sources?: string[]
  lastReviewed?: string
  note?: string
}
