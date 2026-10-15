import type { AlignmentSegment, CountrySpec } from './types'

/** Time-varying alliance colouring — keyed by country id. */
export const ALIGNMENT_BY_ID: Record<string, AlignmentSegment[]> = {
  ita: [
    { from: '1937-07', side: 'axis', involvement: 'axis' },
    { from: '1943-09', side: 'allies', involvement: 'co-belligerent' },
  ],
  fra: [
    { from: '1937-07', side: 'allies', involvement: 'allies' },
    { from: '1940-06', side: 'other', involvement: 'occupied' },
    { from: '1944-08', side: 'allies', involvement: 'allies' },
  ],
  sun: [
    { from: '1937-07', side: 'other', involvement: 'co-belligerent' },
    { from: '1941-06', side: 'allies', involvement: 'allies' },
  ],
  usa: [
    { from: '1937-07', side: 'other', involvement: 'late-declarant' },
    { from: '1941-12', side: 'allies', involvement: 'allies' },
  ],
  chn: [
    { from: '1937-07', side: 'allies', involvement: 'allies' },
  ],
  rou: [
    { from: '1941-06', side: 'axis', involvement: 'axis' },
    { from: '1944-08', side: 'allies', involvement: 'co-belligerent' },
  ],
  bgr: [
    { from: '1941-03', side: 'axis', involvement: 'axis' },
    { from: '1944-09', side: 'allies', involvement: 'co-belligerent' },
  ],
  fin: [
    { from: '1939-11', side: 'other', involvement: 'co-belligerent' },
    { from: '1941-06', side: 'axis', involvement: 'co-belligerent' },
    { from: '1944-09', side: 'allies', involvement: 'co-belligerent' },
  ],
}

export function defaultAlignment(spec: CountrySpec): AlignmentSegment[] {
  return [{ from: spec.activeFrom, side: spec.side, involvement: spec.involvement }]
}
