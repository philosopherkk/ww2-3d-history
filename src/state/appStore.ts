import { create } from 'zustand'
import type { DetailLevel, MetricKey } from '../data/types'

interface AppState {
  time: number
  playing: boolean
  metric: MetricKey
  detail: DetailLevel
  selectedCountryId: string | null
  selectedIncidentId: string | null
  showSources: boolean
  setTime: (t: number) => void
  setPlaying: (p: boolean) => void
  setMetric: (m: MetricKey) => void
  setDetail: (d: DetailLevel) => void
  selectCountry: (id: string | null) => void
  selectIncident: (id: string | null) => void
  setShowSources: (v: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  time: 0.18, // ~Sep 1939
  playing: false,
  metric: 'economicPower',
  detail: 'standard',
  selectedCountryId: null,
  selectedIncidentId: null,
  showSources: false,
  setTime: (time) => set({ time }),
  setPlaying: (playing) => set({ playing }),
  setMetric: (metric) => set({ metric }),
  setDetail: (detail) => set({ detail }),
  selectCountry: (selectedCountryId) =>
    set({ selectedCountryId, selectedIncidentId: null }),
  selectIncident: (selectedIncidentId) =>
    set({ selectedIncidentId, selectedCountryId: null }),
  setShowSources: (showSources) => set({ showSources }),
}))
