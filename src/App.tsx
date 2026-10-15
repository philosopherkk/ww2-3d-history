import { lazy, Suspense } from 'react'
import { Keybindings } from './components/Keybindings'
import './App.css'

const AtlasShell = lazy(() => import('./AtlasShell'))

export default function App() {
  return (
    <Suspense fallback={<p className="boot">Loading atlas… / 正在載入地圖…</p>}>
      <Keybindings />
      <AtlasShell />
    </Suspense>
  )
}
