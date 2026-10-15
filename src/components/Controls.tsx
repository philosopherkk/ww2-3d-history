import { datasetStats, ww2Dataset } from '../data/ww2Dataset'
import { dateLabelFromFraction } from '../data/selectors'
import type { DetailLevel, MetricKey } from '../data/types'
import { useAppStore } from '../state/appStore'

const METRICS = Object.keys(ww2Dataset.metricLabels) as MetricKey[]
const DETAILS: DetailLevel[] = ['overview', 'standard', 'deep']

export function Controls() {
  const time = useAppStore((s) => s.time)
  const playing = useAppStore((s) => s.playing)
  const metric = useAppStore((s) => s.metric)
  const detail = useAppStore((s) => s.detail)
  const setTime = useAppStore((s) => s.setTime)
  const setPlaying = useAppStore((s) => s.setPlaying)
  const setMetric = useAppStore((s) => s.setMetric)
  const setDetail = useAppStore((s) => s.setDetail)
  const setShowSources = useAppStore((s) => s.setShowSources)

  return (
    <header className="controls">
      <div className="brand-row">
        <div>
          <p className="eyebrow">Project Ww 2 · v1</p>
          <h1 className="brand">WWII Atlas</h1>
        </div>
        <button type="button" className="ghost" onClick={() => setShowSources(true)}>
          Sources
        </button>
      </div>

      <div className="time-row">
        <button
          type="button"
          className="play"
          onClick={() => setPlaying(!playing)}
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? 'Pause' : 'Play'}
        </button>
        <div className="scrubber">
          <label htmlFor="time">
            Time · {dateLabelFromFraction(time)}
            {yearIsPrelude(time) ? ' · labeled prelude' : ''}
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
            <span>1937 prelude</span>
            <span>1939</span>
            <span>1942</span>
            <span>1945</span>
          </div>
        </div>
      </div>

      <div className="filter-row">
        <label>
          Metric layer
          <select value={metric} onChange={(e) => setMetric(e.target.value as MetricKey)}>
            {METRICS.map((m) => (
              <option key={m} value={m}>
                {ww2Dataset.metricLabels[m].label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Student detail
          <select value={detail} onChange={(e) => setDetail(e.target.value as DetailLevel)}>
            {DETAILS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="hint">{ww2Dataset.metricLabels[metric].description}</p>
      <p className="hint muted">
        {datasetStats.countryCount} countries · {datasetStats.incidentCount} incidents · majors weekly
        densified · {datasetStats.totalMetricPoints.toLocaleString()} metric points · pins on Earth
        surface · click for learning panel · drag to orbit · scroll to zoom · amber = unsure
      </p>
    </header>
  )
}

function yearIsPrelude(t: number) {
  // before Sep 1939
  return t < 0.18
}
