import { describe, expect, it } from 'vitest'
import { ww2Dataset } from './ww2Dataset'
import { alignmentAt } from './selectors'
import { tFromDate } from './timeScale'

describe('alignmentAt', () => {
  const ita = ww2Dataset.countries.find((c) => c.id === 'ita')!
  const usa = ww2Dataset.countries.find((c) => c.id === 'usa')!

  it('Italy is Axis in 1940 and Allied co-belligerent after Sep 1943', () => {
    const t1940 = tFromDate(1940, 6, 1)
    const t1944 = tFromDate(1944, 1, 1)
    expect(alignmentAt(ita, t1940).side).toBe('axis')
    expect(alignmentAt(ita, t1944).side).toBe('allies')
  })

  it('United States is non-belligerent before Pearl Harbor', () => {
    const t1941 = tFromDate(1941, 6, 1)
    const t1942 = tFromDate(1942, 1, 1)
    expect(alignmentAt(usa, t1941).side).toBe('other')
    expect(alignmentAt(usa, t1942).side).toBe('allies')
  })
})
