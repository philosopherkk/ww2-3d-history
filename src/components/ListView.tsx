import { adaptIncident, adaptMetricPoint, metricStoredUnsure } from '../data/evidenceAdapt'
import {
  countriesActiveAt,
  dateLabelFromFraction,
  incidentsVisible,
  metricAtYear,
  metricLabel,
  yearFromFraction,
} from '../data/selectors'
import { EvidenceBadge } from '../shared/evidence'
import { formatNumber } from '../shared/i18n/format'
import { useT } from '../shared/i18n/translate'
import { useAppStore } from '../state/appStore'
import { Localized } from './Localized'

/** Keyboard-navigable table for the same date as the map. */
export function ListView() {
  const t = useT()
  const time = useAppStore((s) => s.time)
  const detail = useAppStore((s) => s.detail)
  const metric = useAppStore((s) => s.metric)
  const selectedCountryId = useAppStore((s) => s.selectedCountryId)
  const selectedIncidentId = useAppStore((s) => s.selectedIncidentId)
  const selectCountry = useAppStore((s) => s.selectCountry)
  const selectIncident = useAppStore((s) => s.selectIncident)
  const year = yearFromFraction(time)
  const countries = countriesActiveAt(year, metric)
  const incidents = incidentsVisible(detail, year)
  const date = dateLabelFromFraction(time)

  return (
    <div className="list-view" id="atlas-list" tabIndex={-1}>
      <p className="border-notice">Modern borders shown / 顯示為現代國界</p>
      <table className="atlas-table">
        <caption>
          {t('tableCountries')} · {date}
        </caption>
        <thead>
          <tr>
            <th scope="col">{t('colName')}</th>
            <th scope="col">{t('colInvolvement')}</th>
            <th scope="col">{metricLabel(metric)}</th>
            <th scope="col">{t('colEvidence')}</th>
          </tr>
        </thead>
        <tbody>
          {countries.map((country) => {
            const nearest = metricAtYear(country, metric, year)
            return (
              <tr
                key={country.id}
                tabIndex={0}
                className={selectedCountryId === country.id ? 'selected' : ''}
                onClick={() => selectCountry(country.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    selectCountry(country.id)
                  }
                }}
              >
                <th scope="row">
                  <Localized value={country.name} />
                </th>
                <td>{country.involvement}</td>
                <td>
                  {nearest ? (
                    <>
                      {formatNumber(nearest.value)} {nearest.unit}
                    </>
                  ) : (
                    '—'
                  )}
                </td>
                <td>
                  {nearest ? (
                    <EvidenceBadge
                      level={adaptMetricPoint(nearest, metric).level}
                      storedUnsure={metricStoredUnsure(nearest)}
                    />
                  ) : (
                    '—'
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <table className="atlas-table">
        <caption>
          {t('tableIncidents')} · {date}
        </caption>
        <thead>
          <tr>
            <th scope="col">{t('colDate')}</th>
            <th scope="col">{t('colTitle')}</th>
            <th scope="col">{t('colEvidence')}</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((incident) => (
            <tr
              key={incident.id}
              tabIndex={0}
              className={selectedIncidentId === incident.id ? 'selected' : ''}
              onClick={() => selectIncident(incident.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  selectIncident(incident.id)
                }
              }}
            >
              <td>{incident.date}</td>
              <th scope="row">
                <Localized value={incident.title} />
              </th>
              <td>
                <EvidenceBadge
                  level={adaptIncident(incident).level}
                  storedUnsure={incident.certainty === 'unsure'}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
