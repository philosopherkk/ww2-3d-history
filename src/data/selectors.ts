import type { Country, DetailLevel, Incident, MetricKey, MetricPoint } from './types'
import { ww2Dataset } from './ww2Dataset'
import { formatYearMonth } from './buildSeries'

const DETAIL_RANK: Record<DetailLevel, number> = {
  overview: 0,
  standard: 1,
  deep: 2,
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
