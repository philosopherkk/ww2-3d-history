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
import { DEFAULT_T } from '../data/timeScale'
import { people } from '../data/people'
import { ww2Dataset } from '../data/ww2Dataset'
import { useAppStore, type AtlasView } from './appStore'
import { hasWebGL } from './capabilities'
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
    serialize: (value) =>
      Math.abs(value - DEFAULT_T) < 0.0005 ? null : String(Math.round(value * 1000) / 1000),
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

function selectionToken(state: {
  selectedCountryId: string | null
  selectedIncidentId: string | null
  selectedPersonId: string | null
}): string {
  if (state.selectedPersonId) return `p:${state.selectedPersonId}`
  if (state.selectedIncidentId) return `i:${state.selectedIncidentId}`
  if (state.selectedCountryId) return `c:${state.selectedCountryId}`
  return ''
}

function urlSnapshot(state: ReturnType<typeof useAppStore.getState>, locale: Locale): AtlasQuery {
  return {
    t: state.time,
    sel: selectionToken(state),
    layers: state.metric,
    level: state.detail,
    lang: locale,
    view: state.view,
  }
}

let applying = false
let lastWrittenSearch = ''
let debounceTimer: ReturnType<typeof setTimeout> | null = null
let pendingMode: HistoryMode = 'replace'

function writeUrl(mode: HistoryMode) {
  if (applying || typeof window === 'undefined') return
  const search = writeSearch(fields, urlSnapshot(useAppStore.getState(), useLocale.getState().locale))
  if (search === lastWrittenSearch) return
  lastWrittenSearch = search
  applySearch(search, mode)
}

function scheduleWrite(mode: HistoryMode, immediate = false) {
  pendingMode = mode === 'push' ? 'push' : pendingMode === 'push' ? 'push' : mode
  if (immediate) {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = null
    writeUrl(pendingMode)
    pendingMode = 'replace'
    return
  }
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    debounceTimer = null
    writeUrl(pendingMode)
    pendingMode = 'replace'
  }, 250)
}

function validateSelection(sel: string | undefined) {
  if (!sel) return
  if (sel.startsWith('c:')) {
    const id = sel.slice(2)
    if (!ww2Dataset.countries.some((c) => c.id === id)) {
      useAppStore.setState({ selectedCountryId: null })
    }
  } else if (sel.startsWith('i:')) {
    const id = sel.slice(2)
    if (!ww2Dataset.incidents.some((i) => i.id === id)) {
      useAppStore.setState({ selectedIncidentId: null })
    }
  } else if (sel.startsWith('p:')) {
    const id = sel.slice(2)
    if (!people.some((p) => p.id === id)) {
      useAppStore.setState({ selectedPersonId: null })
    }
  }
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
  validateSelection(sel)
}

export function applyUrlToStore() {
  applying = true
  try {
    const parsed = readSearch<AtlasQuery>(currentSearch(), fields)
    let view = parsed.view ?? 'map'
    if (view === 'globe' && !hasWebGL()) view = 'map'
    useAppStore.setState({
      time: parsed.t ?? DEFAULT_T,
      metric: parsed.layers ?? 'economicPower',
      detail: parsed.level ?? 'overview',
      view,
    })
    applySelection(parsed.sel)
    if (parsed.lang) useLocale.getState().setLocale(parsed.lang)
    lastWrittenSearch = currentSearch()
  } finally {
    applying = false
  }
}

type UrlSlice = Pick<
  ReturnType<typeof useAppStore.getState>,
  'time' | 'playing' | 'metric' | 'detail' | 'view' | 'selectedCountryId' | 'selectedIncidentId' | 'selectedPersonId'
>

function pickUrlFields(state: ReturnType<typeof useAppStore.getState>): UrlSlice {
  return {
    time: state.time,
    playing: state.playing,
    metric: state.metric,
    detail: state.detail,
    view: state.view,
    selectedCountryId: state.selectedCountryId,
    selectedIncidentId: state.selectedIncidentId,
    selectedPersonId: state.selectedPersonId,
  }
}

/** replaceState while scrubbing; pushState when the selection changes. */
export function startUrlSync() {
  applyUrlToStore()
  writeUrl('replace')
  let prev = pickUrlFields(useAppStore.getState())

  const unsubApp = useAppStore.subscribe((state) => {
    if (applying) return
    const slice = pickUrlFields(state)
    const selectionChanged =
      slice.selectedCountryId !== prev.selectedCountryId ||
      slice.selectedIncidentId !== prev.selectedIncidentId ||
      slice.selectedPersonId !== prev.selectedPersonId
    const timeChanged = slice.time !== prev.time
    const playingStopped = prev.playing && !slice.playing
    prev = slice

    if (selectionChanged) {
      scheduleWrite('push', true)
      return
    }
    if (playingStopped) {
      scheduleWrite('replace', true)
      return
    }
    if (timeChanged && slice.playing) {
      return
    }
    if (timeChanged) {
      scheduleWrite('replace', false)
      return
    }
    scheduleWrite('replace', true)
  })

  const unsubLocale = useLocale.subscribe(() => {
    if (!applying) scheduleWrite('replace', true)
  })
  const stopPop = onPopState(() => applyUrlToStore())

  const dispose = () => {
    unsubApp()
    unsubLocale()
    stopPop()
    if (debounceTimer) clearTimeout(debounceTimer)
  }

  if (import.meta.hot) {
    import.meta.hot.dispose(dispose)
  }

  return dispose
}
