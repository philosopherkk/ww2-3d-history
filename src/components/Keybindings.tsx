import { useEffect } from 'react'
import { useAppStore } from '../state/appStore'

const START = 1937 + 6 / 12
const END = 1945 + 8 / 12
const MONTH = 1 / 12 / (END - START)
const STEP = 0.001

/** ←/→ one scrub step, Shift+←/→ one month, Enter selects the hover, Esc closes panels. */
export function Keybindings() {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const tag = target?.tagName
      const typing = tag === 'TEXTAREA' || tag === 'SELECT' || (tag === 'INPUT' && (target as HTMLInputElement).type !== 'range')
      if (event.key === 'Escape') {
        const { showSources, selectedPersonId, selectedIncidentId, selectedCountryId } = useAppStore.getState()
        if (showSources) {
          useAppStore.getState().setShowSources(false)
          event.preventDefault()
          return
        }
        if (selectedPersonId) {
          useAppStore.getState().selectPerson(null)
          event.preventDefault()
          return
        }
        if (selectedIncidentId) {
          useAppStore.getState().selectIncident(null)
          event.preventDefault()
          return
        }
        if (selectedCountryId) {
          useAppStore.getState().selectCountry(null)
          event.preventDefault()
        }
        return
      }
      if (typing) return
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault()
        const dir = event.key === 'ArrowRight' ? 1 : -1
        const delta = (event.shiftKey ? MONTH : STEP) * dir
        const { time, setTime, setPlaying } = useAppStore.getState()
        setPlaying(false)
        setTime(Math.min(1, Math.max(0, time + delta)))
        return
      }
      if (event.key === 'Enter') {
        if (target?.closest('button, a, [role="button"]')) return
        const { hoveredIncidentId, hoveredCountryId, selectIncident, selectCountry } = useAppStore.getState()
        if (hoveredIncidentId) selectIncident(hoveredIncidentId)
        else if (hoveredCountryId) selectCountry(hoveredCountryId)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
  return null
}
