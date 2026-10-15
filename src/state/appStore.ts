import { create } from 'zustand'
import type { DetailLevel, MetricKey } from '../data/types'

export type MapMode = 'flat' | 'globe'

interface AppState {
  time: number
  playing: boolean
  metric: MetricKey
  detail: DetailLevel
  mapMode: MapMode
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
  setMapMode: (m: MapMode) => void
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
  detail: 'standard',
  mapMode: 'flat',
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
  setMapMode: (mapMode) => set({ mapMode }),
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
