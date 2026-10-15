import type { MetricPoint } from '../data/types'
import { useT } from '../shared/i18n/translate'

/** Anchor points are solid. Interpolated and held points are dashed and lighter. */
export function SeriesChart({ points }: { points: MetricPoint[] }) {
  const t = useT()
  if (points.length < 2) return null
  const width = 280
  const height = 64
  const pad = 6
  const min = Math.min(...points.map((p) => p.value))
  const max = Math.max(...points.map((p) => p.value))
  const span = max - min || 1
  const xAt = (index: number) => pad + (index / (points.length - 1)) * (width - pad * 2)
  const yAt = (value: number) => height - pad - ((value - min) / span) * (height - pad * 2)
  const line = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${xAt(index).toFixed(1)} ${yAt(point.value).toFixed(1)}`)
    .join(' ')

  return (
    <figure className="series-chart">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={t('seriesLegend')}>
        <path d={line} className="series-dashed" />
        {points.map((point, index) => {
          const anchor = point.provenance === 'anchor'
          return (
            <circle
              key={`${point.year}-${index}`}
              cx={xAt(index)}
              cy={yAt(point.value)}
              r={anchor ? 2.2 : 1.4}
              className={anchor ? 'series-anchor' : 'series-interp'}
            />
          )
        })}
      </svg>
      <figcaption className="series-legend">
        <span>● {t('seriesAnchor')}</span>
        <span>◐ {t('seriesInterpolated')}</span>
      </figcaption>
    </figure>
  )
}
