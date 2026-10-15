import { ww2Dataset } from '../data/ww2Dataset'
import { Localized } from './Localized'
import { useT } from '../shared/i18n/translate'
import { useAppStore } from '../state/appStore'

export function SourcesModal() {
  const t = useT()
  const open = useAppStore((s) => s.showSources)
  const setShowSources = useAppStore((s) => s.setShowSources)
  if (!open) return null

  return (
    <div className="modal-backdrop" role="presentation" onClick={() => setShowSources(false)}>
      <div
        className="modal"
        role="dialog"
        aria-labelledby="sources-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="detail-head">
          <h2 id="sources-title">{t('sourcesTitle')}</h2>
          <button type="button" className="ghost" onClick={() => setShowSources(false)}>
            {t('close')}
          </button>
        </div>
        <p>{t('sourcesIntro')}</p>
        <p className="meta">
          <Localized value={ww2Dataset.series.note} />
        </p>
        <ul className="sources-full">
          {ww2Dataset.sources.map((s) => (
            <li key={s.id}>
              <strong>{s.id}</strong> — {s.citation}
              {s.url && (
                <>
                  {' '}
                  <a href={s.url} target="_blank" rel="noopener noreferrer">
                    {t('link')}
                  </a>
                </>
              )}
              <div className="meta">
                {t('covers')}: {s.covers}
              </div>
            </li>
          ))}
        </ul>
        <p className="hint muted">
          {t('timeframe')}: {ww2Dataset.timeframe.start} → {ww2Dataset.timeframe.end}
          {ww2Dataset.timeframe.preludeLabeled ? ` ${t('preludeLabeled')}` : ''}.
        </p>
      </div>
    </div>
  )
}
