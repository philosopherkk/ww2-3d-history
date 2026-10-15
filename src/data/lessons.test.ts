import { describe, expect, it } from 'vitest'
import { lessonIncidentVisible, lessons } from './lessons'
import { incidents } from './incidents'
import { incidentsVisible } from './selectors'
import { yearFromFraction } from './timeScale'

describe('lessons', () => {
  it('each lesson incident exists and is visible at lesson time', () => {
    for (const lesson of lessons) {
      const ids = [lesson.incidentId, ...(lesson.incidentIds ?? [])]
      for (const id of ids) {
        expect(incidents.some((i) => i.id === id)).toBe(true)
      }
      const detail = lesson.detail ?? 'overview'
      const year = yearFromFraction(lesson.t)
      const visible = incidentsVisible(detail, year)
      expect(visible.some((i) => i.id === lesson.incidentId)).toBe(true)
      if (lesson.incidentIds?.length) {
        for (const id of lesson.incidentIds) {
          const inc = incidents.find((i) => i.id === id)!
          const atEvent = incidentsVisible(detail, inc.year + (inc.month - 1) / 12)
          expect(atEvent.some((i) => i.id === id)).toBe(true)
        }
      }
      expect(lessonIncidentVisible(lesson.id, detail, lesson.t)).toBe(true)
    }
  })
})
