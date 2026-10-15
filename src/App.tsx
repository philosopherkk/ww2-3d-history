import { Controls } from './components/Controls'
import { DetailPanel } from './components/DetailPanel'
import { FlatMap } from './components/FlatMap'
import { Globe } from './components/Globe'
import { PlayTicker } from './components/PlayTicker'
import { SourcesModal } from './components/SourcesModal'
import { Timeline } from './components/Timeline'
import { useAppStore } from './state/appStore'
import './App.css'

export default function App() {
  const mapMode = useAppStore((s) => s.mapMode)

  return (
    <div className="app">
      <PlayTicker />
      <Controls />
      <main className="stage">
        {mapMode === 'flat' ? <FlatMap /> : <Globe />}
        <div className="side">
          <Timeline />
          <DetailPanel />
        </div>
      </main>
      <SourcesModal />
    </div>
  )
}
