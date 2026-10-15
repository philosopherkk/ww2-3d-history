import { datasetStats } from '../data/ww2Dataset'
import { dateLabelFromFraction, metricDescription, metricLabel } from '../data/selectors'
import type { DetailLevel, MetricKey } from '../data/types'
import { formatNumber } from '../shared/i18n/format'
import { useLocale } from '../shared/i18n/useLocale'
import { useT } from '../shared/i18n/translate'
import type { Locale } from '../shared/i18n/types'
import { useAppStore, type MapMode } from '../state/appStore'

const METRICS: MetricKey[] = [
  'economicPower',
  'population',
  'militaryStrength',
  'armyMobilisation',
  'navyMobilisation',
]
const DETAILS: DetailLevel[] = ['overview', 'standard', 'deep']

export function Controls() {
  const t = useT()
  const locale = useLocale((s) => s.locale)
  const setLocale = useLocale((s) => s.setLocale)
  const time = useAppStore((s) => s.time)
  const playing = useAppStore((s) => s.playing)
  const metric = useAppStore((s) => s.metric)
  const detail = useAppStore((s) => s.detail)
  const mapMode = useAppStore((s) => s.mapMode)
  const setTime = useAppStore((s) => s.setTime)
  const setPlaying = useAppStore((s) => s.setPlaying)
  const setMetric = useAppStore((s) => s.setMetric)
  const setDetail = useAppStore((s) => s.setDetail)
  const setMapMode = useAppStore((s) => s.setMapMode)
  const setShowSources = useAppStore((s) => s.setShowSources)

  return (
    <header className="controls">
      <div className="brand-row">
        <div>
          <p className="eyebrow">{t('eyebrow')}</p>
          <h1 className="brand">{t('brand')}</h1>
        </div>
        <div className="header-actions">
          <div className="locale-toggle" role="group" aria-label={t('language')}>
            <LocaleButton locale="en" current={locale} onSelect={setLocale}>
              EN
            </LocaleButton>
            <span aria-hidden="true">|</span>
            <LocaleButton locale="zh-Hant" current={locale} onSelect={setLocale}>
              繁中
            </LocaleButton>
          </div>
          <button type="button" className="ghost" onClick={() => setShowSources(true)}>
            {t('sources')}
          </button>
        </div>
      </div>

      <div className="time-row">
        <button
          type="button"
          className="play"
          onClick={() => setPlaying(!playing)}
          aria-label={playing ? t('pause') : t('play')}
        >
          {playing ? t('pause') : t('play')}
        </button>
        <div className="scrubber">
          <label htmlFor="time">
            {t('time')} · {dateLabelFromFraction(time)}
            {yearIsPrelude(time) ? ` · ${t('preludeTag')}` : ''}
          </label>
          <input
            id="time"
            type="range"
            min={0}
            max={1}
            step={0.001}
            value={time}
            onChange={(e) => {
              setPlaying(false)
              setTime(Number(e.target.value))
            }}
          />
          <div className="ticks">
            <span>{t('tickPrelude')}</span>
            <span>{t('tick1939')}</span>
            <span>{t('tick1942')}</span>
            <span>{t('tick1945')}</span>
          </div>
        </div>
      </div>

      <div className="filter-row">
        <label>
          {t('mapView')}
          <select value={mapMode} onChange={(e) => setMapMode(e.target.value as MapMode)}>
            <option value="flat">{t('viewMap')}</option>
            <option value="globe">{t('viewGlobe')}</option>
          </select>
        </label>
        <label>
          {t('metricLayer')}
          <select value={metric} onChange={(e) => setMetric(e.target.value as MetricKey)}>
            {METRICS.map((m) => (
              <option key={m} value={m}>
                {metricLabel(m)}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t('studentDetail')}
          <select value={detail} onChange={(e) => setDetail(e.target.value as DetailLevel)}>
            {DETAILS.map((d) => (
              <option key={d} value={d}>
                {detailName(d, t)}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="hint">{metricDescription(metric)}</p>
      <p className="hint muted">
        {t('statsLine', {
          countries: formatNumber(datasetStats.countryCount),
          incidents: formatNumber(datasetStats.incidentCount),
          points: formatNumber(datasetStats.totalMetricPoints),
        })}
      </p>
    </header>
  )
}

function LocaleButton({
  locale,
  current,
  onSelect,
  children,
}: {
  locale: Locale
  current: Locale
  onSelect: (locale: Locale) => void
  children: string
}) {
  return (
    <button type="button" aria-pressed={current === locale} onClick={() => onSelect(locale)}>
      {children}
    </button>
  )
}

function detailName(detail: DetailLevel, tr: (key: 'detailOverview' | 'detailStandard' | 'detailDeep') => string) {
  if (detail === 'overview') return tr('detailOverview')
  if (detail === 'standard') return tr('detailStandard')
  return tr('detailDeep')
}

function yearIsPrelude(time: number) {
  return time < 0.18
}
