import { formatNumber, formatRange } from '../i18n/format'
import type { Locale } from '../i18n/types'
import type { Measured } from './types'

/** Disputed low/high uses formatRange. Other levels show the single value. */
export function measuredValueText(measured: Measured, locale?: Locale): string {
  if (measured.level === 'disputed' && measured.low != null && measured.high != null) {
    return formatRange(measured.low, measured.high, locale)
  }
  if (measured.value == null) return ''
  const n = formatNumber(measured.value, locale)
  return measured.unit ? `${n} ${measured.unit}` : n
}
