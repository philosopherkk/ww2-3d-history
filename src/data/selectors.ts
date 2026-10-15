import { formatMonthYear } from '../shared/i18n/format'
import type { MessageKey } from '../shared/i18n/locales/en'
import { enOf } from '../shared/i18n/pickText'
import { t } from '../shared/i18n/translate'
import type { LocalizedText } from '../shared/i18n/types'
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

const INVOLVEMENT_KEY: Record<Involvement, MessageKey> = {
  allies: 'inv_allies',
  axis: 'inv_axis',
  'co-belligerent': 'inv_coBelligerent',
  puppet: 'inv_puppet',
  occupied: 'inv_occupied',
  'government-in-exile': 'inv_exile',
  dominion: 'inv_dominion',
  'late-declarant': 'inv_late',
}

const SIDE_KEY: Record<Side, MessageKey> = {
  allies: 'side_allies',
  axis: 'side_axis',
  other: 'side_other',
}

/** Max gap (years) when picking nearest dense point — ~5 months. */
const MAX_METRIC_GAP = 5 / 12

export function yearFromFraction(t: number): number {
  const start = 1937 + 6 / 12
  const end = 1945 + 8 / 12
  return start + t * (end - start)
}

export function dateLabelFromFraction(time: number): string {
  const y = yearFromFraction(time)
  const year = Math.floor(y + 1e-9)
  const month = Math.min(12, Math.max(1, Math.floor((y - year) * 12 + 1e-9) + 1))
  const prelude = year < 1939 ? ` ${t('datePrelude')}` : ''
  return `${formatMonthYear(year, month)}${prelude}`
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

export function incidentSummary(incident: Incident, detail: DetailLevel): LocalizedText {
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
  return t(INVOLVEMENT_KEY[inv])
}

export function sideLabel(side: Side): string {
  return t(SIDE_KEY[side])
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
  const name = enOf(country.name).toLowerCase()
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
        `${enOf(i.title)} ${enOf(i.summaryOverview)} ${enOf(i.summaryStandard)}`,
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
  roleNote: LocalizedText
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
  const markerExplainer = t('markerCountry')

  const statusLine = `${involvementLabel(country.involvement)} · ${sideLabel(country.side)} · ${dateLabel}`

  const related = relatedIncidentsForCountry(country, year, detail, 5)
  const relatedTitles =
    related.length > 0
      ? related.map((i) => `${i.date}: ${enOf(i.title)}`).join('; ')
      : null

  const overview = [
    t('countryAt', {
      name: enOf(country.name),
      date: dateLabel,
      involvement: involvementLabel(country.involvement).toLowerCase(),
      side: sideLabel(country.side).toLowerCase(),
    }),
    point
      ? t('metricSentence', {
          metric: t(metricKey(metric)),
          value: point.value,
          unit: point.unit,
          stamp: pointStamp(point),
          certainty: point.certainty,
          provenance: point.provenance && point.provenance !== 'anchor' ? ` (${point.provenance})` : '',
        })
      : t('noMetricSentence'),
  ]

  if (detail === 'overview') {
    return { markerExplainer, statusLine, roleNote: country.roleNote, paragraphs: overview }
  }

  const standard = [
    ...overview,
    relatedTitles
      ? t('incidentsReached', { list: relatedTitles })
      : t('noIncidentsReached', { date: dateLabel }),
    t('seriesCaveat', { cadence: country.cadence }),
    point?.note ? t('metricNote', { note: enOf(point.note) }) : null,
    t('peopleHint'),
  ].filter(Boolean) as string[]

  if (detail === 'standard') {
    return { markerExplainer, statusLine, roleNote: country.roleNote, paragraphs: standard }
  }

  const allMetrics = (Object.keys(ww2Dataset.metricLabels) as MetricKey[])
    .map((m) => {
      const p = metricAtYear(country, m, year)
      const label = t(metricKey(m))
      if (!p) return t('metricMissing', { label })
      return t('metricSnap', {
        label,
        value: p.value,
        unit: p.unit,
        certainty: p.certainty,
        extra: p.provenance === 'interpolated' ? t('interpolatedWord') : '',
      })
    })
    .join('; ')

  const deep = [
    ...standard,
    t('fullSnapshot', { date: dateLabel, metrics: allMetrics }),
    t('deepCaveat'),
    t('geoCaveat'),
  ]

  return { markerExplainer, statusLine, roleNote: country.roleNote, paragraphs: deep }
}

export interface IncidentBriefing {
  markerExplainer: string
  statusLine: string
  summary: LocalizedText
  extra: string
}

export function incidentBriefing(
  incident: Incident,
  detail: DetailLevel,
  dateLabel: string,
): IncidentBriefing {
  const extra =
    detail === 'overview'
      ? ''
      : detail === 'standard'
        ? t('incidentExtraStandard', { date: dateLabel, incidentDate: incident.date })
        : t('incidentExtraDeep', { certainty: incident.certainty })

  return {
    markerExplainer: t('markerIncident'),
    statusLine: `${incident.date}${incident.year < 1939 ? t('statusPrelude') : ''}${t('statusScrubber', { date: dateLabel })}${incident.certainty === 'unsure' ? t('statusUnsure') : ''}`,
    summary: incidentSummary(incident, detail),
    extra,
  }
}

export function metricLabel(metric: MetricKey): string {
  return t(metricKey(metric))
}

export function metricDescription(metric: MetricKey): string {
  return t(`${metricKey(metric)}_desc` as MessageKey)
}

function metricKey(metric: MetricKey): MessageKey {
  if (metric === 'economicPower') return 'metric_economicPower'
  if (metric === 'population') return 'metric_population'
  if (metric === 'militaryStrength') return 'metric_militaryStrength'
  if (metric === 'armyMobilisation') return 'metric_armyMobilisation'
  return 'metric_navyMobilisation'
}
