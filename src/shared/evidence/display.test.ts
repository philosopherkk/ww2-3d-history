import { describe, expect, it } from 'vitest'
import { measuredValueText } from './display'

describe('measuredValueText', () => {
  it('includes unit on disputed ranges', () => {
    const text = measuredValueText(
      { level: 'disputed', low: 10, high: 5, unit: 'M' },
      'en',
    )
    expect(text).toContain('M')
    expect(text).toMatch(/5.*10|10.*5/)
  })

  it('returns localized no-data token when value is missing', () => {
    const text = measuredValueText({ level: 'unverified' }, 'en')
    expect(text.length).toBeGreaterThan(0)
    expect(text).not.toBe('')
  })
})
