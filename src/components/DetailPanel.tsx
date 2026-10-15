import { ww2Dataset } from '../data/ww2Dataset'
import {
  dateLabelFromFraction,
  incidentSummary,
  metricAtYear,
  pointStamp,
  yearFromFraction,
} from '../data/selectors'
import { useAppStore } from '../state/appStore'

export function DetailPanel() {
  const time = useAppStore((s) => s.time)
  const metric = useAppStore((s) => s.metric)
  const detail = useAppStore((s) => s.detail)
  const countryId = useAppStore((s) => s.selectedCountryId)
  const incidentId = useAppStore((s) => s.selectedIncidentId)
  const selectCountry = useAppStore((s) => s.selectCountry)
  const selectIncident = useAppStore((s) => s.selectIncident)

  const fracYear = yearFromFraction(time)
  const country = ww2Dataset.countries.find((c) => c.id === countryId)
  const incident = ww2Dataset.incidents.find((i) => i.id === incidentId)

  if (!country && !incident) {
    return (
      <aside className="detail">
        <h2>Detail</h2>
        <p className="empty">
          Select a country bar on the globe or an incident on the timeline. Metric:{' '}
          <strong>{ww2Dataset.metricLabels[metric].label}</strong> ·{' '}
          {dateLabelFromFraction(time)}. {ww2Dataset.countries.length} countries in dataset (
          {ww2Dataset.series.defaultCadence} densification for majors).
        </p>
      </aside>
    )
  }

  if (incident) {
    const sources = incident.sources
      .map((id) => ww2Dataset.sources.find((s) => s.id === id))
      .filter(Boolean)

    return (
      <aside className="detail">
        <div className="detail-head">
          <h2>{incident.title}</h2>
          <button type="button" className="ghost" onClick={() => selectIncident(null)}>
            Close
          </button>
        </div>
        <p className="meta">
          {incident.date}
          {incident.year < 1939 ? ' · prelude (pre-1939 European war)' : ''}
          {incident.certainty === 'unsure' ? ' · unsure' : ''}
        </p>
        <p>{incidentSummary(incident, detail)}</p>
        <h3>Sources</h3>
        <ul className="sources-mini">
          {sources.map((s) => (
            <li key={s!.id}>{s!.citation}</li>
          ))}
        </ul>
      </aside>
    )
  }

  const point = country ? metricAtYear(country, metric, fracYear) : null

  return (
    <aside className="detail">
      <div className="detail-head">
        <h2>{country!.name}</h2>
        <button type="button" className="ghost" onClick={() => selectCountry(null)}>
          Close
        </button>
      </div>
      <p className="meta">
        {country!.involvement} · globe side {country!.side} · {country!.cadence} series · scrubber{' '}
        {dateLabelFromFraction(time)}
      </p>
      <p className="hint">{country!.roleNote}</p>
      {point ? (
        <>
          <p className="metric-value">
            {ww2Dataset.metricLabels[metric].label}:{' '}
            <strong>
              {point.value} {point.unit}
            </strong>
          </p>
          <p className="meta">
            Point: {pointStamp(point)} · certainty:{' '}
            <span className={point.certainty === 'unsure' ? 'unsure' : ''}>
              {point.certainty}
            </span>
            {point.provenance ? ` · ${point.provenance}` : ''}
          </p>
          {point.note && <p className="note">{point.note}</p>}
        </>
      ) : (
        <p className="empty">
          No nearby datapoint (outside active window or gap &gt; ~5 months).
        </p>
      )}
      <h3>All metrics @ {dateLabelFromFraction(time)}</h3>
      <ul className="metric-list">
        {(Object.keys(ww2Dataset.metricLabels) as Array<keyof typeof ww2Dataset.metricLabels>).map(
          (m) => {
            const p = metricAtYear(country!, m, fracYear)
            return (
              <li key={m}>
                <span>{ww2Dataset.metricLabels[m].label}</span>
                <span>
                  {p ? (
                    <>
                      {p.value} {p.unit}
                      {p.certainty === 'unsure' ? ' (unsure)' : ''}
                      {p.provenance === 'interpolated' ? ' ~' : ''}
                    </>
                  ) : (
                    '—'
                  )}
                </span>
              </li>
            )
          },
        )}
      </ul>
    </aside>
  )
}
