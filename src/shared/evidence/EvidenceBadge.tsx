import { EVIDENCE_LABELS } from './labels'
import type { BadgeLevel } from './types'
import './evidence.css'

export function EvidenceBadge({
  level,
  storedUnsure = false,
  onClick,
}: {
  level: BadgeLevel
  /** Keep the word unsure visible when an interpolated/held point is also stored unsure. */
  storedUnsure?: boolean
  onClick?: () => void
}) {
  return (
    <span className="evidence-row">
      <BadgeFace level={level} onClick={onClick} />
      {storedUnsure && level !== 'unsure' ? <BadgeFace level="unsure" onClick={onClick} /> : null}
    </span>
  )
}

function BadgeFace({ level, onClick }: { level: BadgeLevel; onClick?: () => void }) {
  const label = EVIDENCE_LABELS[level]
  const text = (
    <>
      <span className="evidence-badge-icon" aria-hidden="true">
        {label.icon}
      </span>
      <span>{label.short}</span>
    </>
  )
  if (!onClick) {
    return (
      <span className={`evidence-badge evidence-${level}`} title={label.tooltip}>
        {text}
      </span>
    )
  }
  return (
    <button
      type="button"
      className={`evidence-badge evidence-${level}`}
      title={label.tooltip}
      aria-label={label.tooltip}
      onClick={onClick}
    >
      {text}
    </button>
  )
}
