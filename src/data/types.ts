import type { LocalizedText } from '../shared/i18n/types'

export type DetailLevel = 'overview' | 'standard' | 'deep'

export type MetricKey =
  | 'economicPower'
  | 'population'
  | 'militaryStrength'
  | 'armyMobilisation'
  | 'navyMobilisation'

export type Certainty = 'certain' | 'approximate' | 'unsure'

/** Alignment for globe colouring (puppets/co-belligerents map into these buckets). */
export type Side = 'allies' | 'axis' | 'other'

export type Involvement =
  | 'allies'
  | 'axis'
  | 'co-belligerent'
  | 'puppet'
  | 'occupied'
  | 'government-in-exile'
  | 'dominion'
  | 'late-declarant'

export type SeriesCadence = 'weekly' | 'monthly' | 'quarterly'

export interface AlignmentSegment {
  from: string
  side: Side
  involvement: Involvement
}

export interface MetricPoint {
  /** Fractional calendar year (e.g. 1939 + 8/12 = Sep 1939). */
  year: number
  value: number
  unit: string
  certainty: Certainty
  note?: string | LocalizedText
  /** How this point was produced. */
  provenance?: 'anchor' | 'interpolated' | 'held' | 'gap'
  /** Catalog source ids backing this anchor (required when certainty is certain). */
  sourceIds?: string[]
}

export interface Country {
  id: string
  name: LocalizedText
  lat: number
  lon: number
  side: Side
  involvement: Involvement
  /** Time-varying alliance for map colouring and labels. */
  alignment: AlignmentSegment[]
  /** Short factual note on wartime role. */
  roleNote: LocalizedText
  /** Preferred dense series cadence for this country. */
  cadence: SeriesCadence
  metrics: Record<MetricKey, MetricPoint[]>
}

export interface Incident {
  id: string
  date: string
  year: number
  month: number
  title: LocalizedText
  lat: number
  lon: number
  minDetail: DetailLevel
  summaryOverview: LocalizedText
  summaryStandard: LocalizedText
  summaryDeep: LocalizedText
  sources: string[]
  certainty: Certainty
}

export interface DataCatalog {
  timeframe: { start: string; end: string; preludeLabeled: boolean }
  series: {
    defaultCadence: SeriesCadence
    startYear: number
    endYear: number
    note: string
  }
  countries: Country[]
  incidents: Incident[]
  metricLabels: Record<MetricKey, { label: string; description: string }>
  sources: { id: string; citation: string; url?: string; covers: string }[]
}

/** Compact teaching anchors before densification. */
export interface MetricAnchor {
  /** "YYYY-MM" */
  date: string
  value: number
  certainty: Certainty
  note?: LocalizedText
  sourceIds?: string[]
}

export interface CountrySpec {
  id: string
  name: LocalizedText
  lat: number
  lon: number
  side: Side
  involvement: Involvement
  roleNote: LocalizedText
  cadence: SeriesCadence
  /** Inclusive involvement window; outside → no points (gap). */
  activeFrom: string
  activeTo: string
  units: Record<MetricKey, string>
  anchors: Partial<Record<MetricKey, MetricAnchor[]>>
}
