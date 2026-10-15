import type { Measured } from '../shared/evidence/types'
import { enOf } from '../shared/i18n/pickText'
import type { Certainty, Incident, MetricKey, MetricPoint } from './types'
import { ww2Dataset } from './ww2Dataset'

function citationsForMetric(metric: MetricKey): string[] {
  return ww2Dataset.sources.filter((source) => source.covers.includes(metric)).map((source) => source.citation)
}

function incidentCitations(incident: Incident): string[] {
  return incident.sources
    .map((id) => ww2Dataset.sources.find((source) => source.id === id)?.citation)
    .filter((citation): citation is string => Boolean(citation))
}

/**
 * Interpolated and held points display as estimated.
 * The method string names the bounding anchors already written by the densifier.
 * Stored `unsure` is not remapped: callers still show the word unsure.
 */
export function adaptMetricPoint(point: MetricPoint, metric: MetricKey): Measured {
  const note = enOf(point.note)
  const interpolated = point.provenance === 'interpolated' || point.provenance === 'held'
  let level: Measured['level']
  if (interpolated) level = 'estimated'
  else if (point.certainty === 'unsure') level = 'unsure'
  else if (point.certainty === 'approximate') level = 'estimated'
  else if (point.certainty === 'certain') {
    level = point.sourceIds?.length ? 'sourced' : 'unverified'
  } else level = 'unverified'

  // TODO(data): needs source — anchors do not store a last-reviewed date
  return {
    value: point.value,
    unit: point.unit,
    level,
    method: interpolated ? note : undefined,
    sources: citationsForMetric(metric),
    note: interpolated ? undefined : note || undefined,
  }
}

export function metricStoredUnsure(point: MetricPoint): boolean {
  return point.certainty === 'unsure'
}

export function adaptIncident(incident: Incident): Measured {
  const sources = incidentCitations(incident)
  let level: Measured['level']
  if (sources.length === 0) level = 'unverified'
  else if (incident.certainty === 'unsure') level = 'unsure'
  else if (incident.certainty === 'approximate') level = 'estimated'
  else level = 'sourced'
  return {
    level,
    sources,
    method: `Incident record ${incident.date}`,
  }
}

export function adaptPerson(person: { certainty: Certainty; wikipediaTitle: string }): Measured {
  const sources = [`Wikipedia: ${person.wikipediaTitle}`]
  const level: Measured['level'] =
    person.certainty === 'unsure' ? 'unsure' : person.certainty === 'approximate' ? 'estimated' : 'sourced'
  return { level, sources, method: 'Person dossier' }
}

export function adaptCertainty(certainty: Certainty, hasSource: boolean): Measured['level'] {
  if (!hasSource) return 'unverified'
  if (certainty === 'unsure') return 'unsure'
  if (certainty === 'approximate') return 'estimated'
  return 'sourced'
}
