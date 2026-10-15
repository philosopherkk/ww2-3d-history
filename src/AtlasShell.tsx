import { lazy, Suspense } from 'react'
import { Controls } from './components/Controls'
import { DetailPanel } from './components/DetailPanel'
import { FlatMap } from './components/FlatMap'
import { Lessons } from './components/Lessons'
import { ListView } from './components/ListView'
import { PlayTicker } from './components/PlayTicker'
import { PrintSummary } from './components/PrintSummary'
import { SourcesModal } from './components/SourcesModal'
import { Timeline } from './components/Timeline'
import './print.css'
import { hasWebGL } from './state/capabilities'
import { useAppStore } from './state/appStore'

const Globe = lazy(() => import('./components/Globe').then((mod) => ({ default: mod.Globe })))

export default function AtlasShell() {
  const view = useAppStore((s) => s.view)
  const setView = useAppStore((s) => s.setView)
  const setShowSources = useAppStore((s) => s.setShowSources)
  const showGlobe = view === 'globe' && hasWebGL()

  return (
    <div className="app">
      <button
        type="button"
        className="skip-link"
        onClick={() => {
          setView('list')
          requestAnimationFrame(() => document.getElementById('atlas-list')?.focus())
        }}
      >
        Skip to list / 跳至列表
      </button>
      <PrintSummary />
      <PlayTicker />
      <Controls />
      <main className="stage">
        {showGlobe ? (
          <Suspense fallback={<p className="list-stub">Loading globe… / 正在載入地球…</p>}>
            <Globe />
          </Suspense>
        ) : view === 'list' ? (
          <ListView />
        ) : (
          <FlatMap />
        )}
        <div className="side">
          <Lessons />
          <Timeline />
          <DetailPanel />
        </div>
      </main>
      <footer className="edu-footer">
        <button type="button" className="linkish" onClick={() => setShowSources(true)}>
          數字多為教學用概估，非官方認證統計 / Figures are educational estimates, not certified statistics.
        </button>
      </footer>
      <SourcesModal />
    </div>
  )
}
