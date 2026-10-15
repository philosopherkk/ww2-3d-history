import { formatNumber, formatRange } from '../i18n/format'
import { t } from '../i18n/translate'
import type { Locale } from '../i18n/types'
import type { Measured } from './types'

/** Disputed low/high uses formatRange. Other levels show the single value. */
export function measuredValueText(measured: Measured, locale?: Locale): string {
  if (measured.level === 'disputed' && measured.low != null && measured.high != null) {
    const low = Math.min(measured.low, measured.high)
    const high = Math.max(measured.low, measured.high)
    const range = formatRange(low, high, locale)
    return measured.unit ? `${range} ${measured.unit}` : range
  }
  if (measured.value == null) return t('noData')
  const n = formatNumber(measured.value, locale)
  return measured.unit ? `${n} ${measured.unit}` : n
}
