import { lessons } from '../data/lessons'
import { useT } from '../shared/i18n/translate'
import { useAppStore } from '../state/appStore'
import { Localized } from './Localized'

export function Lessons() {
  const t = useT()
  const selectIncident = useAppStore((s) => s.selectIncident)
  const setTime = useAppStore((s) => s.setTime)
  const setPlaying = useAppStore((s) => s.setPlaying)
  const selected = useAppStore((s) => s.selectedIncidentId)

  return (
    <section className="lessons">
      <h2>{t('lessons')}</h2>
      <ul>
        {lessons.map((lesson) => (
          <li key={lesson.id}>
            <button
              type="button"
              className={selected === lesson.incidentId ? 'selected' : ''}
              onClick={() => {
                setPlaying(false)
                selectIncident(lesson.incidentId)
                setTime(lesson.t)
              }}
            >
              <Localized value={lesson.title} />
            </button>
            <p>
              <Localized value={lesson.prompt} />
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
