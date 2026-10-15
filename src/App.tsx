import { Controls } from './components/Controls'
import { DetailPanel } from './components/DetailPanel'
import { FlatMap } from './components/FlatMap'
import { Globe } from './components/Globe'
import { PlayTicker } from './components/PlayTicker'
import { SourcesModal } from './components/SourcesModal'
import { Timeline } from './components/Timeline'
import { useT } from './shared/i18n/translate'
import { useAppStore } from './state/appStore'
import './App.css'

function ListStub() {
  const t = useT()
  return (
    <div className="flat-map-wrap list-stub">
      <p className="border-notice">Modern borders shown / 顯示為現代國界</p>
      <p>{t('listStub')}</p>
    </div>
  )
}

export default function App() {
  const view = useAppStore((s) => s.view)
  const setShowSources = useAppStore((s) => s.setShowSources)

  return (
    <div className="app">
      <PlayTicker />
      <Controls />
      <main className="stage">
        {view === 'globe' ? <Globe /> : view === 'list' ? <ListStub /> : <FlatMap />}
        <div className="side">
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
