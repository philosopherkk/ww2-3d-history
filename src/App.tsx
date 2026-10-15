import { lazy, Suspense } from 'react'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Keybindings } from './components/Keybindings'
import { useT } from './shared/i18n/translate'
import { useAppStore } from './state/appStore'
import './App.css'

const AtlasShell = lazy(() => import('./AtlasShell'))

function BootLoading() {
  const t = useT()
  return <p className="boot" role="status">{t('bootLoading')}</p>
}

export default function App() {
  const setView = useAppStore((s) => s.setView)
  return (
    <ErrorBoundary onOpenList={() => setView('list')}>
      <Suspense fallback={<BootLoading />}>
        <Keybindings />
        <AtlasShell />
      </Suspense>
    </ErrorBoundary>
  )
}
