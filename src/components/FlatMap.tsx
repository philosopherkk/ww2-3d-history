import { useCallback, useEffect, useRef, useState } from 'react'
import { resolveLocalized } from '../data/localize'
import {
  countriesActiveAt,
  dateLabelFromFraction,
  incidentsVisible,
  involvementLabel,
  maxMetricValue,
  metricAtYear,
  pointStamp,
  yearFromFraction,
} from '../data/selectors'
import { ww2Dataset } from '../data/ww2Dataset'
import { buildEarthCanvas, lonLatToMapFraction } from '../geo/earthMap'
import { useLocale } from '../shared/i18n/useLocale'
import { useT } from '../shared/i18n/translate'
import { useAppStore } from '../state/appStore'

type View = { x: number; y: number; scale: number }

export function FlatMap() {
  const t = useT()
  const locale = useLocale((s) => s.locale)
  const time = useAppStore((s) => s.time)
  const detail = useAppStore((s) => s.detail)
  const metric = useAppStore((s) => s.metric)
  const selectedCountryId = useAppStore((s) => s.selectedCountryId)
  const selectedIncidentId = useAppStore((s) => s.selectedIncidentId)
  const hoveredCountryId = useAppStore((s) => s.hoveredCountryId)
  const hoveredIncidentId = useAppStore((s) => s.hoveredIncidentId)
  const selectCountry = useAppStore((s) => s.selectCountry)
  const selectIncident = useAppStore((s) => s.selectIncident)
  const setHoveredCountry = useAppStore((s) => s.setHoveredCountry)
  const setHoveredIncident = useAppStore((s) => s.setHoveredIncident)

  const year = yearFromFraction(time)
  const active = countriesActiveAt(year, metric)
  const incidents = incidentsVisible(detail, year)
  const max = maxMetricValue(metric, year)

  const [mapUrl, setMapUrl] = useState<string | null>(null)
  const [view, setView] = useState<View>({ x: 0, y: 0, scale: 1 })
  const wrapRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ px: number; py: number; vx: number; vy: number } | null>(null)

  useEffect(() => {
    let alive = true
    let objectUrl: string | null = null
    buildEarthCanvas(2048)
      .then((canvas) => {
        if (!alive) return
        objectUrl = canvas.toDataURL('image/jpeg', 0.85)
        setMapUrl(objectUrl)
      })
      .catch((err) => console.warn(err))
    return () => {
      alive = false
    }
  }, [])

  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const rect = wrapRef.current?.getBoundingClientRect()
    if (!rect) return
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top
    setView((v) => {
      const nextScale = Math.min(6, Math.max(1, v.scale * (e.deltaY > 0 ? 0.9 : 1.1)))
      const k = nextScale / v.scale
      return {
        scale: nextScale,
        x: mx - k * (mx - v.x),
        y: my - k * (my - v.y),
      }
    })
  }, [])

  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('.map-pin')) return
    dragRef.current = { px: e.clientX, py: e.clientY, vx: view.x, vy: view.y }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current
    if (!d) return
    setView((v) => ({
      ...v,
      x: d.vx + (e.clientX - d.px),
      y: d.vy + (e.clientY - d.py),
    }))
  }

  const onPointerUp = () => {
    dragRef.current = null
  }

  const focusCountry = selectedCountryId ?? hoveredCountryId
  const focusIncident = selectedIncidentId ?? hoveredIncidentId
  const focusC = focusCountry
    ? ww2Dataset.countries.find((c) => c.id === focusCountry)
    : null
  const focusI = focusIncident
    ? ww2Dataset.incidents.find((i) => i.id === focusIncident)
    : null

  const pins = active.map((c) => {
    const point = metricAtYear(c, metric, year)!
    const sizeT = Math.min(1, point.value / max)
    const { x, y } = lonLatToMapFraction(c.lon, c.lat)
    return { c, point, sizeT, x, y }
  })

  return (
    <div className="flat-map-wrap">
      <div
        className="flat-map-viewport"
        ref={wrapRef}
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          className="flat-map-stage"
          style={{
            transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})`,
          }}
        >
          {mapUrl ? (
            <img className="flat-map-img" src={mapUrl} alt={t('mapAlt')} draggable={false} />
          ) : (
            <div className="flat-map-loading">{t('loadingMap')}</div>
          )}

          <div className="flat-map-pins">
            {pins.map(({ c, point, sizeT, x, y }) => {
              const selected = selectedCountryId === c.id
              const hovered = hoveredCountryId === c.id
              const unsure = point.certainty === 'unsure'
              const color =
                unsure
                  ? '#c4a03a'
                  : c.side === 'axis'
                    ? '#c45c3a'
                    : c.side === 'allies'
                      ? '#3a7ec4'
                      : '#8a8a6a'
              const size = 8 + sizeT * 14
              return (
                <button
                  key={c.id}
                  type="button"
                  className={`map-pin map-pin-country ${selected ? 'selected' : ''} ${hovered ? 'hovered' : ''}`}
                  style={{
                    left: `${x * 100}%`,
                    top: `${y * 100}%`,
                    width: size,
                    height: size,
                    background: color,
                    boxShadow: selected || hovered ? `0 0 0 3px ${color}` : undefined,
                  }}
                  title={`${resolveLocalized(c.name, locale).text} · ${point.value} ${point.unit}`}
                  aria-label={t('countryPin', { name: resolveLocalized(c.name, locale).text })}
                  onClick={(e) => {
                    e.stopPropagation()
                    selectCountry(c.id)
                  }}
                  onPointerEnter={() => setHoveredCountry(c.id)}
                  onPointerLeave={() => setHoveredCountry(null)}
                />
              )
            })}

            {incidents.map((inc) => {
              const { x, y } = lonLatToMapFraction(inc.lon, inc.lat)
              const selected = selectedIncidentId === inc.id
              const hovered = hoveredIncidentId === inc.id
              return (
                <button
                  key={inc.id}
                  type="button"
                  className={`map-pin map-pin-incident ${selected ? 'selected' : ''} ${hovered ? 'hovered' : ''}`}
                  style={{ left: `${x * 100}%`, top: `${y * 100}%` }}
                  title={`${resolveLocalized(inc.title, locale).text} · ${inc.date}`}
                  aria-label={t('incidentPin', { name: resolveLocalized(inc.title, locale).text })}
                  onClick={(e) => {
                    e.stopPropagation()
                    selectIncident(inc.id)
                  }}
                  onPointerEnter={() => setHoveredIncident(inc.id)}
                  onPointerLeave={() => setHoveredIncident(null)}
                />
              )
            })}
          </div>
        </div>
      </div>

      <div className="globe-hud-stack flat-hud">
        <div className={`globe-hud ${focusC || focusI ? 'globe-hud--focus' : ''}`}>
          {focusC || focusI ? (
            <>
              <span className="globe-hud-kind">{focusC ? t('countryEntity') : t('incidentKind')}</span>
              <strong>
                {focusC
                  ? resolveLocalized(focusC.name, locale).text
                  : focusI
                    ? resolveLocalized(focusI.title, locale).text
                    : ''}
              </strong>
              <span>
                {dateLabelFromFraction(time)}
                {focusC ? ` · ${involvementLabel(focusC.involvement)}` : ''}
                {focusI && !focusC ? ` · ${focusI.date}` : ''}
                {selectedCountryId || selectedIncidentId ? ` · ${t('selected')}` : ` · ${t('hover')}`}
              </span>
              {focusC &&
                (() => {
                  const p = metricAtYear(focusC, metric, year)
                  return p ? (
                    <span>
                      {p.value} {p.unit} · {pointStamp(p)} · {p.certainty}
                    </span>
                  ) : null
                })()}
            </>
          ) : (
            dateLabelFromFraction(time)
          )}
        </div>
        <div className="globe-legend">
          <span className="leg leg-country">{t('legCountryOnMap')}</span>
          <span className="leg leg-incident">{t('legIncidentOnMap')}</span>
          <span className="leg">{t('dragHint')}</span>
        </div>
      </div>
    </div>
  )
}
