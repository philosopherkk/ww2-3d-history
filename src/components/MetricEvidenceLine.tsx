import type { Country, MetricKey, MetricPoint } from '../data/types'
import { metricStoredUnsure } from '../data/evidenceAdapt'
import { pointStamp } from '../data/selectors'
import { toMeasured } from '../data/toMeasured'
import { EvidenceBadge, measuredValueText } from '../shared/evidence'
import { useLocale } from '../shared/i18n/useLocale'

export function MetricEvidenceLine({
  point,
  country,
  metric,
}: {
  point: MetricPoint
  country: Country
  metric: MetricKey
}) {
  const locale = useLocale((s) => s.locale)
  const measured = toMeasured(point, country, metric)
  return (
    <span className="metric-evidence-line">
      {measuredValueText(measured, locale)} · {pointStamp(point)}{' '}
      <EvidenceBadge level={measured.level} storedUnsure={metricStoredUnsure(point)} />
    </span>
  )
}
