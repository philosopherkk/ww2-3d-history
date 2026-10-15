import { useState } from 'react'
import { incidentIsGraphic } from '../data/graphicContent'
import { adaptIncident, adaptMetricPoint, adaptPerson, metricStoredUnsure } from '../data/evidenceAdapt'
import { ww2Dataset } from '../data/ww2Dataset'
import { incidentExternalLinks } from '../data/incidentLinks'
import {
  getPerson,
  peopleForCountry,
  peopleForIncident,
  personBackground,
  personExternalLinks,
} from '../data/people'
import type { ExternalLink } from '../data/externalLinks'
import {
  countryBriefing,
  dateLabelFromFraction,
  incidentBriefing,
  metricAtYear,
  metricLabel,
  pointStamp,
  relatedCountriesForIncident,
  relatedIncidentsForCountry,
  yearFromFraction,
} from '../data/selectors'
import type { DetailLevel, MetricKey } from '../data/types'
import { formatNumber } from '../shared/i18n/format'
import type { LocalizedText } from '../shared/i18n/types'
import { useT } from '../shared/i18n/translate'
import type { Measured } from '../shared/evidence/types'
import { EvidenceBadge, SourcePanel } from '../shared/evidence'
import { useAppStore } from '../state/appStore'
import { Localized } from './Localized'
import { SeriesChart } from './SeriesChart'

function destinationType(link: ExternalLink): string {
  if (link.url.includes('wikipedia.org')) return 'Wikipedia'
  if (link.url.includes('/search')) return 'Search / 搜尋'
  if (link.url.includes('grokipedia.com')) return 'Grokipedia'
  return 'External / 外部網站'
}

function ExtLinks({ links }: { links: ExternalLink[] }) {
  const ordered = [...links].sort((a, b) => {
    const rank = (url: string) => (url.includes('wikipedia.org') ? 0 : 1)
    return rank(a.url) - rank(b.url)
  })
  return (
    <ul className="ext-links">
      {ordered.map((l) => (
        <li key={l.url}>
          <a href={l.url} target="_blank" rel="noopener noreferrer">
            {l.label}
          </a>
          <span className="dest-type">{destinationType(l)}</span>
          {l.url.includes('grokipedia.com') && (
            <span className="ai-note">AI 生成內容，請比對 / AI-generated — compare with other sources</span>
          )}
          {l.certainty === 'unsure' && <span className="badge">unsure</span>}
        </li>
      ))}
    </ul>
  )
}

function IncidentBody({
  incidentId,
  detail,
  summary,
  overview,
  extra,
  opened,
  onOpen,
}: {
  incidentId: string
  detail: DetailLevel
  summary: LocalizedText
  overview: LocalizedText
  extra: string
  opened: boolean
  onOpen: () => void
}) {
  const graphic = incidentIsGraphic(incidentId)
  if (!graphic) {
    return (
      <p>
        <Localized value={summary} />
        {extra}
      </p>
    )
  }
  if (detail !== 'deep' || !opened) {
    return (
      <>
        <p>
          <Localized value={overview} />
        </p>
        {detail === 'deep' ? (
          <button type="button" className="content-note" onClick={onOpen}>
            內容提示：涉及戰爭暴行 / Content note: wartime atrocities
          </button>
        ) : null}
      </>
    )
  }
  return (
    <p>
      <Localized value={summary} />
      {extra}
    </p>
  )
}

function detailName(detail: DetailLevel, tr: ReturnType<typeof useT>) {
  if (detail === 'overview') return tr('detailOverview')
  if (detail === 'standard') return tr('detailStandard')
  return tr('detailDeep')
}

export function DetailPanel() {
  const t = useT()
  const time = useAppStore((s) => s.time)
  const metric = useAppStore((s) => s.metric)
  const detail = useAppStore((s) => s.detail)
  const countryId = useAppStore((s) => s.selectedCountryId)
  const incidentId = useAppStore((s) => s.selectedIncidentId)
  const personId = useAppStore((s) => s.selectedPersonId)
  const selectCountry = useAppStore((s) => s.selectCountry)
  const selectIncident = useAppStore((s) => s.selectIncident)
  const selectPerson = useAppStore((s) => s.selectPerson)
  const setTime = useAppStore((s) => s.setTime)
  const setPlaying = useAppStore((s) => s.setPlaying)
  const selectionKey = `${countryId ?? ''}|${incidentId ?? ''}|${personId ?? ''}`
  const [graphicOpen, setGraphicOpen] = useState<string | null>(null)
  const [panel, setPanel] = useState<{ key: string; measured: Measured | null }>({ key: '', measured: null })
  const evidence = panel.key === selectionKey ? panel.measured : null
  const setEvidence = (measured: Measured | null) => setPanel({ key: selectionKey, measured })

  const fracYear = yearFromFraction(time)
  const dateLabel = dateLabelFromFraction(time)
  const country = ww2Dataset.countries.find((c) => c.id === countryId)
  const incident = ww2Dataset.incidents.find((i) => i.id === incidentId)
  const person = getPerson(personId)
  const detailText = detailName(detail, t)

  if (person) {
    const links = personExternalLinks(person)
    return (
      <aside className="detail">
        <div className="detail-head">
          <div>
            <p className="kind-chip kind-person">{t('person')}</p>
            <h2>
              <Localized value={person.name} />
            </h2>
          </div>
          <button type="button" className="ghost" onClick={() => selectPerson(null)}>
            {t('back')}
          </button>
        </div>
        <p className="meta">
          <Localized value={person.role} /> · {t('contextAt', { date: dateLabel })}
        </p>
        <p>
          <EvidenceBadge level={adaptPerson(person).level} onClick={() => setEvidence(adaptPerson(person))} />
        </p>
        {evidence ? <SourcePanel measured={evidence} onClose={() => setEvidence(null)} /> : null}
        <h3>{t('background')}</h3>
        <p>
          <Localized value={personBackground(person, detail)} />
        </p>
        <p className="hint muted">{t('dossierHint', { detail: detailText })}</p>
        <h3>{t('encyclopedia')}</h3>
        <ExtLinks links={links} />
      </aside>
    )
  }

  if (!country && !incident) {
    return (
      <aside className="detail">
        <h2>{t('learningPanel')}</h2>
        <p className="empty">{t('emptyPanel', { date: dateLabel })}</p>
        <p className="hint muted">
          {t('metricDetailHint', {
            metric: metricLabel(metric),
            detail: detailText,
            countries: ww2Dataset.countries.length,
            incidents: ww2Dataset.incidents.length,
          })}
        </p>
        <ul className="legend-list">
          <li>
            <span className="swatch country" /> {t('legendCountry')}
          </li>
          <li>
            <span className="swatch incident" /> {t('legendIncident')}
          </li>
          <li>
            <span className="swatch unsure" /> {t('legendUnsure')}
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
    const folks = peopleForIncident(incident.id)
    const ext = incidentExternalLinks(incident.id, incident.title)

    return (
      <aside className="detail">
        <div className="detail-head">
          <div>
            <p className="kind-chip kind-incident">{t('criticalIncident')}</p>
            <h2>
              <Localized value={incident.title} />
            </h2>
          </div>
          <button type="button" className="ghost" onClick={() => selectIncident(null)}>
            {t('close')}
          </button>
        </div>
        <p className="meta">{brief.statusLine}</p>
        <p>
          <EvidenceBadge
            level={adaptIncident(incident).level}
            storedUnsure={incident.certainty === 'unsure'}
            onClick={() => setEvidence(adaptIncident(incident))}
          />
        </p>
        {evidence ? <SourcePanel measured={evidence} onClose={() => setEvidence(null)} /> : null}
        <p className="marker-explainer">{brief.markerExplainer}</p>
        <h3>{t('backgroundAt', { date: dateLabel })}</h3>
        <IncidentBody
          incidentId={incident.id}
          detail={detail}
          summary={brief.summary}
          overview={incident.summaryOverview}
          extra={brief.extra}
          opened={graphicOpen === incident.id}
          onOpen={() => setGraphicOpen(incident.id)}
        />
        <p className="hint muted">{t('detailDeepens', { detail: detailText })}</p>

        <h3>{t('peopleInvolved')}</h3>
        {folks.length === 0 ? (
          <p className="hint muted">{t('noPeopleIncident')}</p>
        ) : (
          <ul className="people-list">
            {folks.map((p) => (
              <li key={p.id}>
                <button type="button" className="linkish" onClick={() => selectPerson(p.id)}>
                  <Localized value={p.name} />
                </button>
                <span className="meta">
                  {' '}
                  — <Localized value={p.role} />
                </span>
              </li>
            ))}
          </ul>
        )}

        <h3>{t('encyclopedia')}</h3>
        <ExtLinks links={ext} />

        {nearby.length > 0 && (
          <>
            <h3>{t('nearbyEntities')}</h3>
            <ul className="related-list">
              {nearby.map((c) => (
                <li key={c.id}>
                  <button type="button" className="linkish" onClick={() => selectCountry(c.id)}>
                    <Localized value={c.name} />
                  </button>
                  <span className="meta"> · {c.involvement}</span>
                </li>
              ))}
            </ul>
          </>
        )}

        <h3>{t('sourcesHeading')}</h3>
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
  const folks = peopleForCountry(country!.id)

  return (
    <aside className="detail">
      <div className="detail-head">
        <div>
          <p className="kind-chip kind-country">{t('countryEntity')}</p>
          <h2>
            <Localized value={country!.name} />
          </h2>
        </div>
        <button type="button" className="ghost" onClick={() => selectCountry(null)}>
          {t('close')}
        </button>
      </div>
      <p className="meta">{brief.statusLine}</p>
      <p className="marker-explainer">{brief.markerExplainer}</p>

      <h3>{t('backgroundAt', { date: dateLabel })}</h3>
      <p>
        <Localized value={brief.roleNote} />
      </p>
      {brief.paragraphs.map((p) => (
        <p key={p.slice(0, 80)}>{p}</p>
      ))}
      <p className="hint muted">{t('detailAdds', { detail: detailText })}</p>

      <h3>{t('peopleInvolved')}</h3>
      {folks.length === 0 ? (
        <p className="hint muted">{t('noPeopleCountry')}</p>
      ) : (
        <ul className="people-list">
          {folks.map((p) => (
            <li key={p.id}>
              <button type="button" className="linkish" onClick={() => selectPerson(p.id)}>
                <Localized value={p.name} />
              </button>
              <span className="meta">
                {' '}
                — <Localized value={p.role} />
              </span>
            </li>
          ))}
        </ul>
      )}

      {point ? (
        <>
          <p className="metric-value">
            {metricLabel(metric)}:{' '}
            <strong>
              {formatNumber(point.value)} {point.unit}
            </strong>
          </p>
          <p className="meta">
            {t('pointLabel')}: {pointStamp(point)}{' '}
            <EvidenceBadge
              level={adaptMetricPoint(point, metric).level}
              storedUnsure={metricStoredUnsure(point)}
              onClick={() => setEvidence(adaptMetricPoint(point, metric))}
            />
          </p>
          <SeriesChart points={country!.metrics[metric]} />
          {evidence ? <SourcePanel measured={evidence} onClose={() => setEvidence(null)} /> : null}
          {point.note && (
            <p className="note">
              <Localized value={point.note} />
            </p>
          )}
        </>
      ) : (
        <p className="empty">{t('noDatapoint')}</p>
      )}

      <h3>{t('allMetricsAt', { date: dateLabel })}</h3>
      <ul className="metric-list">
        {(Object.keys(ww2Dataset.metricLabels) as MetricKey[]).map((m) => {
          const p = metricAtYear(country!, m, fracYear)
          return (
            <li key={m}>
              <span>{metricLabel(m)}</span>
              <span>
                {p ? (
                  <>
                    {formatNumber(p.value)} {p.unit}{' '}
                    <EvidenceBadge
                      level={adaptMetricPoint(p, m).level}
                      storedUnsure={metricStoredUnsure(p)}
                      onClick={() => setEvidence(adaptMetricPoint(p, m))}
                    />
                  </>
                ) : (
                  '—'
                )}
              </span>
            </li>
          )
        })}
      </ul>

      {related.length > 0 && (
        <>
          <h3>{t('relatedIncidents')}</h3>
          <p className="hint muted">{t('relatedHint')}</p>
          <ul className="related-list">
            {related.map((inc) => {
              const ext = incidentExternalLinks(inc.id, inc.title)
              return (
                <li key={inc.id} className="related-incident">
                  <button
                    type="button"
                    className="linkish"
                    onClick={() => {
                      const start = 1937 + 6 / 12
                      const end = 1945 + 8 / 12
                      const y = inc.year + (inc.month - 1) / 12
                      setPlaying(false)
                      selectIncident(inc.id)
                      setTime(Math.min(1, Math.max(0, (y - start) / (end - start))))
                    }}
                  >
                    {inc.date} — <Localized value={inc.title} />
                  </button>
                  {inc.certainty === 'unsure' && <span className="badge">unsure</span>}
                  <span className="related-ext">
                    {ext.map((l) => (
                      <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer">
                        {l.label}
                        <span className="dest-type"> ({destinationType(l)})</span>
                        {l.certainty === 'unsure' ? ' ?' : ''}
                        {l.url.includes('grokipedia.com')
                          ? ' — AI 生成內容，請比對 / AI-generated — compare with other sources'
                          : ''}
                      </a>
                    ))}
                  </span>
                </li>
              )
            })}
          </ul>
        </>
      )}
    </aside>
  )
}
