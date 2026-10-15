import type { Locale } from './types'
import { useLocale } from './useLocale'

function intlTag(locale: Locale): string {
  return locale === 'zh-Hant' ? 'zh-Hant' : 'en'
}

export function formatNumber(value: number, locale: Locale = useLocale.getState().locale): string {
  return new Intl.NumberFormat(intlTag(locale), { maximumFractionDigits: 3 }).format(value)
}

export function formatDate(input: string | Date, locale: Locale = useLocale.getState().locale): string {
  const date =
    typeof input === 'string'
      ? new Date(input.length === 10 ? `${input}T00:00:00Z` : input)
      : input
  return new Intl.DateTimeFormat(intlTag(locale), {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

export function formatMonthYear(
  year: number,
  month: number,
  locale: Locale = useLocale.getState().locale,
): string {
  return new Intl.DateTimeFormat(intlTag(locale), {
    year: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, 1)))
}

/** Disputed low/high display. Uses an en dash. */
export function formatRange(
  low: number,
  high: number,
  locale: Locale = useLocale.getState().locale,
): string {
  return `${formatNumber(low, locale)}–${formatNumber(high, locale)}`
}
