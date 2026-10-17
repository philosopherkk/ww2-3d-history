import { adaptIncident } from '../data/evidenceAdapt'
import { incidentsVisible, yearFromFraction } from '../data/selectors'
import { tFromDate } from '../data/timeScale'
import { EvidenceBadge } from '../shared/evidence'
import { Localized } from './Localized'
import { useT } from '../shared/i18n/translate'
import { useAppStore } from '../state/appStore'

export function Timeline() {
  const t = useT()
  const time = useAppStore((s) => s.time)
  const detail = useAppStore((s) => s.detail)
  const selectedIncidentId = useAppStore((s) => s.selectedIncidentId)
  const selectIncident = useAppStore((s) => s.selectIncident)
  const setTime = useAppStore((s) => s.setTime)
  const setPlaying = useAppStore((s) => s.setPlaying)

  const year = yearFromFraction(time)
  const incidents = incidentsVisible(detail, 1946)
  const visibleIds = new Set(incidentsVisible(detail, year).map((i) => i.id))

  return (
    <aside className="timeline">
      <h2>{t('timelineTitle')}</h2>
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
                  setPlaying(false)
                  setTime(tFromDate(inc.year, inc.month))
                }}
              >
                <span className="inc-date">{inc.date}</span>
                <span className="inc-title">
                  <Localized value={inc.title} />
                </span>
                <EvidenceBadge
                  level={adaptIncident(inc).level}
                  storedUnsure={inc.certainty === 'unsure'}
                />
                {inc.year < 1939 && <span className="badge prelude">{t('prelude')}</span>}
              </button>
            </li>
          )
        })}
      </ul>
      <p className="hint muted">{t('timelineHint')}</p>
    </aside>
  )
}
