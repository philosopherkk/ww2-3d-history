import { ww2Dataset } from '../data/ww2Dataset'
import {
  countryBriefing,
  dateLabelFromFraction,
  incidentBriefing,
  metricAtYear,
  pointStamp,
  relatedCountriesForIncident,
  relatedIncidentsForCountry,
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
  const setTime = useAppStore((s) => s.setTime)
  const setPlaying = useAppStore((s) => s.setPlaying)

  const fracYear = yearFromFraction(time)
  const dateLabel = dateLabelFromFraction(time)
  const country = ww2Dataset.countries.find((c) => c.id === countryId)
  const incident = ww2Dataset.incidents.find((i) => i.id === incidentId)

  if (!country && !incident) {
    return (
      <aside className="detail">
        <h2>Learning panel</h2>
        <p className="empty">
          Click any <strong>country pin</strong> or <strong>incident diamond</strong> on the globe
          surface — or pick an incident in the timeline. The panel explains that place/entity at the
          scrubber date ({dateLabel}).
        </p>
        <p className="hint muted">
          Metric layer: {ww2Dataset.metricLabels[metric].label} · detail: {detail} ·{' '}
          {ww2Dataset.countries.length} entities · {ww2Dataset.incidents.length} incidents.
        </p>
        <ul className="legend-list">
          <li>
            <span className="swatch country" /> Country / entity pin on the Earth — alliance colour;
            size = selected metric
          </li>
          <li>
            <span className="swatch incident" /> Critical-incident pin on the Earth — dated event
          </li>
          <li>
            <span className="swatch unsure" /> Amber pin — metric point labeled unsure
          </li>
        </ul>
      </aside>
    )
  }

  if (incident) {
    const brief = incidentBriefing(incident, detail, dateLabel)
    const sources = incident.sources
      .map((id) => ww2Dataset.sources.find((s) => s.id === id))
      .filter(Boolean)
    const nearby = relatedCountriesForIncident(incident, fracYear, metric)

    return (
      <aside className="detail">
        <div className="detail-head">
          <div>
            <p className="kind-chip kind-incident">Critical incident pin</p>
            <h2>{incident.title}</h2>
          </div>
          <button type="button" className="ghost" onClick={() => selectIncident(null)}>
            Close
          </button>
        </div>
        <p className="meta">{brief.statusLine}</p>
        <p className="marker-explainer">{brief.markerExplainer}</p>
        <h3>Background @ {dateLabel}</h3>
        <p>{brief.body}</p>
        <p className="hint muted">
          Student detail “{detail}” deepens this incident text (overview → standard → deep).
        </p>

        {nearby.length > 0 && (
          <>
            <h3>Nearby entities on the map</h3>
            <ul className="related-list">
              {nearby.map((c) => (
                <li key={c.id}>
                  <button type="button" className="linkish" onClick={() => selectCountry(c.id)}>
                    {c.name}
                  </button>
                  <span className="meta"> · {c.involvement}</span>
                </li>
              ))}
            </ul>
          </>
        )}

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
  const brief = countryBriefing(country!, detail, fracYear, metric, dateLabel)
  const related = relatedIncidentsForCountry(country!, fracYear, detail)

  return (
    <aside className="detail">
      <div className="detail-head">
        <div>
          <p className="kind-chip kind-country">Country / entity metric pin</p>
          <h2>{country!.name}</h2>
        </div>
        <button type="button" className="ghost" onClick={() => selectCountry(null)}>
          Close
        </button>
      </div>
      <p className="meta">{brief.statusLine}</p>
      <p className="marker-explainer">{brief.markerExplainer}</p>

      <h3>Background @ {dateLabel}</h3>
      {brief.paragraphs.map((p) => (
        <p key={p.slice(0, 48)}>{p}</p>
      ))}
      <p className="hint muted">
        Detail level “{detail}” adds series / certainty / linked-incident context — it does not invent
        new events.
      </p>

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
            <span className={point.certainty === 'unsure' ? 'unsure' : ''}>{point.certainty}</span>
            {point.provenance ? ` · ${point.provenance}` : ''}
          </p>
          {point.note && <p className="note">{point.note}</p>}
        </>
      ) : (
        <p className="empty">
          No nearby datapoint (outside active window or gap &gt; ~5 months).
        </p>
      )}

      <h3>All metrics @ {dateLabel}</h3>
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

      {related.length > 0 && (
        <>
          <h3>Related incidents</h3>
          <p className="hint muted">
            Linked by proximity to this pin or by naming this entity in the teaching summary — only
            incidents already reached by the scrubber.
          </p>
          <ul className="related-list">
            {related.map((inc) => (
              <li key={inc.id}>
                <button
                  type="button"
                  className="linkish"
                  onClick={() => {
                    const start = 1937 + 6 / 12
                    const end = 1945 + 8 / 12
                    const y = inc.year + (inc.month - 1) / 12
                    setPlaying(false)
                    setTime(Math.min(1, Math.max(0, (y - start) / (end - start))))
                    selectIncident(inc.id)
                  }}
                >
                  {inc.date} — {inc.title}
                </button>
                {inc.certainty === 'unsure' && <span className="badge">unsure</span>}
              </li>
            ))}
          </ul>
        </>
      )}
    </aside>
  )
}
