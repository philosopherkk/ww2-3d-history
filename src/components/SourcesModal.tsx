import { ww2Dataset } from '../data/ww2Dataset'
import { useAppStore } from '../state/appStore'

export function SourcesModal() {
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
          <h2 id="sources-title">Data sources & certainty</h2>
          <button type="button" className="ghost" onClick={() => setShowSources(false)}>
            Close
          </button>
        </div>
        <p>
          Figures are teaching estimates densified to weekly (major combatants), monthly (key
          secondaries), or quarterly
          (others) from sparse published anchors — not a research database. Interpolated / held
          points are never marked <em>certain</em>. Values marked{' '}
          <span className="unsure">unsure</span> are debated, method-dependent, occupied/partitioned,
          or thinly sourced. Prefer Official Histories for graded work.
        </p>
        <p className="meta">{ww2Dataset.series.note}</p>
        <ul className="sources-full">
          {ww2Dataset.sources.map((s) => (
            <li key={s.id}>
              <strong>{s.id}</strong> — {s.citation}
              {s.url && (
                <>
                  {' '}
                  <a href={s.url} target="_blank" rel="noreferrer">
                    link
                  </a>
                </>
              )}
              <div className="meta">Covers: {s.covers}</div>
            </li>
          ))}
        </ul>
        <p className="hint muted">
          Timeframe: {ww2Dataset.timeframe.start} → {ww2Dataset.timeframe.end}
          {ww2Dataset.timeframe.preludeLabeled
            ? ' (late-1930s Asian prelude labeled on the scrubber)'
            : ''}
          .
        </p>
      </div>
    </div>
  )
}
