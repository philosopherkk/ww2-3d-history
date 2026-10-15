import { measuredValueText } from './display'
import { EvidenceBadge } from './EvidenceBadge'
import type { Measured } from './types'
import './evidence.css'

export function SourcePanel({ measured, onClose }: { measured: Measured; onClose: () => void }) {
  const range =
    measured.low != null && measured.high != null ? measuredValueText({ ...measured, level: 'disputed' }) : null
  return (
    <section className="source-panel" aria-label="Sources">
      <div className="detail-head">
        <h4>Sources / 資料來源</h4>
        <button type="button" className="ghost" onClick={onClose}>
          Close / 關閉
        </button>
      </div>
      <EvidenceBadge level={measured.level} />
      {measured.level === 'disputed' && range ? (
        <p>Range / 範圍: {range}</p>
      ) : measured.value != null ? (
        <p>Value / 數值: {measuredValueText(measured)}</p>
      ) : null}
      <p>Method / 方法: {measured.method ?? '—'}</p>
      <p>
        Last reviewed / 最後複核:{' '}
        {measured.lastReviewed ?? (
          <>
            {/* TODO(data): needs source — no last-reviewed date is stored on this record */}
            <EvidenceBadge level="unverified" />
          </>
        )}
      </p>
      {measured.sources && measured.sources.length > 0 ? (
        <ul>
          {measured.sources.map((source) => (
            <li key={source}>{source}</li>
          ))}
        </ul>
      ) : (
        <p>
          {/* TODO(data): needs source */}
          <EvidenceBadge level="unverified" />
        </p>
      )}
      {measured.note ? <p>{measured.note}</p> : null}
    </section>
  )
}
