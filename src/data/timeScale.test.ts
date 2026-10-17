/// <reference types="node" />
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { DEFAULT_T, dateFromT, tFromDate, tFromIsoDate } from './timeScale'

const PRIVATE_END_FILES = [
  'src/components/Timeline.tsx',
  'src/components/Keybindings.tsx',
  'src/components/DetailPanel.tsx',
]

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

  it('fails when Timeline, Keybindings, or DetailPanel keep a private end', () => {
    const needle = '1945 + 8 / 12'
    const offenders = PRIVATE_END_FILES.filter((file) => readFileSync(resolve(file), 'utf8').includes(needle))
    expect(offenders).toEqual([])
  })

  it('maps incident clicks and the month step through tFromDate', () => {
    for (const file of PRIVATE_END_FILES) {
      expect(readFileSync(resolve(file), 'utf8')).toContain('tFromDate(')
    }
  })
})
