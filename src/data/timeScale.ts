/** Shared WWII atlas timeline — Jul 1937 through 2 Sep 1945 (inclusive). */
export const START = 1937 + 6 / 12

/** End slightly past 1945-09-02 so the formal surrender date is reachable on the scrubber. */
export const END = 1945 + 8 / 12 + 2 / 365.25

const SPAN = END - START

export const DEFAULT_T = tFromDate(1939, 9, 1)

export function calendarYear(year: number, month: number, day = 1): number {
  return year + (month - 1) / 12 + (day - 1) / 365.25
}

export function tFromDate(year: number, month: number, day = 1): number {
  const y = calendarYear(year, month, day)
  return Math.min(1, Math.max(0, (y - START) / SPAN))
}

export function dateFromT(t: number): { year: number; month: number; day: number } {
  const clamped = Math.min(1, Math.max(0, t))
  const y = START + clamped * SPAN
  const year = Math.floor(y + 1e-9)
  const monthFrac = (y - year) * 12
  const month = Math.min(12, Math.max(1, Math.floor(monthFrac + 1e-9) + 1))
  const dayInMonth = Math.min(28, Math.max(1, Math.round((monthFrac - (month - 1)) * 30) + 1))
  return { year, month, day: dayInMonth }
}

export function tFromIsoDate(iso: string): number {
  const [ys, ms, ds] = iso.split('-')
  return tFromDate(Number(ys), Number(ms), Number(ds))
}

export function yearFromFraction(t: number): number {
  return START + Math.min(1, Math.max(0, t)) * SPAN
}
