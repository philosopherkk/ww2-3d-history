import type {
  Country,
  DetailLevel,
  Incident,
  Involvement,
  MetricKey,
  MetricPoint,
  Side,
} from './types'
import { ww2Dataset } from './ww2Dataset'
import { formatYearMonth } from './buildSeries'

const DETAIL_RANK: Record<DetailLevel, number> = {
  overview: 0,
  standard: 1,
  deep: 2,
}

const INVOLVEMENT_LABEL: Record<Involvement, string> = {
  allies: 'Allied combatant',
  axis: 'Axis combatant',
  'co-belligerent': 'Co-belligerent (fought alongside a major alliance without full membership)',
  puppet: 'Client / puppet regime (limited sovereignty)',
  occupied: 'Occupied or annexed territory in this dataset window',
  'government-in-exile': 'Government-in-exile (homeland under occupation)',
  dominion: 'British Dominion / Commonwealth partner',
  'late-declarant': 'Late declarant of war (often limited or no combat)',
}

const SIDE_LABEL: Record<Side, string> = {
  allies: 'Allies (globe colour)',
  axis: 'Axis (globe colour)',
  other: 'Other / mixed (globe colour)',
}

/** Max gap (years) when picking nearest dense point — ~5 months. */
const MAX_METRIC_GAP = 5 / 12

export function yearFromFraction(t: number): number {
  const start = 1937 + 6 / 12
  const end = 1945 + 8 / 12
  return start + t * (end - start)
}

export function dateLabelFromFraction(t: number): string {
  const y = yearFromFraction(t)
  const year = Math.floor(y + 1e-9)
  const month = Math.min(12, Math.max(1, Math.floor((y - year) * 12 + 1e-9) + 1))
  const names = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ]
  const prelude = year < 1939 ? ' (prelude)' : ''
  return `${names[month - 1]} ${year}${prelude}`
}

export function nearestMetric(points: MetricPoint[], year: number): MetricPoint | null {
  if (!points.length) return null
  let best = points[0]
  let bestDist = Math.abs(points[0].year - year)
  for (const p of points) {
    const d = Math.abs(p.year - year)
    if (d < bestDist) {
      best = p
      bestDist = d
    }
  }
  if (bestDist > MAX_METRIC_GAP) return null
  return best
}

export function metricAtYear(country: Country, metric: MetricKey, year: number) {
  return nearestMetric(country.metrics[metric], year)
}

export function maxMetricValue(metric: MetricKey, year: number): number {
  let max = 0
  for (const c of ww2Dataset.countries) {
    const p = metricAtYear(c, metric, year)
    if (p && p.value > max) max = p.value
  }
  return max || 1
}

export function countriesActiveAt(year: number, metric: MetricKey): Country[] {
  return ww2Dataset.countries.filter((c) => metricAtYear(c, metric, year) != null)
}

export function incidentsVisible(detail: DetailLevel, year: number): Incident[] {
  const rank = DETAIL_RANK[detail]
  return ww2Dataset.incidents.filter(
    (i) => DETAIL_RANK[i.minDetail] <= rank && i.year + (i.month - 1) / 12 <= year + 0.05,
  )
}

export function incidentSummary(incident: Incident, detail: DetailLevel): string {
  if (detail === 'overview') return incident.summaryOverview
  if (detail === 'standard') return incident.summaryStandard
  return incident.summaryDeep
}

export function latLonToVec3(lat: number, lon: number, radius: number): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)
  const x = -radius * Math.sin(phi) * Math.cos(theta)
  const z = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)
  return [x, y, z]
}

export function pointStamp(point: MetricPoint): string {
  return formatYearMonth(point.year)
}

export function involvementLabel(inv: Involvement): string {
  return INVOLVEMENT_LABEL[inv]
}

export function sideLabel(side: Side): string {
  return SIDE_LABEL[side]
}

/** Approximate great-circle distance in km (teaching proximity only). */
export function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(a)))
}

function incidentYearFrac(i: Incident): number {
  return i.year + (i.month - 1) / 12
}

function nameMentioned(text: string, country: Country): boolean {
  const hay = text.toLowerCase()
  const name = country.name.toLowerCase()
  if (hay.includes(name)) return true
  // Short aliases used in titles (factual string match only)
  const aliases: Record<string, string[]> = {
    deu: ['germany', 'german', 'reich'],
    usa: ['united states', 'u.s.', 'america', 'american'],
    gbr: ['britain', 'british', 'uk ', 'u.k.', 'england'],
    sun: ['soviet', 'ussr', 'russia', 'russian'],
    jpn: ['japan', 'japanese'],
    ita: ['italy', 'italian'],
    fra: ['france', 'french'],
    chn: ['china', 'chinese'],
    pol: ['poland', 'polish'],
  }
  return (aliases[country.id] ?? []).some((a) => hay.includes(a))
}

/** Incidents near a country (geo or name) that have occurred by scrubber year. */
export function relatedIncidentsForCountry(
  country: Country,
  year: number,
  detail: DetailLevel,
  limit = 8,
): Incident[] {
  const rank = DETAIL_RANK[detail]
  const scored = ww2Dataset.incidents
    .filter((i) => DETAIL_RANK[i.minDetail] <= rank && incidentYearFrac(i) <= year + 0.05)
    .map((i) => {
      const dist = haversineKm(country.lat, country.lon, i.lat, i.lon)
      const mentioned = nameMentioned(
        `${i.title} ${i.summaryOverview} ${i.summaryStandard}`,
        country,
      )
      const geoHit = dist < 900
      if (!geoHit && !mentioned) return null
      const timeDist = Math.abs(incidentYearFrac(i) - year)
      const score = (mentioned ? 0 : 1) + dist / 4000 + timeDist * 0.35
      return { i, score }
    })
    .filter((x): x is { i: Incident; score: number } => x != null)
    .sort((a, b) => a.score - b.score)
  return scored.slice(0, limit).map((s) => s.i)
}

/** Countries near an incident (active at scrubber year). */
export function relatedCountriesForIncident(
  incident: Incident,
  year: number,
  metric: MetricKey,
  limit = 6,
): Country[] {
  return countriesActiveAt(year, metric)
    .map((c) => ({ c, d: haversineKm(incident.lat, incident.lon, c.lat, c.lon) }))
    .filter((x) => x.d < 1200)
    .sort((a, b) => a.d - b.d)
    .slice(0, limit)
    .map((x) => x.c)
}

export interface CountryBriefing {
  markerExplainer: string
  statusLine: string
  paragraphs: string[]
}

/**
 * Time-aware country learning copy composed from roster fields + metrics.
 * Does not invent events — only restates involvement, roleNote, and measured/approx points.
 */
export function countryBriefing(
  country: Country,
  detail: DetailLevel,
  year: number,
  metric: MetricKey,
  dateLabel: string,
): CountryBriefing {
  const point = metricAtYear(country, metric, year)
  const markerExplainer =
    'This map marker is a country / entity pin on the Earth surface at the teaching lat/lon. Pin size reflects the selected metric at the scrubber date (not a stick floating in space).'

  const statusLine = `${involvementLabel(country.involvement)} · ${sideLabel(country.side)} · ${dateLabel}`

  const overview = [
    `${country.name} appears in this atlas as a wartime participant entity.`,
    country.roleNote,
    point
      ? `At ${dateLabel}, ${ww2Dataset.metricLabels[metric].label.toLowerCase()} is about ${point.value} ${point.unit} (${point.certainty}${point.provenance && point.provenance !== 'anchor' ? `, ${point.provenance}` : ''}).`
      : `At ${dateLabel}, this entity has no datapoint for the selected metric (outside its active window or beyond the nearest-point gap).`,
  ]

  if (detail === 'overview') {
    return { markerExplainer, statusLine, paragraphs: overview }
  }

  const standard = [
    ...overview,
    `Series cadence for this entity: ${country.cadence} densification from sparse anchors — interpolated points stay approximate/unsure and are never upgraded to “certain”.`,
    point?.note ? `Metric note at nearest stamp: ${point.note}` : null,
  ].filter(Boolean) as string[]

  if (detail === 'standard') {
    return { markerExplainer, statusLine, paragraphs: standard }
  }

  const deep = [
    ...standard,
    'Deep view lists every metric layer at the scrubber date below, plus linked incidents that are geographically near this pin or that name this entity in their teaching summaries.',
    'Treat occupied, puppet, and late-declarant figures cautiously — national accounts and force totals often double-count metropolitan powers or remain unsure.',
  ]

  return { markerExplainer, statusLine, paragraphs: deep }
}

export interface IncidentBriefing {
  markerExplainer: string
  statusLine: string
  body: string
}

export function incidentBriefing(
  incident: Incident,
  detail: DetailLevel,
  dateLabel: string,
): IncidentBriefing {
  return {
    markerExplainer:
      'This map marker is a critical-incident pin (diamond) on the Earth surface. It marks where a dated event is taught — distinct from country metric pins.',
    statusLine: `${incident.date}${incident.year < 1939 ? ' · Asian/European prelude (pre-Sep 1939)' : ''} · scrubber ${dateLabel}${incident.certainty === 'unsure' ? ' · unsure' : ''}`,
    body: incidentSummary(incident, detail),
  }
}
