let webGlSupported: boolean | null = null

export function hasWebGL(): boolean {
  if (webGlSupported !== null) return webGlSupported
  if (typeof document === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
    if (!gl) {
      webGlSupported = false
      return false
    }
    const lose = gl.getExtension('WEBGL_lose_context')
    lose?.loseContext()
    webGlSupported = true
    return true
  } catch {
    webGlSupported = false
    return false
  }
}

/** Low-end machines stay on the flat map unless a link explicitly asks for the globe. */
export function isLowEndDevice(): boolean {
  if (typeof navigator === 'undefined') return false
  const nav = navigator as Navigator & { deviceMemory?: number }
  if (typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 2) return true
  if (typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 2) return true
  return false
}
