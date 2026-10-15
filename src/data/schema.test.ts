import { describe, expect, it } from 'vitest'
import { countrySpecs } from './countryRoster'
import { adaptMetricPoint } from './evidenceAdapt'
import { incidents } from './incidents'
import { people } from './people'
import { countrySpecSchema, incidentSchema, personSchema } from './schema'
import type { MetricKey } from './types'
import { ww2Dataset } from './ww2Dataset'

const catalogIds = new Set(ww2Dataset.sources.map((s) => s.id))

describe('schema', () => {
  it('passes every incident, country, and person', () => {
    for (const incident of incidents) {
      expect(incidentSchema.parse(incident).id).toBe(incident.id)
    }
    for (const spec of countrySpecs) {
      expect(countrySpecSchema.parse(spec).id).toBe(spec.id)
    }
    for (const person of people) {
      expect(personSchema.parse(person).id).toBe(person.id)
    }
    expect(ww2Dataset.incidents).toHaveLength(incidents.length)
    expect(ww2Dataset.countries).toHaveLength(countrySpecs.length)
  })
})

describe('evidence display', () => {
  it('requires resolvable sourceIds on certain anchors in roster', () => {
    for (const spec of countrySpecs) {
      for (const anchors of Object.values(spec.anchors)) {
        if (!anchors) continue
        for (const anchor of anchors) {
          if (anchor.certainty !== 'certain') continue
          expect(anchor.sourceIds?.length ?? 0).toBeGreaterThan(0)
          for (const id of anchor.sourceIds ?? []) {
            expect(catalogIds.has(id)).toBe(true)
          }
        }
      }
    }
  })

  it('never displays interpolated or held points as sourced', () => {
    const metrics = Object.keys(ww2Dataset.metricLabels) as MetricKey[]
    let checked = 0
    for (const country of ww2Dataset.countries) {
      for (const metric of metrics) {
        for (const point of country.metrics[metric]) {
          if (point.provenance !== 'interpolated' && point.provenance !== 'held') continue
          checked += 1
          expect(adaptMetricPoint(point, metric).level).not.toBe('sourced')
        }
      }
    }
    expect(checked).toBeGreaterThan(0)
  })
})
