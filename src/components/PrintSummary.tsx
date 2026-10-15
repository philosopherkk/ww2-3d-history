import { adaptIncident, adaptMetricPoint, metricStoredUnsure } from '../data/evidenceAdapt'
import { getPerson } from '../data/people'
import { dateLabelFromFraction, metricAtYear, metricLabel, yearFromFraction } from '../data/selectors'
import { ww2Dataset } from '../data/ww2Dataset'
import { EVIDENCE_LABELS } from '../shared/evidence'
import { enOf } from '../shared/i18n/pickText'
import { useLocale } from '../shared/i18n/useLocale'
import { formatNumber } from '../shared/i18n/format'
import type { MetricKey } from '../data/types'
import { useAppStore } from '../state/appStore'

const METRICS: MetricKey[] = [
  'economicPower',
  'population',
  'militaryStrength',
  'armyMobilisation',
  'navyMobilisation',
]

/** Screen-hidden sheet: date, selection, values with evidence labels, sources. */
export function PrintSummary() {
  useLocale((s) => s.locale)
  const time = useAppStore((s) => s.time)
  const metric = useAppStore((s) => s.metric)
  const countryId = useAppStore((s) => s.selectedCountryId)
  const incidentId = useAppStore((s) => s.selectedIncidentId)
  const personId = useAppStore((s) => s.selectedPersonId)
  const year = yearFromFraction(time)
  const country = ww2Dataset.countries.find((c) => c.id === countryId)
  const incident = ww2Dataset.incidents.find((i) => i.id === incidentId)
  const person = getPerson(personId)
  const name = person
    ? enOf(person.name)
    : incident
      ? enOf(incident.title)
      : country
        ? enOf(country.name)
        : '—'

  const sources = incident
    ? incident.sources
        .map((id) => ww2Dataset.sources.find((s) => s.id === id)?.citation)
        .filter((citation): citation is string => Boolean(citation))
    : country
      ? ww2Dataset.sources.filter((s) => s.covers.includes(metric)).map((s) => s.citation)
      : []

  return (
    <section className="print-summary">
      <h1>WWII Atlas / 二戰互動地圖</h1>
      <p>
        {dateLabelFromFraction(time)} — {name}
      </p>
      {country &&
        METRICS.map((key) => {
          const point = metricAtYear(country, key, year)
          if (!point) return null
          const measured = adaptMetricPoint(point, key)
          const unsure = metricStoredUnsure(point) && measured.level !== 'unsure'
          return (
            <p key={key}>
              {metricLabel(key)}: {formatNumber(point.value)} {point.unit} — {EVIDENCE_LABELS[measured.level].short}
              {unsure ? ` · ${EVIDENCE_LABELS.unsure.short}` : ''}
            </p>
          )
        })}
      {incident && (
        <p>
          {incident.date} — {EVIDENCE_LABELS[adaptIncident(incident).level].short}
        </p>
      )}
      <h2>Sources / 資料來源</h2>
      {sources.length === 0 ? <p>—</p> : <ul>{sources.map((s) => <li key={s}>{s}</li>)}</ul>}
      <p>數字多為教學用概估，非官方認證統計 / Figures are educational estimates, not certified statistics.</p>
    </section>
  )
}
