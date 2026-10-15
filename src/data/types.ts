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

export interface MetricPoint {
  /** Fractional calendar year (e.g. 1939 + 8/12 = Sep 1939). */
  year: number
  value: number
  unit: string
  certainty: Certainty
  note?: string
  /** How this point was produced. */
  provenance?: 'anchor' | 'interpolated' | 'held' | 'gap'
}

export interface Country {
  id: string
  name: string
  lat: number
  lon: number
  side: Side
  involvement: Involvement
  /** Short factual note on wartime role. */
  roleNote: string
  /** Preferred dense series cadence for this country. */
  cadence: SeriesCadence
  metrics: Record<MetricKey, MetricPoint[]>
}

export interface Incident {
  id: string
  date: string
  year: number
  month: number
  title: string
  lat: number
  lon: number
  minDetail: DetailLevel
  summaryOverview: string
  summaryStandard: string
  summaryDeep: string
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
  note?: string
}

export interface CountrySpec {
  id: string
  name: string
  lat: number
  lon: number
  side: Side
  involvement: Involvement
  roleNote: string
  cadence: SeriesCadence
  /** Inclusive involvement window; outside → no points (gap). */
  activeFrom: string
  activeTo: string
  units: Record<MetricKey, string>
  anchors: Partial<Record<MetricKey, MetricAnchor[]>>
}
