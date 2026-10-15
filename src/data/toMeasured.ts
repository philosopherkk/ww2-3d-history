import { adaptMetricPoint } from './evidenceAdapt'
import type { Country, MetricKey, MetricPoint } from './types'
import { ww2Dataset } from './ww2Dataset'
import type { Measured } from '../shared/evidence/types'

function citationsFromIds(ids: string[] | undefined): string[] {
  if (!ids?.length) return []
  return ids
    .map((id) => ww2Dataset.sources.find((s) => s.id === id)?.citation)
    .filter((c): c is string => Boolean(c))
}

/** Build display Measured from a densified metric point and its country context. */
export function toMeasured(point: MetricPoint, _country: Country, metric: MetricKey): Measured {
  const base = adaptMetricPoint(point, metric)
  const fromPoint = citationsFromIds(point.sourceIds)
  const sources = fromPoint.length > 0 ? fromPoint : base.sources
  let level = base.level
  if (point.provenance === 'anchor' && point.certainty === 'certain' && fromPoint.length === 0) {
    level = 'unverified'
  }
  return { ...base, level, sources }
}
