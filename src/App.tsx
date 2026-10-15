import { Controls } from './components/Controls'
import { DetailPanel } from './components/DetailPanel'
import { Globe } from './components/Globe'
import { SourcesModal } from './components/SourcesModal'
import { Timeline } from './components/Timeline'
import './App.css'

export default function App() {
  return (
    <div className="app">
      <Controls />
      <main className="stage">
        <Globe />
        <div className="side">
          <Timeline />
          <DetailPanel />
        </div>
      </main>
      <SourcesModal />
    </div>
  )
}
