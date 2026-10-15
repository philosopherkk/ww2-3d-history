import { create } from 'zustand'
import type { DetailLevel, MetricKey } from '../data/types'

export type AtlasView = 'map' | 'globe' | 'list'

interface AppState {
  time: number
  playing: boolean
  metric: MetricKey
  detail: DetailLevel
  view: AtlasView
  selectedCountryId: string | null
  selectedIncidentId: string | null
  selectedPersonId: string | null
  hoveredCountryId: string | null
  hoveredIncidentId: string | null
  showSources: boolean
  setTime: (t: number) => void
  setPlaying: (p: boolean) => void
  setMetric: (m: MetricKey) => void
  setDetail: (d: DetailLevel) => void
  setView: (view: AtlasView) => void
  selectCountry: (id: string | null) => void
  selectIncident: (id: string | null) => void
  selectPerson: (id: string | null) => void
  setHoveredCountry: (id: string | null) => void
  setHoveredIncident: (id: string | null) => void
  setShowSources: (v: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  time: 0.18, // ~Sep 1939
  playing: false,
  metric: 'economicPower',
  detail: 'overview',
  view: 'map',
  selectedCountryId: null,
  selectedIncidentId: null,
  selectedPersonId: null,
  hoveredCountryId: null,
  hoveredIncidentId: null,
  showSources: false,
  setTime: (time) => set({ time }),
  setPlaying: (playing) => set({ playing }),
  setMetric: (metric) => set({ metric }),
  setDetail: (detail) => set({ detail }),
  setView: (view) => set({ view }),
  selectCountry: (selectedCountryId) =>
    set({
      selectedCountryId,
      selectedIncidentId: null,
      selectedPersonId: null,
      playing: false,
    }),
  selectIncident: (selectedIncidentId) =>
    set({
      selectedIncidentId,
      selectedCountryId: null,
      selectedPersonId: null,
      playing: false,
    }),
  selectPerson: (selectedPersonId) => set({ selectedPersonId, playing: false }),
  setHoveredCountry: (hoveredCountryId) => set({ hoveredCountryId }),
  setHoveredIncident: (hoveredIncidentId) => set({ hoveredIncidentId }),
  setShowSources: (showSources) => set({ showSources }),
}))
