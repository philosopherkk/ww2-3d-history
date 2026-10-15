import type {
  Certainty,
  Country,
  CountrySpec,
  MetricAnchor,
  MetricKey,
  MetricPoint,
  SeriesCadence,
} from './types'

const METRICS: MetricKey[] = [
  'economicPower',
  'population',
  'militaryStrength',
  'armyMobilisation',
  'navyMobilisation',
]

export function parseYearMonth(date: string): number {
  const [ys, ms] = date.split('-')
  const y = Number(ys)
  const m = Number(ms)
  return y + (m - 1) / 12
}

export function formatYearMonth(frac: number): string {
  const y = Math.floor(frac + 1e-9)
  const m = Math.min(12, Math.max(1, Math.round((frac - y) * 12) + 1))
  return `${y}-${String(m).padStart(2, '0')}`
}

function cadenceStep(cadence: SeriesCadence): number {
  if (cadence === 'weekly') return 1 / 52
  if (cadence === 'monthly') return 1 / 12
  return 3 / 12
}

/** Snap fractional years so dense timelines stay stable across float drift. */
function snapTimeline(t: number, cadence: SeriesCadence): number {
  if (cadence === 'weekly') return Math.round(t * 52) / 52
  if (cadence === 'monthly') return Math.round(t * 12) / 12
  return Math.round(t * 4) / 4
}

function enumerateTimeline(from: string, to: string, cadence: SeriesCadence): number[] {
  const start = parseYearMonth(from)
  const end = parseYearMonth(to)
  const step = cadenceStep(cadence)
  const out: number[] = []
  for (let t = start; t <= end + 1e-9; t += step) {
    out.push(snapTimeline(t, cadence))
  }
  return out
}

function worstCertainty(a: Certainty, b: Certainty): Certainty {
  const rank = { certain: 0, approximate: 1, unsure: 2 }
  return rank[a] >= rank[b] ? a : b
}

function densifyMetric(
  anchors: MetricAnchor[] | undefined,
  unit: string,
  timeline: number[],
  activeFrom: number,
  activeTo: number,
): MetricPoint[] {
  if (!anchors?.length) return []

  const sorted = [...anchors]
    .map((a) => ({ ...a, t: parseYearMonth(a.date) }))
    .sort((a, b) => a.t - b.t)

  const points: MetricPoint[] = []

  for (const t of timeline) {
    if (t < activeFrom - 1e-9 || t > activeTo + 1e-9) continue

    // Exact / nearest anchor within half-step
    const exact = sorted.find((a) => Math.abs(a.t - t) < 1e-6)
    if (exact) {
      points.push({
        year: t,
        value: exact.value,
        unit,
        certainty: exact.certainty,
        note: exact.note,
        provenance: 'anchor',
      })
      continue
    }

    let left = sorted[0]
    let right = sorted[sorted.length - 1]
    for (let i = 0; i < sorted.length; i++) {
      if (sorted[i].t <= t) left = sorted[i]
      if (sorted[i].t >= t) {
        right = sorted[i]
        break
      }
    }

    if (t < sorted[0].t) {
      // Before first anchor inside active window: hold first peacetime value as unsure gap-fill
      points.push({
        year: t,
        value: sorted[0].value,
        unit,
        certainty: 'unsure',
        note: `Held from first anchor ${sorted[0].date}; pre-anchor densification.`,
        provenance: 'held',
      })
      continue
    }

    if (t > sorted[sorted.length - 1].t) {
      points.push({
        year: t,
        value: sorted[sorted.length - 1].value,
        unit,
        certainty: 'unsure',
        note: `Held from last anchor ${sorted[sorted.length - 1].date}; post-anchor densification.`,
        provenance: 'held',
      })
      continue
    }

    if (Math.abs(left.t - right.t) < 1e-9) {
      points.push({
        year: t,
        value: left.value,
        unit,
        certainty: left.certainty,
        note: left.note,
        provenance: 'anchor',
      })
      continue
    }

    const w = (t - left.t) / (right.t - left.t)
    const value = left.value + (right.value - left.value) * w
    const certainty = worstCertainty(
      worstCertainty(left.certainty, right.certainty),
      'approximate',
    )
    // Linear interpolation never upgrades certainty above approximate
    const finalCertainty: Certainty =
      left.certainty === 'unsure' || right.certainty === 'unsure' ? 'unsure' : certainty

    points.push({
      year: t,
      value: Math.round(value * 1000) / 1000,
      unit,
      certainty: finalCertainty === 'certain' ? 'approximate' : finalCertainty,
      note: `Interpolated between ${left.date} and ${right.date} (not measured monthly).`,
      provenance: 'interpolated',
    })
  }

  return points
}

export function buildCountry(spec: CountrySpec, globalFrom: string, globalTo: string): Country {
  const from = spec.activeFrom > globalFrom ? spec.activeFrom : globalFrom
  const to = spec.activeTo < globalTo ? spec.activeTo : globalTo
  const timeline = enumerateTimeline(from, to, spec.cadence)
  const activeFrom = parseYearMonth(spec.activeFrom)
  const activeTo = parseYearMonth(spec.activeTo)

  const metrics = {} as Country['metrics']
  for (const key of METRICS) {
    metrics[key] = densifyMetric(
      spec.anchors[key],
      spec.units[key],
      timeline,
      activeFrom,
      activeTo,
    )
  }

  return {
    id: spec.id,
    name: spec.name,
    lat: spec.lat,
    lon: spec.lon,
    side: spec.side,
    involvement: spec.involvement,
    roleNote: spec.roleNote,
    cadence: spec.cadence,
    metrics,
  }
}

export function buildCountries(
  specs: CountrySpec[],
  globalFrom = '1937-07',
  globalTo = '1945-09',
): Country[] {
  return specs.map((s) => buildCountry(s, globalFrom, globalTo))
}
