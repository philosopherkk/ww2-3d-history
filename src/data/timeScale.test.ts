import { describe, expect, it } from 'vitest'
import { DEFAULT_T, dateFromT, tFromDate, tFromIsoDate } from './timeScale'

describe('timeScale', () => {
  it('default time is September 1939', () => {
    const { year, month } = dateFromT(DEFAULT_T)
    expect(year).toBe(1939)
    expect(month).toBe(9)
  })

  it('maps Japan surrender date into [0,1]', () => {
    const t = tFromIsoDate('1945-09-02')
    expect(t).toBeGreaterThan(0.99)
    expect(t).toBeLessThanOrEqual(1)
  })

  it('round-trips Sep 1939 via tFromDate', () => {
    const t = tFromDate(1939, 9, 1)
    expect(dateFromT(t).year).toBe(1939)
    expect(dateFromT(t).month).toBe(9)
  })
})
