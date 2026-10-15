import { describe, expect, it } from 'vitest'
import { en, type MessageKey } from './locales/en'
import { zhHant } from './locales/zh-Hant'

describe('locales', () => {
  it('has every key in both English and Traditional Chinese', () => {
    const enKeys = Object.keys(en).sort()
    const zhKeys = Object.keys(zhHant).sort()
    expect(zhKeys).toEqual(enKeys)
    for (const key of enKeys) {
      const message = zhHant[key as MessageKey]
      expect(typeof message).toBe('string')
      expect(message.length).toBeGreaterThan(0)
      expect(en[key as MessageKey].length).toBeGreaterThan(0)
    }
  })
})
