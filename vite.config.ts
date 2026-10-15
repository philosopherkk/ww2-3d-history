import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages project site: https://philosopherkk.github.io/ww2-3d-history/
  base: process.env.VITE_BASE ?? '/ww2-3d-history/',
})
