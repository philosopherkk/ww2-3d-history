import { incidentsVisible, yearFromFraction } from '../data/selectors'
import { useAppStore } from '../state/appStore'

export function Timeline() {
  const time = useAppStore((s) => s.time)
  const detail = useAppStore((s) => s.detail)
  const selectedIncidentId = useAppStore((s) => s.selectedIncidentId)
  const selectIncident = useAppStore((s) => s.selectIncident)
  const setTime = useAppStore((s) => s.setTime)
  const setPlaying = useAppStore((s) => s.setPlaying)

  const year = yearFromFraction(time)
  const incidents = incidentsVisible(detail, 1946) // full list filtered by detail only
  const visibleIds = new Set(incidentsVisible(detail, year).map((i) => i.id))

  return (
    <aside className="timeline">
      <h2>Critical incidents</h2>
      <ul>
        {incidents.map((inc) => {
          const reached = visibleIds.has(inc.id)
          const selected = selectedIncidentId === inc.id
          return (
            <li key={inc.id}>
              <button
                type="button"
                className={`incident-btn ${selected ? 'selected' : ''} ${reached ? 'reached' : 'future'}`}
                onClick={() => {
                  selectIncident(inc.id)
                  // Jump scrubber near incident
                  const start = 1937 + 6 / 12
                  const end = 1945 + 8 / 12
                  const y = inc.year + (inc.month - 1) / 12
                  setPlaying(false)
                  setTime(Math.min(1, Math.max(0, (y - start) / (end - start))))
                }}
              >
                <span className="inc-date">{inc.date}</span>
                <span className="inc-title">{inc.title}</span>
                {inc.certainty === 'unsure' && <span className="badge">unsure</span>}
                {inc.year < 1939 && <span className="badge prelude">prelude</span>}
              </button>
            </li>
          )
        })}
      </ul>
      <p className="hint muted">Detail level filters which incidents appear. Click to inspect.</p>
    </aside>
  )
}
