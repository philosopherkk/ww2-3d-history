import {
  applySearch,
  currentSearch,
  onPopState,
  readSearch,
  writeSearch,
  type FieldCodec,
  type HistoryMode,
} from '../shared/urlState'
import { useLocale, type Locale } from '../shared/i18n'
import { useAppStore, type AtlasView } from './appStore'
import { hasWebGL, isLowEndDevice } from './capabilities'
import type { DetailLevel, MetricKey } from '../data/types'

const METRICS: MetricKey[] = [
  'economicPower',
  'population',
  'militaryStrength',
  'armyMobilisation',
  'navyMobilisation',
]
const LEVELS: DetailLevel[] = ['overview', 'standard', 'deep']
const VIEWS: AtlasView[] = ['map', 'globe', 'list']

interface AtlasQuery {
  t: number
  sel: string
  layers: MetricKey
  level: DetailLevel
  lang: Locale
  view: AtlasView
}

const DEFAULT_T = 0.18

function oneOf<T extends string>(allowed: readonly T[]): FieldCodec<T> {
  return {
    parse: (raw) => (allowed.includes(raw as T) ? (raw as T) : undefined),
    serialize: (value) => value,
  }
}

const fields: { [K in keyof AtlasQuery]: FieldCodec<AtlasQuery[K]> } = {
  t: {
    parse: (raw) => {
      const n = Number(raw)
      if (!Number.isFinite(n)) return undefined
      return Math.min(1, Math.max(0, n))
    },
    serialize: (value) => (Math.abs(value - DEFAULT_T) < 0.0005 ? null : String(Math.round(value * 1000) / 1000)),
  },
  sel: {
    parse: (raw) => (/^[cip]:[a-z0-9-]+$/i.test(raw) ? raw : undefined),
    serialize: (value) => (value ? value : null),
  },
  layers: {
    ...oneOf(METRICS),
    serialize: (value) => (value === 'economicPower' ? null : value),
  },
  level: {
    ...oneOf(LEVELS),
    serialize: (value) => (value === 'overview' ? null : value),
  },
  lang: {
    parse: (raw) => (raw === 'zh-Hant' || raw === 'en' ? raw : undefined),
    serialize: (value) => value,
  },
  view: {
    ...oneOf(VIEWS),
    serialize: (value) => (value === 'map' ? null : value),
  },
}

function selectionToken(state: ReturnType<typeof useAppStore.getState>): string {
  if (state.selectedPersonId) return `p:${state.selectedPersonId}`
  if (state.selectedIncidentId) return `i:${state.selectedIncidentId}`
  if (state.selectedCountryId) return `c:${state.selectedCountryId}`
  return ''
}

function snapshot(): AtlasQuery {
  const state = useAppStore.getState()
  return {
    t: state.time,
    sel: selectionToken(state),
    layers: state.metric,
    level: state.detail,
    lang: useLocale.getState().locale,
    view: state.view,
  }
}

let applying = false

function writeUrl(mode: HistoryMode) {
  if (applying || typeof window === 'undefined') return
  applySearch(writeSearch(fields, snapshot()), mode)
}

function applySelection(sel: string | undefined) {
  const country = sel?.startsWith('c:') ? sel.slice(2) : null
  const incident = sel?.startsWith('i:') ? sel.slice(2) : null
  const person = sel?.startsWith('p:') ? sel.slice(2) : null
  useAppStore.setState({
    selectedCountryId: country,
    selectedIncidentId: incident,
    selectedPersonId: person,
  })
}

export function applyUrlToStore() {
  applying = true
  const parsed = readSearch<AtlasQuery>(currentSearch(), fields)
  let view = parsed.view ?? 'map'
  if (view === 'globe' && !hasWebGL()) view = 'map'
  if (parsed.view == null && isLowEndDevice()) view = 'map'
  useAppStore.setState({
    time: parsed.t ?? DEFAULT_T,
    metric: parsed.layers ?? 'economicPower',
    detail: parsed.level ?? 'overview',
    view,
  })
  applySelection(parsed.sel)
  if (parsed.lang) useLocale.getState().setLocale(parsed.lang)
  applying = false
}

/** replaceState while scrubbing; pushState when the selection changes. */
export function startUrlSync() {
  applyUrlToStore()
  writeUrl('replace')
  const unsubApp = useAppStore.subscribe((state, prev) => {
    if (applying) return
    const selectionChanged =
      state.selectedCountryId !== prev.selectedCountryId ||
      state.selectedIncidentId !== prev.selectedIncidentId ||
      state.selectedPersonId !== prev.selectedPersonId
    writeUrl(selectionChanged ? 'push' : 'replace')
  })
  const unsubLocale = useLocale.subscribe(() => {
    if (!applying) writeUrl('replace')
  })
  const stopPop = onPopState(() => applyUrlToStore())
  return () => {
    unsubApp()
    unsubLocale()
    stopPop()
  }
}
