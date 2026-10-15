import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { startUrlSync } from './state/urlSync'

startUrlSync()

if (typeof window !== 'undefined') {
  window.addEventListener('vite:preloadError', () => {
    window.location.reload()
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
