import { lazy, Suspense } from 'react'
import { Controls } from './components/Controls'
import { DetailPanel } from './components/DetailPanel'
import { ErrorBoundary } from './components/ErrorBoundary'
import { FlatMap } from './components/FlatMap'
import { Lessons } from './components/Lessons'
import { ListView } from './components/ListView'
import { PlayTicker } from './components/PlayTicker'
import { PrintSummary } from './components/PrintSummary'
import { SourcesModal } from './components/SourcesModal'
import { Timeline } from './components/Timeline'
import './print.css'
import { useT } from './shared/i18n/translate'
import { hasWebGL } from './state/capabilities'
import { useAppStore } from './state/appStore'

const Globe = lazy(() => import('./components/Globe').then((mod) => ({ default: mod.Globe })))

export default function AtlasShell() {
  const t = useT()
  const view = useAppStore((s) => s.view)
  const setView = useAppStore((s) => s.setView)
  const setShowSources = useAppStore((s) => s.setShowSources)
  const webgl = hasWebGL()
  const showGlobe = view === 'globe' && webgl

  return (
    <div className="app">
      <a className="skip-link" href="#atlas-list">
        Skip to list / 跳至列表
      </a>
      <PrintSummary />
      <PlayTicker />
      <Controls />
      <main className="stage">
        {showGlobe ? (
          <ErrorBoundary
            fallbackKind="globe"
            onSwitchToMap={() => setView('map')}
            onOpenList={() => setView('list')}
          >
            <Suspense fallback={<p className="list-stub" role="status">{t('loadingGlobe')}</p>}>
              <Globe />
            </Suspense>
          </ErrorBoundary>
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
          <span className="footer-sources-label">{t('sourcesFooter')}</span>
          <span className="footer-sources-hint">{t('sourcesFooterHint')}</span>
        </button>
      </footer>
      <SourcesModal />
    </div>
  )
}
